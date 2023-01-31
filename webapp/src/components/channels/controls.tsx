
import React, {Dispatch} from 'react';
import styled, {css} from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';

import {PrimaryButton} from 'src/components/assets/buttons';

// import {openChannelProductModal} from 'src/actions';
import {ChannelProduct} from 'src/types/product';
import {addChannelToProduct} from 'src/client';
import {nameErrorMessageAction, selectErrorMessageAction} from 'src/actions';

type ControlProps = {
    product: ChannelProduct,
    teamId: string,
    dispatchSelectErrorMessage: Dispatch<any>,
    dispatchNameErrorMessage: Dispatch<any>,
};

const addChannel = (
    product: ChannelProduct,
    teamId: string,
    dispatchSelectErrorMessage: Dispatch<any>,
    dispatchNameErrorMessage: Dispatch<any>,
) => {
    if (!product) {
        return;
    }

    const {id, channel_mode, channel_id, channel_name_template, create_public_channel} = product;
    const createNewChannel = channel_mode === 'create_new_channel';
    const linkExistingChannel = channel_mode === 'link_existing_channel';
    if (linkExistingChannel && channel_id === '') {
        dispatchSelectErrorMessage(selectErrorMessageAction('A channel has to be selected.'));
        return;
    }
    if (createNewChannel && channel_name_template === '') {
        dispatchNameErrorMessage(nameErrorMessageAction('Channel name cannot be empty.'));
        return;
    }
    addChannelToProduct(
        id,
        teamId,
        linkExistingChannel ? channel_id : undefined,
        createNewChannel ? channel_name_template : undefined,
        createNewChannel ? create_public_channel : false,
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
export const CreateProductChannel = ({
    product,
    teamId,
    dispatchSelectErrorMessage,
    dispatchNameErrorMessage,
}: ControlProps) => {
    const dispatch = useDispatch();
    const {formatMessage} = useIntl();
    const title = formatMessage({defaultMessage: 'Add channel'});
    return (
        <PrimaryButtonLarger
            onClick={() => addChannel(product, teamId, dispatchSelectErrorMessage, dispatchNameErrorMessage)}
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
