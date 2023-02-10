import React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {useIntl} from 'react-intl';

import {LHSOrganizationDotMenu} from 'src/components/backstage/lhs_product_dot_menu';

import {pluginUrl} from 'src/browser_routing';
import {
    ReservedCategory,
    useEcosystem,
    useProductsNoPageList,
    useReservedCategoryTitleMapper,
} from 'src/hooks';
import {DEFAULT_PATH, ORGANIZATIONS_PATH} from 'src/constants';
import {Product} from 'src/types/product';

import Sidebar, {SidebarGroup} from './sidebar';
import {ItemContainer, StyledNavLink} from './item';

const defaultOrganizationsFetchParams = {
    sort: 'name',
    direction: 'desc',
};

const useLHSData = () => {
    const normalizeCategoryName = useReservedCategoryTitleMapper();
    const ecosystem = useEcosystem('0') as Product;
    const organizations = useProductsNoPageList(defaultOrganizationsFetchParams);
    if (!organizations || !ecosystem) {
        return {groups: [], ready: false};
    }

    const organizationsItems = organizations.map((p) => {
        const icon = 'icon-play-outline';
        const link = pluginUrl(`/${ORGANIZATIONS_PATH}/${p.id}?from=organizations_lhs`);

        return {
            areaLabel: p.name,
            display_name: p.name,
            id: p.id,
            icon,
            link,
            isCollapsed: false,
            itemMenu: (
                <LHSOrganizationDotMenu
                    organizationId={p.id}
                />),
            className: '',
        };
    });
    const organizationsWithoutEcosystem = organizationsItems.filter((group) => group.display_name !== ecosystem.name);
    const organizationsWithEcosystem = organizationsItems.filter((group) => group.display_name === ecosystem.name);
    const groups = [
        {
            collapsed: false,
            display_name: normalizeCategoryName(ReservedCategory.Ecosystem),
            id: ReservedCategory.Ecosystem,
            items: organizationsWithEcosystem,
        },
        {
            collapsed: false,
            display_name: normalizeCategoryName(ReservedCategory.Organizations),
            id: ReservedCategory.Organizations,
            items: organizationsWithoutEcosystem,
        },
    ];
    return {groups, ready: true};
};

const ViewAllOrganizations = () => {
    const {formatMessage} = useIntl();
    const viewAllMessage = formatMessage({defaultMessage: 'View all...'});
    return (
        <ItemContainer>
            <ViewAllNavLink
                id={'sidebarItem_view_all_organizations'}
                aria-label={formatMessage({defaultMessage: 'View all organizations'})}
                data-testid={'organizationsLHSButton'}
                to={`/${DEFAULT_PATH}/${ORGANIZATIONS_PATH}`}
                exact={true}
            >
                {viewAllMessage}
            </ViewAllNavLink>
        </ItemContainer>
    );
};

const addViewAllsToGroups = (groups: SidebarGroup[]) => {
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].id === ReservedCategory.Organizations) {
            groups[i].afterGroup = <ViewAllOrganizations/>;
        }
    }
};

const OrganizationsSidebar = () => {
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

export default OrganizationsSidebar;