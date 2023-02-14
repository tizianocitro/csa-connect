import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {Product} from 'src/types/product';
import {AnchorLinkTitle} from 'src/components/backstage/widgets/shared';

import ChannelBox from './channel_box';

interface Props {
    id: string;
    product: Product;
    teamId: string;
}

const ChannelsSection = ({id, product, teamId}: Props) => {
    const {formatMessage} = useIntl();

    const title = formatMessage({defaultMessage: 'Channels'});
    return (
        <Container
            id={id}
            data-testid={'product-channel-box-section'}
        >
            <Header>
                <AnchorLinkTitle
                    text={title}
                    title={title}
                    id={id}
                />
            </Header>
            <ChannelBox
                product={product}
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

const Header = styled.div`
    display: flex;
    flex: 1;
    margin-bottom: 8px;
`;

export default ChannelsSection;