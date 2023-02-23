import React, {useEffect} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {useForceDocumentTitle, useSection, useSectionInfo} from 'src/hooks';
import {getSiteUrl} from 'src/clients';
import {PARENT_ID_PARAM} from 'src/constants';
import SectionsWidgetsContainer from 'src/components/backstage/sections_widgets/sections_widgets_container';

import {SECTION_NAV_ITEM, SECTION_NAV_ITEM_ACTIVE} from './sections';

const SectionDetails = () => {
    const {url, path, params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {hash: urlHash} = useLocation();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const parentIdParam = queryParams.parentId as string;

    const section = useSection(parentIdParam);
    const sectionInfo = useSectionInfo(sectionId, section.url);

    useForceDocumentTitle(sectionInfo.name ? (sectionInfo.name) : 'Section');

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

    useEffect(() => {
        const navItems = document.getElementsByClassName(SECTION_NAV_ITEM) as HTMLCollectionOf<HTMLElement>;
        let currentNavItem: HTMLElement;
        for (let i = 0; i < navItems.length; i++) {
            currentNavItem = navItems[i];
            const isCurrentNavItem = currentNavItem.innerText === section.name;
            if (isCurrentNavItem) {
                currentNavItem.classList.add(SECTION_NAV_ITEM_ACTIVE);
                break;
            }
        }
        return () => {
            let isAnotherNavItemActive = false;
            for (let i = 0; i < navItems.length; i++) {
                const isNotCurrentNavItem = navItems[i].innerText !== currentNavItem.innerText;
                const isNextCurrentNavItem = navItems[i].classList.contains(SECTION_NAV_ITEM_ACTIVE);
                if (isNotCurrentNavItem && isNextCurrentNavItem) {
                    isAnotherNavItemActive = true;
                    break;
                }
            }
            if (isAnotherNavItemActive && currentNavItem) {
                currentNavItem.classList.remove(SECTION_NAV_ITEM_ACTIVE);
            }
        };
    }, [parentIdParam]);

    // Loading state
    if (!section) {
        return null;
    }

    return (
        <SectionsWidgetsContainer
            headerPath={`${getSiteUrl()}${url}?${PARENT_ID_PARAM}=${section.id}`}
            name={sectionInfo.name}
            sectionPath={path}
            sections={section.sections}
            url={url}
            widgets={section.widgets}
        />
    );
};

export default SectionDetails;