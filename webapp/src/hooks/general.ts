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

import {
    fetchProduct,
    fetchProducts,
    fetchProductsNoPage,
    isFavoriteItem,
} from 'src/client';

import {
    ChannelProduct,
    FetchProductsNoPageParams,
    FetchProductsParams,
    Product,
} from 'src/types/product';
import {resolve} from 'src/utils';

export enum ReservedCategory {
    Favorite = 'Favorite',
    Products = 'Products',
}

export const useReservedCategoryTitleMapper = () => {
    const {formatMessage} = useIntl();
    return (categoryName: ReservedCategory | string) => {
        switch (categoryName) {
        case ReservedCategory.Favorite:
            return formatMessage({defaultMessage: 'Favorites'});
        case ReservedCategory.Products:
            return formatMessage({defaultMessage: 'Products'});
        default:
            return categoryName;
        }
    };
};

export const useSetProductFavorite = (id: string | undefined) => {
    // TODO: Here make API call and remove this fake interface and function
    interface Variables {
        variables: {
            id: string | undefined;
            fav: boolean;
        }
    }

    const innerUpdateProduct = (variables: Variables) => {
        return variables;
    };

    return useCallback((fav: boolean) => {
        if (id === undefined) {
            return;
        }
        innerUpdateProduct({variables: {id, fav}});
    }, [id, innerUpdateProduct]);
};

export const useFavoriteProduct = (id: string): [boolean, () => void] => {
    const [isFavoriteProduct, setIsFavoriteProduct] = useState(false);
    const setProductFavorite = useSetProductFavorite(id);

    useEffect(() => {
        isFavoriteItem(id)
            .then(setIsFavoriteProduct)
            .catch(() => setIsFavoriteProduct(false));
    }, [id]);

    const toggleFavorite = () => {
        setProductFavorite(!isFavoriteProduct);
        setIsFavoriteProduct(!isFavoriteProduct);
    };
    return [isFavoriteProduct, toggleFavorite];
};

export function useProduct(id: string): Product | {} {
    const [product, setProduct] = useState<Product | {}>({});
    useEffect(() => {
        let isCanceled = false;
        async function fetchProductAsync() {
            const productReturn = await fetchProduct(id);
            if (!isCanceled) {
                setProduct(productReturn);
            }
        }

        fetchProductAsync();

        return () => {
            isCanceled = true;
        };
    }, [id]);

    return product;
}

export const convertProductToChannelProduct = (product: Product): ChannelProduct => {
    return {
        ...product,
        team_id: '',
        channel_id: '',
        channel_mode: 'link_existing_channel', // Default is creation create_new_channel, but also link_existing_channel
        channel_name_template: '',
        create_public_channel: true,
    };
};

export function useProductsNoPageList(defaultFetchParams: FetchProductsNoPageParams): Product[] {
    const [products, setProducts] = useState<Product[]>([]);
    const currentTeamId = useSelector(getCurrentTeamId);

    // Fetch the queried runs
    useEffect(() => {
        let isCanceled = false;
        async function fetchProductsNoPageAsync() {
            const productsReturn = await fetchProductsNoPage({...defaultFetchParams, team_id: currentTeamId});
            if (!isCanceled) {
                setProducts((existingProducts: Product[]) => [...existingProducts, ...productsReturn.items]);
            }
        }

        fetchProductsNoPageAsync();

        return () => {
            isCanceled = true;
        };
    }, [currentTeamId]);

    return products;
}

const combineQueryParameters = (oldParams: FetchProductsParams, searchString: string) => {
    const queryParams = qs.parse(searchString, {ignoreQueryPrefix: true});
    return {...oldParams, ...queryParams};
};

export function useProductsList(defaultFetchParams: FetchProductsParams, routed = true):
[Product[], number, FetchProductsParams, React.Dispatch<React.SetStateAction<FetchProductsParams>>] {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const history = useHistory();
    const location = useLocation();
    const currentTeamId = useSelector(getCurrentTeamId);
    const [fetchParams, setFetchParams] = useState(combineQueryParameters(defaultFetchParams, location.search));

    // Fetch the queried runs
    useEffect(() => {
        let isCanceled = false;
        async function fetchProductsAsync() {
            const productsReturn = await fetchProducts({...fetchParams, team_id: currentTeamId});
            if (!isCanceled) {
                setProducts((existingProducts: Product[]) => {
                    if (fetchParams.page === 0) {
                        return productsReturn.items;
                    }
                    return [...existingProducts, ...productsReturn.items];
                });
                setTotalCount(productsReturn.total_count);
            }
        }

        fetchProductsAsync();

        return () => {
            isCanceled = true;
        };
    }, [fetchParams, currentTeamId]);

    // Update the query string when the fetchParams change
    useEffect(() => {
        if (routed) {
            const newFetchParams: Record<string, unknown> = {...fetchParams};
            delete newFetchParams.page;
            delete newFetchParams.per_page;
            history.replace({...location, search: qs.stringify(newFetchParams, {addQueryPrefix: false, arrayFormat: 'brackets'})});
        }
    }, [fetchParams, history]);

    return [products, totalCount, fetchParams, setFetchParams];
}

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