package store

import (
	"database/sql"

	"github.com/pkg/errors"

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
	productsSelect  sq.SelectBuilder
	channelsSelect sq.SelectBuilder
	elementsSelect sq.SelectBuilder
}

// This is a way to implement interface explicitly
var _ app.ProductStore = (*productStore)(nil)

// NewProductStore creates a new store for product service.
func NewProductStore(pluginAPI PluginAPIClient, sqlStore *SQLStore) app.ProductStore {
	productSelect := sqlStore.builder.
		Select(
			"CreatedAt",
			"ID",
			"IsFavorite",
			"LastUpdateAt",
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
		From("MP_Elements").
		OrderBy("Name ASC")

	channelsSelect := sqlStore.builder.
		Select(
			"ID",
			"Name",
			"ProductID",
		).
		From("MP_Channels")

	return &productStore{
		pluginAPI:      pluginAPI,
		store:          sqlStore,
		queryBuilder:   sqlStore.builder,
		productsSelect:  productsSelect,
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
	err = p.store.getBuilder(tx, &product, p.productsSelect.Where(sq.Eq{"p.ID": id}))
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

	return toProduct(&product, elements, nil)
}


// GetProductsNoPage retrieves all products
func (p *productStore) GetProductsNoPage() ([]app.Product, error) {
	var productsEntities []ProductEntity
	err = p.store.selectBuilder(tx, &productsEntities, p.productsSelect)
	if err == sql.ErrNoRows {
		return nil, errors.Wrap(app.ErrNotFound, "no products found")
	} else if err != nil {
		return nil, errors.Wrap(err, "failed to get products")
	}
	return toProducts(productsEntities), nil
}

// GetProducts retrieves all playbooks given a set of filters.
func (p *productStore) GetProducts(opts app.ProductFilterOptions) (app.GetProductsResults, error) {
	queryForResults, err := applyFilterOptions(p.productsSelect, opts)
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
	hasMore := opts.Page + 1 < pageCount

	return app.GetProductsResults{
		TotalCount: total,
		PageCount:  pageCount,
		HasMore:    hasMore,
		Items:      toProducts(productsEntities),
	}, nil
}

func (p *productStore) GetChannels(productID string, opts app.ProductChannelFilterOptions) (app.GetProductChannelsResults, error) {
	queryForResults, err := applyFilterOptions(p.channellSelect, opts)
	if err != nil {
		return app.GetProductChannelsResults{}, errors.Wrap(err, "failed to apply sort options")
	}

	queryForTotal := p.store.builder.
		Select("COUNT(*)").
		From("MP_Channel")

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
		return app.GetProductChannelsResults{}, errors.Wrap(app.ErrNotFound, "no channeles found for product with id '%s'", id)
	} else if err != nil {
		return app.GetProductChannelsResults{}, errors.Wrap(err, "failed to get channels for product with id '%s'", id)
	}

	var total int
	if err = p.store.getBuilder(p.store.db, &total, queryForTotal); err != nil {
		return app.GetProductChannelsResults{}, errors.Wrap(err, "failed to get total count")
	}

	pageCount := 0
	if opts.PerPage > 0 {
		pageCount = int(math.Ceil(float64(total) / float64(opts.PerPage)))
	}
	hasMore := opts.Page + 1 < pageCount

	return app.GetProductChannelsResults{
		TotalCount: total,
		PageCount:  pageCount,
		HasMore:    hasMore,
		Items:      toChannels(channelsEntities),
	}, nil
}

// TODO: Add the AddChannel function

func applyFilterOptions(builder sq.SelectBuilder, options app.ProductFilterOptions) (sq.SelectBuilder, error) {
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

func toProducts(productsEntities []ProductEntity) []app.Product {
	if productsEntities == nil {
		return nil
	}
	products := make([]string, len(productsEntities))
	for _, product := range productsEntities {
		append(products, toProduct(product, nil, nil))
	}
	return products
}

func toProduct(
	productEntity *ProductEntity,
	elementsEntities []ElementsEntity,
	channelsEntities []ChannelsEntity,
) app.Product {
	product := &app.Product{}
	util.Convert(productEntity, product)
	product.Elements = toElements(elementsEntities)
	product.Channels = toChannels(channelsEntities)
	return product
}

func toElements(elementsEntities []ElementsEntity) []app.ProductElement {
	if elements == nil {
		return nil
	}
	elements = make([]app.ProductElement, 0, len(elementsEntities))
	for _, el range elementsEntities {
		append(elements, util.Convert(el, app.ProductElement{}))
	}
	return elements
}

func toChannel(channelsEntities []ChannelsEntity,) []app.ProductChannel {
	if channelsEntities == nil {
		return nil
	}
	channels := make([]app.ProductChannel, 0, len(channelsEntities))
	for _, c range channelsEntities {
		append(channels, util.Convert(c, app.ProductChannel{}))
	}
	return channels
}
