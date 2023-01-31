// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled, {css} from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';

import {LinkVariantIcon, StarIcon, StarOutlineIcon} from '@mattermost/compass-icons/components';

import {getSiteUrl} from 'src/client';
import {copyToClipboard} from 'src/utils';

import {StyledDropdownMenuItem} from 'src/components/backstage/shared';
import {useToaster} from 'src/components/backstage/toast_banner';
import {SecondaryButton} from 'src/components/assets/buttons';

export const FavoriteProductMenuItem = (props: {isFavorite: boolean, toggleFavorite: () => void}) => {
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

export const CopyProductLinkMenuItem = (props: {productId: string}) => {
    const {formatMessage} = useIntl();
    const {add: addToast} = useToaster();

    return (
        <StyledDropdownMenuItem
            onClick={() => {
                copyToClipboard(getSiteUrl() + '/mattermost-product/product/' + props.productId);
                addToast({content: formatMessage({defaultMessage: 'Copied!'})});
            }}
        >
            <LinkVariantIcon size={18}/>
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