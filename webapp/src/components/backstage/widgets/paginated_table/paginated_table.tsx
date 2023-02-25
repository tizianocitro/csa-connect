import {Table} from 'antd';
import React from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import CopyLink from 'src/components/commons/copy_link';
import {PaginatedTableRow} from 'src/types/paginated_table';
import {buildIdForUrlHashReference, isReferencedByUrlHash} from 'src/hooks';

const columns = [
    {
        title: '',
        dataIndex: 'icon',
        key: 'icon',
        width: '1.45em',
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
    return (
        <Table
            dataSource={rows}
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
        />
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
`;

export default PaginatedTable;