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
    FetchChannelsResult,
} from 'src/types/channels';
import {PLATFORM_CONFIG_CACHE_NAME} from 'src/config/config';
import {PlatformConfig} from 'src/types/organization';
import {pluginId} from 'src/manifest';

import {getCachedResponse, putCacheResponse} from './cache';

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

export const loadPlatformConfig = async (
    path: string,
    setConfig: (config: PlatformConfig) => void,
): Promise<void> => {
    const url = `${apiUrl}${path}`;

    const cachedConfig = await getCachedResponse<PlatformConfig>(PLATFORM_CONFIG_CACHE_NAME, url);
    if (cachedConfig) {
        setConfig(cachedConfig);
        return;
    }

    const config = await doGet<PlatformConfig>(url);
    if (!config) {
        return;
    }
    await putCacheResponse(PLATFORM_CONFIG_CACHE_NAME, url, config);
    setConfig(config);
};

export const fetchChannels = async (params: FetchChannelsParams): Promise<FetchChannelsResult> => {
    const queryParams = qs.stringify(params, {addQueryPrefix: true, indices: false});
    let data = await doGet(`${apiUrl}/channels/${params.section_id}${queryParams}`);
    if (!data) {
        data = {items: []} as FetchChannelsResult;
    }
    return data as FetchChannelsResult;
};

export const fetchChannelById = async (channelId: string): Promise<FetchChannelByIDResult> => {
    let data = await doGet<FetchChannelByIDResult>(`${apiUrl}/channel/${channelId}`);
    if (!data) {
        data = {channel: {}} as FetchChannelByIDResult;
    }
    return data;
};

export const addChannel = async (params: AddChannelParams): Promise<AddChannelResult> => {
    let data = await doPost<AddChannelResult>(
        `${apiUrl}/channels/${params.sectionId}`,
        JSON.stringify(params),
    );
    if (!data) {
        data = {channelId: '', parentId: '', sectionId: ''} as AddChannelResult;
    }
    return data;
};

const doGet = async <TData = any>(url: string): Promise<TData | undefined> => {
    const {data} = await doFetchWithResponse<TData>(url, {method: 'get'});
    return data;
};

const doPost = async <TData = any>(url: string, body = {}): Promise<TData | undefined> => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'POST',
        body,
    });
    return data;
};

const doDelete = async <TData = any>(url: string, body = {}): Promise<TData | undefined> => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'DELETE',
        body,
    });
    return data;
};

const doPut = async <TData = any>(url: string, body = {}): Promise<TData | undefined> => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'PUT',
        body,
    });
    return data;
};

const doPatch = async <TData = any>(url: string, body = {}): Promise<TData | undefined> => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'PATCH',
        body,
    });
    return data;
};

const doFetchWithResponse = async <TData = any>(
    url: string,
    options = {},
): Promise<{
    response: Response;
    data: TData | undefined;
}> => {
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

const doFetchWithTextResponse = async <TData extends string>(
    url: string,
    options = {},
): Promise<{
    response: Response;
    data: TData;
}> => {
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

const doFetchWithoutResponse = async (
    url: string,
    options = {},
): Promise<void> => {
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

