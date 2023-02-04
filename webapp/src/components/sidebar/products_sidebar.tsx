import React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {useIntl} from 'react-intl';

import {LHSProductDotMenu} from 'src/components/backstage/lhs_product_dot_menu';

import {pluginUrl} from 'src/browser_routing';
import {ReservedCategory, useProductsNoPageList, useReservedCategoryTitleMapper} from 'src/hooks';

import Sidebar, {SidebarGroup} from './sidebar';
import {ItemContainer, StyledNavLink} from './item';

const defaultProductsFetchParams = {
    sort: 'name',
    direction: 'desc',
};
const useLHSData = () => {
    const normalizeCategoryName = useReservedCategoryTitleMapper();
    const products = useProductsNoPageList(defaultProductsFetchParams);
    if (!products) {
        return {groups: [], ready: false};
    }

    const productItems = products.map((p) => {
        const icon = 'icon-play-outline';
        const link = pluginUrl(`/products/${p.id}?from=products_lhs`);

        return {
            areaLabel: p.name,
            display_name: p.name,
            id: p.id,
            icon,
            link,
            isCollapsed: false,
            itemMenu: (
                <LHSProductDotMenu
                    productId={p.id}
                    isFavorite={p.isFavorite}
                />),
            isFavorite: p.isFavorite,
            className: '',
        };
    });
    const productsFavorites = productItems.filter((group) => group.isFavorite);
    const productsWithoutFavorites = productItems.filter((group) => !group.isFavorite);

    let groups = [
        {
            collapsed: false,
            display_name: normalizeCategoryName(ReservedCategory.Products),
            id: ReservedCategory.Products,
            items: productsWithoutFavorites,
        },
    ];
    if (productsFavorites.length > 0) {
        groups = [
            {
                collapsed: false,
                display_name: normalizeCategoryName(ReservedCategory.Favorite),
                id: ReservedCategory.Favorite,
                items: productsFavorites,
            },
        ].concat(groups);
    }

    return {groups, ready: true};
};

const ViewAllProducts = () => {
    const {formatMessage} = useIntl();
    const viewAllMessage = formatMessage({defaultMessage: 'View all...'});
    return (
        <ItemContainer>
            <ViewAllNavLink
                id={'sidebarItem_view_all_products'}
                aria-label={formatMessage({defaultMessage: 'View all products'})}
                data-testid={'productsLHSButton'}
                to={'/mattermost-product/products'}
                exact={true}
            >
                {viewAllMessage}
            </ViewAllNavLink>
        </ItemContainer>
    );
};

const addViewAllsToGroups = (groups: SidebarGroup[]) => {
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].id === ReservedCategory.Products) {
            groups[i].afterGroup = <ViewAllProducts/>;
        }
    }
};

const ProductsSidebar = () => {
    const teamID = useSelector(getCurrentTeamId);
    const {groups, ready} = useLHSData();

    if (!ready) {
        return (
            <Sidebar
                groups={[]}
                team_id={teamID}
            />
        );
    }

    addViewAllsToGroups(groups);

    return (
        <Sidebar
            groups={groups}
            team_id={teamID}
        />
    );
};

const ViewAllNavLink = styled(StyledNavLink)`
    &&& {
        &:not(.active) {
            color: rgba(var(--sidebar-text-rgb), 0.56);
        }

        padding-left: 23px;
    }
`;

export default ProductsSidebar;