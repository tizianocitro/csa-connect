package app

type ProductChannel struct {
	ID   string `json:"id" export:"id"`
	Name string `json:"name" export:"name"`
}

// ProductChannelFilterOptions specifies the parameters when getting products.
type ProductChannelFilterOptions struct {
	Sort       SortField
	Direction  SortDirection
	SearchTerm string

	// Pagination options.
	Page    int
	PerPage int
}

type GetProductChannelsResults struct {
	TotalCount int              `json:"totalCount"`
	PageCount  int              `json:"pageCount"`
	HasMore    bool             `json:"hasMore"`
	Items      []ProductChannel `json:"items"`
}

type AddChannelParams struct {
	ChannelID           string `json:"channelId" export:"channelId"`
	ChannelMode         string `json:"channelMode" export:"channelMode"`
	ChannelNameTemplate string `json:"channelNameTemplate" export:"channelNameTemplate"`
	CreatePublicChannel bool   `json:"createPublicChannel" export:"createPublicChannel"`
	TeamID              string `json:"teamId" export:"teamId"`
}

type AddChannelResult struct {
	ID   string `json:"id" export:"id"`
	Name string `json:"name" export:"name"`
}
