import {CombinedState, Reducer, combineReducers} from 'redux';

import {
    SET_NAME_ERROR_MESSAGE,
    SET_PRODUCT_FOR_CREATE_CHANNEL,
    SET_SELECT_ERROR_MESSAGE,
    setNameErrorMessageAction,
    setProductForCreateChannelAction,
    setSelectErrorMessageAction,
} from './action_types';
import {ChannelProduct} from './types/product';

type AnyAction = any;
type AnyState = any;
export type CombinedReducer = Reducer<CombinedState<AnyState>, AnyAction> | any

export const setProductForCreateChannel = (state: ChannelProduct, {type, productForCreateChannel}: setProductForCreateChannelAction) => {
    switch (type) {
    case SET_PRODUCT_FOR_CREATE_CHANNEL:
        return productForCreateChannel;
    default:
        return state;
    }
};

export const setNameErrorMessage = (state = '', {type, nameErrorMessage}: setNameErrorMessageAction) => {
    switch (type) {
    case SET_NAME_ERROR_MESSAGE:
        return nameErrorMessage;
    default:
        return state;
    }
};

export const setSelectErrorMessage = (state = '', {type, selectErrorMessage}: setSelectErrorMessageAction) => {
    switch (type) {
    case SET_SELECT_ERROR_MESSAGE:
        return selectErrorMessage;
    default:
        return state;
    }
};

export default combineReducers({
    setNameErrorMessage,
    setSelectErrorMessage,
    setProductForCreateChannel,
});