package api

import (
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/pkg/errors"

	pluginapi "github.com/mattermost/mattermost-plugin-api"

	"github.com/tizianocitro/csa-connect/server/app"
)

// OrganizationHandler is the API handler.
type OrganizationHandler struct {
	*ErrorHandler
	organizationService *app.OrganizationService
	pluginAPI           *pluginapi.Client
}

// OrganizationHandler returns a new organization api handler
func NewOrganizationHandler(router *mux.Router, organizationService *app.OrganizationService, api *pluginapi.Client) *OrganizationHandler {
	handler := &OrganizationHandler{
		ErrorHandler:        &ErrorHandler{},
		organizationService: organizationService,
		pluginAPI:           api,
	}

	organizationsRouter := router.PathPrefix("/organizations").Subrouter()
	organizationsRouter.HandleFunc("", withContext(handler.getOrganizations)).Methods(http.MethodGet)
	organizationsRouter.HandleFunc("/no_page", withContext(handler.getOrganizationsNoPage)).Methods(http.MethodGet)

	organizationRouter := organizationsRouter.PathPrefix("/{organizationId:[A-Za-z0-9]+}").Subrouter()
	organizationRouter.HandleFunc("", withContext(handler.getOrganization)).Methods(http.MethodGet)

	return handler
}

func (h *OrganizationHandler) getOrganizations(c *Context, w http.ResponseWriter, r *http.Request) {
	opts, err := parseGetOrganizationsOptions(r.URL)
	if err != nil {
		h.HandleErrorWithCode(w, c.logger, http.StatusBadRequest, fmt.Sprintf("failed to get organizations: %s", err.Error()), nil)
		return
	}
	result, err := h.organizationService.GetOrganizations(opts)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, result, http.StatusOK)
}

func (h *OrganizationHandler) getOrganizationsNoPage(c *Context, w http.ResponseWriter, r *http.Request) {
	result, err := h.organizationService.GetOrganizationsNoPage()
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, result, http.StatusOK)
}

func (h *OrganizationHandler) getOrganization(c *Context, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	organizationID := vars["organizationId"]
	product, err := h.organizationService.Get(organizationID)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, &product, http.StatusOK)
}

func parseGetOrganizationsOptions(u *url.URL) (app.OrganizationFilterOptions, error) {
	params := u.Query()

	var sortField app.SortField
	param := strings.ToLower(params.Get("sort"))
	switch param {
	case "name", "":
		sortField = app.SortByName
	default:
		return app.OrganizationFilterOptions{}, errors.Errorf("bad parameter 'sort' (%s): it should be empty or 'name'", param)
	}

	var sortDirection app.SortDirection
	param = strings.ToLower(params.Get("direction"))
	switch param {
	case "asc", "":
		sortDirection = app.DirectionAsc
	case "desc":
		sortDirection = app.DirectionDesc
	default:
		return app.OrganizationFilterOptions{}, errors.Errorf("bad parameter 'direction' (%s): it should be empty or one of 'asc' or 'desc'", param)
	}

	pageParam := params.Get("page")
	if pageParam == "" {
		pageParam = "0"
	}
	page, err := strconv.Atoi(pageParam)
	if err != nil {
		return app.OrganizationFilterOptions{}, errors.Wrapf(err, "bad parameter 'page': it should be a number")
	}
	if page < 0 {
		return app.OrganizationFilterOptions{}, errors.Errorf("bad parameter 'page': it should be a positive number")
	}

	perPageParam := params.Get("per_page")
	if perPageParam == "" || perPageParam == "0" {
		perPageParam = "50"
	}
	perPage, err := strconv.Atoi(perPageParam)
	if err != nil {
		return app.OrganizationFilterOptions{}, errors.Wrapf(err, "bad parameter 'per_page': it should be a number")
	}
	if perPage < 0 {
		return app.OrganizationFilterOptions{}, errors.Errorf("bad parameter 'per_page': it should be a positive number")
	}

	searchTerm := u.Query().Get("search_term")

	return app.OrganizationFilterOptions{
		Sort:       sortField,
		Direction:  sortDirection,
		Page:       page,
		PerPage:    perPage,
		SearchTerm: searchTerm,
	}, nil
}
