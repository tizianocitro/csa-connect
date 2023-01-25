import React from 'react';
import styled from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';

import {Product} from 'src/types/product';
import {AnchorLinkTitle} from 'src/components/backstage/products/shared';

import TableHeader from './table_header';
import TableRow from './table_row';

interface Props {
    id: string;
    product: Product;
}

const Table = ({id, product}: Props) => {
    const {formatMessage} = useIntl();

    const title = formatMessage({defaultMessage: 'Info Table'});
    return (
        <Container
            id={id}
            data-testid={'product-table-section'}
        >
            <Header>
                <AnchorLinkTitle
                    title={title}
                    id={id}
                />
            </Header>
            <ProductTable
                id='productsList'
                className='productsList'
            >
                <TableHeader/>
                <TableRow
                    key={product.id}
                    product={product}
                />
                <Footer>
                    <FooterText>
                        <FormattedMessage
                            defaultMessage='Product info table'
                        />
                    </FooterText>
                </Footer>
            </ProductTable>
        </Container>
    );
};

const ProductTable = styled.div`
    font-family: 'Open Sans', sans-serif;
    color: rgba(var(--center-channel-color-rgb), 0.90);
`;

const Footer = styled.div`
    margin: 10px 0 20px;
    font-size: 14px;
`;

const FooterText = styled.div`
    padding-top: 8px;
    width: 100%;
    text-align: center;
    color: rgba(var(--center-channel-color-rgb), 0.56);
`;

const Header = styled.div`
    display: flex;
    flex: 1;
    margin-bottom: 8px;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default Table;