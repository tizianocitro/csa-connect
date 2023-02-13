import {Client4} from 'mattermost-redux/client';
import {ClientError} from '@mattermost/client';

import {TableData} from 'src/components/backstage/widgets/table/table';

export async function fetchTableData(url: string) {
    let data = await doGet(url);
    if (!data) {
        data = {caption: '', headers: [], rows: []} as TableData;
    }
    return data as TableData;
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
    const response = await fetch(url, options);
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
