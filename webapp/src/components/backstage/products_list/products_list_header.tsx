// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';

import {useIntl} from 'react-intl';

import {SortableColHeader} from 'src/components/sortable_col_header';
import {FetchProductsParams} from 'src/types/product';

interface Props {
    fetchParams: FetchProductsParams;
    setFetchParams: React.Dispatch<React.SetStateAction<FetchProductsParams>>;
}

const ProductsListHeader = ({fetchParams, setFetchParams}: Props) => {
    const {formatMessage} = useIntl();
    function colHeaderClicked(colName: string) {
        if (fetchParams.sort === colName) {
            // we're already sorting on this column; reverse the direction
            const newDirection = fetchParams.direction === 'asc' ? 'desc' : 'asc';

            setFetchParams((oldParams: FetchProductsParams) => {
                return {...oldParams, direction: newDirection, page: 0};
            });
            return;
        }

        // change to a new column; default to descending for time-based columns, ascending otherwise
        let newDirection = 'desc';
        if (['name', 'is_active'].indexOf(colName) !== -1) {
            newDirection = 'asc';
        }

        setFetchParams((oldParams: FetchProductsParams) => {
            return {...oldParams, sort: colName, direction: newDirection, page: 0};
        });
    }
    return (
        <ProductListHeader>
            <div className='row'>
                <div className='col-sm-4'>
                    <SortableColHeader
                        name={formatMessage({defaultMessage: 'Name'})}
                        direction={fetchParams.direction ? fetchParams.direction : 'desc'}
                        active={fetchParams.sort ? fetchParams.sort === 'name' : false}
                        onClick={() => colHeaderClicked('name')}
                    />
                </div>
            </div>
        </ProductListHeader>
    );
};

const ProductListHeader = styled.div`
    font-weight: 600;
    font-size: 11px;
    line-height: 36px;
    color: rgba(var(--center-channel-color-rgb), 0.72);
    background-color: rgba(var(--center-channel-color-rgb), 0.04);
    padding: 0 1.6rem;
    border-top: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
    border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.08);
`;

export default ProductsListHeader;
