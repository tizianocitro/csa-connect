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
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';
import {debounce, isEqual} from 'lodash';

import {fetchProductChannels, fetchSectionInfo, fetchTableData} from 'src/clients';
import {ChannelProduct, FetchProductsParams, Product} from 'src/types/product';
import {resolve} from 'src/utils';
import {FetchChannelsParams, ProductChannel} from 'src/types/channels';
import {
    FetchOrganizationsParams,
    Organization,
    Section,
    SectionInfo,
} from 'src/types/organization';
import {ECOSYSTEM} from 'src/constants';
import {TableData} from 'src/components/backstage/widgets/table/table';
import {getOrganizations} from 'src/config/config';

type FetchParams = FetchOrganizationsParams | FetchChannelsParams;

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

export const useConvertProductToChannelProduct = (product: Product): ChannelProduct => {
    return {
        ...product,
        teamId: '',
        channelId: '',
        channelMode: 'link_existing_channel', // Default is creation link_existing_channel, but also create_new_channel
        channelNameTemplate: '',
        createPublicChannel: true,
    };
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

const combineQueryParameters = (oldParams: FetchOrganizationsParams, searchString: string) => {
    const queryParams = qs.parse(searchString, {ignoreQueryPrefix: true});
    return {...oldParams, ...queryParams};
};

export const useOrganizationsList = (defaultFetchParams: FetchOrganizationsParams, routed = true):
[Organization[], number, FetchProductsParams, React.Dispatch<React.SetStateAction<FetchOrganizationsParams>>] => {
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

export const useProductChannelsList = (defaultFetchParams: FetchChannelsParams, routed = true):
[ProductChannel[], number, FetchChannelsParams, React.Dispatch<React.SetStateAction<FetchChannelsParams>>] => {
    const [channels, setChannels] = useState<ProductChannel[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const history = useHistory();
    const location = useLocation();
    const currentTeamId = useSelector(getCurrentTeamId);
    const [fetchParams, setFetchParams] = useState(combineQueryParameters(defaultFetchParams, location.search));

    // Fetch the queried runs
    useEffect(() => {
        let isCanceled = false;
        async function fetchProductChannelsAsync() {
            const channelsReturn = await fetchProductChannels({...fetchParams, team_id: currentTeamId});
            if (!isCanceled) {
                setChannels((existingChannels: ProductChannel[]) => {
                    if (fetchParams.page === 0) {
                        return channelsReturn.items;
                    }
                    return [...existingChannels, ...channelsReturn.items];
                });
                setTotalCount(channelsReturn.totalCount);
            }
        }

        fetchProductChannelsAsync();

        return () => {
            isCanceled = true;
        };
    }, [fetchParams, currentTeamId]);

    useUpdateFetchParams(routed, fetchParams, history, location);

    return [channels, totalCount, fetchParams, setFetchParams];
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