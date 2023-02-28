import {debounce, isEqual} from 'lodash';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {useUpdateEffect} from 'react-use';

import {FetchChannelsParams, WidgetChannel} from 'src/types/channels';
import {
    FetchOrganizationsParams,
    Organization,
    Section,
    SectionInfo,
} from 'src/types/organization';
import {
    fetchChannelById,
    fetchChannels,
    fetchGraphData,
    fetchPaginatedTableData,
    fetchSectionInfo,
    fetchTableData,
    fetchTextBoxData,
} from 'src/clients';
import {fillEdges, fillNodes} from 'src/components/backstage/widgets/graph/graph_node_type';
import {
    getEcosystem,
    getOrganizationById,
    getOrganizations,
    getOrganizationsNoEcosystem,
} from 'src/config/config';
import {GraphData} from 'src/types/graph';
import {FullUrlContext} from 'src/components/rhs/rhs';
import {PaginatedTableData} from 'src/types/paginated_table';
import {TableData} from 'src/types/table';
import {TextBoxData} from 'src/types/text_box';
import {fillColumn} from 'src/components/backstage/widgets/paginated_table/paginated_table_wrapper';
import {navigateToUrl} from 'src/browser_routing';
import {resolve} from 'src/utils';
import {PARENT_ID_PARAM} from 'src/constants';
import {OrganizationIdContext} from 'src/components/backstage/organizations/organization_details';

import {buildIdForUrlHashReference, buildTo} from './url';
import {formatSectionPath, formatStringToLowerCase} from './format';

type FetchParams = FetchOrganizationsParams;

export enum ReservedCategory {
    Ecosystem = 'Ecosystem',
    Organizations = 'Organizations',
}

export const useReservedCategoryTitleMapper = (): (categoryName: ReservedCategory | string) => string => {
    const {formatMessage} = useIntl();
    return (categoryName: ReservedCategory | string) => {
        switch (categoryName) {
        case ReservedCategory.Ecosystem:
            return formatMessage({defaultMessage: 'Ecosystem'});
        case ReservedCategory.Organizations:
            return formatMessage({defaultMessage: 'Organizations'});
        default:
            return categoryName;
        }
    };
};

export const useEcosystem = (): Organization => {
    return getEcosystem();
};

export const useOrganization = (id: string): Organization => {
    return getOrganizationById(id);
};

export const useOrganizationsNoPageList = (): Organization[] => {
    const [organizations, setOrganizations] = useState<Organization[]>(getOrganizations());
    const currentTeamId = useSelector(getCurrentTeamId);

    useEffect(() => {
        organizations.sort();
        setOrganizations(organizations);
    }, [currentTeamId]);

    return organizations;
};

export const useOrganizationsList = (defaultFetchParams: FetchOrganizationsParams, routed = true): [
    Organization[],
    number,
    FetchOrganizationsParams,
    React.Dispatch<React.SetStateAction<FetchOrganizationsParams>>,
] => {
    const [organizations, setOrganizations] = useState<Organization[]>(getOrganizationsNoEcosystem());
    const [totalCount, setTotalCount] = useState(0);
    const history = useHistory();
    const location = useLocation();
    const [fetchParams, setFetchParams] = useState(combineQueryParameters(defaultFetchParams, location.search));

    // const currentTeamId = useSelector(getCurrentTeamId);
    // check whether [fetchParams, currentTeamId] is a good set of dependencies
    useEffect(() => {
        organizations.sort();
        if (fetchParams.direction === 'desc') {
            organizations.reverse();
        }
        setOrganizations(organizations);
        setTotalCount(organizations.length);
    });

    useEffect(() => {
        let orgs = getOrganizationsNoEcosystem();
        orgs.sort();
        if (fetchParams.direction === 'desc') {
            orgs.reverse();
        }
        const searchTerm = fetchParams.search_term;
        if (searchTerm && searchTerm.trim().length !== 0) {
            orgs = orgs.filter((o) => o.name.indexOf(searchTerm) !== -1);
        }
        setOrganizations(orgs);
        setTotalCount(orgs.length);
    }, [fetchParams.search_term]);

    useUpdateFetchParams(routed, fetchParams, history, location);

    return [organizations, totalCount, fetchParams, setFetchParams];
};

export const useSection = (id: string): Section => {
    return getOrganizations().
        map((o) => o.sections).
        flat().
        filter((s: Section) => s.id === id)[0];
};

export const useSectionInfo = (id: string, url: string): SectionInfo => {
    const [info, setInfo] = useState<SectionInfo | {}>({});

    useEffect(() => {
        let isCanceled = false;
        async function fetchSectionInfoAsync() {
            const infoResult = await fetchSectionInfo(id, url);
            if (!isCanceled) {
                setInfo(infoResult);
            }
        }

        fetchSectionInfoAsync();

        return () => {
            isCanceled = true;
        };
    }, [id]);
    return info as SectionInfo;
};

export const useSectionData = ({id, name, url}: Section): PaginatedTableData => {
    const [sectionData, setSectionData] = useState<PaginatedTableData>({columns: [], rows: []});
    const {path, url: routeUrl} = useRouteMatch();
    const organizationId = useContext(OrganizationIdContext);
    const basePath = `${formatSectionPath(path, organizationId)}/${formatStringToLowerCase(name)}`;

    useEffect(() => {
        let isCanceled = false;
        async function fetchSectionDataAsync() {
            const paginatedTableDataResult = await fetchPaginatedTableData(url);
            if (!isCanceled) {
                const {columns, rows} = sectionData;

                paginatedTableDataResult.columns.forEach(({title}) => {
                    columns.push({
                        title,
                        dataIndex: formatStringToLowerCase(title),
                        key: formatStringToLowerCase(title),
                    });
                });

                paginatedTableDataResult.rows.forEach((row) => {
                    const itemId = buildIdForUrlHashReference('paginated-table-row', row.id);
                    rows.push({
                        ...row,
                        key: row.id,
                        itemId,
                        to: buildTo('', itemId, '', routeUrl),
                        onClick: () => navigateToUrl(`${basePath}/${row.id}?${PARENT_ID_PARAM}=${id}`),
                    });
                });

                setSectionData({columns, rows});
            }
        }

        fetchSectionDataAsync();

        return () => {
            isCanceled = true;
        };
    }, [url]);

    return sectionData as PaginatedTableData;
};

export const useGraphData = (url: string, hash: string, routeUrl: string): GraphData => {
    const [graphData, setGraphData] = useState<GraphData | {}>({});
    const {hash: urlHash, search} = useLocation();

    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const parentIdParam = queryParams.parentId as string;
    const sectionIdParam = queryParams.sectionId as string;

    useEffect(() => {
        let isCanceled = false;
        async function fetchGraphDataAsync() {
            const graphDataResult = await fetchGraphData(url);
            if (!isCanceled) {
                const filledNodes = fillNodes(graphDataResult.nodes, parentIdParam, sectionIdParam, routeUrl, urlHash);
                const filledEdges = fillEdges(graphDataResult.edges);
                setGraphData({
                    description: graphDataResult.description,
                    edges: filledEdges,
                    nodes: filledNodes,
                });
            }
        }

        fetchGraphDataAsync();

        return () => {
            isCanceled = true;
        };
    }, [url, hash]);
    return graphData as GraphData;
};

export const useTableData = (url: string): TableData => {
    const [tableData, setTableData] = useState<TableData | {}>({});

    useEffect(() => {
        let isCanceled = false;
        async function fetchTableDataAsync() {
            const tableDataResult = await fetchTableData(url);
            if (!isCanceled) {
                setTableData(tableDataResult);
            }
        }

        fetchTableDataAsync();

        return () => {
            isCanceled = true;
        };
    }, [url]);
    return tableData as TableData;
};

export const usePaginatedTableData = (url: string, query: string): PaginatedTableData => {
    const [paginatedTableData, setPaginatedTableData] = useState<PaginatedTableData>({columns: [], rows: []});
    const fullUrl = useContext(FullUrlContext);
    const {url: routeUrl} = useRouteMatch();

    useEffect(() => {
        let isCanceled = false;
        async function fetchPaginatedTableDataAsync() {
            const paginatedTableDataResult = await fetchPaginatedTableData(url);
            if (!isCanceled) {
                const {columns, rows} = paginatedTableData;

                paginatedTableDataResult.columns.forEach(({title}) => {
                    columns.push(fillColumn(title));
                });

                paginatedTableDataResult.rows.forEach((row) => {
                    const itemId = buildIdForUrlHashReference('paginated-table-row', row.id);
                    rows.push({
                        ...row,
                        key: row.id,
                        itemId,
                        to: buildTo(fullUrl, itemId, query, routeUrl),
                    });
                });

                setPaginatedTableData({columns, rows});
            }
        }

        fetchPaginatedTableDataAsync();

        return () => {
            isCanceled = true;
        };
    }, [url]);

    return paginatedTableData as PaginatedTableData;
};

export const useTextBoxData = (url: string): TextBoxData => {
    const [textBoxData, setTextBoxData] = useState<TextBoxData | {}>({});

    useEffect(() => {
        let isCanceled = false;
        async function fetchTextBoxDataAsync() {
            const textBoxDataResult = await fetchTextBoxData(url);
            if (!isCanceled) {
                setTextBoxData(textBoxDataResult);
            }
        }

        fetchTextBoxDataAsync();

        return () => {
            isCanceled = true;
        };
    }, [url]);
    return textBoxData as TextBoxData;
};

export const useChannelsList = (defaultFetchParams: FetchChannelsParams): WidgetChannel[] => {
    const [channels, setChannels] = useState<WidgetChannel[]>([]);

    useEffect(() => {
        let isCanceled = false;
        async function fetchChannelsAsync() {
            const channelsReturn = await fetchChannels(defaultFetchParams);
            if (!isCanceled) {
                setChannels(channelsReturn.items);
            }
        }

        fetchChannelsAsync();

        return () => {
            isCanceled = true;
        };
    }, []);

    return channels;
};

export const useChannelById = (channelId: string): WidgetChannel => {
    const [channel, setChannel] = useState<WidgetChannel | {}>({});

    useEffect(() => {
        let isCanceled = false;
        async function fetchChannelsAsync() {
            const channelReturn = await fetchChannelById(channelId);
            if (!isCanceled) {
                setChannel(channelReturn.channel);
            }
        }

        fetchChannelsAsync();

        return () => {
            isCanceled = true;
        };
    }, [channelId]);

    return channel as WidgetChannel;
};

// Update the query string when the fetchParams change
const useUpdateFetchParams = (
    routed: boolean,
    fetchParams: FetchParams,
    history: any,
    location: any,
): void => {
    useEffect(() => {
        if (routed) {
            const newFetchParams: Record<string, unknown> = {...fetchParams};
            delete newFetchParams.page;
            delete newFetchParams.per_page;
            history.replace({...location, search: qs.stringify(newFetchParams, {addQueryPrefix: false, arrayFormat: 'brackets'})});
        }
    }, [fetchParams, history]);
};

const combineQueryParameters = (
    oldParams: FetchOrganizationsParams,
    searchString: string,
): FetchOrganizationsParams => {
    const queryParams = qs.parse(searchString, {ignoreQueryPrefix: true});
    return {...oldParams, ...queryParams};
};

/**
 * For controlled props or other pieces of state that need immediate updates with a debounced side effect.
 * @remarks
 * This is a problem solving hook; it is not intended for general use unless it is specifically needed.
 * Also consider {@link https://github.com/streamich/react-use/blob/master/docs/useDebounce.md react-use#useDebounce}.
 *
 * @example
 * const [debouncedValue, setDebouncedValue] = useState('…');
 * const [val, setVal] = useProxyState(debouncedValue, setDebouncedValue, 500);
 * const input = <input type='text' value={val} onChange={({currentTarget}) => setVal(currentTarget.value)}/>;
 */
export const useProxyState = <T>(
    prop: T,
    onChange: (val: T) => void,
    wait = 500,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const check = useRef(prop);
    const [value, setValue] = useState(prop);

    useUpdateEffect(() => {
        if (!isEqual(value, check.current)) {
            // check failed; don't destroy pending changes (values set mid-cycle between send/sync)
            return;
        }
        check.current = prop; // sync check
        setValue(prop);
    }, [prop]);

    const onChangeDebounced = useMemo(() => debounce((v) => {
        check.current = v; // send check
        onChange(v);
    }, wait), [wait, onChange]);

    useEffect(() => onChangeDebounced.cancel, [onChangeDebounced]);

    return [value, useCallback((update) => {
        setValue((v) => {
            const newValue = resolve(update, v);
            onChangeDebounced(newValue);
            return newValue;
        });
    }, [setValue, onChangeDebounced])];
};