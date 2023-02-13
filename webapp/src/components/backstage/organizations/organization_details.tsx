// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {useForceDocumentTitle, useOrganization} from 'src/hooks';
import Sections from 'src/components/backstage/sections//sections';
import Widgets from 'src/components/backstage/widgets/widgets';
import {
    Body,
    Container,
    Header,
    Main,
    MainWrapper,
} from 'src/components/backstage/shared';
import {getSiteUrl} from 'src/clients';
import {DEFAULT_PATH, ORGANIZATIONS_PATH} from 'src/constants';
import {NameHeader} from 'src/components/backstage/header/header';

const OrganizationDetails = () => {
    const teamId = useSelector(getCurrentTeamId);
    const {url, path, params: {organizationId}} = useRouteMatch<{organizationId: string}>();
    const {hash: urlHash} = useLocation();
    const organization = useOrganization(organizationId);

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

    // Loading state
    if (!organization) {
        return null;
    }

    return (
        <Container>
            <MainWrapper>
                <Header>
                    <NameHeader
                        path={getSiteUrl() + '/' + DEFAULT_PATH + '/' + ORGANIZATIONS_PATH + '/' + organization?.id}
                        name={organization.name}
                    />
                </Header>
                <Main>
                    <Body>
                        <Sections
                            path={path}
                            sections={organization.sections}
                            url={url}
                        />
                        <Widgets widgets={organization.widgets}/>
                    </Body>
                </Main>
            </MainWrapper>
        </Container>
    );
};

export default OrganizationDetails;