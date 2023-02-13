import React, {useReducer} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {CreateAChannel} from 'src/components/backstage/widgets/channels/channel_access';
import {Section} from 'src/components/backstage/widgets/channels/styles';
import {Product} from 'src/types/product';
import {useConvertProductToChannelProduct, useProductChannelsList} from 'src/hooks';
import {setNameErrorMessage, setProductForCreateChannel, setSelectErrorMessage} from 'src/reducer';
import {nameErrorMessageAction, selectErrorMessageAction} from 'src/actions';
import {BACKSTAGE_LIST_PER_PAGE} from 'src/constants';
import ChannelsList from 'src/components/backstage/widgets/channels_list/channels_list';
import Header from 'src/components/common/header';

import {CreateProductChannel} from './controls';

interface Props {
    product: Product;
    teamId: string;
}

const defaultChannelsFetchParams = {
    page: 0,
    per_page: BACKSTAGE_LIST_PER_PAGE,
    sort: 'name',
    direction: 'desc',
};

// const [productForCreateChannel, setProductForCreateChannel] = useState(channelProduct);
const ChannelBox = ({product, teamId}: Props) => {
    const {formatMessage} = useIntl();
    const [channels, totalCount, fetchParams, setFetchParams] = useProductChannelsList({...defaultChannelsFetchParams, product_id: product.id});

    const [selectErrorMessage, dispatchSelectErrorMessage] = useReducer(setSelectErrorMessage, '');
    const [nameErrorMessage, dispatchNameErrorMessage] = useReducer(setNameErrorMessage, '');

    const channelProduct = useConvertProductToChannelProduct(product);
    const [productForCreateChannel, dispatchProductForCreateChannel] = useReducer(setProductForCreateChannel, channelProduct);

    const cleanErrorMessages = () => {
        dispatchSelectErrorMessage(selectErrorMessageAction(''));
        dispatchNameErrorMessage(nameErrorMessageAction(''));
    };
    return (
        <>
            <StyledSection>
                <Setting id={'product-channel-action'}>
                    <CreateAChannel
                        product={productForCreateChannel}
                        selectErrorMessage={selectErrorMessage}
                        nameErrorMessage={nameErrorMessage}
                        dispatchProductForCreateChannel={dispatchProductForCreateChannel}
                        cleanErrorMessages={cleanErrorMessages}
                    />
                </Setting>
                <CreateProductChannel
                    product={productForCreateChannel}
                    productId={product.id}
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
                    subtitle={formatMessage({defaultMessage: 'All the channels added to the product will show here'})}
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