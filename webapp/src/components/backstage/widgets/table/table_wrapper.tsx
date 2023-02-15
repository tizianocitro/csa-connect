import React from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {formatName, formatUrlWithId, useTableData} from 'src/hooks';

import Table from './table';

type Props = {
    name?: string;
    url?: string;
}

const TableWrapper = ({
    name = 'default',
    url = '',
}: Props) => {
    const {params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {hash: urlHash} = useLocation();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const parentId = queryParams.sectionId as string;
    const data = useTableData(formatUrlWithId(url, sectionId));
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