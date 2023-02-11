import React from 'react';
import styled from 'styled-components';
import {useRouteMatch} from 'react-router-dom';

import CopyLink from 'src/components/common/copy_link';
import {buildIdForUrlHashReference, buildToForCopy, isReferencedByUrlHash} from 'src/hooks';

export interface TableRow {
    id: string;
    name: string;
    values: TableValue[];
}

interface TableValue {
    dim: 2 | 4 | 6 | 8 | 12;
    value: string;
}

type Props = {
    fullUrl?: string;
    pointer: boolean;
    row: TableRow;
    urlHash: string;
    onClick?: () => void;
};

const TableRow = ({fullUrl, onClick, pointer, row, urlHash}: Props) => {
    const {url} = useRouteMatch();
    const {id, name, values} = row;
    const itemId = buildIdForUrlHashReference('table-row', id);
    return (
        <RowItem
            className='row'
            key={id}
            id={itemId}
            isUrlHashed={isReferencedByUrlHash(urlHash, itemId)}
            pointer={pointer}
            onClick={onClick}
        >
            <CopyLink
                id={itemId}
                to={fullUrl ? buildToForCopy(`${url}${fullUrl}#${itemId}`) : buildToForCopy(`${url}#${itemId}`)}
                name={name}
                area-hidden={true}
                iconWidth={'1.45em'}
                iconHeight={'1.45em'}
            />
            {values.map((val) => {
                const {dim, value} = val;
                const className = `$col-sm-${dim}`;
                return (
                    <div
                        key={itemId}
                        className={className}
                    >
                        <RowText>{value}</RowText>
                    </div>
                );
            })}
        </RowItem>
    );
};

// cursor: pointer; if you want to enable again copy on click
const RowItem = styled.div<{isUrlHashed?: boolean, pointer?: boolean}>`
    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    align-items: center;
    margin: 0;
    background: ${(props) => (props.isUrlHashed ? 'rgba(var(--center-channel-color-rgb), 0.08)' : 'var(--center-channel-bg)')};
    border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.08);
    background: ${(props) => (props.pointer ? 'pointer' : 'auto')};
    ${CopyLink} {
        margin-left: -1.25em;
        opacity: 1;
        transition: opacity ease 0.15s;
    }

    &:not(:hover) ${CopyLink}:not(:hover) {
        opacity: 0;
    }

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