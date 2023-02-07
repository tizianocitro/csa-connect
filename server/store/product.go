package sqlstore

type ProductEntity struct {
	CreatedAt         int    `json:"createdAt" export:"createdAt"`
	ID                string `json:"id" export:"id"`
	IsFavorite        bool   `json:"isFavorite" export:"isFavorite"`
	LastUpdateAt      int    `json:"lastUpdateAt" export:"lastUpdateAt"`
	Name              string `json:"name" export:"name"`
	Summary           string `json:"summary" export:"summary"`
	SummaryModifiedAt int    `json:"summaryModifiedAt" export:"summaryModifiedAt"`
}

type ProductElementEntity struct {
	Description string `json:"description" export:"description"`
	ID          string `json:"id" export:"id"`
	Name        string `json:"name" export:"name"`
	ProductID   string `json:"productID" export:"productID"`
}
