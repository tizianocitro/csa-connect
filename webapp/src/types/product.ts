export interface Product {
    id: string;
    name: string;
    summary: string;
    summary_modified_at: number;
    product_id: string;
    channels_ids?: string[]; // To show in product page
    is_favorite: boolean;
    created_at: number;
    last_update_at: number;
    delete_at: number;
}

export interface ChannelProduct extends Product {
    team_id: string;
    channel_id: string;
    channel_mode: string;
    channel_name_template: string;
    create_public_channel: boolean;
}

export interface FetchProductsNoPageParams {
    team_id?: string;
    sort?: string;
    direction?: string;
}

export interface FetchProductsNoPageReturn {
    items: Product[];
}

export interface FetchProductsParams {
    page: number;
    per_page: number;
    team_id?: string;
    sort?: string;
    direction?: string;
    search_term?: string;
    product_id?: string;
}

export interface FetchProductsReturn {
    total_count: number;
    page_count: number;
    has_more: boolean;
    items: Product[];
}

export interface AddChannelResult {
    channel_id?: string;
}
