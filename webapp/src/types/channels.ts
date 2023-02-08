export interface ProductChannel {
    id: string;
    name: string
}

export interface FetchChannelsParams {
    channel_id?: string;
    direction?: string;
    page: number;
    per_page: number;
    product_id?: string;
    search_term?: string;
    sort?: string;
    team_id?: string;
}

export interface FetchChannelsReturn {
    hasMore: boolean;
    items: ProductChannel[];
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
    id?: string;
    name?: string;
}
