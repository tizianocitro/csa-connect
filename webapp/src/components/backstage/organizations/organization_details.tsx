import React, {useEffect} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';

import {useForceDocumentTitle, useOrganization} from 'src/hooks';
import {getSiteUrl} from 'src/clients';
import {DEFAULT_PATH, ORGANIZATIONS_PATH} from 'src/constants';
import SectionsWidgetsContainer from 'src/components/backstage/sections_widgets/sections_widgets_container';

const OrganizationDetails = () => {
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
        <SectionsWidgetsContainer
            headerPath={`${getSiteUrl()}/${DEFAULT_PATH}/${ORGANIZATIONS_PATH}/${organization.id}`}
            name={organization.name}
            sectionPath={path}
            sections={organization.sections}
            url={url}
            widgets={organization.widgets}
        />
    );
};

export default OrganizationDetails;