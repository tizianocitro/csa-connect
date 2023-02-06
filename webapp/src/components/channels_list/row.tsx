// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {getCurrentTeamId, getTeam} from 'mattermost-redux/selectors/entities/teams';
import {GlobalState} from '@mattermost/types/store';
import {Team} from '@mattermost/types/teams';

import {navigateToChannel} from 'src/browser_routing';
import {ProductChannel} from 'src/types/channels';

interface Props {
    channel: ProductChannel;
}

const teamNameSelector = (teamId: string) => (state: GlobalState): Team => getTeam(state, teamId);

const Row = (props: Props) => {
    const teamId = useSelector(getCurrentTeamId);
    let team = useSelector(teamNameSelector(teamId));
    if (!teamId) {
        team = {...team, display_name: 'All Teams', description: 'No team is selected'};
    }

    function openChannel(channel: ProductChannel) {
        navigateToChannel(team.name, channel.id);
    }

    return (
        <ChannelItem
            className='row'
            key={props.channel.id}
            onClick={() => openChannel(props.channel)}
        >
            <div className='col-sm-4'>
                <ChannelName>{props.channel.name}</ChannelName>
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