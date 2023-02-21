import React from 'react';

import {Widget} from 'src/types/organization';
import SectionsWidgetsContainer from 'src/components/backstage/sections_widgets/sections_widgets_container';

type Props = {
    headerPath: string;
    name: string;
    url: string;
    widgets: Widget[];
}

const RhsSectionsWidgetsContainer = (props: Props) => {
    return (
        <SectionsWidgetsContainer
            {...props}
            isRhs={true}
        />
    );
};

export default RhsSectionsWidgetsContainer;