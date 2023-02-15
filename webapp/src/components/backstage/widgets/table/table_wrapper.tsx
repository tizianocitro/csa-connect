import React from 'react';
import {useLocation} from 'react-router-dom';
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
    const {hash: urlHash} = useLocation();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const sectionId = queryParams.sectionId as string;
    const data = useTableData(formatUrlWithId(url, sectionId));
    return (
        <Table
            id={formatName(name)}
            data={data}
            parentId={sectionId}
            urlHash={urlHash}
        />
    );
};

export default TableWrapper;