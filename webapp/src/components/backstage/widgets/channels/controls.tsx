
import React, {Dispatch} from 'react';
import styled, {css} from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {getTeam} from 'mattermost-redux/selectors/entities/teams';
import {GlobalState} from 'mattermost-webapp/packages/types/src/store';
import {Team} from 'mattermost-webapp/packages/types/src/teams';

import {PrimaryButton} from 'src/components/assets/buttons';
import {addChannel} from 'src/clients';
import {addChannelErrorMessageAction, nameErrorMessageAction, selectErrorMessageAction} from 'src/actions';
import {AddChannelResult, ChannelCreation} from 'src/types/channels';
import {navigateToUrl} from 'src/browser_routing';
import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';
import {HorizontalSpacer, HorizontalSplit} from 'src/components/backstage/grid';
import {ErrorMessage} from 'src/components/common/messages';

type AddChannelProps = {
    channelCreation: ChannelCreation;
    parentId: string;
    sectionId: string;
    teamId: string;
    addChannelErrorMessage: string;
    dispacthAddChannelErrorMessage: Dispatch<any>;
    dispatchNameErrorMessage: Dispatch<any>;
    dispatchSelectErrorMessage: Dispatch<any>;
};

const createChannel = (
    channelCreation: ChannelCreation,
    parentId: string,
    sectionId: string,
    teamId: string,
    teamName: string,
    dispacthAddChannelErrorMessage: Dispatch<any>,
    dispatchNameErrorMessage: Dispatch<any>,
    dispatchSelectErrorMessage: Dispatch<any>,
) => {
    if (!channelCreation) {
        return;
    }

    const {channelMode, channelId, channelName, createPublicChannel} = channelCreation;
    const createNewChannel = channelMode === 'create_new_channel';
    const linkExistingChannel = channelMode === 'link_existing_channel';
    if (linkExistingChannel && channelId === '') {
        dispatchSelectErrorMessage(selectErrorMessageAction('A channel has to be selected.'));
        return;
    }
    if (createNewChannel && channelName === '') {
        dispatchNameErrorMessage(nameErrorMessageAction('Channel name cannot be empty.'));
        return;
    }
    addChannel({
        channelId: linkExistingChannel ? channelId : undefined,
        channelName: createNewChannel ? channelName : undefined,
        createPublicChannel: createNewChannel ? createPublicChannel : false,
        parentId,
        sectionId,
        teamId,
    }).
        then((result: AddChannelResult) => {
            navigateToUrl(`/${teamName}/channels/${result.channelId}?${SECTION_ID_PARAM}=${result.sectionId}&${PARENT_ID_PARAM}=${result.parentId}&from=channel_list`);
        }).
        catch(() => {
            dispacthAddChannelErrorMessage(addChannelErrorMessageAction('Please ensure the channel has not been added to other sections.'));
        });
};

const teamNameSelector = (teamId: string) => (state: GlobalState): Team => getTeam(state, teamId);

export const CreateChannel = ({
    channelCreation,
    parentId,
    sectionId,
    teamId,
    addChannelErrorMessage,
    dispacthAddChannelErrorMessage,
    dispatchNameErrorMessage,
    dispatchSelectErrorMessage,
}: AddChannelProps) => {
    const {formatMessage} = useIntl();
    let team = useSelector(teamNameSelector(teamId));
    if (!teamId) {
        team = {...team, display_name: 'All Teams', description: 'No team is selected'};
    }
    const title = formatMessage({defaultMessage: 'Add Channel'});
    return (
        <HorizontalSplit>
            <PrimaryButtonLarger
                onClick={() => createChannel(
                    channelCreation,
                    parentId,
                    sectionId,
                    teamId,
                    team.name,
                    dispacthAddChannelErrorMessage,
                    dispatchNameErrorMessage,
                    dispatchSelectErrorMessage,
                )}
                title={title}
                data-testid='create-channel-button'
            >
                <FormattedMessage defaultMessage='Add Channel'/>
            </PrimaryButtonLarger>
            <HorizontalSpacer size={1}/>
            <ErrorMessage display={addChannelErrorMessage !== ''}>
                {addChannelErrorMessage}
            </ErrorMessage>
        </HorizontalSplit>
    );
};

const buttonCommon = css`
    padding: 0 16px;
    height: 36px;
    gap: 8px;

    i::before {
        margin-left: 0;
        margin-right: 0;
        font-size: 1.05em;
    }
`;

const PrimaryButtonLarger = styled(PrimaryButton)`
    ${buttonCommon};
`;