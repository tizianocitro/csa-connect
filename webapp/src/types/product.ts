export interface Product {
    id: string;
    name: string;
    summary: string;
    summary_modified_at: number;
    team_id: string;
    channel_id: string;
    product_id: string;
    is_favorite: boolean;
    created_at: number;
    last_update_at: number;
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

