import React from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import {formatName, formatStringToLowerCase, useSectionData} from 'src/hooks';
import {PARENT_ID_PARAM} from 'src/constants';
import {Section} from 'src/types/organization';
import Table from 'src/components/backstage/widgets/table/table';
import {navigateToUrl} from 'src/browser_routing';

type Props = {
    path: string;
    section: Section;
};

const SectionList = ({path, section}: Props) => {
    const {hash: urlHash} = useLocation();
    const {id, name, url} = section;
    const data = useSectionData(url);
    const openOrganizationDetails = (resourceId: string) => {
        navigateToUrl(`${path}/${formatStringToLowerCase(name)}/${resourceId}?${PARENT_ID_PARAM}=${id}`);
    };

    return (
        <Body>
            <Table
                id={formatName(name)}
                isSection={true}
                data={data}
                open={openOrganizationDetails}
                parentId={section.id}
                pointer={true}
                urlHash={urlHash}
            />
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