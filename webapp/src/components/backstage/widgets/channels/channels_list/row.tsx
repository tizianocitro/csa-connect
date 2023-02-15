// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {getCurrentChannelId} from 'mattermost-webapp/packages/mattermost-redux/src/selectors/entities/common';
import {getCurrentTeamId, getTeam} from 'mattermost-redux/selectors/entities/teams';
import {getChannel} from 'mattermost-redux/selectors/entities/channels';
import {GlobalState} from 'mattermost-webapp/packages/types/src/store';
import {Team} from 'mattermost-webapp/packages/types/src/teams';
import {Channel} from 'mattermost-webapp/packages/types/src/channels';

import {navigateToUrl} from 'src/browser_routing';
import {WidgetChannel} from 'src/types/channels';
import {SECTION_ID_PARAM} from 'src/constants';

interface Props {
    channel: WidgetChannel;
}

const teamNameSelector = (teamId: string) => (state: GlobalState): Team => getTeam(state, teamId);
const channelNameSelector = (channelId: string) => (state: GlobalState): Channel => getChannel(state, channelId);

const Row = (props: Props) => {
    const channelId = useSelector(getCurrentChannelId);
    const channel = useSelector(channelNameSelector(channelId));
    const teamId = useSelector(getCurrentTeamId);
    let team = useSelector(teamNameSelector(teamId));
    if (!teamId) {
        team = {...team, display_name: 'All Teams', description: 'No team is selected'};
    }

    function openChannel(channelToOpenId: string, channelToOpenSectionId: string) {
        navigateToUrl(`/${team.name}/channels/${channelToOpenId}?${SECTION_ID_PARAM}=${channelToOpenSectionId}&from=channel_list`);
    }

    return (
        <ChannelItem
            className='row'
            key={props.channel.channelId}
            onClick={() => openChannel(channel.name, props.channel.sectionId)}
        >
            <div className='col-sm-4'>
                <ChannelName>{channel.display_name}</ChannelName>
            </div>
        </ChannelItem>
    );
};

const ChannelItem = styled.div`
    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    align-items: center;
    margin: 0;
    background-color: var(--center-channel-bg);
    border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.08);
    cursor: pointer;

    &:hover {
        background: rgba(var(--center-channel-color-rgb), 0.04);
    }
`;

const ChannelName = styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
`;

export default Row;