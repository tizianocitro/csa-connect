package app

// ChannelStore is an interface for storing channels
type ChannelStore interface {
	// GetChannels retrieves all channels for a section
	GetChannels(sectionID string, parentID string) (GetChannelsResults, error)

	// AddChannel adds a channel to a section
	AddChannel(sectionID string, params AddChannelParams) (AddChannelResult, error)
}
