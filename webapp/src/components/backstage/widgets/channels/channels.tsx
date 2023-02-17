import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';

import ChannelBox from './channel_box';

interface Props {
    parentId: string;
    sectionId: string;
    teamId: string;
}

const ChannelsSection = ({parentId, sectionId, teamId}: Props) => {
    const {formatMessage} = useIntl();
    const id = 'channels-widget';
    const title = formatMessage({defaultMessage: 'Channels'});
    return (
        <Container
            id={id}
            data-testid={id}
        >
            <Header>
                <AnchorLinkTitle
                    id={id}
                    query={`sectionId=${parentId}`}
                    text={title}
                    title={title}
                />
            </Header>
            <ChannelBox
                parentId={parentId}
                sectionId={sectionId}
                teamId={teamId}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default ChannelsSection;