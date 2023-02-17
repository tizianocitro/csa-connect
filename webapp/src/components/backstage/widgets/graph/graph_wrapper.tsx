import React from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import Graph from './graph';

type Props = {
    name?: string;
    url?: string;
}

const GraphWrapper = ({
    name = 'default',
    url = '',
}: Props) => {
    const {params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const parentId = queryParams.sectionId as string;
    return (
        <Graph
            name={name}
            parentId={parentId}
        />
    );
};

export default GraphWrapper;