import React from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
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
    const {params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const parentId = queryParams.sectionId as string;
    const {text} = useTextBoxData(formatUrlWithId(url, sectionId));
    return (
        <TextBox
            name={name}
            parentId={parentId}
            text={text}
        />
    );
};

export default TextBoxWrapper;