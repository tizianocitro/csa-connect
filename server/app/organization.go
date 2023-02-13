package app

type Organization struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// OrganizationFilterOptions specifies the parameters when getting products.
type OrganizationFilterOptions struct {
	Direction  SortDirection
	SearchTerm string
	Sort       SortField

	// Pagination options.
	Page    int
	PerPage int
}

type GetOrganizationsResults struct {
	HasMore    bool           `json:"hasMore"`
	Items      []Organization `json:"items"`
	PageCount  int            `json:"pageCount"`
	TotalCount int            `json:"totalCount"`
}

type GetOrganizationsNoPageResults struct {
	Items []Organization `json:"items"`
}

type Incident struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Policy struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Story struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}
