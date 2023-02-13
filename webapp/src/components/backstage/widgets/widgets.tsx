import React from 'react';

import {Widget} from 'src/types/organization';

type Props = {
    widgets: Widget[];
};

const Widgets = ({widgets}: Props) => {
    return (
        <div>
            {(widgets && widgets.length > 0) && JSON.stringify(widgets, null, 2)}
        </div>
    );
};

export default Widgets;