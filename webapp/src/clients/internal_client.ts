// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4} from 'mattermost-redux/client';
import {ClientError} from '@mattermost/client';
import qs from 'qs';

import {
    AddChannelParams,
    AddChannelResult,
    FetchChannelByIDResult,
    FetchChannelsParams,
    FetchChannelsReturn,
} from 'src/types/channels';
import {PlatformConfig} from 'src/types/organization';
import {pluginId} from 'src/manifest';

let siteURL = '';
let basePath = '';
let apiUrl = `${basePath}/plugins/${pluginId}/api/v0`;

export const setSiteUrl = (url?: string) => {
    if (url) {
        basePath = new URL(url).pathname.replace(/\/+$/, '');
        siteURL = url;
    } else {
        basePath = '';
        siteURL = '';
    }
    apiUrl = `${basePath}/plugins/${pluginId}/api/v0`;
};

export const getSiteUrl = () => {
    return siteURL;
};

export const getApiUrl = () => {
    return apiUrl;
};

export const loadPlatformConfig = async (
    path: string,
    setConfig: (config: PlatformConfig) => void,
) => {
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

export const fetchChannelById = async (channelId: string) => {
    let data = await doGet(`${apiUrl}/channel/${channelId}`);
    if (!data) {
        data = {channel: {}} as FetchChannelByIDResult;
    }
    return data as FetchChannelByIDResult;
};

export const addChannel = async ({
    channelId,
    channelName,
    createPublicChannel,
    parentId,
    sectionId,
    teamId,
}: AddChannelParams) => {
    const data = await doPost(`${apiUrl}/channels/${sectionId}`, JSON.stringify({
        channelId,
        channelName,
        createPublicChannel,
        parentId,
        sectionId,
        teamId,
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

