import {Client4} from 'mattermost-redux/client';
import {ClientError} from '@mattermost/client';

import {GraphData} from 'src/types/graph';
import {SectionInfo} from 'src/types/organization';
import {TableData} from 'src/types/table';
import {TextBoxData} from 'src/types/text_box';

export const fetchSectionInfo = async (id: string, url: string): Promise<SectionInfo> => {
    let data = await doGet(`${url}/${id}`);
    if (!data) {
        data = {description: '', id: '', name: ''} as SectionInfo;
    }
    return data as SectionInfo;
};

export const fetchGraphData = async (url: string): Promise<GraphData> => {
    let data = await doGet(url);
    if (!data) {
        data = {edges: [], nodes: []} as GraphData;
    }
    return data as GraphData;
};

export const fetchTableData = async (url: string): Promise<TableData> => {
    let data = await doGet(url);
    if (!data) {
        data = {caption: '', headers: [], rows: []} as TableData;
    }
    return data as TableData;
};

export const fetchTextBoxData = async (url: string): Promise<TextBoxData> => {
    let data = await doGet(url);
    if (!data) {
        data = {text: ''} as TextBoxData;
    }
    return data as TextBoxData;
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
