import React from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {formatUrlWithId, useGraphData} from 'src/hooks';

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
    const data = useGraphData(formatUrlWithId(url, sectionId));
    return (
        <Graph
            name={name}
            data={data}
            parentId={parentId}
        />
    );
};

export default GraphWrapper;