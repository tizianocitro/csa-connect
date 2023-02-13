import React from 'react';

import {Widget} from 'src/types/organization';

type Props = {
    widgets: Widget[];
};

const Widgets = ({widgets}: Props) => {
    return (
        <div>
            {JSON.stringify(widgets)}
        </div>
    );
};

export default Widgets;