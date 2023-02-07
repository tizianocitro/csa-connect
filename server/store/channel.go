package store

type ProductChannelEntity struct {
	ID        string `json:"id" export:"id"`
	Name      string `json:"name" export:"name"`
	ProductID string `json:"productID" export:"productID"`
}
