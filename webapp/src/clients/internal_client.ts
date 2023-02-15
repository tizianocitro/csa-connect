// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4} from 'mattermost-redux/client';
import {ClientError} from '@mattermost/client';
import qs from 'qs';

import {pluginId} from 'src/manifest';
import {
    AddChannelParams,
    AddChannelResult,
    FetchChannelsParams,
    FetchChannelsReturn,
} from 'src/types/channels';
import {PlatformConfig} from 'src/types/organization';

let siteURL = '';
let basePath = '';
let apiUrl = `${basePath}/plugins/${pluginId}/api/v0`;

export const setSiteUrl = (url?: string): void => {
    if (url) {
        basePath = new URL(url).pathname.replace(/\/+$/, '');
        siteURL = url;
    } else {
        basePath = '';
        siteURL = '';
    }

    apiUrl = `${basePath}/plugins/${pluginId}/api/v0`;
};

export const getSiteUrl = (): string => {
    return siteURL;
};

export const getApiUrl = (): string => {
    return apiUrl;
};

export const loadPlatformConfig = async (path: string, setConfig: (config: PlatformConfig) => void) => {
    doGet(`${apiUrl}${path}`).
        then((config) => setConfig(config)).
        catch(() => setConfig({organizations: []}));
};

export const fetchChannels = async (params: FetchChannelsParams) => {
    const queryParams = qs.stringify(params, {addQueryPrefix: true, indices: false});

    let data = await doGet(`${apiUrl}/channels/${params.section_id}${queryParams}`);
    if (!data) {
        data = {items: []} as FetchChannelsReturn;
    }
    return data as FetchChannelsReturn;
};

export const addChannel = async ({
    channel_id,
    channel_name,
    create_public_channel,
    parent_id,
    section_id,
    team_id,
}: AddChannelParams) => {
    const data = await doPatch(`${apiUrl}/channels/${section_id}`, JSON.stringify({
        channel_id,
        channel_name,
        create_public_channel,
        parent_id,
        section_id,
        team_id,
    }));
    return data as AddChannelResult;
};

const doGet = async <TData = any>(url: string) => {
    const {data} = await doFetchWithResponse<TData>(url, {method: 'get'});

    return data;
};

const doPost = async <TData = any>(url: string, body = {}) => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'POST',
        body,
    });

    return data;
};

const doDelete = async <TData = any>(url: string, body = {}) => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'DELETE',
        body,
    });

    return data;
};

const doPut = async <TData = any>(url: string, body = {}) => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'PUT',
        body,
    });

    return data;
};

const doPatch = async <TData = any>(url: string, body = {}) => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'PATCH',
        body,
    });

    return data;
};

const doFetchWithResponse = async <TData = any>(url: string, options = {}) => {
    const response = await fetch(url, Client4.getOptions(options));
    let data;
    if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType === 'application/json') {
            data = await response.json() as TData;
        }

        return {
            response,
            data,
        };
    }

    data = await response.text();

    throw new ClientError(Client4.url, {
        message: data || '',
        status_code: response.status,
        url,
    });
};

const doFetchWithTextResponse = async <TData extends string>(url: string, options = {}) => {
    const response = await fetch(url, Client4.getOptions(options));

    let data;
    if (response.ok) {
        data = await response.text() as TData;

        return {
            response,
            data,
        };
    }

    data = await response.text();

    throw new ClientError(Client4.url, {
        message: data || '',
        status_code: response.status,
        url,
    });
};

const doFetchWithoutResponse = async (url: string, options = {}) => {
    const response = await fetch(url, Client4.getOptions(options));

    if (response.ok) {
        return;
    }

    throw new ClientError(Client4.url, {
        message: '',
        status_code: response.status,
        url,
    });
};

