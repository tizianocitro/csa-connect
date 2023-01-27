import React, {ComponentProps, useCallback} from 'react';
import styled from 'styled-components';

import {CreateAChannel} from 'src/components/channels/channel_access';
import {Section} from 'src/components/channels/styles';
import {Product} from 'src/types/product';
import {convertProductToChannelProduct, useProxyState, useUpdateProduct} from 'src/hooks';

import {CreateProductChannel} from './controls';

interface Props {
    product: Product;
    teamId: string;
}

const ChannelBox = (props: Props) => {
    const product = convertProductToChannelProduct(props.product);
    const updateProduct = useUpdateProduct(product.id);

    const [
        productForCreateChannel,
        setProductForCreateChannel,
    ] = useProxyState<ComponentProps<typeof CreateAChannel>['product']>(product, useCallback((update) => {
        updateProduct({
            createPublicChannel: update.create_public_channel,
            channelNameTemplate: update.channel_name_template,
            channelMode: update.channel_mode,
            channelId: update.channel_id,
        });
    }, [updateProduct]));

    return (
        <StyledSection>
            <Setting id={'product-channel-action'}>
                <CreateAChannel
                    product={productForCreateChannel}
                    setProduct={setProductForCreateChannel}
                />
            </Setting>
            <CreateProductChannel
                product={product}
                teamId={props.teamId}
            />
        </StyledSection>
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

export default ChannelBox;