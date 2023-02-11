import React from 'react';
import styled from 'styled-components';

import {ColHeader} from 'src/components/col_header';

export interface TableHeader {
    dim: 2 | 4 | 6 | 8 | 12;
    name: string;
}

type Props = {
    headers: TableHeader[];
};

const TableHeader = ({headers}: Props) => {
    return (
        <InnerTableHeader>
            <div className='row'>
                {headers.map((header) => {
                    const className = `$col-sm-${header.dim}`;
                    return (
                        <div
                            key={header.name}
                            className={className}
                        >
                            <ColHeader name={header.name}/>
                        </div>
                    );
                })}
            </div>
        </InnerTableHeader>
    );
};

const InnerTableHeader = styled.div`
    font-weight: 600;
    font-size: 11px;
    line-height: 36px;
    color: rgba(var(--center-channel-color-rgb), 0.72);
    background-color: rgba(var(--center-channel-color-rgb), 0.04);
    padding: 0 1.6rem;
    border-top: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
    border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.08);
`;

export default TableHeader;