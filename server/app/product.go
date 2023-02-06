package app

type Product struct {
	ChannelsIDs       []string         `json:"channelIds" export:"channelIds"`
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
	ID          string `json:"id" export:"id"`
	Name        string `json:"name" export:"name"`
	Description string `json:"description" export:"description"`
}

// ProductFilterOptions specifies the parameters when getting products.
type ProductFilterOptions struct {
	Sort       SortField
	Direction  SortDirection
	SearchTerm string

	// Pagination options.
	Page    int
	PerPage int
}

type GetProductsResults struct {
	TotalCount int       `json:"total_count"`
	PageCount  int       `json:"page_count"`
	HasMore    bool      `json:"has_more"`
	Items      []Product `json:"items"`
}
