import React, {ElementType, useContext} from 'react';
import {Collapse} from 'antd';
import styled from 'styled-components';

import {AccordionData} from 'src/types/accordion';
import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {IsEcosystemRhsContext} from 'src/components/rhs/rhs_widgets';
import {FullUrlContext} from 'src/components/rhs/rhs';
import {buildQuery, formatName} from 'src/hooks';

const {Panel} = Collapse;

type AccordionChildProps = {
    element: AccordionData;
    [key: string]: any;
};

type Props = {
    name: string;
    elements: AccordionData[];
    parentId: string;
    sectionId: string;
    childComponent: ElementType<AccordionChildProps>;
    [key: string]: any;
};

const Accordion = ({
    name,
    elements,
    parentId,
    sectionId,
    childComponent: ChildComponent,
    ...props
}: Props) => {
    const isEcosystemRhs = useContext(IsEcosystemRhsContext);
    const fullUrl = useContext(FullUrlContext);

    const id = `${formatName(name)}-${sectionId}-${parentId}-widget`;

    return (
        <Container
            id={id}
            data-testid={id}
        >
            <Header>
                <AnchorLinkTitle
                    fullUrl={fullUrl}
                    id={id}
                    query={isEcosystemRhs ? '' : buildQuery(parentId, sectionId)}
                    text={name}
                    title={name}
                />
            </Header>
            {elements && elements.length > 0 &&
                <Collapse
                    defaultActiveKey={[elements[0].id]}
                    accordion={true}
                >
                    {elements.map((element) => (
                        <Panel
                            key={element.id}
                            header={element.name}
                        >
                            <ChildComponent
                                element={element}
                                {...props}
                            />
                        </Panel>
                    ))}
                </Collapse>}
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default Accordion;
