// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4} from 'mattermost-redux/client';
import {ClientError} from '@mattermost/client';

import qs from 'qs';

import {Product} from 'mattermost-webapp/packages/types/src/cloud';

import {
    FetchProductsNoPageParams,
    FetchProductsNoPageReturn,
    FetchProductsParams,
    FetchProductsReturn,
} from './types/product';

import {pluginId} from './manifest';
import {
    AddChannelParams,
    AddChannelResult,
    FetchChannelsParams,
    FetchChannelsReturn,
} from './types/channels';

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

/* data = {
    id: '1',
    name: 'My First Product',
    summary: 'My First Product',
    summaryModifiedAt: 21122022,
    productId: '1',
    isFavorite: false,
    createdAt: 21122022,
    lastUpdateAt: 21122022,
    elements: [
        {
            id: '1',
            name: 'My First Element',
            description: 'My First Element Description',
        },
        {
            id: '2',
            name: 'My Second Element',
            description: 'My Second Element Description',
        },
        {
            id: '3',
            name: 'My Third Element',
            description: 'My Third Element Description',
        },
        {
            id: '4',
            name: 'My Fourth Element',
            description: 'My Fouth Element Description',
        },
    ],
}; */
export async function fetchProduct(id: string) {
    const data = await doGet(`${apiUrl}/products/${id}`);
    return data as Product;
}

/* data = {
    items: [
        {
            id: '1',
            name: 'My First Product',
            summary: 'My First Product',
            summaryModifiedAt: 21122022,
            productId: '1',
            isFavorite: false,
            createdAt: 21122022,
            lastUpdateAt: 21122022,
        },
        {
            id: '2',
            name: 'My Second Product',
            summary: 'My Second Product',
            summaryModifiedAt: 21122022,
            productId: '2',
            isFavorite: true,
            createdAt: 21122022,
            lastUpdateAt: 21122022,
        },
    ],
}; */
export async function fetchProductsNoPage(params: FetchProductsNoPageParams) {
    const queryParams = qs.stringify(params, {addQueryPrefix: true, indices: false});

    let data = await doGet(`${apiUrl}/products/products_no_page${queryParams}`);
    if (!data) {
        data = {items: []} as FetchProductsNoPageReturn;
    }
    return data as FetchProductsNoPageReturn;
}

/* data = {
    items: [
        {
            id: '1',
            name: 'My First Product',
            summary: 'My First Product',
            summaryModifiedAt: 21122022,
            productId: '1',
            isFavorite: false,
            createdAt: 21122022,
            lastUpdateAt: 21122022,
        },
        {
            id: '2',
            name: 'My Second Product',
            summary: 'My Second Product',
            summaryModifiedAt: 21122022,
            productId: '2',
            isFavorite: true,
            createdAt: 21122022,
            lastUpdateAt: 21122022,
        },
    ],
    totalCount: 2,
    hasMore: false,
    pageCount: 1,
}; */
export async function fetchProducts(params: FetchProductsParams) {
    const queryParams = qs.stringify(params, {addQueryPrefix: true, indices: false});

    let data = await doGet(`${apiUrl}/products${queryParams}`);
    if (!data) {
        data = {items: [], totalCount: 0, pageCount: 0, hasMore: false} as FetchProductsReturn;
    }

    // pageCount = totalCount / perPage
    return data as FetchProductsReturn;
}

/* data = {
    items: [
        {
            id: 'demo',
            name: 'Demo',
        },
        {
            id: 'my-first-product-channel',
            name: 'My First Product Channel',
        },
    ],
    totalCount: 2,
    hasMore: false,
    pageCount: 0,
}; */
export async function fetchProductChannels(params: FetchChannelsParams) {
    const queryParams = qs.stringify(params, {addQueryPrefix: true, indices: false});

    let data = await doGet(`${apiUrl}/products/${params.product_id}/get_channels${queryParams}`);
    if (!data) {
        data = {items: [], totalCount: 0, pageCount: 0, hasMore: false} as FetchChannelsReturn;
    }
    return data as FetchChannelsReturn;
}

export async function addChannelToProduct({
    product_id,
    team_id,
    channel_id,
    channel_name,
    create_public_channel,
}: AddChannelParams) {
    const data = await doPatch(`${apiUrl}/products/${product_id}/add_channel`, JSON.stringify({
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

