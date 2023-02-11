export interface Organization {
    description?: string,
    id: string,
    name: string,
    sections: Section[],
    widgets: Widget[],
}

export interface Section {
    id: string,
    name: string,
    url: string,
    sections: Section[],
    widgets: Widget[],
}

export interface Widget {
    name?: string,
    type: string,
    url?: string,
}

export interface FetchOrganizationsParams {
    direction?: string;
    page: number;
    per_page: number;
    organization_id?: string;
    search_term?: string;
    sort?: string;
    team_id?: string;
}

export interface FetchOrganizationsNoPageParams {
    direction?: string;
    sort?: string;
    team_id?: string;
}
