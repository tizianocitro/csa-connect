import {makeModalDefinition as makeChannelProductModalDefinition} from 'src/components/channels/channel_box_modal';
import {modals} from 'src/webapp_globals';

import {SET_NAME_ERROR_MESSAGE, SET_PRODUCT_FOR_CREATE_CHANNEL, SET_SELECT_ERROR_MESSAGE} from './action_types';
import {ChannelProduct} from './types/product';

export const productForCreateChannelAction = (productForCreateChannel: ChannelProduct) => {
    return {
        type: SET_PRODUCT_FOR_CREATE_CHANNEL,
        productForCreateChannel,
    };
};

export const selectErrorMessageAction = (selectErrorMessage = '') => {
    return {
        type: SET_SELECT_ERROR_MESSAGE,
        selectErrorMessage,
    };
};

export const nameErrorMessageAction = (nameErrorMessage = '') => {
    return {
        type: SET_NAME_ERROR_MESSAGE,
        nameErrorMessage,
    };
};

type newChannelProductModalProps = {
    productId: string | undefined,
    triggerChannelId?: string | undefined,
    teamId: string,
    onChannelCreated: () => void,
};

export const openChannelProductModal = (dialogProps: newChannelProductModalProps) => {
    return modals.openModal(makeChannelProductModalDefinition(
        dialogProps.productId,
        dialogProps.triggerChannelId,
        dialogProps.teamId,
        dialogProps.onChannelCreated,
    ));
};