import {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';

import {useSelector} from 'react-redux';

import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';

import {fetchProducts} from 'src/client';

import {FetchProductsParams, Product} from 'src/types/product';

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
