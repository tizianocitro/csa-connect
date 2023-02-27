import React, {useContext} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {formatName, formatUrlWithId, usePaginatedTableData} from 'src/hooks';
import {SectionContext} from 'src/components/rhs/rhs';
import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';

import PaginatedTable from './paginated_table';

type Props = {
    name?: string;
    url?: string;
};

const buildQuery = (parentId: string, sectionId: string | undefined) => {
    let query = `${PARENT_ID_PARAM}=${parentId}`;
    if (sectionId) {
        query = `${query}&${SECTION_ID_PARAM}=${sectionId}`;
    }
    return query;
};

const PaginatedTableWrapper = ({
    name = 'default',
    url = '',
}: Props) => {
    const sectionContextOptions = useContext(SectionContext);
    const {params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {search} = useLocation();

    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const parentIdParam = queryParams.parentId as string;
    const areSectionContextOptionsProvided = sectionContextOptions.parentId !== '' && sectionContextOptions.sectionId !== '';
    const parentId = areSectionContextOptionsProvided ? sectionContextOptions.parentId : parentIdParam;
    const sectionIdForUrl = areSectionContextOptionsProvided ? sectionContextOptions.sectionId : sectionId;

    const data = usePaginatedTableData(formatUrlWithId(url, sectionIdForUrl), buildQuery(parentId, sectionIdForUrl));

    return (
        <>
            {/* {JSON.stringify(data, null, 2)}
            <br/>
            <br/>
            <br/> */}
            <PaginatedTable
                id={formatName(name)}
                data={data}
            />
        </>
    );
};

export default PaginatedTableWrapper;