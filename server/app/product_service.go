package app

import (
	pluginapi "github.com/mattermost/mattermost-plugin-api"
)

type ProductService struct {
	store ProductStore
	api   *pluginapi.Client
}

// NewProductService returns a new product service
func NewProductService(store ProductStore, api *pluginapi.Client) *ProductService {
	return &ProductService{
		store: store,
		api:   api,
	}
}

func (s *ProductService) Get(id string) (Product, error) {
	return s.store.Get(id)
}

func (s *ProductService) GetProducts(opts ProductFilterOptions) (GetProductsResults, error) {
	return s.store.GetProducts(opts)
}

func (s *ProductService) GetProductsNoPage() (GetProductsNoPageResults, error) {
	return s.store.GetProductsNoPage()
}

func (s *ProductService) GetChannels(productID string, opts ProductChannelFilterOptions) (GetProductChannelsResults, error) {
	return s.store.GetChannels(productID, opts)
}

func (s *ProductService) AddChannel(productID string, params AddChannelParams) (AddChannelResult, error) {
	return s.store.AddChannel(productID, params)
}
