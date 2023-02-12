import React from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import {Section} from 'src/types/organization';
import {navigateToPluginUrl} from 'src/browser_routing';

//import {TableData} from 'src/components/widgets/table/table';
import Table, {TableData} from 'src/components/widgets/table/table';

import {useSectionData} from 'src/hooks';
import {ORGANIZATIONS_PATH} from 'src/constants';

type Props = {
    organizationId: string;
    section: Section;
};

type SectionListProps = {
    data: TableData;
    organizationId: string;
    section: Section;
    urlHash: string;
}

const buildSectionList = ({data, organizationId, section, urlHash}: SectionListProps) => {
    const {id, name} = section;
    function openOrganizationDetails(sectionName: string, sectionId: string) {
        navigateToPluginUrl(`/${ORGANIZATIONS_PATH}/${organizationId}/${sectionName.toLowerCase()}/${sectionId}`);
    }

    return (
        <Body>
            {data &&
                <Table
                    id={`${name}`}
                    data={data}
                    onClick={() => openOrganizationDetails(name, id)}
                    pointer={true}
                    urlHash={urlHash}
                />}
        </Body>
    );
};

const SectionList = ({organizationId, section}: Props) => {
    const {hash: urlHash} = useLocation();
    const data = useSectionData(section.url);
    return buildSectionList({data, organizationId, section, urlHash});
};

const RowContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Body = styled(RowContainer)`
`;

export default SectionList;