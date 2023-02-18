import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {useUpdateEffect} from 'react-use';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';
import {debounce, isEqual} from 'lodash';
import {Edge, Node} from 'reactflow';

import {
    fetchChannels,
    fetchGraphData,
    fetchSectionInfo,
    fetchTableData,
    fetchTextBoxData,
} from 'src/clients';
import {resolve} from 'src/utils';
import {FetchChannelsParams, WidgetChannel} from 'src/types/channels';
import {
    FetchOrganizationsParams,
    Organization,
    Section,
    SectionInfo,
} from 'src/types/organization';
import {ECOSYSTEM} from 'src/constants';
import {TableData} from 'src/types/table';
import {getOrganizations} from 'src/config/config';
import {TextBoxData} from 'src/types/text_box';
import {GraphData} from 'src/types/graph';
import {
    buildEdgeType,
    buildNodeIsUrlHashed,
    buildNodeType,
    buildNodeUrl,
} from 'src/components/backstage/widgets/graph/graph_node_type';

type FetchParams = FetchOrganizationsParams;

export enum ReservedCategory {
    Ecosystem = 'Ecosystem',
    Organizations = 'Organizations',
}

export const useReservedCategoryTitleMapper = () => {
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
    return getOrganizations().filter((o: Organization) => o.name.toLowerCase() === ECOSYSTEM)[0];
};

export const useOrganization = (id: string): Organization => {
    return getOrganizations().filter((o: Organization) => o.id === id)[0];
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

export const useOrganizationsList = (defaultFetchParams: FetchOrganizationsParams, routed = true):
[Organization[], number, FetchOrganizationsParams, React.Dispatch<React.SetStateAction<FetchOrganizationsParams>>] => {
    const [organizations, setOrganizations] = useState<Organization[]>(getOrganizations());
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
        let orgs = getOrganizations();
        orgs.sort();
        if (fetchParams.direction === 'desc') {
            orgs.reverse();
        }
        const searchTerm = fetchParams.search_term;
        if (searchTerm && searchTerm.trim().length !== 0) {
            orgs = orgs.filter((o: Organization) => o.name.indexOf(searchTerm) !== -1);
        }
        setOrganizations(orgs);
        setTotalCount(orgs.length);
    }, [fetchParams.search_term]);

    useUpdateFetchParams(routed, fetchParams, history, location);

    return [organizations, totalCount, fetchParams, setFetchParams];
};

export const useSection = (id: string): Section => {
    return getOrganizations().
        map((o: Organization) => o.sections).
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
    }, []);
    return info as SectionInfo;
};

export const useSectionData = (url: string): TableData => {
    const [sectionData, setSectionData] = useState<TableData | {}>({});

    useEffect(() => {
        let isCanceled = false;
        async function fetchSectionDataAsync() {
            const tableDataResult = await fetchTableData(url);
            if (!isCanceled) {
                setSectionData(tableDataResult);
            }
        }

        fetchSectionDataAsync();

        return () => {
            isCanceled = true;
        };
    }, []);
    return sectionData as TableData;
};

export const useGraphData = (url: string): GraphData => {
    const [graphData, setGraphData] = useState<GraphData | {}>({});
    const {url: routeUrl} = useRouteMatch();
    const {hash: urlHash, search} = useLocation();
    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const sectionIdParam = queryParams.sectionId as string;

    const fillNodes = (nodes: Node[], sectionId: string, sectionUrl: string, sectionUrlHash: string) => {
        const filledNodes: Node[] = [];
        nodes.forEach((node) => {
            filledNodes.push({
                ...node,
                data: {
                    ...node.data,
                    url: buildNodeUrl(sectionId, sectionUrl),
                    isUrlHashed: buildNodeIsUrlHashed(node, sectionUrlHash),
                },
                type: buildNodeType(),
            });
        });
        return filledNodes;
    };

    const fillEdges = (edges: Edge[]) => {
        const filledEdges: Edge[] = [];
        edges.forEach((edge) => {
            filledEdges.push({
                ...edge,
                type: buildEdgeType(),
            });
        });
        return filledEdges;
    };

    useEffect(() => {
        let isCanceled = false;
        async function fetchGraphDataAsync() {
            const graphDataResult = await fetchGraphData(url);
            if (!isCanceled) {
                const filledNodes = fillNodes(graphDataResult.nodes, sectionIdParam, routeUrl, urlHash);
                const filledEdges = fillEdges(graphDataResult.edges);
                setGraphData({edges: filledEdges, nodes: filledNodes});
            }
        }

        fetchGraphDataAsync();

        return () => {
            isCanceled = true;
        };
    }, []);
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
    }, []);
    return tableData as TableData;
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
    }, []);
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

// Update the query string when the fetchParams change
const useUpdateFetchParams = (
    routed: boolean,
    fetchParams: FetchParams,
    history: any,
    location: any,
) => {
    useEffect(() => {
        if (routed) {
            const newFetchParams: Record<string, unknown> = {...fetchParams};
            delete newFetchParams.page;
            delete newFetchParams.per_page;
            history.replace({...location, search: qs.stringify(newFetchParams, {addQueryPrefix: false, arrayFormat: 'brackets'})});
        }
    }, [fetchParams, history]);
};

const combineQueryParameters = (oldParams: FetchOrganizationsParams, searchString: string) => {
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