import React, {useContext} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {formatUrlWithId, useGraphData} from 'src/hooks';
import {FullUrlContext, SectionContext} from 'src/components/rhs/rhs';

import Graph from './graph';

type Props = {
    name?: string;
    url?: string;
}

const GraphWrapper = ({
    name = 'default',
    url = '',
}: Props) => {
    const fullUrl = useContext(FullUrlContext);
    const sectionContextOptions = useContext(SectionContext);

    const {url: sectionUrl, params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {hash: urlHash, search} = useLocation();

    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const parentIdParam = queryParams.parentId as string;

    const areSectionContextOptionsProvided = sectionContextOptions.parentId !== '' && sectionContextOptions.sectionId !== '';
    const parentId = areSectionContextOptionsProvided ? sectionContextOptions.parentId : parentIdParam;
    const sectionIdForUrl = areSectionContextOptionsProvided ? sectionContextOptions.sectionId : sectionId;
    const isFullUrlProvided = fullUrl !== '';
    const routeUrl = isFullUrlProvided ? fullUrl : sectionUrl;

    const data = useGraphData(formatUrlWithId(url, sectionIdForUrl), urlHash, routeUrl);

    return (
        <Graph
            data={data}
            name={name}
            sectionId={sectionIdForUrl}
            parentId={parentId}
        />
    );
};

export default GraphWrapper;