package sqlstore

import (
	"database/sql"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"

	sq "github.com/Masterminds/squirrel"
	"github.com/mattermost/mattermost-server/v6/model"

	"github.com/tizianocitro/csa-connect/server/app"
	"github.com/tizianocitro/csa-connect/server/util"
)

// channelStore is a sql store for channels
// Use NewChannelStore to create it
type channelStore struct {
	pluginAPI      PluginAPIClient
	store          *SQLStore
	queryBuilder   sq.StatementBuilderType
	channelsSelect sq.SelectBuilder
}

// This is a way to implement interface explicitly
var _ app.ChannelStore = (*channelStore)(nil)

// NewChannelStore creates a new store for channel service.
func NewChannelStore(pluginAPI PluginAPIClient, sqlStore *SQLStore) app.ChannelStore {
	channelsSelect := sqlStore.builder.
		Select(
			"ChannelID",
			"ParentID",
			"SectionID",
		).
		From("CSA_Channel")

	return &channelStore{
		pluginAPI:      pluginAPI,
		store:          sqlStore,
		queryBuilder:   sqlStore.builder,
		channelsSelect: channelsSelect,
	}
}

// GetChannels retrieves all channels for a product given a set of filters
func (s *channelStore) GetChannels(sectionID string) (app.GetChannelsResults, error) {
	queryForResults := s.channelsSelect.Where(sq.Eq{"SectionID": sectionID})
	var channelsEntities []ChannelEntity
	err := s.store.selectBuilder(s.store.db, &channelsEntities, queryForResults)
	if err == sql.ErrNoRows {
		return app.GetChannelsResults{}, errors.Wrap(app.ErrNotFound, "no channels found for the section")
	} else if err != nil {
		return app.GetChannelsResults{}, errors.Wrap(err, "failed to get channels for the section")
	}

	return app.GetChannelsResults{
		Items: s.toChannels(channelsEntities),
	}, nil
}

// AddChannel adds a channel to a product
func (s *channelStore) AddChannel(sectionID string, params app.AddChannelParams) (app.AddChannelResult, error) {
	if sectionID == "" {
		return app.AddChannelResult{}, errors.New("SectionID cannot be empty")
	}
	if strings.TrimSpace(params.ChannelID) != "" {
		return s.addExistingChannel(sectionID, params)
	}
	return s.createChannel(sectionID, params)
}

func (s *channelStore) addExistingChannel(sectionID string, params app.AddChannelParams) (app.AddChannelResult, error) {
	tx, err := s.store.db.Beginx()
	if err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not begin transaction")
	}
	defer s.store.finalizeTransaction(tx)

	// channelsIds, err := s.getChannelsIdsBySectionID(sectionID, tx)
	// if err != nil {
	// 	return app.AddChannelResult{}, err
	// }

	if _, err := s.store.execBuilder(tx, sq.
		Insert("CSA_Channel").
		SetMap(map[string]interface{}{
			"ChannelID": params.ChannelID,
			"ParentID":  params.ParentID,
			"SectionID": sectionID,
		})); err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not add existing channel to section")
	}
	if err := tx.Commit(); err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not commit transaction")
	}
	return app.AddChannelResult{
		ChannelID: params.ChannelID,
		ParentID:  params.ParentID,
		SectionID: sectionID,
	}, nil
}

func (s *channelStore) createChannel(sectionID string, params app.AddChannelParams) (app.AddChannelResult, error) {
	tx, txErr := s.store.db.Beginx()
	if txErr != nil {
		return app.AddChannelResult{}, errors.Wrap(txErr, "could not begin transaction")
	}
	defer s.store.finalizeTransaction(tx)

	channel, err := s.pluginAPI.API.CreateChannel(&model.Channel{
		TeamId:      params.TeamID,
		Type:        s.getChannelType(params),
		DisplayName: params.ChannelName,
		Name:        strings.ToLower(params.ChannelName),
	})
	if err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not create channel to add to the product")
	}
	if _, err := s.store.execBuilder(tx, sq.
		Insert("CSA_Channel").
		SetMap(map[string]interface{}{
			"ChannelID": channel.Id,
			"ParentID":  params.ParentID,
			"SectionID": sectionID,
		})); err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not add new channel to section")
	}
	if err := tx.Commit(); err != nil {
		return app.AddChannelResult{}, errors.Wrap(err, "could not commit transaction")
	}
	return app.AddChannelResult{
		ChannelID: channel.Id,
		ParentID:  params.ParentID,
		SectionID: sectionID,
	}, nil
}

func (s *channelStore) getChannelsIdsBySectionID(sectionID string, tx *sqlx.Tx) ([]string, error) {
	channelsIdsSelect := s.store.builder.
		Select("ChannelID").
		From("CSA_Channel").
		Where(sq.Eq{"SectionID": sectionID})

	var channelsIds []string
	if err := s.store.selectBuilder(tx, &channelsIds, channelsIdsSelect); err != nil && err != sql.ErrNoRows {
		return nil, errors.Wrapf(err, "failed to get channels ids for section with id '%s'", sectionID)
	}
	return channelsIds, nil
}

func (s *channelStore) getChannelType(params app.AddChannelParams) model.ChannelType {
	channelType := model.ChannelTypePrivate
	if params.CreatePublicChannel {
		channelType = model.ChannelTypeOpen
	}
	return channelType
}

func (s *channelStore) toChannels(channelsEntities []ChannelEntity) []app.Channel {
	if channelsEntities == nil {
		return nil
	}
	channels := make([]app.Channel, 0, len(channelsEntities))
	for _, c := range channelsEntities {
		channel := app.Channel{}
		err := util.Convert(c, &channel)
		if err != nil {
			return nil
		}
		channels = append(channels, channel)
	}
	return channels
}
