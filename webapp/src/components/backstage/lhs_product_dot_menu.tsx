// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {DotsVerticalIcon} from '@mattermost/compass-icons/components';

import DotMenu from 'src/components/dot_menu';
import {Separator} from 'src/components/backstage/products/shared';
import {useSetProductFavorite} from 'src/http/hooks';

import {
    CopyProductLinkMenuItem,
    FavoriteProductMenuItem
} from './products/controls';

import {DotMenuButtonStyled} from './shared';

interface Props {
    productId: string;
    isFavorite: boolean;
}

export const LHSProductDotMenu = ({productId, isFavorite}: Props) => {
    const setProductFavorite = useSetProductFavorite(productId);

    const toggleFavorite = () => {
        setProductFavorite(!isFavorite);
    };

    return (
        <>
            <DotMenu
                placement='bottom-start'
                icon={(
                    <DotsVerticalIcon
                        size={14.4}
                        color={'var(--button-color)'}
                    />
                )}
                dotMenuButton={DotMenuButtonStyled}
            >
                <FavoriteProductMenuItem
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                />
                <Separator/>
                <CopyProductLinkMenuItem
                    productId={productId}
                />
            </DotMenu>
        </>
    );
};
