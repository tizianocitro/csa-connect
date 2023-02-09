// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {StarIcon, StarOutlineIcon} from '@mattermost/compass-icons/components';
import React from 'react';
import {useIntl} from 'react-intl';

import styled, {css} from 'styled-components';

import {getSiteUrl} from 'src/client';
import {PrimaryButton, TertiaryButton} from 'src/components/assets/buttons';
import CopyLink from 'src/components/widgets/copy_link';
import {useFavoriteProduct} from 'src/hooks';
import TextEdit from 'src/components/text_edit';
import {SemiBoldHeading} from 'src/styles/headings';

import {Product} from 'src/types/product';
import {DEFAULT_PATH} from 'src/constants';

import {ContextMenu} from './context_menu';

interface Props {
    product: Product;
    productId: string;
}

export const ProductHeader = ({product, productId}: Props) => {
    const {formatMessage} = useIntl();
    product.id = productId;
    const [isFavoriteProduct, toggleFavorite] = useFavoriteProduct(product.id);

    // Favorite Button State
    const FavoriteIcon = isFavoriteProduct ? StarIcon : StarOutlineIcon;

    // Put before ${PrimaryButton}, ${TertiaryButton}
    // ${CancelSaveContainer} {
    //    padding: 0;
    // }
    return (
        <Container data-testid={'product-header-section'}>
            <StarButton onClick={toggleFavorite}>
                <FavoriteIcon
                    size={18}
                    color={isFavoriteProduct ? 'var(--sidebar-text-active-border)' : 'var(--center-channel-color-56)'}
                />
            </StarButton>

            <TextEdit
                disabled={false}
                placeholder={formatMessage({defaultMessage: 'Product name'})}
                value={product.name}
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
                        product={product}
                        isFavoriteProduct={isFavoriteProduct}
                        toggleFavorite={toggleFavorite}
                    />
                    <StyledCopyLink
                        id='copy-product-link-tooltip'
                        to={getSiteUrl() + '/' + DEFAULT_PATH + '/products/' + product?.id}
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

const StarButton = styled.button`
    border-radius: 4px;
    border: 0;
    display: flex;
    height: 28px;
    width: 28px;
    align-items: center;
    background: none;
    margin: 0 6px;

    &:hover {
       background: rgba(var(--center-channel-color-rgb), 0.08);
       color: rgba(var(--center-channel-color-rgb), 0.72);
    }
`;
