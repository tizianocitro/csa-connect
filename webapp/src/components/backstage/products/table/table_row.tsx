import React from 'react';
import styled from 'styled-components';

import {Product} from 'src/types/product';

interface Props {
    product: Product;
}

const TableRow = ({product}: Props) => {
    return (
        <RowItem
            className='row'
            key={product.id}
        >
            <div className='col-sm-4'>
                <RowText>{product.id}</RowText>
            </div>
            <div className='col-sm-4'>
                <RowText>{product.name}</RowText>
            </div>
            <div className='col-sm-4'>
                <RowText>{`${product.is_favorite}`}</RowText>
            </div>
        </RowItem>
    );
};

const RowItem = styled.div`
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

const RowText = styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
`;

export default TableRow;