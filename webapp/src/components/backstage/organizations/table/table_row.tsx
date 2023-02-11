import React from 'react';
import styled from 'styled-components';
import {useRouteMatch} from 'react-router-dom';

import CopyLink from 'src/components/widgets/copy_link';
import {ProductElement} from 'src/types/product';
import {buildIdForUrlHashReference, buildToForCopy, isReferencedByUrlHash} from 'src/hooks';

type Props = {
    element: ProductElement;
    fullUrl?: string;
    urlHash: string;
};

const TableRow = ({urlHash, fullUrl, element}: Props) => {
    const {url} = useRouteMatch();
    const {id, name, description} = element;
    const itemId = buildIdForUrlHashReference('organization-element', id);
    return (
        <RowItem
            className='row'
            key={id}
            id={itemId}
            isUrlHashed={isReferencedByUrlHash(urlHash, itemId)}
        >
            <CopyLink
                id={itemId}
                to={fullUrl ? buildToForCopy(`${url}${fullUrl}#${itemId}`) : buildToForCopy(`${url}#${itemId}`)}
                name={name}
                area-hidden={true}
                iconWidth={'1.45em'}
                iconHeight={'1.45em'}
            />
            <div className='col-sm-2'>
                <RowText>{id}</RowText>
            </div>
            <div className='col-sm-4'>
                <RowText>{name}</RowText>
            </div>
            <div className='col-sm-6'>
                <RowText>{`${description}`}</RowText>
            </div>
        </RowItem>
    );
};

// cursor: pointer; if you want to enable again copy on click
const RowItem = styled.div<{isUrlHashed?: boolean}>`
    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    align-items: center;
    margin: 0;
    background: ${(props) => (props.isUrlHashed ? 'rgba(var(--center-channel-color-rgb), 0.08)' : 'var(--center-channel-bg)')};
    border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.08);

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