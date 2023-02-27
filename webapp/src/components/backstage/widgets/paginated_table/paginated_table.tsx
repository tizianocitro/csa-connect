import {Input, Table} from 'antd';
import React, {useState} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import CopyLink from 'src/components/commons/copy_link';
import {PaginatedTableColumn, PaginatedTableData, PaginatedTableRow} from 'src/types/paginated_table';
import {
    buildIdForUrlHashReference,
    buildToForCopy,
    formatStringToLowerCase,
    isReferencedByUrlHash,
} from 'src/hooks';

type Props = {
    data: PaginatedTableData;
    id: string;
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

const PaginatedTable = ({data, id}: Props) => {
    const [searchText, setSearchText] = useState('');
    const [filteredRows, setFilteredRows] = useState<PaginatedTableRow[]>(data.rows);

    const handleSearch = (value: string) => {
        const filtered = data.rows.filter((record: PaginatedTableRow) => {
            const name = formatStringToLowerCase(record.name);
            return name.includes(formatStringToLowerCase(value));
        });
        setSearchText(value);
        setFilteredRows(filtered);
    };

    const paginatedTableId = `${id}-paginated-table-widget`;

    return (
        <Container
            id={paginatedTableId}
            data-testid={paginatedTableId}
        >
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
    const {open, record} = props;
    return (
        <TableRowItem
            id={buildIdForUrlHashReference('paginated-table-row', record?.id)}
            isUrlHashed={isReferencedByUrlHash(urlHash, buildIdForUrlHashReference('paginated-table-row', record?.id))}
            onClick={open ? open(record?.id) : undefined}
            {...props}
        >
            {props.children}
        </TableRowItem>
    );
};

const TableRowItem = styled.tr<{isUrlHashed?: boolean}>`
    cursor: pointer;
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
    margin-bottom: 4px;
    width: 50%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export default PaginatedTable;