// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import MarkdownEdit from 'src/components/markdown_edit';
import {Timestamp} from 'src/webapp_globals';
import {AnchorLinkTitle} from 'src/components/backstage/widgets/shared';
import {PAST_TIME_SPEC} from 'src/components/time_spec';
import {Product} from 'src/types/product';

interface Props {
    id: string;
    product: Product;
}

const Summary = ({id, product}: Props) => {
    const {formatMessage} = useIntl();

    const title = formatMessage({defaultMessage: 'Summary'});
    const modifiedAt = (
        <Timestamp
            value={product.summaryModifiedAt}
            units={PAST_TIME_SPEC}
        />
    );

    const modifiedAtMessage = (
        <TimestampContainer>
            {formatMessage({defaultMessage: 'Last edited {timestamp}'}, {timestamp: modifiedAt})}
        </TimestampContainer>
    );

    const placeholder = formatMessage({defaultMessage: 'There\'s no summary'});

    return (
        <Container
            id={id}
            data-testid={'product-summary-section'}
        >
            <Header>
                <AnchorLinkTitle
                    text={title}
                    title={title}
                    id={id}
                />
                {product.summaryModifiedAt > 0 && modifiedAtMessage}
            </Header>
            <MarkdownEdit
                placeholder={placeholder}
                value={product.summary}
            />
        </Container>
    );
};

const Header = styled.div`
    display: flex;
    flex: 1;
    margin-bottom: 8px;
`;

const TimestampContainer = styled.div`
    flex-grow: 1;
    display: flex;
    white-space: pre-wrap;

    align-items: center;
    justify-content: flex-end;

    color: rgba(var(--center-channel-color-rgb), 0.64);
    font-size: 12px;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default Summary;