import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import MarkdownEdit from 'src/components/markdown_edit';
import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {formatName} from 'src/hooks';

export interface TextBoxData {
    text: string;
}

type Props = {
    name: string;
    parentId: string;
    text: string;
}

const TextBox = ({name, parentId, text}: Props) => {
    const {formatMessage} = useIntl();
    const id = `${formatName(name)}-text-box-widget`;
    const placeholder = formatMessage({defaultMessage: 'There\'s no text to show'});
    return (
        <Container
            id={id}
            data-testid={id}
        >
            <Header>
                <AnchorLinkTitle
                    id={id}
                    query={`sectionId=${parentId}`}
                    text={name}
                    title={name}
                />
            </Header>
            <MarkdownEdit
                placeholder={placeholder}
                value={text}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default TextBox;