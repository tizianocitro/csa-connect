// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import styled from 'styled-components';

import {FormattedMessage} from 'react-intl';

import InfiniteScroll from 'react-infinite-scroll-component';

import LoadingSpinner from 'src/components/assets/loading_spinner';

import {FetchProductsParams, Product} from 'src/types/product';

import Row from './row';
import ProductsListHeader from './product_list_header';
import Filters from './filters';

interface Props {
    products: Product[]
    totalCount: number
    fetchParams: FetchProductsParams
    setFetchParams: React.Dispatch<React.SetStateAction<FetchProductsParams>>
    filterPill: React.ReactNode | null
}

const ProductList = styled.div`
    font-family: 'Open Sans', sans-serif;
    color: rgba(var(--center-channel-color-rgb), 0.90);
`;

const Footer = styled.div`
    margin: 10px 0 20px;
    font-size: 14px;
`;

const Count = styled.div`
    padding-top: 8px;
    width: 100%;
    text-align: center;
    color: rgba(var(--center-channel-color-rgb), 0.56);
`;

const SpinnerContainer = styled.div`
    width: 100%;
    height: 24px;
    text-align: center;
    margin-top: 10px;
    overflow: visible;
`;

const StyledSpinner = styled(LoadingSpinner)`
    width: auto;
    height: 100%;
`;

const ProductsList = ({
    products,
    totalCount,
    fetchParams,
    setFetchParams,
    filterPill,
}: Props) => {
    const isFiltering = (
        (fetchParams?.search_term?.length ?? 0) > 0
    );

    const nextPage = () => {
        setFetchParams((oldParam: FetchProductsParams) => ({...oldParam, page: oldParam.page + 1}));
    };

    return (
        <ProductList
            id='productsList'
            className='productsList'
        >
            <Filters
                fetchParams={fetchParams}
                setFetchParams={setFetchParams}
            />
            {filterPill}
            <ProductsListHeader
                fetchParams={fetchParams}
                setFetchParams={setFetchParams}
            />
            {products.length === 0 && isFiltering &&
                <div className='text-center pt-8'>
                    <FormattedMessage defaultMessage='There are no products matching those filters.'/>
                </div>
            }
            <InfiniteScroll
                dataLength={products.length}
                next={nextPage}
                hasMore={products.length < totalCount}
                loader={<SpinnerContainer><StyledSpinner/></SpinnerContainer>}
                scrollableTarget={'product-backstageRoot'}
            >
                {products.map((product) => (
                    <Row
                        key={product.id}
                        product={product}
                    />
                ))}
            </InfiniteScroll>
            <Footer>
                <Count>
                    <FormattedMessage
                        defaultMessage='{total, number} total'
                        values={{total: totalCount}}
                    />
                </Count>
            </Footer>
        </ProductList>
    );
};

export default ProductsList;
