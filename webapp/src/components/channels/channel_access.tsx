// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {Dispatch} from 'react';
import styled from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';
import {useSelector} from 'react-redux';

//import {SettingsOutlineIcon} from '@mattermost/compass-icons/components';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {PatternedInput} from 'src/components/channels/patterned_input';
import {
    AutomationHeader,
    AutomationLabel,
    AutomationTitle,
    SelectorWrapper,
} from 'src/components/channels/styles';
import {HorizontalSpacer, RadioInput} from 'src/components/backstage/styles';
import ChannelSelector from 'src/components/backstage/channel_selector';
import ClearIndicator from 'src/components/channels/clear_indicator';
import MenuList from 'src/components/channels/menu_list';
import {ChannelProduct} from 'src/types/product';
import {productForCreateChannelAction} from 'src/actions';

interface Props {
    product: ChannelProduct;
    selectErrorMessage: string,
    nameErrorMessage: string,
    dispatchProductForCreateChannel: Dispatch<any>;
    cleanErrorMessages: () => void,
    setChangesMade?: (b: boolean) => void;
}

export const CreateAChannel = ({
    product,
    selectErrorMessage,
    nameErrorMessage,
    dispatchProductForCreateChannel,
    cleanErrorMessages,
    setChangesMade,
}: Props) => {
    const {formatMessage} = useIntl();
    const teamId = useSelector(getCurrentTeamId);
    const archived = false;

    const handlePublicChange = (isPublic: boolean) => {
        cleanErrorMessages();
        dispatchProductForCreateChannel(productForCreateChannelAction({
            ...product,
            create_public_channel: isPublic,
        }));
        setChangesMade?.(true);
    };
    const handleChannelNameTemplateChange = (channelNameTemplate: string) => {
        cleanErrorMessages();
        dispatchProductForCreateChannel(productForCreateChannelAction({
            ...product,
            channel_name_template: channelNameTemplate,
        }));
        setChangesMade?.(true);
    };
    const handleChannelModeChange = (mode: 'create_new_channel' | 'link_existing_channel') => {
        cleanErrorMessages();
        dispatchProductForCreateChannel(productForCreateChannelAction({
            ...product,
            channel_mode: mode,
        }));
        setChangesMade?.(true);
    };
    const handleChannelIdChange = (channel_id: string) => {
        cleanErrorMessages();
        dispatchProductForCreateChannel(productForCreateChannelAction({
            ...product,
            channel_id,
        }));
        setChangesMade?.(true);
    };

    const attrs = {
        css: {
            alignSelf: 'flex-start',
        },
    };

    return (
        <Container>
            <AutomationHeader id={'link-existing-channel'}>
                <AutomationTitle {...attrs}>
                    <AutomationLabel disabled={archived}>
                        <ChannelModeRadio
                            type='radio'
                            disabled={archived}
                            checked={product.channel_mode === 'link_existing_channel'}
                            onChange={() => handleChannelModeChange('link_existing_channel')}
                        />
                        <FormattedMessage defaultMessage='Link to an existing channel'/>
                    </AutomationLabel>
                </AutomationTitle>
                <SelectorWrapper>
                    <StyledChannelSelector
                        id={'link_existing_channel_selector'}
                        onChannelSelected={(channel_id: string) => handleChannelIdChange(channel_id)}
                        channelIds={product.channel_id === '' ? [] : [product.channel_id]}
                        isClearable={true}
                        selectComponents={{ClearIndicator, DropdownIndicator: () => null, IndicatorSeparator: () => null, MenuList}}
                        isDisabled={archived || product.channel_mode === 'create_new_channel'}
                        captureMenuScroll={false}
                        shouldRenderValue={true}
                        teamId={teamId}
                        isMulti={false}
                    />
                    <ErrorMessage display={selectErrorMessage !== ''}>
                        {selectErrorMessage}
                    </ErrorMessage>
                </SelectorWrapper>
            </AutomationHeader>
            <AutomationHeader id={'create-new-channel'}>
                <AutomationTitle {...attrs}>
                    <AutomationLabel disabled={archived}>
                        <ChannelModeRadio
                            type='radio'
                            disabled={archived}
                            checked={product.channel_mode === 'create_new_channel'}
                            onChange={() => handleChannelModeChange('create_new_channel')}
                        />
                        <FormattedMessage defaultMessage='Create a channel'/>
                    </AutomationLabel>
                </AutomationTitle>
                <HorizontalSplit>
                    <VerticalSplit>
                        <ButtonLabel disabled={archived || product.channel_mode === 'link_existing_channel'}>
                            <RadioInput
                                type='radio'
                                disabled={archived || product.channel_mode === 'link_existing_channel'}
                                checked={product.create_public_channel}
                                onChange={() => handlePublicChange(true)}
                            />
                            <Icon
                                disabled={product.channel_mode === 'link_existing_channel'}
                                active={product.create_public_channel}
                                className={'icon-globe'}
                            />
                            <BigText>{formatMessage({defaultMessage: 'Public'})}</BigText>
                        </ButtonLabel>
                        <HorizontalSpacer size={8}/>
                        <ButtonLabel disabled={archived || product.channel_mode === 'link_existing_channel'}>
                            <RadioInput
                                type='radio'
                                disabled={archived || product.channel_mode === 'link_existing_channel'}
                                checked={!product.create_public_channel}
                                onChange={() => handlePublicChange(false)}
                            />
                            <Icon
                                disabled={product.channel_mode === 'link_existing_channel'}
                                active={!product.create_public_channel}
                                className={'icon-lock-outline'}
                            />
                            <BigText>{formatMessage({defaultMessage: 'Private'})}</BigText>
                        </ButtonLabel>
                    </VerticalSplit>
                    <PatternedInput
                        enabled={!archived && product.channel_mode === 'create_new_channel'}
                        input={product.channel_name_template}
                        onChange={handleChannelNameTemplateChange}
                        pattern={'[\\S][\\s\\S]*[\\S]'} // at least two non-whitespace characters
                        placeholderText={formatMessage({defaultMessage: 'Channel name template'})}
                        type={'text'}
                        errorText={formatMessage({defaultMessage: 'Channel name is not valid.'})}
                    />
                    <ErrorMessage display={nameErrorMessage !== ''}>
                        {nameErrorMessage}
                    </ErrorMessage>
                </HorizontalSplit>
            </AutomationHeader>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const VerticalSplit = styled.div`
    display: flex;
`;

const HorizontalSplit = styled.div`
    display: block;
    text-align: left;
`;

export const ButtonLabel = styled.label<{disabled: boolean}>`
    padding: 10px 16px;
    border: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
    background: ${({disabled}) => (disabled ? 'rgba(var(--center-channel-color-rgb), 0.04)' : 'var(--center-channel-bg)')};
    border-radius: 4px;
    flex-grow: 1;
    flex-basis: 0;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    cursor: pointer;
`;

const Icon = styled.i<{ active?: boolean, disabled: boolean }>`
    font-size: 16px;
    line-height: 16px;
    color: ${({active, disabled}) => (active && !disabled ? 'var(--button-bg)' : 'rgba(var(--center-channel-color-rgb), 0.56)')};
`;

const BigText = styled.div`
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
`;

export const StyledChannelSelector = styled(ChannelSelector)`
    background-color: ${(props) => (props.isDisabled ? 'rgba(var(--center-channel-bg-rgb), 0.16)' : 'var(--center-channel-bg)')};
    .playbooks-rselect__control {
        padding: 4px 16px 4px 3.2rem;

        &:before {
            left: 16px;
            top: 8px;
            position: absolute;
            color: rgba(var(--center-channel-color-rgb), 0.56);
            content: '\f0349';
            font-size: 18px;
            font-family: 'compass-icons', mattermosticons;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    }
`;

export const ChannelModeRadio = styled(RadioInput)`
    && {
        margin: 0 8px;
    }
`;

const ErrorMessage = styled.div<{display?: boolean}>`
    color: var(--error-text);
    margin-left: auto;
    display: ${(props) => (props.display ? 'inline-block' : 'none')};
`;