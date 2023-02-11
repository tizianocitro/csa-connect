// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import styled from 'styled-components';
import {
    NavLink,
    Redirect,
    Route,
    Switch,
    useLocation,
    useRouteMatch,
} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {useForceDocumentTitle, useOrganization} from 'src/hooks';
import {pluginErrorUrl} from 'src/browser_routing';

import {Organization} from 'src/types/organization';
import {ErrorPageTypes} from 'src/constants';
import SectionList from 'src/components/backstage/sections/section_list';

import {OrganizationHeader} from './header';

export enum OrganizationSections {
    SectionSummary = 'product-summary',
    SectionGraph = 'product-graph',
    SectionTable = 'product-table',
    SectionChannelBox = 'product-channel-box',
}

const OrganizationDetails = () => {
    const {formatMessage} = useIntl();

    const teamId = useSelector(getCurrentTeamId);
    const {url, path, params: {organizationId}} = useRouteMatch<{organizationId: string}>();
    const {hash: urlHash} = useLocation();
    const maybeOrganization = useOrganization(organizationId);
    const organization = maybeOrganization as Organization;

    useForceDocumentTitle(organization.name ? (organization.name + ' - Organization') : 'Organization');

    // When first loading the page, the element with the ID corresponding to the URL
    // hash is not mounted, so the browser fails to automatically scroll to such section.
    // To fix this, we need to manually scroll to the component
    useEffect(() => {
        if (urlHash !== '') {
            setTimeout(() => {
                document.querySelector(urlHash)?.scrollIntoView();
            }, 300);
        }
    }, [urlHash]);

    // not found or error
    if (!maybeOrganization) {
        return <Redirect to={pluginErrorUrl(ErrorPageTypes.DEFAULT)}/>;
    }

    // Loading state
    if (!organization) {
        return null;
    }

    return (
        <Container>
            <MainWrapper>
                <Header>
                    <OrganizationHeader
                        organization={organization}
                        organizationId={organizationId}
                    />
                </Header>
                <Main>
                    <Body>
                        <NavBar>
                            {organization.sections.map((section, index) => {
                                if (index === 0) {
                                    return (
                                        <NavItem
                                            key={`nav-item-${section.id}`}
                                            to={`${url}`}
                                            exact={true}
                                        >
                                            {section.name}
                                        </NavItem>
                                    );
                                }
                                return (
                                    <NavItem
                                        key={`nav-item-${section.id}`}
                                        to={`${url}/${section.name}`}
                                        exact={true}
                                    >
                                        {section.name}
                                    </NavItem>
                                );
                            })}
                        </NavBar>
                        <Switch>
                            {organization.sections.map((section, index) => {
                                if (index === 0) {
                                    return (
                                        <Route
                                            key={`route-${section.id}`}
                                            path={`${path}`}
                                            exact={true}
                                        >
                                            <SectionList section={section}/>
                                        </Route>
                                    );
                                }
                                return (
                                    <Route
                                        key={`route-${section.id}`}
                                        path={`${path}/${section.name}`}
                                        exact={true}
                                    >
                                        <SectionList section={section}/>
                                    </Route>
                                );
                            })}
                        </Switch>
                    </Body>
                </Main>
            </MainWrapper>
        </Container>
    );
};

const RowContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(400px, 2fr) minmax(400px, 1fr);
    overflow-y: hidden;

    @media screen and (min-width: 1600px) {
        grid-auto-columns: 2.5fr 500px;
    }
`;

const MainWrapper = styled.div`
    display: grid;
    grid-template-rows: 56px 1fr;
    grid-auto-flow: row;
    overflow-y: hidden;
    grid-auto-columns: minmax(0, 1fr);
`;

const Main = styled.main`
    min-height: 0;
    padding: 0 20px 60px;
    display: grid;
    overflow-y: auto;
    place-content: start center;
    grid-auto-columns: min(780px, 100%);
`;

const Body = styled(RowContainer)`
`;

const Header = styled.header`
    height: 56px;
    min-height: 56px;
    background-color: var(--center-channel-bg);
`;

const NavItem = styled(NavLink)`
    display: flex;
    align-items: center;
    text-align: center;
    padding: 20px 30px;
    font-weight: 600;

    && {
        color: rgba(var(--center-channel-color-rgb), 0.64);

        :hover {
            color: var(--button-bg);
        }

        :hover,
        :focus {
            text-decoration: none;
        }
    }

    &.active {
        color: var(--button-bg);
        box-shadow: inset 0px -3px 0px 0px var(--button-bg);
    }
`;

const NavBar = styled.nav`
    display: flex;
    width: 100%;
    justify-content: center;
    grid-area: nav;
    z-index: 2;
`;

export default OrganizationDetails;