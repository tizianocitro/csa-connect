import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import MarkdownEdit from 'src/components/markdown_edit';
import {AnchorLinkTitle} from 'src/components/backstage/widgets/shared';

interface Props {
    name: string;
    text: string;
}

const TextBox = ({name, text}: Props) => {
    const {formatMessage} = useIntl();
    const id = 'text-box';
    const placeholder = formatMessage({defaultMessage: 'There\'s no text to show'});
    return (
        <Container
            id={id}
            data-testid={'text-box-widget'}
        >
            <Header>
                <AnchorLinkTitle
                    text={name}
                    title={name}
                    id={id}
                />
            </Header>
            <MarkdownEdit
                placeholder={placeholder}
                value={text}
            />
        </Container>
    );
};

const Header = styled.div`
    display: flex;
    flex: 1;
    margin-bottom: 8px;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default TextBox;