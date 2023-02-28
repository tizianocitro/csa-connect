import React from 'react';
import styled from 'styled-components';

import {formatName, useSectionData} from 'src/hooks';
import PaginatedTable from 'src/components/backstage/widgets/paginated_table/paginated_table';
import {Section} from 'src/types/organization';

type Props = {
    section: Section;
};

const SectionList = ({section}: Props) => {
    const {name} = section;
    const data = useSectionData(section);

    return (
        <Body>
            <PaginatedTable
                id={formatName(name)}
                data={data}
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