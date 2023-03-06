import React, {ElementType} from 'react';
import {Collapse} from 'antd';

import {AccordionData} from 'src/types/accordion';

const {Panel} = Collapse;

type AccordionChildProps = {
    element: AccordionData;
    [key: string]: any;
};

type Props = {
    elements: AccordionData[];
    childComponent: ElementType<AccordionChildProps>;
    [key: string]: any;
};

const Accordion = ({elements, childComponent: ChildComponent, ...props}: Props) => {
    return (
        <>
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
        </>
    );
};

export default Accordion;
