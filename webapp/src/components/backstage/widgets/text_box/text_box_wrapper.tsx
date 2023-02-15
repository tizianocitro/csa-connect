import React from 'react';
import {useLocation} from 'react-router-dom';
import qs from 'qs';

import {formatUrlWithId, useTextBoxData} from 'src/hooks';

import TextBox from './text_box';

type Props = {
    name?: string;
    url?: string;
}

const TextBoxWrapper = ({
    name = 'default',
    url = '',
}: Props) => {
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const sectionId = queryParams.sectionId as string;
    const {text} = useTextBoxData(formatUrlWithId(url, sectionId));
    return (
        <TextBox
            name={name}
            parentId={sectionId}
            text={text}
        />
    );
};

export default TextBoxWrapper;