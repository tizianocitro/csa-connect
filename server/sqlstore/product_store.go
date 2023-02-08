package sqlstore

import (
	"database/sql"
	"fmt"
	"math"
	"strings"

	"github.com/pkg/errors"
	"golang.org/x/exp/slices"

	sq "github.com/Masterminds/squirrel"
	"github.com/mattermost/mattermost-server/v6/model"

	"github.com/tizianocitro/mattermost-product/server/app"
	"github.com/tizianocitro/mattermost-product/server/util"
)

// productStore is a sql store for products. Use NewProductStore to create it.
type productStore struct {
	pluginAPI      PluginAPIClient
	store          *SQLStore
	queryBuilder   sq.StatementBuilderType
	productsSelect sq.SelectBuilder
	channelsSelect sq.SelectBuilder
	elementsSelect sq.SelectBuilder
}

// This is a way to implement interface explicitly
var _ app.ProductStore = (*productStore)(nil)

// NewProductStore creates a new store for product service.
func NewProductStore(pluginAPI PluginAPIClient, sqlStore *SQLStore) app.ProductStore {
	productsSelect := sqlStore.builder.
		Select(
			"CreatedAt",
			"ID",
			"IsFavorite",
			"LastUpdatedAt",
			"Name",
			"Summary",
			"SummaryModifiedAt",
		).
		From("MP_Product")

	elementsSelect := sqlStore.builder.
		Select(
			"Description",
			"ID",
			"Name",
			"ProductID",
		).
		From("MP_Element").
		OrderBy("Name ASC")

	channelsSelect := sqlStore.builder.
		Select(
			"ID",
			"Name",
			"ProductID",
		).
		From("MP_Channel")

	return &productStore{
		pluginAPI:      pluginAPI,
		store:          sqlStore,
		queryBuilder:   sqlStore.builder,
		productsSelect: productsSelect,
		elementsSelect: elementsSelect,
		channelsSelect: channelsSelect,
	}
}

// Get retrieves a playbook
func (p *productStore) Get(id string) (app.Product, error) {
	if id == "" {
		return app.Product{}, errors.New("ID cannot be empty")
	}

	tx, err := p.store.db.Beginx()
	if err != nil {
		return app.Product{}, errors.Wrap(err, "could not begin transaction")
	}
	defer p.store.finalizeTransaction(tx)

	var product ProductEntity
	err = p.store.getBuilder(tx, &product, p.productsSelect.Where(sq.Eq{"ID": id}))
	if err == sql.ErrNoRows {
		return app.Product{}, errors.Wrapf(app.ErrNotFound, "product does not exist for id '%s'", id)
	} else if err != nil {
		return app.Product{}, errors.Wrapf(err, "failed to get product by id '%s'", id)
	}

	var elements []ProductElementEntity
	err = p.store.selectBuilder(tx, &elements, p.elementsSelect.Where(sq.Eq{"ProductID": id}))
	if err != nil && err != sql.ErrNoRows {
		return app.Product{}, errors.Wrapf(err, "failed to get elements for product with id '%s'", id)
	}

	// var channels []ProductChannelEntity
	// err = p.store.selectBuilder(tx, &channels, p.channelsSelect.Where(sq.Eq{"ProductID": id}))
	// if err != nil && err != sql.ErrNoRows {
	//	return app.Product{}, errors.Wrapf(err, "failed to get channels configs for product with id '%s'", id)
	// }

	if err = tx.Commit(); err != nil {
		return app.Product{}, errors.Wrap(err, "could not commit transaction")
	}

	return *p.toProduct(product, elements, nil), nil
}

// GetProductsNoPage retrieves all products
func (p *productStore) GetProductsNoPage() (app.GetProductsNoPageResults, error) {
	var productsEntities []ProductEntity
	err := p.store.selectBuilder(p.store.db, &productsEntities, p.productsSelect)
	if err == sql.ErrNoRows {
		return app.GetProductsNoPageResults{}, errors.Wrap(app.ErrNotFound, "no products found")
	} else if err != nil {
		return app.GetProductsNoPageResults{}, errors.Wrap(err, "failed to get products")
	}
	return app.GetProductsNoPageResults{
		Items: p.toProducts(productsEntities),
	}, nil
}

// GetProducts retrieves all playbooks given a set of filters.
func (p *productStore) GetProducts(opts app.ProductFilterOptions) (app.GetProductsResults, error) {
	queryForResults, err := applyProductFilterOptions(p.productsSelect, opts)
	if err != nil {
		return app.GetProductsResults{}, errors.Wrap(err, "failed to apply sort options")
	}

	queryForTotal := p.store.builder.
		Select("COUNT(*)").
		From("MP_Product")

	if opts.SearchTerm != "" {
		column := "Name"
		searchString := opts.SearchTerm

		// Postgres performs a case-sensitive search, so we need to lowercase
		// both the column contents and the search string
		if p.store.db.DriverName() == model.DatabaseDriverPostgres {
			column = "LOWER(Name)"
			searchString = strings.ToLower(opts.SearchTerm)
		}

		queryForResults = queryForResults.Where(sq.Like{column: fmt.Sprint("%", searchString, "%")})
		queryForTotal = queryForTotal.Where(sq.Like{column: fmt.Sprint("%", searchString, "%")})
	}

	var productsEntities []ProductEntity
	err = p.store.selectBuilder(p.store.db, &productsEntities, queryForResults)
	if err == sql.ErrNoRows {
		return app.GetProductsResults{}, errors.Wrap(app.ErrNotFound, "no products found")
	} else if err != nil {
		return app.GetProductsResults{}, errors.Wrap(err, "failed to get products")
	}

	var total int
	if err = p.store.getBuilder(p.store.db, &total, queryForTotal); err != nil {
		return app.GetProductsResults{}, errors.Wrap(err, "failed to get total count")
	}

	pageCount := 0
	if opts.PerPage > 0 {
		pageCount = int(math.Ceil(float64(total) / float64(opts.PerPage)))
	}
	hasMore := opts.Page+1 < pageCount

	return app.GetProductsResults{
		TotalCount: total,
		PageCount:  pageCount,
		HasMore:    hasMore,
		Items:      p.toProducts(productsEntities),
	}, nil
}

// GetChannels retrieves all channels for a product given a set of filters
func (p *productStore) GetChannels(productID string, opts app.ProductChannelFilterOptions) (app.GetProductChannelsResults, error) {
	queryForResults, err := applyProductChannelFilterOptions(p.channelsSelect.Where(sq.Eq{"ProductID": productID}), opts)
	if err != nil {
		return app.GetProductChannelsResults{}, errors.Wrap(err, "failed to apply sort options")
	}

	queryForTotal := p.store.builder.
		Select("COUNT(*)").
		From("MP_Channel").
		Where(sq.Eq{"ProductID": productID})

	if opts.SearchTerm != "" {
		column := "Name"
		searchString := opts.SearchTerm

		// Postgres performs a case-sensitive search, so we need to lowercase
		// both the column contents and the search string
		if p.store.db.DriverName() == model.DatabaseDriverPostgres {
			column = "LOWER(Name)"
			searchString = strings.ToLower(opts.SearchTerm)
		}

		queryForResults = queryForResults.Where(sq.Like{column: fmt.Sprint("%", searchString, "%")})
		queryForTotal = queryForTotal.Where(sq.Like{column: fmt.Sprint("%", searchString, "%")})
	}

	var channelsEntities []ProductChannelEntity
	err = p.store.selectBuilder(p.store.db, &channelsEntities, queryForResults)
	if err == sql.ErrNoRows {
		return app.GetProductChannelsResults{}, errors.Wrap(app.ErrNotFound, "no channels found for the product")
	} else if err != nil {
		return app.GetProductChannelsResults{}, errors.Wrap(err, "failed to get channels for the product")
	}

	var total int
	if err = p.store.getBuilder(p.store.db, &total, queryForTotal); err != nil {
		return app.GetProductChannelsResults{}, errors.Wrap(err, "failed to get total count")
	}

	pageCount := 0
	if opts.PerPage > 0 {
		pageCount = int(math.Ceil(float64(total) / float64(opts.PerPage)))
	}
	hasMore := opts.Page+1 < pageCount

	return app.GetProductChannelsResults{
		TotalCount: total,
		PageCount:  pageCount,
		HasMore:    hasMore,
		Items:      p.toChannels(channelsEntities),
	}, nil
}

// AddChannel adds a channel to a product
func (p *productStore) AddChannel(productID string, params app.AddChannelParams) (app.AddChannelResult, error) {
	if productID == "" {
		return app.AddChannelResult{}, errors.New("ID cannot be empty")
	}

	tx, err := p.store.db.Beginx()
	if err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not begin transaction")
	}
	defer p.store.finalizeTransaction(tx)

	var product ProductEntity
	err = p.store.getBuilder(tx, &product, p.productsSelect.Where(sq.Eq{"ID": productID}))
	if err == sql.ErrNoRows {
		return app.AddChannelResult{}, errors.Wrapf(app.ErrNotFound, "product with given id does not exist")
	} else if err != nil {
		return app.AddChannelResult{}, errors.Wrapf(err, "failed to get product by id '%s'", productID)
	}

	channelsIdsSelect := p.store.builder.
		Select("ID").
		From("MP_Channel").
		Where(sq.Eq{"ProductID": productID})

	var channelsIds []string
	err = p.store.selectBuilder(tx, &channelsIds, channelsIdsSelect)
	if err != nil && err != sql.ErrNoRows {
		return app.AddChannelResult{}, errors.Wrapf(err, "failed to get channels ids for product with id '%s'", productID)
	}

	if len(strings.TrimSpace(params.ChannelID)) != 0 {
		channel, _ := p.pluginAPI.API.GetChannel(params.ChannelID)
		if slices.Contains(channelsIds, params.ChannelID) || slices.Contains(channelsIds, channel.Id) {
			return app.AddChannelResult{
				ID:   params.ChannelID,
				Name: channel.Name,
			}, nil
		}

		_, execErr := p.store.execBuilder(tx, sq.
			Insert("MP_Channel").
			SetMap(map[string]interface{}{
				"ID":        channel.Id,
				"Name":      channel.Name,
				"ProductID": productID,
			}))
		if execErr != nil {
			return app.AddChannelResult{}, errors.Wrap(err, "could not add channel to product")
		}
		return app.AddChannelResult{
			ID:   params.ChannelID,
			Name: channel.Name,
		}, nil
	}

	channelType := model.ChannelTypePrivate
	if params.CreatePublicChannel {
		channelType = model.ChannelTypeOpen
	}

	channel, appErr := p.pluginAPI.API.CreateChannel(&model.Channel{
		TeamId:      params.TeamID,
		Type:        channelType,
		DisplayName: params.ChannelNameTemplate,
		Name:        params.ChannelNameTemplate,
	})
	if appErr != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not create channel to add to the product")
	}

	_, err = p.store.execBuilder(tx, sq.
		Insert("MP_Channel").
		SetMap(map[string]interface{}{
			"ID":        channel.Id,
			"Name":      channel.Name,
			"ProductID": productID,
		}))
	if err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not add new channel to product")
	}

	if err = tx.Commit(); err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not commit transaction")
	}

	return app.AddChannelResult{
		ID:   channel.Id,
		Name: channel.Name,
	}, nil
}

func applyProductFilterOptions(builder sq.SelectBuilder, options app.ProductFilterOptions) (sq.SelectBuilder, error) {
	var sort string
	switch options.Sort {
	case app.SortByName:
		sort = "Name"
	case "":
		// Default to a stable sort if none explicitly provided.
		sort = "Name"
	default:
		return sq.SelectBuilder{}, errors.Errorf("unsupported sort parameter '%s'", options.Sort)
	}

	var direction string
	switch options.Direction {
	case app.DirectionAsc:
		direction = "ASC"
	case app.DirectionDesc:
		direction = "DESC"
	case "":
		// Default to an ascending sort if none explicitly provided.
		direction = "ASC"
	default:
		return sq.SelectBuilder{}, errors.Errorf("unsupported direction parameter '%s'", options.Direction)
	}

	builder = builder.OrderByClause(fmt.Sprintf("%s %s", sort, direction))

	page := options.Page
	perPage := options.PerPage
	if page < 0 {
		page = 0
	}
	if perPage < 0 {
		perPage = 0
	}

	builder = builder.
		Offset(uint64(page * perPage)).
		Limit(uint64(perPage))

	return builder, nil
}

func applyProductChannelFilterOptions(builder sq.SelectBuilder, options app.ProductChannelFilterOptions) (sq.SelectBuilder, error) {
	var sort string
	switch options.Sort {
	case app.SortByName:
		sort = "Name"
	case "":
		// Default to a stable sort if none explicitly provided.
		sort = "Name"
	default:
		return sq.SelectBuilder{}, errors.Errorf("unsupported sort parameter '%s'", options.Sort)
	}

	var direction string
	switch options.Direction {
	case app.DirectionAsc:
		direction = "ASC"
	case app.DirectionDesc:
		direction = "DESC"
	case "":
		// Default to an ascending sort if none explicitly provided.
		direction = "ASC"
	default:
		return sq.SelectBuilder{}, errors.Errorf("unsupported direction parameter '%s'", options.Direction)
	}

	builder = builder.OrderByClause(fmt.Sprintf("%s %s", sort, direction))

	page := options.Page
	perPage := options.PerPage
	if page < 0 {
		page = 0
	}
	if perPage < 0 {
		perPage = 0
	}

	builder = builder.
		Offset(uint64(page * perPage)).
		Limit(uint64(perPage))

	return builder, nil
}

func (p *productStore) toProduct(
	productEntity ProductEntity,
	elementsEntities []ProductElementEntity,
	channelsEntities []ProductChannelEntity,
) *app.Product {
	product := &app.Product{}
	err := util.Convert(productEntity, product)
	if err != nil {
		p.pluginAPI.API.LogError("Failed to convert product entity to product", "err", err.Error())
		return &app.Product{}
	}
	product.Elements = p.toElements(elementsEntities)
	product.Channels = p.toChannels(channelsEntities)
	return product
}

func (p *productStore) toProducts(productsEntities []ProductEntity) []app.Product {
	if productsEntities == nil {
		return nil
	}
	products := make([]app.Product, 0, len(productsEntities))
	for _, product := range productsEntities {
		products = append(products, *p.toProduct(product, nil, nil))
	}
	return products
}

func (p *productStore) toElements(elementsEntities []ProductElementEntity) []app.ProductElement {
	if elementsEntities == nil {
		return nil
	}
	elements := make([]app.ProductElement, 0, len(elementsEntities))
	for _, el := range elementsEntities {
		element := &app.ProductElement{}
		err := util.Convert(el, element)
		if err != nil {
			return nil
		}
		elements = append(elements, *element)
	}
	return elements
}

func (p *productStore) toChannels(channelsEntities []ProductChannelEntity) []app.ProductChannel {
	if channelsEntities == nil {
		return nil
	}
	channels := make([]app.ProductChannel, 0, len(channelsEntities))
	for _, c := range channelsEntities {
		channel := &app.ProductChannel{}
		err := util.Convert(c, channel)
		if err != nil {
			return nil
		}
		channels = append(channels, *channel)
	}
	return channels
}
