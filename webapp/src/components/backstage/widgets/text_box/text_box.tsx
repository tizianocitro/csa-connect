import React, {useContext} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import MarkdownEdit from 'src/components/common/markdown_edit';
import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {formatName} from 'src/hooks';
import {FullUrlContext} from 'src/components/rhs/rhs';
import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';

export type TextBoxStyle = {
    height?: string;
    marginTop?: string;
    width?: string;
}

type Props = {
    name: string;
    parentId: string;
    sectionId: string;
    style?: TextBoxStyle;
    text: string;
}

const TextBox = ({
    name,
    parentId,
    sectionId,
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
                    query={`${SECTION_ID_PARAM}=${sectionId}&${PARENT_ID_PARAM}=${parentId}`}
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