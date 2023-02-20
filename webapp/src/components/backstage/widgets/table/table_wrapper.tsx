import React, {useContext} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {formatName, formatUrlWithId, useTableData} from 'src/hooks';
import {SectionContext} from 'src/components/rhs/right_hand_sidebar';

import Table from './table';

type Props = {
    name?: string;
    url?: string;
}

const TableWrapper = ({
    name = 'default',
    url = '',
}: Props) => {
    const sectionContextOptions = useContext(SectionContext);
    const {params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {hash: urlHash} = useLocation();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const parentIdParam = queryParams.parentId as string;
    const areSectionContextOptionsProvided = sectionContextOptions.parentId !== '' && sectionContextOptions.sectionId !== '';
    const parentId = areSectionContextOptionsProvided ? sectionContextOptions.parentId : parentIdParam;
    const sectionIdForUrl = areSectionContextOptionsProvided ? sectionContextOptions.sectionId : sectionId;

    const data = useTableData(formatUrlWithId(url, sectionIdForUrl));
    return (
        <Table
            id={formatName(name)}
            data={data}
            parentId={parentId}
            urlHash={urlHash}
        />
    );
};

export default TableWrapper;