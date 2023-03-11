import React, {useContext, useEffect, useReducer} from 'react';
import styled from 'styled-components';

import {addChannelErrorMessageAction, channelCreationAction, nameErrorMessageAction} from 'src/actions';
import {
    setAddChannelErrorMessage,
    setChannelCreation,
    setNameErrorMessage,
    setSelectErrorMessage,
} from 'src/reducer';
import ChannelsList from 'src/components/backstage/widgets/channels/channels_list/channels_list';
import {CreateChannel} from 'src/components/backstage/widgets/channels/controls';
import {Section} from 'src/components/backstage/widgets/channels/styles';
import {OrganizationIdContext} from 'src/components/backstage/organizations/organization_details';
import {
    formatName,
    useChannelsList,
    useOrganization,
    useSection,
    useSectionInfo,
} from 'src/hooks';

import {CreateSingleChannel} from './single_channel_creation';

type Props = {
    parentId: string;
    sectionId: string;
    teamId: string;
};

const SingleChannelBox = ({parentId, sectionId, teamId}: Props) => {
    const channels = useChannelsList({section_id: sectionId, parent_id: parentId});
    const organizationId = useContext(OrganizationIdContext);
    const organization = useOrganization(organizationId);
    const section = useSection(parentId);
    const sectionInfo = useSectionInfo(sectionId, section.url);

    const [addChannelErrorMessage, dispacthAddChannelErrorMessage] = useReducer(setAddChannelErrorMessage, '');
    const [_, dispatchSelectErrorMessage] = useReducer(setSelectErrorMessage, '');
    const [nameErrorMessage, dispatchNameErrorMessage] = useReducer(setNameErrorMessage, '');

    const defaultChannelCreation = {
        teamId: '',
        channelId: '',
        channelMode: 'create_new_channel',
        channelName: '',
        createPublicChannel: true,
    };
    const [channelCreation, dispatchChannelCreation] = useReducer(setChannelCreation, defaultChannelCreation);
    useEffect(() => {
        dispatchChannelCreation(channelCreationAction({
            ...channelCreation,
            channelName: formatName(`${organization.name}-${sectionInfo.name}`),
        }));
    }, [sectionInfo]);

    const cleanErrorMessages = () => {
        dispacthAddChannelErrorMessage(addChannelErrorMessageAction(''));
        dispatchNameErrorMessage(nameErrorMessageAction(''));
    };

    return (
        <>
            {(!channels || channels.length < 1) &&
                <StyledSection>
                    <Setting id={'channel-action'}>
                        <CreateSingleChannel
                            channelCreation={channelCreation}
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
                        addChannelErrorMessage={addChannelErrorMessage}
                        dispacthAddChannelErrorMessage={dispacthAddChannelErrorMessage}
                        dispatchSelectErrorMessage={dispatchSelectErrorMessage}
                        dispatchNameErrorMessage={dispatchNameErrorMessage}
                    />
                </StyledSection>}
            {channels &&
                <ChannelContainer>
                    <ChannelsList
                        channels={channels}
                        isList={false}
                    />
                </ChannelContainer>}
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

const ChannelContainer = styled.div`
    flex: 1 1 auto;
`;

export default SingleChannelBox;