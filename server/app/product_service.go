package app

import (
	"strings"

	pluginapi "github.com/mattermost/mattermost-plugin-api"
)

type productService struct {
	store ProductStore
	api   *pluginapi.Client
}

// NewProductService returns a new product service
func NewProductService(store ProductStore, api *pluginapi.Client) *ProductService {
	return &productService{
		store: store,
		api:   api,
	}
}

func (s *productService) Get(id string) (Product, error) {
	return s.store.Get(id)
}

func (s *productService) GetProducts(opts ProductFilterOptions) (GetProductsResults, error) {
	return s.store.GetProducts(opts)
}

func (s *productService) GetProductsNoPage() ([]Product, error) {
	return s.store.GetProductsNoPage()
}

func (s *productService) GetChannels(productID string, opts ProductChannelFilterOptions) (GetProductChannelsResults, error) {
	return s.store.GetChannels(productID, opts)
}

func (s *productService) AddChannel(productID string, params AddChannelParams) (AddChannelResult, error) {
	if len(strings.TrimSpace(params.ChannelID)) == 0 {
		return s.store.AddExistingChannel(productID, params.ChannelID)
	}
	return s.store.AddNewChannel(productID, params)
}
