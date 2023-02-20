import React from 'react';

import {Section, Widget} from 'src/types/organization';

import SectionsWidgetsContainer from './sections_widgets_container';

type Props = {
    headerPath: string;
    isRhs?: boolean;
    name: string;
    sectionPath?: string;
    sections?: Section[];
    url: string;
    widgets: Widget[];
}

const SectionsWidgetsContainerWithRhs = (props: Props) => {
    return (
        <SectionsWidgetsContainer
            {...props}
            isRhs={true}
        />
    );
};

export default SectionsWidgetsContainerWithRhs;