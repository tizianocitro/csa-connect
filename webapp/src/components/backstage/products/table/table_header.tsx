import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {ColHeader} from 'src/components/col_header';

const TableHeader = () => {
    const {formatMessage} = useIntl();
    return (
        <InnerTableHeader>
            <div className='row'>
                <div className='col-sm-2'>
                    <ColHeader
                        name={formatMessage({defaultMessage: 'ID'})}
                    />
                </div>
                <div className='col-sm-4'>
                    <ColHeader
                        name={formatMessage({defaultMessage: 'Name'})}
                    />
                </div>
                <div className='col-sm-6'>
                    <ColHeader
                        name={formatMessage({defaultMessage: 'Description'})}
                    />
                </div>
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