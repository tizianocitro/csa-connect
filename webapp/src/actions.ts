import {CHANNEL_CREATION, SET_NAME_ERROR_MESSAGE, SET_SELECT_ERROR_MESSAGE} from './action_types';
import {ChannelCreation} from './types/channels';

export const channelCreationAction = (channelCreation: ChannelCreation) => {
    return {
        type: CHANNEL_CREATION,
        channelCreation,
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