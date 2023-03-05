import React, {useContext, useEffect} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {
    useForceDocumentTitle,
    useScrollIntoView,
    useSection,
    useSectionInfo,
} from 'src/hooks';
import {PARENT_ID_PARAM} from 'src/constants';
import SectionsWidgetsContainer from 'src/components/backstage/sections_widgets/sections_widgets_container';
import {getSiteUrl} from 'src/clients';
import {IsEcosystemContext} from 'src/components/backstage/organizations/ecosystem/ecosystem_details';
import EcosystemPaginatedTableWrapper from 'src/components/backstage/widgets/paginated_table/ecosystem_wrapper';

import {SECTION_NAV_ITEM, SECTION_NAV_ITEM_ACTIVE} from './sections';

const SectionDetails = () => {
    const {url, path, params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {hash: urlHash, search} = useLocation();
    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const parentIdParam = queryParams.parentId as string;

    const section = useSection(parentIdParam);
    const sectionInfo = useSectionInfo(sectionId, section.url);
    const isEcosystem = useContext(IsEcosystemContext);

    useForceDocumentTitle(sectionInfo.name ? (sectionInfo.name) : 'Section');

    useScrollIntoView(urlHash);

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
        isEcosystem ?
            <SectionsWidgetsContainer
                headerPath={`${getSiteUrl()}${url}?${PARENT_ID_PARAM}=${section.id}`}
                name={sectionInfo.name}
                url={url}
                widgets={section.widgets}
                childrenBottom={false}
            >
                <EcosystemPaginatedTableWrapper elements={sectionInfo.elements}/>
            </SectionsWidgetsContainer> :
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