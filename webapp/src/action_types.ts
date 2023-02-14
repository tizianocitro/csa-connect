import {pluginId} from './manifest';
import {ChannelProduct} from './types/product';

const createActionType = (suffix: string): string => {
    return pluginId + suffix;
};

export const SET_PRODUCT_FOR_CREATE_CHANNEL: string = createActionType('_set_product_for_create_channel');
export const SET_NAME_ERROR_MESSAGE: string = createActionType('_set_name_error_message');
export const SET_SELECT_ERROR_MESSAGE: string = createActionType('_set_select_error_message');

export interface setProductForCreateChannelAction {
    type: string;
    productForCreateChannel: ChannelProduct;
}

export interface setNameErrorMessageAction {
    type: string;
    nameErrorMessage: string;
}

export interface setSelectErrorMessageAction {
    type: string;
    selectErrorMessage: string;
}