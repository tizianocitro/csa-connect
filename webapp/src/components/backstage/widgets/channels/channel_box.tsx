import React, {useReducer} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {CreateAChannel} from 'src/components/backstage/widgets/channels/channel_access';
import {Section} from 'src/components/backstage/widgets/channels/styles';
import {useChannelsList} from 'src/hooks';
import {setChannelCreation, setNameErrorMessage, setSelectErrorMessage} from 'src/reducer';
import {nameErrorMessageAction, selectErrorMessageAction} from 'src/actions';
import {BACKSTAGE_LIST_PER_PAGE} from 'src/constants';
import ChannelsList from 'src/components/backstage/widgets/channels/channels_list/channels_list';
import Header from 'src/components/common/header';

import {CreateChannel} from './controls';

interface Props {
    parentId: string;
    sectionId: string;
    teamId: string;
}

const defaultChannelsFetchParams = {
    page: 0,
    per_page: BACKSTAGE_LIST_PER_PAGE,
    sort: 'name',
    direction: 'desc',
};

const ChannelBox = ({parentId, sectionId, teamId}: Props) => {
    const {formatMessage} = useIntl();
    const [channels, totalCount, fetchParams, setFetchParams] = useChannelsList({...defaultChannelsFetchParams, section_id: sectionId, parent_id: parentId});

    const [selectErrorMessage, dispatchSelectErrorMessage] = useReducer(setSelectErrorMessage, '');
    const [nameErrorMessage, dispatchNameErrorMessage] = useReducer(setNameErrorMessage, '');

    const baseChannelCreation = {
        teamId: '',
        channelId: '',
        channelMode: 'link_existing_channel', // Default is creation link_existing_channel, but also create_new_channel
        channelNameTemplate: '',
        createPublicChannel: true,
    };
    const [channelCreation, dispatchChannelCreation] = useReducer(setChannelCreation, baseChannelCreation);

    const cleanErrorMessages = () => {
        dispatchSelectErrorMessage(selectErrorMessageAction(''));
        dispatchNameErrorMessage(nameErrorMessageAction(''));
    };
    return (
        <>
            <StyledSection>
                <Setting id={'channel-action'}>
                    <CreateAChannel
                        channelCreation={channelCreation}
                        selectErrorMessage={selectErrorMessage}
                        nameErrorMessage={nameErrorMessage}
                        dispatchChannelCreation={dispatchChannelCreation}
                        cleanErrorMessages={cleanErrorMessages}
                    />
                </Setting>
                <CreateChannel
                    channelCreation={channelCreation}
                    parentId={parentId}
                    sectionId={sectionId}
                    teamId={teamId}
                    dispatchSelectErrorMessage={dispatchSelectErrorMessage}
                    dispatchNameErrorMessage={dispatchNameErrorMessage}
                />
            </StyledSection>
            <ChannelListContainer>
                <Header
                    data-testid='titleAddedChannels'
                    level={5}
                    heading={formatMessage({defaultMessage: 'Added Channels'})}
                    subtitle={formatMessage({defaultMessage: 'All the added channels will show here'})}
                    css={`
                        border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
                    `}
                />
                <ChannelsList
                    channels={channels}
                    totalCount={totalCount}
                    fetchParams={fetchParams}
                    setFetchParams={setFetchParams}
                    filterPill={null}
                />
            </ChannelListContainer>
        </>
    );
};

const StyledSection = styled(Section)`
    border: 1px solid rgba(var(--center-channel-color-rgb), 0.08);
    padding: 2rem;
    padding-bottom: 0;
    margin: 0;
    margin-bottom: 20px;
    border-radius: 8px;
`;

const Setting = styled.div`
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ChannelListContainer = styled.div`
    flex: 1 1 auto;
`;

export default ChannelBox;