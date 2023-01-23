// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {StarIcon, StarOutlineIcon} from '@mattermost/compass-icons/components';
import React from 'react';
import {useIntl} from 'react-intl';

import styled, {css} from 'styled-components';

import {getSiteUrl} from 'src/client';
import {StarButton} from 'src/components/backstage/playbook_editor/playbook_editor';
import {ContextMenu} from 'src/components/backstage/playbook_runs/playbook_run/context_menu';
import {PrimaryButton, TertiaryButton} from 'src/components/assets/buttons';
import CopyLink from 'src/components/widgets/copy_link';
import {useFavoriteProduct} from 'src/hooks';
import {CancelSaveContainer} from 'src/components/checklist_item/inputs';
import TextEdit from 'src/components/text_edit';
import {SemiBoldHeading} from 'src/styles/headings';
import {Product} from 'src/types/product';

interface Props {
    product: Product;
}

export const RunHeader = ({product}: Props) => {
    const {formatMessage} = useIntl();
    const [isFavoriteProduct, toggleFavorite] = useFavoriteProduct(product.id);

    // Favorite Button State
    const FavoriteIcon = isFavoriteProduct ? StarIcon : StarOutlineIcon;

    return (
        <Container data-testid={'product-header-section'}>
            <StarButton onClick={toggleFavorite}>
                <FavoriteIcon
                    size={18}
                    color={isFavoriteProduct ? 'var(--sidebar-text-active-border)' : 'var(--center-channel-color-56)'}
                />
            </StarButton>

            <TextEdit
                disabled={true}
                placeholder={formatMessage({defaultMessage: 'Product name'})}
                value={product.name}
                editStyles={css`
                            input {
                                ${titleCommon}
                                height: 36px;
                                width: 240px;
                            }
                            ${CancelSaveContainer} {
                                padding: 0;
                            }
                            ${PrimaryButton}, ${TertiaryButton} {
                                height: 36px;
                            }
                        `}
            >
                {(edit) => (
                    <>
                        <ContextMenu
                            product={product}
                            isFavoriteRun={isFavoriteProduct}
                            toggleFavorite={toggleFavorite}
                        />
                        <StyledCopyLink
                            id='copy-product-link-tooltip'
                            to={getSiteUrl() + '/mattermost-product/products/' + product?.id}
                            tooltipMessage={formatMessage({defaultMessage: 'Copy link to product'})}
                        />
                    </>
                )}
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
