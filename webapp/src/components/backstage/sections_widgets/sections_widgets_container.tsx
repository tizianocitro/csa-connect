import React from 'react';

import {
    Body,
    Container,
    Header,
    Main,
    MainWrapper,
} from 'src/components/backstage/shared';
import Widgets from 'src/components/backstage/widgets/widgets';
import {NameHeader} from 'src/components/backstage/header/header';
import {Section, Widget} from 'src/types/organization';
import Sections from 'src/components/backstage/sections/sections';

type Props = {
    headerPath: string;
    parentId: string;
    name: string;
    sectionPath: string;
    sections: Section[];
    url: string;
    widgets: Widget[];
}

const SectionsWidgetsContainer = ({
    headerPath,
    parentId,
    name,
    sectionPath,
    sections,
    url,
    widgets,
}: Props) => {
    return (
        <Container>
            <MainWrapper>
                <Header>
                    <NameHeader
                        path={headerPath}
                        name={name}
                    />
                </Header>
                <Main>
                    <Body>
                        <Sections
                            path={sectionPath}
                            sections={sections}
                            url={url}
                        />
                        <Widgets
                            parentId={parentId}
                            widgets={widgets}
                        />
                    </Body>
                </Main>
            </MainWrapper>
        </Container>
    );
};

export default SectionsWidgetsContainer;