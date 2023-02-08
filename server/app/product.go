package app

type Product struct {
	Channels          []ProductChannel `json:"channels" export:"channels"`
	CreatedAt         int              `json:"createdAt" export:"createdAt"`
	Elements          []ProductElement `json:"elements" export:"elements"`
	ID                string           `json:"id" export:"id"`
	IsFavorite        bool             `json:"isFavorite" export:"isFavorite"`
	LastUpdatedAt     int              `json:"lastUpdatedAt" export:"lastUpdatedAt"`
	Name              string           `json:"name" export:"name"`
	Summary           string           `json:"summary" export:"summary"`
	SummaryModifiedAt int              `json:"summaryModifiedAt" export:"summaryModifiedAt"`
}

type ProductElement struct {
	Description string `json:"description" export:"description"`
	ID          string `json:"id" export:"id"`
	Name        string `json:"name" export:"name"`
}

// ProductFilterOptions specifies the parameters when getting products.
type ProductFilterOptions struct {
	Direction  SortDirection
	SearchTerm string
	Sort       SortField

	// Pagination options.
	Page    int
	PerPage int
}

type GetProductsResults struct {
	HasMore    bool      `json:"hasMore"`
	Items      []Product `json:"items"`
	PageCount  int       `json:"pageCount"`
	TotalCount int       `json:"totalCount"`
}

type GetProductsNoPageResults struct {
	Items []Product `json:"items"`
}
