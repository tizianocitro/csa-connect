import {useIntl} from 'react-intl';

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
