// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useRef} from 'react';
import styled from 'styled-components';

import TextWithTooltipWhenEllipsis from 'src/components/widgets/text_with_tooltip_when_ellipsis';

interface Props {
    name: string;
}

export function ColHeader({name}: Props) {
    const nameRef = useRef(null);

    return (
        <Header>
            <Name ref={nameRef}>
                <TextWithTooltipWhenEllipsis
                    id={`col_${name}`}
                    text={name}
                    parentRef={nameRef}
                />
            </Name>
        </Header>
    );
}

const Header = styled.div`
    display: flex;
    cursor: pointer;
`;

const Name = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
