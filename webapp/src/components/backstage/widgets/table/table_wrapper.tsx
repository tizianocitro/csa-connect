import React, {useContext} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {formatName, formatUrlWithId, useTableData} from 'src/hooks';
import {SectionContext} from 'src/components/rhs/rhs';

import Table from './table';

type Props = {
    name?: string;
    url?: string;
};

const TableWrapper = ({
    name = 'default',
    url = '',
}: Props) => {
    const sectionContextOptions = useContext(SectionContext);
    const {params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {hash: urlHash, search} = useLocation();

    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const parentIdParam = queryParams.parentId as string;
    const areSectionContextOptionsProvided = sectionContextOptions.parentId !== '' && sectionContextOptions.sectionId !== '';
    const parentId = areSectionContextOptionsProvided ? sectionContextOptions.parentId : parentIdParam;
    const sectionIdForUrl = areSectionContextOptionsProvided ? sectionContextOptions.sectionId : sectionId;

    const data = useTableData(formatUrlWithId(url, sectionIdForUrl));

    return (
        <Table
            id={formatName(name)}
            data={data}
            name={name}
            sectionId={sectionIdForUrl}
            parentId={parentId}
            urlHash={urlHash}
        />
    );
};

export default TableWrapper;