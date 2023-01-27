import {makeModalDefinition as makeChannelProductModalDefinition} from 'src/components/channels/channel_box_modal';
import {modals} from 'src/webapp_globals';

type newChannelProductModalProps = {
    productId: string | undefined,
    triggerChannelId?: string | undefined,
    teamId: string,
    onChannelCreated: () => void,
};

export function openChannelProductModal(dialogProps: newChannelProductModalProps) {
    return modals.openModal(makeChannelProductModalDefinition(
        dialogProps.productId,
        dialogProps.triggerChannelId,
        dialogProps.teamId,
        dialogProps.onChannelCreated,
    ));
}