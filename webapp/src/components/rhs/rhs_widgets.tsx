import React, {useContext, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';
import {useScrollIntoView, useSection, useSectionInfo} from 'src/hooks';
import RhsSectionsWidgetsContainer from 'src/components/rhs/rhs_sections_widgets_container';
import {getSiteUrl} from 'src/clients';

import {FullUrlContext} from './rhs';

type Props = {
    parentId: string;
    sectionId: string;
};

const RHSWidgets = (props: Props) => {
    const {hash: urlHash} = useLocation();
    useScrollIntoView(urlHash);

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
            {(section && sectionInfo) ?
                <RhsSectionsWidgetsContainer
                    headerPath={`${getSiteUrl()}${fullUrl}?${SECTION_ID_PARAM}=${sectionId}&${PARENT_ID_PARAM}=${parentId}`}
                    name={sectionInfo.name}
                    url={fullUrl}
                    widgets={section?.widgets}
                /> : <FormattedMessage defaultMessage='The channel is not related to any section.'/>}
        </Container>
    );
};

const Container = styled.div`
    padding: 10px;
    overflow-y: auto;
`;

export default RHSWidgets;