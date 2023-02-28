import React, {useContext} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {
    buildIdForUrlHashReference,
    buildQuery,
    buildTo,
    formatName,
    formatStringToLowerCase,
    formatUrlWithId,
    usePaginatedTableData,
} from 'src/hooks';
import {PaginatedTableColumn, PaginatedTableRow} from 'src/types/paginated_table';
import {SectionContext} from 'src/components/rhs/rhs';

import PaginatedTable from './paginated_table';

type Props = {
    name?: string;
    url?: string;
};

export const fillColumn = (title: string): PaginatedTableColumn => {
    const lowerCaseTitle = formatStringToLowerCase(title);
    return {
        title,
        dataIndex: lowerCaseTitle,
        key: lowerCaseTitle,
    };
};

export const fillRow = (
    row: PaginatedTableRow,
    fullUrl: string,
    routeUrl: string,
    query: string,
): PaginatedTableRow => {
    const itemId = buildIdForUrlHashReference('paginated-table-row', row.id);
    return {
        ...row,
        key: row.id,
        itemId,
        to: buildTo(fullUrl, itemId, query, routeUrl),
    };
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
        <PaginatedTable
            id={formatName(name)}
            data={data}
            name={name}
            sectionId={sectionIdForUrl}
            parentId={parentId}
        />
    );
};

export default PaginatedTableWrapper;