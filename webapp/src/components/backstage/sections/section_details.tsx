import React, {useEffect} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import qs from 'qs';

import {useForceDocumentTitle, useSection, useSectionInfo} from 'src/hooks';
import {getSiteUrl} from 'src/clients';
import {SECTION_ID_PARAM} from 'src/constants';
import SectionsWidgetsContainer from 'src/components/backstage/sections_widgets/sections_widgets_container';

import {SECTION_NAV_ITEM, SECTION_NAV_ITEM_ACTIVE} from './sections';

const SectionDetails = () => {
    const {url, path, params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {hash: urlHash} = useLocation();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});

    const section = useSection(queryParams.sectionId as string);
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
        const elements = document.getElementsByClassName(`${SECTION_NAV_ITEM}`);
        let htmlElement: HTMLElement;
        for (let i = 0; i < elements.length; i++) {
            htmlElement = elements[i] as HTMLElement;
            if (htmlElement.innerText === section.name) {
                htmlElement.classList.add(`${SECTION_NAV_ITEM_ACTIVE}`);
                break;
            }
        }
        return () => {
            if (htmlElement) {
                htmlElement.classList.remove(`${SECTION_NAV_ITEM_ACTIVE}`);
            }
        };
    }, [section]);

    // Loading state
    if (!section) {
        return null;
    }

    return (
        <SectionsWidgetsContainer
            headerPath={`${getSiteUrl()}${url}?${SECTION_ID_PARAM}=${section.id}`}
            name={sectionInfo.name}
            parentId={sectionId}
            sectionPath={path}
            sections={section.sections}
            url={url}
            widgets={section.widgets}
        />
    );
};

export default SectionDetails;