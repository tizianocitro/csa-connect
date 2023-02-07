package app

type Product struct {
	Channels          []ProductChannel `json:"channels" export:"channels"`
	CreatedAt         int              `json:"createdAt" export:"createdAt"`
	Elements          []ProductElement `json:"element" export:"element"`
	ID                string           `json:"id" export:"id"`
	IsFavorite        bool             `json:"isFavorite" export:"isFavorite"`
	LastUpdateAt      int              `json:"lastUpdateAt" export:"lastUpdateAt"`
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
	HasMore    bool      `json:"has_more"`
	Items      []Product `json:"items"`
	PageCount  int       `json:"page_count"`
	TotalCount int       `json:"total_count"`
}
