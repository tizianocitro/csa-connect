import React from 'react';
import styled from 'styled-components';

import {AnchorLinkTitle} from 'src/components/backstage/organizations/shared';

import TableHeader, {TableHeader as THeader} from './table_header';
import TableRow, {TableRow as TRow} from './table_row';

export interface TableData {
    headers: THeader[],
    rows: TRow[],
}

type Props = {
    caption: string;
    data: TableData;
    fullUrl?: string;
    id: string;
    pointer: boolean;
    urlHash: string;
    onClick?: () => void;
};

// <TableRow
//    key={product.id}
//    product={product}
//    urlHash={urlHash}
// />
const Table = ({data, caption, fullUrl, id, pointer, urlHash}: Props) => {
    const {headers, rows} = data;
    return (
        <Container
            id={id}
            data-testid={'table-widget'}
        >
            <Header>
                <AnchorLinkTitle
                    title={caption}
                    id={id}
                />
            </Header>
            <InnertTable
                id='innerTable'
                className='innerTable'
            >
                <TableHeader
                    headers={headers}
                />

                {rows.map((row) => {
                    return (
                        <TableRow
                            fullUrl={fullUrl}
                            key={row.id}
                            pointer={pointer}
                            row={row}
                            urlHash={urlHash}
                        />
                    );
                })}
                <Footer>
                    <FooterText>{caption}</FooterText>
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