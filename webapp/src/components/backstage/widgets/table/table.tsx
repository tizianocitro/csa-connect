import React, {useContext} from 'react';
import styled from 'styled-components';

import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {TableData} from 'src/types/table';
import {FullUrlContext} from 'src/components/rhs/rhs';
import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';

import TableHeader from './table_header';
import TableRow from './table_row';

type Props = {
    data: TableData;
    id: string;
    isSection?: boolean;
    open?: (resourceId: string) => void;
    parentId: string;
    pointer?: boolean;
    sectionId?: string;
    urlHash: string;
};

const buildQuery = (parentId: string, sectionId: string | undefined) => {
    let query = `${PARENT_ID_PARAM}=${parentId}`;
    if (sectionId) {
        query = `${query}&${SECTION_ID_PARAM}=${sectionId}`;
    }
    return query;
};

const Table = ({
    data,
    id,
    isSection = false,
    open,
    parentId,
    pointer = false,
    sectionId,
    urlHash,
}: Props) => {
    const fullUrl = useContext(FullUrlContext);
    const {caption, headers, rows} = data;
    const tableId = isSection ? `${id}-section` : `${id}-table-widget`;
    return (
        <Container
            id={tableId}
            data-testid={tableId}
        >
            <Header>
                <AnchorLinkTitle
                    fullUrl={fullUrl}
                    id={tableId}
                    query={buildQuery(parentId, sectionId)}
                    text={caption}
                    title={caption}
                />
            </Header>
            <InnertTable
                id={`${tableId}-inner-table`}
                className='innerTable'
            >
                <TableHeader
                    headers={headers}
                />

                {rows?.map((row) => (
                    <TableRow
                        key={row.id}
                        onClick={open ? () => open(row.id) : undefined}
                        pointer={pointer}
                        query={buildQuery(parentId, sectionId)}
                        row={row}
                        urlHash={urlHash}
                    />
                ))}
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
    margin: 10px 0;
    font-size: 14px;
`;

const FooterText = styled.div`
    padding-top: 8px;
    width: 100%;
    text-align: center;
    color: rgba(var(--center-channel-color-rgb), 0.56);
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default Table;