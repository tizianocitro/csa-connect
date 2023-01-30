
import React from 'react';
import styled, {css} from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';

import {PrimaryButton} from 'src/components/assets/buttons';

// import {openChannelProductModal} from 'src/actions';
import {ChannelProduct} from 'src/types/product';
import {addChannelToProduct} from 'src/client';

type ControlProps = {
    product: ChannelProduct,
    teamId: string,
};

const addChannel = (product: ChannelProduct, teamId: string) => {
    if (!product) {
        return;
    }

    const createNewChannel = product.channel_mode === 'create_new_channel';
    const linkExistingChannel = product.channel_mode === 'link_existing_channel';

    addChannelToProduct(
        product.id,
        teamId,
        linkExistingChannel ? product.channel_id : undefined,
        createNewChannel ? product.channel_name_template : undefined,
        createNewChannel ? product.create_public_channel : false,
    )
        .then(() => {
            // redirect to channel
        })
        .catch(() => {
            // show error
        });
};

// onClick={() => {
//    dispatch(openChannelProductModal({
//        onChannelCreated: () => '',
//        productId: product.id,
//        teamId,
//    }));
// }}
export const CreateProductChannel = ({product, teamId}: ControlProps) => {
    const {formatMessage} = useIntl();
    const title = formatMessage({defaultMessage: 'Add channel'});
    return (
        <PrimaryButtonLarger
            onClick={() => addChannel(product, teamId)}
            title={title}
            data-testid='create-product-channel-button'
        >
            <FormattedMessage defaultMessage='Add a channel'/>
        </PrimaryButtonLarger>
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
