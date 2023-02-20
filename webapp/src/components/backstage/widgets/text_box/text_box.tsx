import React, {useContext} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import MarkdownEdit from 'src/components/markdown_edit';
import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {formatName} from 'src/hooks';
import {FullUrlContext} from 'src/components/rhs/right_hand_sidebar';

export type TextBoxStyle = {
    height?: string;
    marginTop?: string;
    width?: string;
}

type Props = {
    name: string;
    parentId: string;
    text: string;
    style?: TextBoxStyle;
}

const TextBox = ({
    name,
    parentId,
    text,
    style = {
        marginTop: '24px',
        width: '100%',
    },
}: Props) => {
    const fullUrl = useContext(FullUrlContext);
    const {formatMessage} = useIntl();
    const id = `${formatName(name)}-text-box-widget`;
    const placeholder = formatMessage({defaultMessage: 'There\'s no text to show'});
    return (
        <Container
            id={id}
            data-testid={id}
            style={style}
        >
            <Header>
                <AnchorLinkTitle
                    fullUrl={fullUrl}
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

const Container = styled.div<{style: TextBoxStyle}>`
    width: ${(props) => props.style.width};
    height: ${(props) => (props.style.height ? props.style.height : 'auto')};
    display: flex;
    flex-direction: column;
    margin-top: ${(props) => props.style.marginTop};
`;

export default TextBox;