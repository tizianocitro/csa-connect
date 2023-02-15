package app

type Channel struct {
	ChannelID string `json:"channelId"`
	ParentID  string `json:"parentId"`
	SectionID string `json:"sectionId"`
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
	Items []Channel `json:"items"`
}

type AddChannelParams struct {
	ChannelID           string `json:"channel_id"`
	ChannelMode         string `json:"channel_mode"`
	ChannelNameTemplate string `json:"channel_name_template"`
	CreatePublicChannel bool   `json:"create_public_channel"`
	ParentID            string `json:"parent_id"`
	SectionID           string `json:"section_id"`
	TeamID              string `json:"team_id"`
}

type AddChannelResult struct {
	ChannelID      string `json:"channelId"`
	OrganizationID string `json:"organizationId"`
	SectionID      string `json:"sectionId"`
	SectionName    string `json:"sectionName"`
}
