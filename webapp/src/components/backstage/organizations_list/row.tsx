// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import styled from 'styled-components';

import {navigateToPluginUrl} from 'src/browser_routing';
import {InfoLine} from 'src/components/backstage/styles';
import {Product} from 'src/types/product';
import {ORGANIZATIONS_PATH} from 'src/constants';

interface Props {
    organization: Product;
}

const Row = (props: Props) => {
    function openProductDetails(organization: Product) {
        navigateToPluginUrl(`/${ORGANIZATIONS_PATH}/${organization.id}?from=organizations_list`);
    }

    return (
        <ProductItem
            className='row'
            key={props.organization.id}
            onClick={() => openProductDetails(props.organization)}
        >
            <div className='col-sm-4'>
                <ProductName>{props.organization.name}</ProductName>
                <InfoLine>{props.organization.description}</InfoLine>
            </div>
        </ProductItem>
    );
};

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

const ProductName = styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
`;

export default Row;