// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled, {css} from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';
import {LinkVariantIcon, StarIcon, StarOutlineIcon} from '@mattermost/compass-icons/components';

import {getSiteUrl} from 'src/clients';
import {copyToClipboard} from 'src/utils';
import {StyledDropdownMenuItem} from 'src/components/backstage/shared';
import {useToaster} from 'src/components/backstage/toast_banner';
import {SecondaryButton} from 'src/components/assets/buttons';
import {DEFAULT_PATH, ORGANIZATIONS_PATH} from 'src/constants';

export const FavoriteOrganizationMenuItem = (props: {isFavorite: boolean, toggleFavorite: () => void}) => {
    return (
        <StyledDropdownMenuItem onClick={props.toggleFavorite}>
            {props.isFavorite ? (
                <>
                    <StarOutlineIcon size={18}/>
                    <FormattedMessage defaultMessage='Unfavorite'/>
                </>
            ) : (
                <>
                    <StarIcon size={18}/>
                    <FormattedMessage defaultMessage='Favorite'/>
                </>
            )}
        </StyledDropdownMenuItem>
    );
};

export const CopyOrganizationLinkMenuItem = (props: {organizationId: string}) => {
    const {formatMessage} = useIntl();
    const {add: addToast} = useToaster();

    return (
        <StyledDropdownMenuItem
            onClick={() => {
                copyToClipboard(getSiteUrl() + '/' + DEFAULT_PATH + '/' + ORGANIZATIONS_PATH + '/' + props.organizationId);
                addToast({content: formatMessage({defaultMessage: 'Copied!'})});
            }}
        >
            <LinkVariantIcon size={16}/>
            <FormattedMessage defaultMessage='Copy link'/>
        </StyledDropdownMenuItem>
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

export const SecondaryButtonLarger = styled(SecondaryButton)`
    ${buttonCommon};
`;