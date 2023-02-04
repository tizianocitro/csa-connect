export interface Product {
    channelsIds?: string[];
    createdAt: number;
    id: string;
    isFavorite: boolean;
    lastUpdateAt: number;
    name: string;
    productId: string;
    summary: string;
    summaryModifiedAt: number;
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

export interface AddChannelParams {
    channel_id?: string;
    channel_name?: string;
    create_public_channel?: boolean;
    product_id: string;
    team_id: string;
}

export interface AddChannelResult {
    channelId?: string;
}
