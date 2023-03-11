import styled, {css} from 'styled-components';
import React from 'react';
import {useIntl} from 'react-intl';

import {PrimaryButton, TertiaryButton} from 'src/components/assets/buttons';
import CopyLink from 'src/components/commons/copy_link';
import {SemiBoldHeading} from 'src/styles/headings';
import TextEdit from 'src/components/commons/text_edit';

import {ContextMenu} from './context_menu';

type Props = {
    id: string;
    name: string;
    path: string;
};

export const NameHeader = ({id, name, path}: Props) => {
    const {formatMessage} = useIntl();

    return (
        <Container
            id={`_${id}`}
            data-testid={`_${id}`}
        >
            <TextEdit
                disabled={false}
                placeholder={formatMessage({defaultMessage: 'Name'})}
                value={name}
                editStyles={css`
                            input {
                                ${titleCommon}
                                height: 36px;
                                width: 240px;
                            }
                            ${PrimaryButton}, ${TertiaryButton} {
                                height: 36px;
                            }
                        `}
            >
                <>
                    <ContextMenu
                        name={name}
                        path={path}
                    />
                    <StyledCopyLink
                        id='copy-name-link-tooltip'
                        text={name}
                        to={path}
                        tooltipMessage={formatMessage({defaultMessage: 'Copy link'})}
                    />
                </>
            </TextEdit>
        </Container>
    );
};

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 14px 0 20px;

    box-shadow: inset 0px -1px 0px rgba(var(--center-channel-color-rgb), 0.16);
`;

const StyledCopyLink = styled(CopyLink)`
    border-radius: 4px;
    font-size: 18px;
    width: 28px;
    height: 28px;
    margin-left: 4px;
    display: grid;
    place-items: center;
`;

const titleCommon = css`
    ${SemiBoldHeading}
    font-size: 16px;
    line-height: 24px;
    color: var(--center-channel-color);
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px rgba(var(--center-channel-color-rgb), 0.16);
`;
