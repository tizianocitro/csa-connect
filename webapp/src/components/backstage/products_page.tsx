// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {useProductsList} from 'src/hooks';
import {BACKSTAGE_LIST_PER_PAGE} from 'src/constants';
import Header from 'src/components/widgets/header';

import ProductsList from './products_list/products_list';

const defaultProductsFetchParams = {
    page: 0,
    per_page: BACKSTAGE_LIST_PER_PAGE,
    sort: 'name',
    direction: 'desc',
};

const ProductsPage = () => {
    const {formatMessage} = useIntl();
    const [products, totalCount, fetchParams, setFetchParams] = useProductsList(defaultProductsFetchParams);

    return (
        <ProductListContainer>
            <Header
                data-testid='titleProduct'
                level={2}
                heading={formatMessage({defaultMessage: 'Products'})}
                subtitle={formatMessage({defaultMessage: 'All the products will show here'})}
                css={`
                    border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
                `}
            />
            <ProductsList
                products={products}
                totalCount={totalCount}
                fetchParams={fetchParams}
                setFetchParams={setFetchParams}
                filterPill={null}
            />
        </ProductListContainer>
    );
};

const ProductListContainer = styled.div`
    flex: 1 1 auto;
`;

export default ProductsPage;
