package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/pkg/errors"

	pluginapi "github.com/mattermost/mattermost-plugin-api"

	"github.com/tizianocitro/mattermost-product/server/app"
)

// ProductHandler is the API handler.
type ProductHandler struct {
	*ErrorHandler
	productService *app.ProductService
	pluginAPI      *pluginapi.Client
}

// NewProductHandler returns a new product api handler
func NewProductHandler(router *mux.Router, productService *app.ProductService, api *pluginapi.Client) *ProductHandler {
	handler := &ProductHandler{
		ErrorHandler:   &ErrorHandler{},
		productService: productService,
		pluginAPI:      api,
	}

	productsRouter := router.PathPrefix("/products").Subrouter()
	productsRouter.HandleFunc("", withContext(handler.getProducts)).Methods(http.MethodGet)
	productsRouter.HandleFunc("/favorites", withContext(handler.isFavorited)).Methods(http.MethodGet)
	productsRouter.HandleFunc("/products_no_page", withContext(handler.getProductsNoPage)).Methods(http.MethodGet)

	productRouter := productsRouter.PathPrefix("/{id:[A-Za-z0-9]+}").Subrouter()
	productRouter.HandleFunc("", withContext(handler.getProduct)).Methods(http.MethodGet)
	productRouter.HandleFunc("/get_channels", withContext(handler.getProductChannels)).Methods(http.MethodGet)
	productRouter.HandleFunc("/add_channel", withContext(handler.addChannel)).Methods(http.MethodPatch)

	return handler
}

func (h *ProductHandler) getProducts(c *Context, w http.ResponseWriter, r *http.Request) {
	opts, err := parseGetProductsOptions(r.URL)
	if err != nil {
		h.HandleErrorWithCode(w, c.logger, http.StatusBadRequest, fmt.Sprintf("failed to get products: %s", err.Error()), nil)
		return
	}
	result, err := h.productService.GetProducts(opts)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, result, http.StatusOK)
}

func (h *ProductHandler) getProductsNoPage(c *Context, w http.ResponseWriter, r *http.Request) {
	result, err := h.productService.GetProductsNoPage()
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, result, http.StatusOK)
}

func (h *ProductHandler) isFavorited(c *Context, w http.ResponseWriter, r *http.Request) {
	productID := r.URL.Query().Get("id")
	product, err := h.productService.Get(productID)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, &product.IsFavorite, http.StatusOK)
}

func (h *ProductHandler) getProduct(c *Context, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]
	product, err := h.productService.Get(productID)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, &product, http.StatusOK)
}

func (h *ProductHandler) getProductChannels(c *Context, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]
	opts, err := parseGetProductChannelsOptions(r.URL)
	if err != nil {
		h.HandleErrorWithCode(w, c.logger, http.StatusBadRequest, fmt.Sprintf("failed to get product %s's channels: %s", productID, err.Error()), nil)
		return
	}
	channels, err := h.productService.GetChannels(productID, opts)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, channels, http.StatusOK)
}

func (h *ProductHandler) addChannel(c *Context, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]
	var params app.AddChannelParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		h.HandleErrorWithCode(w, c.logger, http.StatusBadRequest, "unable to decode channel product", err)
		return
	}
	result, err := h.productService.AddChannel(productID, params)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, result, http.StatusOK)
}

func parseGetProductsOptions(u *url.URL) (app.ProductFilterOptions, error) {
	params := u.Query()

	var sortField app.SortField
	param := strings.ToLower(params.Get("sort"))
	switch param {
	case "name", "":
		sortField = app.SortByName
	default:
		return app.ProductFilterOptions{}, errors.Errorf("bad parameter 'sort' (%s): it should be empty or 'name'", param)
	}

	var sortDirection app.SortDirection
	param = strings.ToLower(params.Get("direction"))
	switch param {
	case "asc", "":
		sortDirection = app.DirectionAsc
	case "desc":
		sortDirection = app.DirectionDesc
	default:
		return app.ProductFilterOptions{}, errors.Errorf("bad parameter 'direction' (%s): it should be empty or one of 'asc' or 'desc'", param)
	}

	pageParam := params.Get("page")
	if pageParam == "" {
		pageParam = "0"
	}
	page, err := strconv.Atoi(pageParam)
	if err != nil {
		return app.ProductFilterOptions{}, errors.Wrapf(err, "bad parameter 'page': it should be a number")
	}
	if page < 0 {
		return app.ProductFilterOptions{}, errors.Errorf("bad parameter 'page': it should be a positive number")
	}

	perPageParam := params.Get("per_page")
	if perPageParam == "" || perPageParam == "0" {
		perPageParam = "50"
	}
	perPage, err := strconv.Atoi(perPageParam)
	if err != nil {
		return app.ProductFilterOptions{}, errors.Wrapf(err, "bad parameter 'per_page': it should be a number")
	}
	if perPage < 0 {
		return app.ProductFilterOptions{}, errors.Errorf("bad parameter 'per_page': it should be a positive number")
	}

	searchTerm := u.Query().Get("search_term")

	return app.ProductFilterOptions{
		Sort:       sortField,
		Direction:  sortDirection,
		Page:       page,
		PerPage:    perPage,
		SearchTerm: searchTerm,
	}, nil
}

func parseGetProductChannelsOptions(u *url.URL) (app.ProductChannelFilterOptions, error) {
	params := u.Query()

	var sortField app.SortField
	param := strings.ToLower(params.Get("sort"))
	switch param {
	case "name", "":
		sortField = app.SortByName
	default:
		return app.ProductChannelFilterOptions{}, errors.Errorf("bad parameter 'sort' (%s): it should be empty or 'name'", param)
	}

	var sortDirection app.SortDirection
	param = strings.ToLower(params.Get("direction"))
	switch param {
	case "asc", "":
		sortDirection = app.DirectionAsc
	case "desc":
		sortDirection = app.DirectionDesc
	default:
		return app.ProductChannelFilterOptions{}, errors.Errorf("bad parameter 'direction' (%s): it should be empty or one of 'asc' or 'desc'", param)
	}

	pageParam := params.Get("page")
	if pageParam == "" {
		pageParam = "0"
	}
	page, err := strconv.Atoi(pageParam)
	if err != nil {
		return app.ProductChannelFilterOptions{}, errors.Wrapf(err, "bad parameter 'page': it should be a number")
	}
	if page < 0 {
		return app.ProductChannelFilterOptions{}, errors.Errorf("bad parameter 'page': it should be a positive number")
	}

	perPageParam := params.Get("per_page")
	if perPageParam == "" || perPageParam == "0" {
		perPageParam = "50"
	}
	perPage, err := strconv.Atoi(perPageParam)
	if err != nil {
		return app.ProductChannelFilterOptions{}, errors.Wrapf(err, "bad parameter 'per_page': it should be a number")
	}
	if perPage < 0 {
		return app.ProductChannelFilterOptions{}, errors.Errorf("bad parameter 'per_page': it should be a positive number")
	}

	searchTerm := u.Query().Get("search_term")

	return app.ProductChannelFilterOptions{
		Sort:       sortField,
		Direction:  sortDirection,
		Page:       page,
		PerPage:    perPage,
		SearchTerm: searchTerm,
	}, nil
}
