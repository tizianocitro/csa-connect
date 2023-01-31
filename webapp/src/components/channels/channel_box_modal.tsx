import React, {ComponentProps, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {ArrowLeftIcon} from '@mattermost/compass-icons/components';

import GenericModal, {ModalSideheading} from 'src/components/widgets/generic_modal';
import ClearIndicator from 'src/components/channels/clear_indicator';
import MenuList from 'src/components/channels/menu_list';
import {ButtonLabel, StyledChannelSelector, VerticalSplit} from 'src/components/channels/channel_access';
import {HorizontalSpacer, RadioInput} from 'src/components/backstage/styles';
import {addChannelToProduct} from 'src/client';
import {Product} from 'src/types/product';

type Props = {
    product: Product;
    onChannelCreated: () => void;
} & Partial<ComponentProps<typeof GenericModal>>;

type ChannelProps = {
    teamId: string;
    channelMode: string;
    channelId: string;
    createPublicChannel: boolean;
    onSetCreatePublicChannel: (val: boolean) => void;
    onSetChannelMode: (mode: 'link_existing_channel' | 'create_new_channel') => void;
    onSetChannelId: (channelId: string) => void;
};

const ID = 'product_channel_dialog';

const ChannelBoxModal = ({product}: Props) => {
    const {formatMessage} = useIntl();
    const teamId = useSelector(getCurrentTeamId);

    // const [showModal, setShowModal] = useState(false);
    const [channelMode, setChannelMode] = useState('');
    const [channelId, setChannelId] = useState('');
    const [channelName, setChannelName] = useState('');
    const [createPublicChannel, setCreatePublicChannel] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const createNewChannel = channelMode === 'create_new_channel';
    const linkExistingChannel = channelMode === 'link_existing_channel';
    const isFormValid = (createNewChannel || channelId !== '');

    const onSubmit = () => {
        if (!product) {
            return;
        }

        addChannelToProduct(
            product.id,
            teamId,
            channelName,
            linkExistingChannel ? channelId : undefined,
            createNewChannel ? createPublicChannel : undefined,
        )
            .then(() => {
                // redirect to channel
            })
            .catch(() => {
                // show error
            });
    };

    return (
        <StyledGenericModal
            cancelButtonText={formatMessage({defaultMessage: 'Cancel'})}
            confirmButtonText={formatMessage({defaultMessage: 'Add a channel'})}
            showCancel={true}
            isConfirmDisabled={!isFormValid}
            handleConfirm={onSubmit}
            autoCloseOnConfirmButton={false}
            id={ID}
            modalHeaderText={(
                <ColContainer>
                    <IconWrapper
                        onClick={() => {
                            setSearchTerm('');
                        }}
                    >
                        <ArrowLeftIcon
                            size={24}
                            color={'rgba(var(--center-channel-color-rgb), 0.56)'}
                        />
                    </IconWrapper>
                    <HeaderTitle>
                        <FormattedMessage defaultMessage='Add a channel'/>
                        <ModalSideheading>{product?.name}</ModalSideheading>
                    </HeaderTitle>
                </ColContainer>
            )}
        >
            <Body>
                <ConfigChannelSection
                    teamId={teamId}
                    channelId={channelId}
                    channelMode={channelMode}
                    createPublicChannel={createPublicChannel}
                    onSetCreatePublicChannel={setCreatePublicChannel}
                    onSetChannelMode={setChannelMode}
                    onSetChannelId={setChannelId}
                />
            </Body>
        </StyledGenericModal>
    );
};

const ConfigChannelSection = ({
    teamId,
    channelMode,
    channelId,
    createPublicChannel,
    onSetCreatePublicChannel,
    onSetChannelMode,
    onSetChannelId,
}: ChannelProps) => {
    const {formatMessage} = useIntl();
    const createNewChannel = channelMode === 'create_new_channel';
    const linkExistingChannel = channelMode === 'link_existing_channel';
    return (
        <ChannelContainer>
            <ChannelBlock>
                <StyledRadioInput
                    data-testid={'link-existing-channel-radio'}
                    type='radio'
                    checked={linkExistingChannel}
                    onChange={() => onSetChannelMode('link_existing_channel')}
                />
                <FormattedMessage defaultMessage='Link to an existing channel'/>
            </ChannelBlock>
            {linkExistingChannel && (
                <SelectorWrapper>
                    <StyledChannelSelector
                        id={'link-existing-channel-selector'}
                        onChannelSelected={(channel_id: string) => onSetChannelId(channel_id)}
                        channelIds={channelId ? [channelId] : []}
                        isClearable={true}
                        selectComponents={{ClearIndicator, DropdownIndicator: () => null, IndicatorSeparator: () => null, MenuList}}
                        isDisabled={false}
                        captureMenuScroll={false}
                        shouldRenderValue={true}
                        teamId={teamId}
                        isMulti={false}
                    />
                </SelectorWrapper>
            )}

            <ChannelBlock>
                <StyledRadioInput
                    data-testid={'create-channel-radio'}
                    type='radio'
                    checked={createNewChannel}
                    onChange={() => onSetChannelMode('create_new_channel')}
                />
                <FormattedMessage defaultMessage='Create a channel'/>
            </ChannelBlock>

            {createNewChannel && (
                <HorizontalSplit>
                    <VerticalSplit>
                        <ButtonLabel disabled={false}>
                            <RadioInput
                                data-testid={'create-public-channel-radio'}
                                type='radio'
                                checked={createPublicChannel}
                                onChange={() => onSetCreatePublicChannel(true)}
                            />
                            <Icon
                                disabled={false}
                                active={createPublicChannel}
                                className={'icon-globe'}
                            />
                            <BigText>{formatMessage({defaultMessage: 'Public channel'})}</BigText>
                        </ButtonLabel>
                        <HorizontalSpacer size={8}/>
                        <ButtonLabel disabled={false}>
                            <RadioInput
                                data-testid={'create-private-channel-radio'}
                                type='radio'
                                checked={!createPublicChannel}
                                onChange={() => onSetCreatePublicChannel(false)}
                            />
                            <Icon
                                disabled={false}
                                active={!createPublicChannel}
                                className={'icon-lock-outline'}
                            />
                            <BigText>{formatMessage({defaultMessage: 'Private channel'})}</BigText>
                        </ButtonLabel>
                    </VerticalSplit>
                </HorizontalSplit>
            )}
        </ChannelContainer>
    );
};

export const makeModalDefinition = (
    productId: string | undefined,
    triggerChannelId: string | undefined,
    teamId: string,
    onChannelCreated: () => void,
) => ({
    modalId: ID,
    dialogType: ChannelBoxModal,
    dialogProps: {productId, triggerChannelId, teamId, onChannelCreated},
});

const StyledGenericModal = styled(GenericModal)`
    &&& {
        h1 {
            width:100%;
        }

        .modal-header {
            padding: 24px 31px;
            margin-bottom: 0;
            box-shadow: inset 0px -1px 0px rgba(var(--center-channel-color-rgb), 0.16);
        }
        .modal-content {
            padding: 0px;
        }
        .modal-body {
            padding: 24px 31px;
        }
        .modal-footer {
           box-shadow: inset 0px -1px 0px rgba(var(--center-channel-color-rgb), 0.16);
           padding: 0 31px 28px 31px;
        }
    }
`;

const ColContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const HeaderTitle = styled.div`
    display: flex;
    flex-direction: row;
    height: 28px;
    align-items: center;
`;

const IconWrapper = styled.div`
    display: flex;
    cursor: pointer;
    flex-direction: column;
    height: 28px;
    justify-content: center;
    margin-right: 8px;
`;

const ChannelContainer = styled.div`
    margin-top: 39px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledRadioInput = styled(RadioInput)`
    && {
        margin: 0;
    }
`;

const ChannelBlock = styled.label`
    display: flex;
    flex-direction: row;
    width: 350px;
    align-items: center;
    column-gap: 12px;
    align-self: 'flex-start';
    font-weight: inherit;
    margin-bottom: 0;
    cursor: pointer;
`;

const SelectorWrapper = styled.div`
    margin-left: 28px;
    min-height: 40px;
`;

const HorizontalSplit = styled.div`
    display: block;
    text-align: left;
    margin-left: 28px;
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

const Body = styled.div`
    display: flex;
    flex-direction: column;
    & > div, & > input {
        margin-bottom: 12px;
    }
`;

export default ChannelBoxModal;