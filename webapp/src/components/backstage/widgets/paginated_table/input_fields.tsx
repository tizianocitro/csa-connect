import {Input} from 'antd';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';
import React, {ChangeEvent, useCallback, useState} from 'react';

import {PaddedErrorMessage} from 'src/components/commons/messages';
import {formatStringToCapitalize} from 'src/hooks';
import {PaginatedTableColumn, PaginatedTableRow} from 'src/types/paginated_table';
import {PrimaryButtonLarger} from 'src/components/backstage/widgets/shared';

type Props = {
    columns: PaginatedTableColumn[];
    onAddRow: (row: PaginatedTableRow) => void;
};

type RowState = any;

const RowInputFields = ({columns, onAddRow}: Props) => {
    const initRowState = useCallback<RowState>(() => {
        const state: RowState = {};
        columns.forEach(({key}) => {
            state[key] = '';
        });
        return state;
    }, []);
    const [inputValues, setInputValues] = useState<RowState>(initRowState());
    const [errors, setErrors] = useState<RowState>(initRowState());

    const handleInputChange = ({target}: ChangeEvent<HTMLInputElement>, key: string) => {
        setInputValues({...inputValues, [key]: target.value});
        setErrors({...errors, [key]: ''});
    };

    const handleAddRow = () => {
        const addRowErrors: RowState = initRowState();
        let allKeysNotEmpty = true;
        Object.keys(inputValues).forEach((key) => {
            if (!inputValues[key] || inputValues[key].trim() === '') {
                addRowErrors[key] = `${formatStringToCapitalize(key)} is missing.`;
                allKeysNotEmpty = false;
            }
        });

        if (!allKeysNotEmpty) {
            setErrors(addRowErrors);
            return;
        }

        onAddRow(inputValues);
        setInputValues(initRowState());
        setErrors(initRowState());
    };

    return (
        <Container>
            {columns.map(({key, title}) => (
                <>
                    <RowText>{title}</RowText>
                    <RowInput
                        key={key}
                        placeholder={title}
                        value={inputValues[key] || ''}
                        onChange={(e) => handleInputChange(e, key)}
                    />
                    <PaddedErrorMessage
                        display={errors[key] && errors[key] !== ''}
                        marginBottom={'12px'}
                        marginLeft={'0px'}
                    >
                        {errors[key]}
                    </PaddedErrorMessage>
                </>
            ))}
            <PrimaryButtonLarger onClick={handleAddRow}>
                <FormattedMessage defaultMessage='Create'/>
            </PrimaryButtonLarger>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const RowInput = styled(Input)`
    margin-bottom: 12px;
`;

// color: rgba(var(--center-channel-color-rgb), 0.90);
const RowText = styled.div`
    text-align: left;
`;

export default RowInputFields;