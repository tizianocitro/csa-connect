// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import styled from 'styled-components';

import {navigateToPluginUrl} from 'src/browser_routing';
import {InfoLine} from 'src/components/backstage/styles';
import {Product} from 'src/types/product';

const ProductName = styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
`;

const ProductItem = styled.div`
    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    align-items: center;
    margin: 0;
    background-color: var(--center-channel-bg);
    border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.08);
    cursor: pointer;

    &:hover {
        background: rgba(var(--center-channel-color-rgb), 0.04);
    }
`;

interface Props {
    product: Product;
}

const Row = (props: Props) => {
    function openProductDetails(product: Product) {
        navigateToPluginUrl(`/products/${product.id}?from=run_list`);
    }

    return (
        <ProductItem
            className='row'
            key={props.product.id}
            onClick={() => openProductDetails(props.product)}
        >
            <div className='col-sm-4'>
                <ProductName>{props.product.name}</ProductName>
                <InfoLine>{'Product Info Line here'}</InfoLine>
            </div>
        </ProductItem>
    );
};

export default Row;