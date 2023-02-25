export interface PaginatedTabledData {
    columns: PaginatedTableColumn[];
    rows: PaginatedTableRow[];
}

export interface PaginatedTableColumn {
    title: string;
}

export type PaginatedTableRow = any;