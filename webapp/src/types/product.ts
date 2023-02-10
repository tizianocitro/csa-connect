import {ProductChannel} from './channels';

export interface Product {
    channels?: ProductChannel[];
    createdAt: number;
    description?: string;
    elements?: ProductElement[];
    id: string;
    isFavorite: boolean;
    lastUpdatedAt: number;
    name: string;
    summary: string;
    summaryModifiedAt: number;
}

export interface ProductElement {
    id: string;
    name: string;
    description: string;
}

export interface ChannelProduct extends Product {
    channelId: string;
    channelMode: string;
    channelNameTemplate: string;
    createPublicChannel: boolean;
    teamId: string;
}

export interface FetchProductsNoPageParams {
    direction?: string;
    sort?: string;
    team_id?: string;
}

export interface FetchProductsNoPageReturn {
    items: Product[];
}

export interface FetchProductsParams {
    direction?: string;
    page: number;
    per_page: number;
    product_id?: string;
    search_term?: string;
    sort?: string;
    team_id?: string;
}

export interface FetchProductsReturn {
    hasMore: boolean;
    items: Product[];
    pageCount: number;
    totalCount: number;
}