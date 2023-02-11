package sqlstore

type ChannelEntity struct {
	ChannelID      string `json:"channelId"`
	OrganizationID string `json:"organizationId"`
	SectionID      string `json:"sectionId"`
	SectionName    string `json:"sectionName"`
}
