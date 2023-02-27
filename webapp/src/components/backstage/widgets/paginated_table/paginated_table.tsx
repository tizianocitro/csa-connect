import {Input, Table} from 'antd';
import React, {useState} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import CopyLink from 'src/components/commons/copy_link';
import {PaginatedTableRow} from 'src/types/paginated_table';
import {buildIdForUrlHashReference, formatStringToLowerCase, isReferencedByUrlHash} from 'src/hooks';

const columns = [
    {
        title: '',
        dataIndex: 'icon',
        key: 'icon',
        width: '0px',
        render: (text: string, record: PaginatedTableRow) => (
            <CopyLink
                id={buildIdForUrlHashReference('paginated-table-row', record.id)}
                text={record.name}
                to={record.to}
                name={record.name}
                area-hidden={true}
                iconWidth={'1.45em'}
                iconHeight={'1.45em'}
            />
        ),
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
];

const rows = [
    {
        key: '0',
        id: '0',
        name: 'X',
        description: 'X Description',
    },
    {
        key: '1',
        id: '1',
        name: 'Y',
        description: 'Y description',
    },
    {
        key: '2',
        id: '2',
        name: 'Z',
        description: 'Z Description',
    },
];

type Props = {
    onClick?: () => void;
};

const PaginatedTable = ({onClick}: Props) => {
    const [searchText, setSearchText] = useState('');
    const [filteredRows, setFilteredRows] = useState(rows);

    const handleSearch = (value: string) => {
        const filtered = rows.filter((record: PaginatedTableRow) => {
            const name = formatStringToLowerCase(record.name);
            return name.includes(formatStringToLowerCase(value));
        });
        setSearchText(value);
        setFilteredRows(filtered);
    };

    return (
        <Container>
            <TableSearch
                placeholder='Search by name'
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Table
                dataSource={filteredRows}
                columns={columns}
                components={{
                    body: {
                        row: TableRow,
                    },
                }}
                onRow={(record: PaginatedTableRow) => {
                    return {
                        onClick: () => alert('Clicked ' + record.id),
                        record,
                    };
                }}
                rowKey='key'
                size='middle'
            />
        </Container>
    );
};

const TableRow = (props: any) => {
    const {hash: urlHash} = useLocation();
    const {record} = props;
    return (
        <TableRowItem
            id={buildIdForUrlHashReference('paginated-table-row', record.id)}
            isUrlHashed={isReferencedByUrlHash(urlHash, buildIdForUrlHashReference('paginated-table-row', record.id))}
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