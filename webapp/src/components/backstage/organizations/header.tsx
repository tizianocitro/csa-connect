// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import styled, {css} from 'styled-components';

import {getSiteUrl} from 'src/client';
import {PrimaryButton, TertiaryButton} from 'src/components/assets/buttons';
import CopyLink from 'src/components/widgets/copy_link';
import TextEdit from 'src/components/text_edit';
import {SemiBoldHeading} from 'src/styles/headings';

import {Product} from 'src/types/product';
import {DEFAULT_PATH, ORGANIZATIONS_PATH} from 'src/constants';

import {ContextMenu} from './context_menu';

interface Props {
    organization: Product;
    organizationId: string;
}

export const OrganizationHeader = ({organization, organizationId}: Props) => {
    const {formatMessage} = useIntl();
    organization.id = organizationId;

    // Put before ${PrimaryButton}, ${TertiaryButton}
    // ${CancelSaveContainer} {
    //    padding: 0;
    // }
    return (
        <Container data-testid={'organization-header-section'}>
            <TextEdit
                disabled={false}
                placeholder={formatMessage({defaultMessage: 'Organization name'})}
                value={organization.name}
                editStyles={css`
                            input {
                                ${titleCommon}
                                height: 36px;
                                width: 240px;
                            }
                            ${PrimaryButton}, ${TertiaryButton} {
                                height: 36px;
                            }
                        `}
            >
                <>
                    <ContextMenu
                        organization={organization}
                    />
                    <StyledCopyLink
                        id='copy-product-link-tooltip'
                        to={getSiteUrl() + '/' + DEFAULT_PATH + '/' + ORGANIZATIONS_PATH + '/' + organization?.id}
                        tooltipMessage={formatMessage({defaultMessage: 'Copy link to product'})}
                    />
                </>
            </TextEdit>
        </Container>
    );
};

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 14px 0 20px;

    box-shadow: inset 0px -1px 0px rgba(var(--center-channel-color-rgb), 0.16);
`;

const StyledCopyLink = styled(CopyLink)`
    border-radius: 4px;
    font-size: 18px;
    width: 28px;
    height: 28px;
    margin-left: 4px;
    display: grid;
    place-items: center;
`;

const titleCommon = css`
    ${SemiBoldHeading}
    font-size: 16px;
    line-height: 24px;
    color: var(--center-channel-color);
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px rgba(var(--center-channel-color-rgb), 0.16);
`;
