import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';

import {useSection, useSectionInfo} from 'src/hooks';

import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';
import SectionsWidgetsContainerWithRhs from 'src/components/backstage/sections_widgets/rhs_sections_widgets_container';
import {getSiteUrl} from 'src/clients';

import {FullUrlContext} from './rhs';

type Props = {
    parentId: string;
    sectionId: string;
};

// Test: http://localhost:8065/lab/channels/demo?sectionId=0&parentId=0
const RHSWidgets = (props: Props) => {
    const [parentId, setParentId] = useState('');
    const [sectionId, setSectionId] = useState('');
    useEffect(() => {
        setParentId(props.parentId || '');
        setSectionId(props.sectionId || '');
    }, [props.parentId, props.sectionId]);
    const section = useSection(parentId);
    const sectionInfo = useSectionInfo(sectionId, section?.url);
    const fullUrl = useContext(FullUrlContext);
    return (
        <Container>
            {section && sectionInfo &&
                <SectionsWidgetsContainerWithRhs
                    headerPath={`${getSiteUrl()}${fullUrl}?${SECTION_ID_PARAM}=${sectionId}&${PARENT_ID_PARAM}=${parentId}`}
                    name={sectionInfo.name}
                    url={fullUrl}
                    widgets={section?.widgets}
                />}
        </Container>
    );
};

const Container = styled.div`
    padding: 10px;
`;

export default RHSWidgets;