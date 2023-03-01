import React from 'react';
import styled from 'styled-components';

import {formatName, useSectionData} from 'src/hooks';
import PaginatedTable from 'src/components/backstage/widgets/paginated_table/paginated_table';
import {Section} from 'src/types/organization';

type Props = {
    section: Section;
};

const SectionList = ({section}: Props) => {
    const {id, internal, name} = section;
    const data = useSectionData(section);

    return (
        <Body>
            <PaginatedTable
                id={formatName(name)}
                internal={internal}
                name={name}
                data={data}
                parentId={id}
                pointer={true}
            />
        </Body>
    );
};

const Body = styled.div`
    display: flex;
    flex-direction: column;
`;

export default SectionList;