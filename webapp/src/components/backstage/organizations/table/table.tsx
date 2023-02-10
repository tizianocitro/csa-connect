import React from 'react';
import styled from 'styled-components';
import {FormattedMessage, useIntl} from 'react-intl';

import {Product} from 'src/types/product';
import {AnchorLinkTitle} from 'src/components/backstage/organizations/shared';

import TableHeader from './table_header';
import TableRow from './table_row';

type Props = {
    fullUrl?: string;
    id: string;
    organization: Product;
    urlHash: string;
};

// <TableRow
//    key={product.id}
//    product={product}
//    urlHash={urlHash}
// />
const Table = ({fullUrl, id, organization, urlHash}: Props) => {
    const {formatMessage} = useIntl();

    const title = formatMessage({defaultMessage: 'Elements Info'});
    return (
        <Container
            id={id}
            data-testid={'organization-table-section'}
        >
            <Header>
                <AnchorLinkTitle
                    title={title}
                    id={id}
                />
            </Header>
            <InnertTable
                id='innerTable'
                className='innerTable'
            >
                <TableHeader/>
                {organization.elements?.map((el, _) => {
                    return (
                        <TableRow
                            key={el.id}
                            element={el}
                            urlHash={urlHash}
                            fullUrl={fullUrl}
                        />
                    );
                })}
                <Footer>
                    <FooterText>
                        <FormattedMessage
                            defaultMessage='Organization elements info'
                        />
                    </FooterText>
                </Footer>
            </InnertTable>
        </Container>
    );
};

const InnertTable = styled.div`
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