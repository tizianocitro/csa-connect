package app

// ChannelStore is an interface for storing channels
type ChannelStore interface {
	// GetChannels retrieves all channels for a section
	GetChannels(productID string) (GetChannelsResults, error)

	// AddChannel adds a channel to a section
	AddChannel(productID string, params AddChannelParams) (AddChannelResult, error)
}
