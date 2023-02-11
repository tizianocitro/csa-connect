import React from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import {Section} from 'src/types/organization';
import {navigateToPluginUrl} from 'src/browser_routing';
import Table, {TableData} from 'src/components/widgets/table/table';
import {useSectionData} from 'src/hooks';

type Props = {
    section: Section;
};

const buildSectionList = (section: Section, data: TableData, urlHash: string) => {
    const {id, name} = section;
    function openOrganizationDetails(sectionName: string, sectionId: string) {
        navigateToPluginUrl(`/${sectionName}/${sectionId}`);
    }

    return (
        <Body>
            <Table
                caption={''}
                id={`${name}`}
                data={data}
                onClick={() => openOrganizationDetails(name, id)}
                pointer={true}
                urlHash={urlHash}
            />
        </Body>
    );
};

const SectionList = ({section}: Props) => {
    const {hash: urlHash} = useLocation();
    const data = useSectionData(section.url);
    return buildSectionList(section, data, urlHash);
};

const RowContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Body = styled(RowContainer)`
`;

export default SectionList;