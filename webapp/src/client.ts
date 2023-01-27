// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4} from 'mattermost-redux/client';
import {ClientError} from '@mattermost/client';

import qs from 'qs';

import {Product} from 'mattermost-webapp/packages/types/src/cloud';

import {
    AddChannelResult,
    FetchProductsNoPageParams,
    FetchProductsNoPageReturn,
    FetchProductsParams,
    FetchProductsReturn,
} from './types/product';

import {pluginId} from './manifest';

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

export const isFavoriteItem = async (id: string) => {
    const data = await doGet<void>(`${apiUrl}/products/favorites?id=${id}`);
    return Boolean(data);
};

export async function fetchProduct(id: string) {
    let data = await doGet(`${apiUrl}/products/${id}`);
    data = {
        id: '1',
        name: 'My First Product',
        summary: 'My First Product',
        summary_modified_at: 21122022,
        product_id: '1',
        is_favorite: false,
        created_at: 21122022,
        last_update_at: 21122022,
        delete_at: 0,
    };
    return data as Product;
}

export async function fetchProductsNoPage(params: FetchProductsNoPageParams) {
    const queryParams = qs.stringify(params, {addQueryPrefix: true, indices: false});

    let data = await doGet(`${apiUrl}/products${queryParams}`);
    if (!data) {
        data = {items: []} as FetchProductsNoPageReturn;
    }

    data = {
        items: [
            {
                id: '1',
                name: 'My First Product',
                summary: 'My First Product',
                summary_modified_at: 21122022,
                product_id: '1',
                is_favorite: false,
                created_at: 21122022,
                last_update_at: 21122022,
            },
            {
                id: '2',
                name: 'My Second Product',
                summary: 'My Second Product',
                summary_modified_at: 21122022,
                product_id: '2',
                is_favorite: true,
                created_at: 21122022,
                last_update_at: 21122022,
            },
        ],
    };
    return data as FetchProductsNoPageReturn;
}

export async function fetchProducts(params: FetchProductsParams) {
    const queryParams = qs.stringify(params, {addQueryPrefix: true, indices: false});

    let data = await doGet(`${apiUrl}/products${queryParams}`);
    if (!data) {
        data = {items: [], total_count: 0, page_count: 0, has_more: false} as FetchProductsReturn;
    }
    data = {
        items: [
            {
                id: '1',
                name: 'My First Product',
                summary: 'My First Product',
                summary_modified_at: 21122022,
                product_id: '1',
                is_favorite: false,
                created_at: 21122022,
                last_update_at: 21122022,
            },
            {
                id: '2',
                name: 'My Second Product',
                summary: 'My Second Product',
                summary_modified_at: 21122022,
                product_id: '2',
                is_favorite: true,
                created_at: 21122022,
                last_update_at: 21122022,
            },
        ],
        total_count: 2,
        has_more: false,
        page_count: 0,
    };
    return data as FetchProductsReturn;
}

export async function addChannelToProduct(
    product_id: string,
    team_id: string,
    channel_name?: string,
    channel_id?: string,
    create_public_channel?: boolean
) {
    const data = await doPost(`${apiUrl}/products/add_channel`, JSON.stringify({
        team_id,
        channel_name,
        product_id,
        channel_id,
        create_public_channel,
    }));
    return data as AddChannelResult;
}

export const doGet = async <TData = any>(url: string) => {
    const {data} = await doFetchWithResponse<TData>(url, {method: 'get'});

    return data;
};

export const doPost = async <TData = any>(url: string, body = {}) => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'POST',
        body,
    });

    return data;
};

export const doDelete = async <TData = any>(url: string, body = {}) => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'DELETE',
        body,
    });

    return data;
};

export const doPut = async <TData = any>(url: string, body = {}) => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'PUT',
        body,
    });

    return data;
};

export const doPatch = async <TData = any>(url: string, body = {}) => {
    const {data} = await doFetchWithResponse<TData>(url, {
        method: 'PATCH',
        body,
    });

    return data;
};

export const doFetchWithResponse = async <TData = any>(url: string, options = {}) => {
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

export const doFetchWithTextResponse = async <TData extends string>(url: string, options = {}) => {
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

export const doFetchWithoutResponse = async (url: string, options = {}) => {
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

