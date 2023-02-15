import React from 'react';

import {formatUrlWithId, useTextBoxData} from 'src/hooks';

import TextBox from './text-box';

type Props = {
    name?: string;
    parentId: string;
    url?: string;
}

const TextBoxWrapper = ({
    name = 'default',
    parentId,
    url = '',
}: Props) => {
    const {text} = useTextBoxData(formatUrlWithId(url, parentId));
    return (
        <TextBox
            name={name}
            parentId={parentId}
            text={text}
        />
    );
};

export default TextBoxWrapper;