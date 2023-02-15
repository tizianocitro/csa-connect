import React from 'react';

import {Widget} from 'src/types/organization';

import TextBoxWrapper from './text-box/text-box-wrapper';

export enum WidgetType {
    Table = 'table',
    TextBox = 'text-box',
}

type Props = {
    parentId: string;
    widgets: Widget[];
};

const filterWidgetsByType = (widgets: Widget[], type: string) => {
    return widgets.filter((widget) => widget.type === type);
};

// const tableWidgets = filterWidgetsByType(widgets, WidgetType.Table);
const Widgets = ({parentId, widgets}: Props) => {
    const textBoxWidgets = filterWidgetsByType(widgets, WidgetType.TextBox);
    return (
        <>
            {textBoxWidgets.map(({name, url}, index) => (
                <TextBoxWrapper
                    key={`${name}-${index}`}
                    name={name}
                    parentId={parentId}
                    url={url}
                />
            ))}
        </>
    );
};

export default Widgets;