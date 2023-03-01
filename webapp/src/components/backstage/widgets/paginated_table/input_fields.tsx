import {Input} from 'antd';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';
import React, {ChangeEvent, useState} from 'react';

import {PaginatedTableColumn, PaginatedTableRow} from 'src/types/paginated_table';
import {PrimaryButtonLarger} from 'src/components/backstage/widgets/shared';

type Props = {
    columns: PaginatedTableColumn[];
    onAddRow: (row: PaginatedTableRow) => void;
};

const RowInputFields = ({columns, onAddRow}: Props) => {
    const [inputValues, setInputValues] = useState<any>({});

    const handleInputChange = ({target}: ChangeEvent<HTMLInputElement>, key: string) => {
        setInputValues({...inputValues, [key]: target.value});
    };

    const handleAddRow = () => {
        onAddRow(inputValues);
        setInputValues({});
    };

    return (
        <>
            {columns.map(({key, title}) => (
                <>
                    <RowInputName>{title}</RowInputName>
                    <RowInput
                        key={key}
                        placeholder={title}
                        value={inputValues[key] || ''}
                        onChange={(e) => handleInputChange(e, key)}
                    />
                </>
            ))}
            <PrimaryButtonLarger onClick={handleAddRow}>
                <FormattedMessage defaultMessage='Add'/>
            </PrimaryButtonLarger>
        </>
    );
};

const RowInput = styled(Input)`
    margin-bottom: 12px;
`;

// color: rgba(var(--center-channel-color-rgb), 0.90);
const RowInputName = styled.div`
`;

export default RowInputFields;