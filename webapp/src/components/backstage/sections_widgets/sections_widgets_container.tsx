import React, {ReactNode, createContext} from 'react';

import {
    Body,
    Container,
    Header,
    Main,
    MainWrapper,
} from 'src/components/backstage/shared';
import {Section, Widget} from 'src/types/organization';
import {NameHeader} from 'src/components/backstage/header/header';
import Sections from 'src/components/backstage/sections/sections';
import Widgets from 'src/components/backstage/widgets/widgets';

export const IsRhsContext = createContext(false);

type Props = {
    headerPath: string;
    isRhs?: boolean;
    name: string;
    sectionPath?: string;
    sections?: Section[];
    url: string;
    widgets: Widget[];
    children?: ReactNode;
};

const SectionsWidgetsContainer = ({
    headerPath,
    isRhs = false,
    name,
    sectionPath,
    sections,
    url,
    widgets,
    children = [],
}: Props) => {
    return (
        <IsRhsContext.Provider value={isRhs}>
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
                            {sections && sectionPath &&
                                <Sections
                                    path={sectionPath}
                                    sections={sections}
                                    url={url}
                                />
                            }
                            <Widgets
                                widgets={widgets}
                            />
                            {children}
                        </Body>
                    </Main>
                </MainWrapper>
            </Container>
        </IsRhsContext.Provider>
    );
};

export default SectionsWidgetsContainer;