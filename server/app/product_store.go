package app

// ProductStore is an interface for storing products
type ProductStore interface {
	// Get retrieves a product given the id
	Get(id string) (Product, error)

	// GetProductsNoPage retrieves all products
	GetProductsNoPage() (GetProductsNoPageResults, error)

	// GetProducts retrieves all products given a set of filters
	GetProducts(opts ProductFilterOptions) (GetProductsResults, error)

	// GetChannels retrieves all channels for a product given a set of filters
	GetChannels(productID string, opts ProductChannelFilterOptions) (GetProductChannelsResults, error)

	// AddChannel adds a channel to a product
	AddChannel(productID string, params AddChannelParams) (AddChannelResult, error)
}
