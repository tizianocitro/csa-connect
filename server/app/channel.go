package app

type Channel struct {
	ChannelID      string `json:"channelId"`
	OrganizationID string `json:"organizationId"`
	SectionID      string `json:"sectionId"`
	SectionName    string `json:"sectionName"`
}

// ProductChannelFilterOptions specifies the parameters when getting products.
type ChannelFilterOptions struct {
	Sort       SortField
	Direction  SortDirection
	SearchTerm string

	// Pagination options.
	Page    int
	PerPage int
}

type GetChannelsResults struct {
	TotalCount int       `json:"totalCount"`
	PageCount  int       `json:"pageCount"`
	HasMore    bool      `json:"hasMore"`
	Items      []Channel `json:"items"`
}

type AddChannelParams struct {
	ChannelID           string `json:"channelId"`
	ChannelMode         string `json:"channelMode"`
	ChannelNameTemplate string `json:"channelNameTemplate"`
	CreatePublicChannel bool   `json:"createPublicChannel"`
	OrganizationID      string `json:"organizationId"`
	SectionID           string `json:"sectionId"`
	SectionName         string `json:"sectionName"`
	TeamID              string `json:"teamId"`
}

type AddChannelResult struct {
	ChannelID      string `json:"channelId"`
	OrganizationID string `json:"organizationId"`
	SectionID      string `json:"sectionId"`
	SectionName    string `json:"sectionName"`
}
