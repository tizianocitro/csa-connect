// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import styled from 'styled-components';

import React from 'react';

import DotMenu, {TitleButton} from 'src/components/dot_menu';
import {SemiBoldHeading} from 'src/styles/headings';

import {Product} from 'src/types/product';

import {CopyProductLinkMenuItem, FavoriteProductMenuItem} from './controls';

import {Separator} from './shared';

interface Props {
    product: Product;
    isFavoriteProduct: boolean;
    toggleFavorite: () => void;
}

export const ContextMenu = ({product, isFavoriteProduct, toggleFavorite}: Props) => {
    return (
        <>
            <DotMenu
                dotMenuButton={TitleButton}
                placement='bottom-start'
                icon={
                    <>
                        <Title>{product.name}</Title>
                        <i
                            className={'icon icon-chevron-down'}
                            data-testid='runDropdown'
                        />
                    </>
                }
            >

                <FavoriteProductMenuItem
                    isFavorite={isFavoriteProduct}
                    toggleFavorite={toggleFavorite}
                />
                <Separator/>
                <CopyProductLinkMenuItem
                    productId={product.id}
                />
            </DotMenu>
        </>
    );
};

const Title = styled.h1`
    ${SemiBoldHeading}
    letter-spacing: -0.01em;
    font-size: 16px;
    line-height: 24px;
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

