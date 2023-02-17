import React from 'react';

import {Widget} from 'src/types/organization';

import ChannelsWrapper from './channels/channels_wrapper';
import GraphWrapper from './graph/graph_wrapper';
import TableWrapper from './table/table_wrapper';
import TextBoxWrapper from './text_box/text_box_wrapper';

export enum WidgetType {
    Channels = 'channels',
    Table = 'table',
    TextBox = 'text-box',
}

type Props = {
    widgets: Widget[];
};

const filterWidgetsByType = (widgets: Widget[], type: string) => {
    return widgets.filter((widget) => widget.type === type);
};

const Widgets = ({widgets}: Props) => {
    const textBoxWidgets = filterWidgetsByType(widgets, WidgetType.TextBox);
    const tableWidgets = filterWidgetsByType(widgets, WidgetType.Table);
    const channelWidgets = filterWidgetsByType(widgets, WidgetType.Channels);
    return (
        <>
            <GraphWrapper
                name={'My Graph'}
                url={''}
            />
            {textBoxWidgets.map(({name, url}, index) => (
                <TextBoxWrapper
                    key={`${name}-${index}`}
                    name={name}
                    url={url}
                />
            ))}
            {tableWidgets.map(({name, url}, index) => (
                <TableWrapper
                    key={`${name}-${index}`}
                    name={name}
                    url={url}
                />
            ))}
            {channelWidgets.length > 0 &&
                <ChannelsWrapper/>
            }
        </>
    );
};

export default Widgets;