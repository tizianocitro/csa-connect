
import React, {Dispatch} from 'react';
import styled, {css} from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';

import {PrimaryButton} from 'src/components/assets/buttons';
import {addChannel} from 'src/clients';
import {nameErrorMessageAction, selectErrorMessageAction} from 'src/actions';
import {ChannelCreation} from 'src/types/channels';

type AddChannelProps = {
    channelCreation: ChannelCreation,
    parentId: string;
    sectionId: string;
    teamId: string,
    dispatchSelectErrorMessage: Dispatch<any>,
    dispatchNameErrorMessage: Dispatch<any>,
};

const createChannel = (
    channelCreation: ChannelCreation,
    parentId: string,
    sectionId: string,
    teamId: string,
    dispatchSelectErrorMessage: Dispatch<any>,
    dispatchNameErrorMessage: Dispatch<any>,
) => {
    if (!channelCreation) {
        return;
    }

    const {channelMode, channelId, channelName, createPublicChannel} = channelCreation;
    const createNewChannel = channelMode === 'create_new_channel';
    const linkExistingChannel = channelMode === 'link_existing_channel';
    if (linkExistingChannel && channelId === '') {
        dispatchSelectErrorMessage(selectErrorMessageAction('A channel has to be selected.'));
        return;
    }
    if (createNewChannel && channelName === '') {
        dispatchNameErrorMessage(nameErrorMessageAction('Channel name cannot be empty.'));
        return;
    }
    addChannel({
        channelId: linkExistingChannel ? channelId : undefined,
        channelName: createNewChannel ? channelName : undefined,
        createPublicChannel: createNewChannel ? createPublicChannel : false,
        parentId,
        sectionId,
        teamId,
    }).
        then(() => {
            // redirect to channel
        }).
        catch(() => {
            // show error
        });
};

export const CreateChannel = ({
    channelCreation,
    parentId,
    sectionId,
    teamId,
    dispatchSelectErrorMessage,
    dispatchNameErrorMessage,
}: AddChannelProps) => {
    const {formatMessage} = useIntl();
    const title = formatMessage({defaultMessage: 'Add Channel'});
    return (
        <PrimaryButtonLarger
            onClick={() => createChannel(
                channelCreation,
                parentId,
                sectionId,
                teamId,
                dispatchSelectErrorMessage,
                dispatchNameErrorMessage,
            )}
            title={title}
            data-testid='create-channel-button'
        >
            <FormattedMessage defaultMessage='Add Channel'/>
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
