import React from 'react';

import {
    Body,
    Container,
    Header,
    Main,
    MainWrapper,
} from 'src/components/backstage/shared';
import {NameHeader} from 'src/components/backstage/header/header';
import Accordion from 'src/components/backstage/widgets/accordion/accordion';
import {SectionInfo} from 'src/types/organization';

import EcosystemAccordionChild from './ecosystem_accordion_child';

type Props = {
    headerPath: string;
    parentId: string;
    sectionId: string;
    sectionInfo: SectionInfo;
};

const EcosystemRhs = ({
    headerPath,
    parentId,
    sectionId,
    sectionInfo,
}: Props) => {
    return (
        <Container>
            <MainWrapper>
                <Header>
                    <NameHeader
                        path={headerPath}
                        name={sectionInfo.name}
                    />
                </Header>
                <Main>
                    <Body>
                        <Accordion
                            name={`${sectionInfo.name} Elements`}
                            childComponent={EcosystemAccordionChild}
                            elements={sectionInfo.elements}
                            parentId={parentId}
                            sectionId={sectionId}
                        />
                    </Body>
                </Main>
            </MainWrapper>
        </Container>
    );
};

export default EcosystemRhs;