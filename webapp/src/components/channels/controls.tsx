
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
    setSelectErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setNameErrorMessage: React.Dispatch<React.SetStateAction<string>>,
};

const addChannel = (
    product: ChannelProduct,
    teamId: string,
    setSelectErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setNameErrorMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
    if (!product) {
        return;
    }

    const {id, channel_mode, channel_id, channel_name_template, create_public_channel} = product;
    const createNewChannel = channel_mode === 'create_new_channel';
    const linkExistingChannel = channel_mode === 'link_existing_channel';
    if (linkExistingChannel && channel_id === '') {
        setSelectErrorMessage('A channel has to be selected.');
        return;
    }
    if (createNewChannel && channel_name_template === '') {
        setNameErrorMessage('Channel name cannot be empty.');
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
    setSelectErrorMessage,
    setNameErrorMessage,
}: ControlProps) => {
    const {formatMessage} = useIntl();
    const title = formatMessage({defaultMessage: 'Add channel'});
    return (
        <PrimaryButtonLarger
            onClick={() => addChannel(product, teamId, setSelectErrorMessage, setNameErrorMessage)}
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
