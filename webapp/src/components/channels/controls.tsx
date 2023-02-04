
import React, {Dispatch} from 'react';
import styled, {css} from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';

import {PrimaryButton} from 'src/components/assets/buttons';

// import {openChannelProductModal} from 'src/actions';
import {ChannelProduct} from 'src/types/product';
import {addChannelToProduct} from 'src/client';
import {nameErrorMessageAction, selectErrorMessageAction} from 'src/actions';

type AddChannelProps = {
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

    const {id, channelMode, channelId, channelNameTemplate, createPublicChannel} = product;
    const createNewChannel = channelMode === 'create_new_channel';
    const linkExistingChannel = channelMode === 'link_existing_channel';
    if (linkExistingChannel && channelId === '') {
        dispatchSelectErrorMessage(selectErrorMessageAction('A channel has to be selected.'));
        return;
    }
    if (createNewChannel && channelNameTemplate === '') {
        dispatchNameErrorMessage(nameErrorMessageAction('Channel name cannot be empty.'));
        return;
    }
    addChannelToProduct({
        product_id: id,
        team_id: teamId,
        channel_id: linkExistingChannel ? channelId : undefined,
        channel_name: createNewChannel ? channelNameTemplate : undefined,
        create_public_channel: createNewChannel ? createPublicChannel : false,
    })
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
}: AddChannelProps) => {
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
