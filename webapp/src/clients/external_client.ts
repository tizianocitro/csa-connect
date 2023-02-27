import {Client4} from 'mattermost-redux/client';
import {ClientError} from '@mattermost/client';

import {GraphData} from 'src/types/graph';
import {PaginatedTableData} from 'src/types/paginated_table';
import {SectionInfo} from 'src/types/organization';
import {TableData} from 'src/types/table';
import {TextBoxData} from 'src/types/text_box';

export const fetchSectionInfo = async (id: string, url: string): Promise<SectionInfo> => {
    let data = await doGet<SectionInfo>(`${url}/${id}`);
    if (!data) {
        data = {description: '', id: '', name: ''} as SectionInfo;
    }
    return data;
};

export const fetchGraphData = async (url: string): Promise<GraphData> => {
    let data = await doGet<GraphData>(url);
    if (!data) {
        data = {edges: [], nodes: []} as GraphData;
    }
    return data;
};

export const fetchTableData = async (url: string): Promise<TableData> => {
    let data = await doGet<TableData>(url);
    if (!data) {
        data = {caption: '', headers: [], rows: []} as TableData;
    }
    return data;
};

export const fetchPaginatedTableData = async (url: string): Promise<PaginatedTableData> => {
    let data = await doGet<PaginatedTableData>(url);
    if (!data) {
        data = {columns: [], rows: []} as PaginatedTableData;
    }
    return data;
};

export const fetchTextBoxData = async (url: string): Promise<TextBoxData> => {
    let data = await doGet<TextBoxData>(url);
    if (!data) {
        data = {text: ''} as TextBoxData;
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
