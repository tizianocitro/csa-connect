import {Input, Table} from 'antd';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import CopyLink from 'src/components/commons/copy_link';
import {PaginatedTableColumn, PaginatedTableData, PaginatedTableRow} from 'src/types/paginated_table';
import {
    buildIdForUrlHashReference,
    buildQuery,
    buildToForCopy,
    formatStringToLowerCase,
    isReferencedByUrlHash,
} from 'src/hooks';
import {FullUrlContext} from 'src/components/rhs/rhs';

type Props = {
    data: PaginatedTableData;
    id: string;
    isSection?: boolean;
    name: string;
    parentId: string;
    pointer?: boolean;
    sectionId?: string;
};

const iconColumn: PaginatedTableColumn = {
    title: '',
    dataIndex: 'icon',
    key: 'icon',
    width: '0px',
    render: (text: string, record: PaginatedTableRow) => (
        <CopyLink
            id={record.itemId}
            text={record.name}
            to={buildToForCopy(record.to)}
            name={record.name}
            area-hidden={true}
            iconWidth={'1.45em'}
            iconHeight={'1.45em'}
        />
    ),
};

const PaginatedTable = ({
    data,
    id,
    isSection = false,
    name,
    parentId,
    pointer = false,
    sectionId,
}: Props) => {
    const fullUrl = useContext(FullUrlContext);
    const [searchText, setSearchText] = useState('');
    const [filteredRows, setFilteredRows] = useState<PaginatedTableRow[]>(data.rows);

    const handleSearch = (value: string) => {
        const filtered = data.rows.filter((record: PaginatedTableRow) => {
            const recordName = formatStringToLowerCase(record.name);
            return recordName.includes(formatStringToLowerCase(value));
        });
        setSearchText(value);
        setFilteredRows(filtered);
    };

    const paginatedTableId = isSection ? `${id}-section` : `${id}-paginated-table-widget`;

    return (
        <Container
            id={paginatedTableId}
            data-testid={paginatedTableId}
        >
            <Header>
                <AnchorLinkTitle
                    fullUrl={fullUrl}
                    id={paginatedTableId}
                    query={buildQuery(parentId, sectionId)}
                    text={name}
                    title={name}
                />
            </Header>
            {(filteredRows.length > 0 || searchText !== '') &&
                <>
                    <TableSearch
                        placeholder='Search by name'
                        value={searchText}
                        onChange={({target}) => handleSearch(target.value)}
                    />
                    <Table
                        id={paginatedTableId}
                        dataSource={filteredRows}
                        columns={[iconColumn, ...data.columns]}
                        components={{
                            body: {
                                row: TableRow,
                            },
                        }}
                        onRow={(record: PaginatedTableRow) => {
                            return {
                                onClick: record.onClick ? record.onClick : undefined,
                                pointer,
                                record,
                            };
                        }}
                        rowKey='key'
                        size='middle'
                    />
                </>}
        </Container>
    );
};

const TableRow = (props: any) => {
    const {hash: urlHash} = useLocation();
    const {pointer, record} = props;
    return (
        <TableRowItem
            id={buildIdForUrlHashReference('paginated-table-row', record?.id)}
            isUrlHashed={isReferencedByUrlHash(urlHash, buildIdForUrlHashReference('paginated-table-row', record?.id))}
            pointer={pointer}
            {...props}
        >
            {props.children}
        </TableRowItem>
    );
};

const TableRowItem = styled.tr<{isUrlHashed?: boolean, pointer: boolean}>`
    cursor: ${(props) => (props.pointer ? 'pointer' : 'auto')};
    background: ${(props) => (props.isUrlHashed ? 'rgba(var(--center-channel-color-rgb), 0.08)' : 'var(--center-channel-bg)')};
    &:hover {
        background: rgba(var(--center-channel-color-rgb), 0.04);
    }
    &:hover {
        background: rgba(var(--center-channel-color-rgb), 0.04);
    }
    ${CopyLink} {
        margin-left: -1.25em;
        opacity: 1;
        transition: opacity ease 0.15s;
    }
    &:not(:hover) ${CopyLink}:not(:hover) {
        opacity: 0;
    }
`;

const TableSearch = styled(Input.Search)`
    margin-bottom: 6px;
    width: 50%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default PaginatedTable;