export interface WidgetChannel {
    channelId: string;
    sectionId: string;
}

export interface FetchChannelsParams {
    channel_id?: string;
    direction?: string;
    page: number;
    parent_id?: string;
    per_page: number;
    search_term?: string;
    section_id?: string;
    sort?: string;
    team_id?: string;
}

export interface FetchChannelsReturn {
    items: WidgetChannel[];
}

export interface ChannelCreation {
    channelId: string;
    channelMode: string;
    channelNameTemplate: string;
    createPublicChannel: boolean;
    teamId: string;
}

export interface AddChannelParams {
    channel_id?: string;
    channel_name?: string;
    create_public_channel?: boolean;
    section_id: string;
    parent_id: string;
    team_id: string;
}

export interface AddChannelResult {
    channel_id?: string;
    section_id?: string;
}
