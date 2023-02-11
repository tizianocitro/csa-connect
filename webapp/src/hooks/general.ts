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

import {fetchProductChannels, fetchTableData} from 'src/client';

import {ChannelProduct, FetchProductsParams, Product} from 'src/types/product';
import {resolve} from 'src/utils';
import {FetchChannelsParams, ProductChannel} from 'src/types/channels';
import {FetchOrganizationsNoPageParams, FetchOrganizationsParams, Organization} from 'src/types/organization';
import {ECOSYSTEM} from 'src/constants';
import {TableData} from 'src/components/widgets/table/table';

type FetchParams = FetchOrganizationsParams | FetchChannelsParams;

export enum ReservedCategory {
    Ecosystem = 'Ecosystem',
    Organizations = 'Organizations',
}

const data = require('../data/data.json');

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

export function useEcosystem(): Organization | {} {
    return data.organizations.filter((o: Organization) => o.name.toLowerCase() === ECOSYSTEM)[0];
}

export function useOrganization(id: string): Product | {} {
    return data.organizations.filter((o: Organization) => o.id === id)[0];
}

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

export function useOrganizationsNoPageList(defaultFetchParams: FetchOrganizationsNoPageParams): Organization[] {
    const [organizations, setOrganizations] = useState<Organization[]>(data.organizations);
    const currentTeamId = useSelector(getCurrentTeamId);

    useEffect(() => {
        organizations.sort();
        setOrganizations(organizations);
    }, [currentTeamId]);

    return organizations;
}

const combineQueryParameters = (oldParams: FetchOrganizationsParams, searchString: string) => {
    const queryParams = qs.parse(searchString, {ignoreQueryPrefix: true});
    return {...oldParams, ...queryParams};
};

export function useOrganizationsList(defaultFetchParams: FetchOrganizationsParams, routed = true):
[Organization[], number, FetchProductsParams, React.Dispatch<React.SetStateAction<FetchOrganizationsParams>>] {
    const [organizations, setOrganizations] = useState<Organization[]>(data.organizations);
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
        let orgs = data.organizations;
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
}

export function useProductChannelsList(defaultFetchParams: FetchChannelsParams, routed = true):
[ProductChannel[], number, FetchChannelsParams, React.Dispatch<React.SetStateAction<FetchChannelsParams>>] {
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
}

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
    }, [tableData]);
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