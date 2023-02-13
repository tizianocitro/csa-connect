import React from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import {Section} from 'src/types/organization';
import {navigateToUrl} from 'src/browser_routing';
import Table from 'src/components/backstage/widgets/table/table';
import {useSectionData} from 'src/hooks';

type Props = {
    path: string;
    section: Section;
};

const SectionList = ({path, section}: Props) => {
    const {hash: urlHash} = useLocation();
    const {name, url} = section;
    const data = useSectionData(url);
    const openOrganizationDetails = (sectionId: string) => {
        navigateToUrl(`${path}/${name.toLowerCase()}/${sectionId}`);
    };
    return (
        <Body>
            {data &&
                <Table
                    id={`${name}`}
                    data={data}
                    open={openOrganizationDetails}
                    pointer={true}
                    urlHash={urlHash}
                />}
        </Body>
    );
};

const RowContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Body = styled(RowContainer)`
`;

export default SectionList;