import React, {useContext} from 'react';

import {Widget} from 'src/types/organization';
import {IsRhsContext} from 'src/components/backstage/sections_widgets/sections_widgets_container';

import ChannelsWrapper from './channels/channels_wrapper';
import GraphWrapper from './graph/graph_wrapper';
import TableWrapper from './table/table_wrapper';
import TextBoxWrapper from './text_box/text_box_wrapper';

export enum WidgetType {
    Channels = 'channels',
    Graph = 'graph',
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
    const isRhs = useContext(IsRhsContext);
    const channelWidgets = filterWidgetsByType(widgets, WidgetType.Channels);
    const graphWidgets = filterWidgetsByType(widgets, WidgetType.Graph);
    const tableWidgets = filterWidgetsByType(widgets, WidgetType.Table);
    const textBoxWidgets = filterWidgetsByType(widgets, WidgetType.TextBox);
    return (
        <>
            {graphWidgets.map(({name, url}, index) => (
                <GraphWrapper
                    key={`${name}-${index}`}
                    name={name}
                    url={url}
                />
            ))}
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
            {channelWidgets.length > 0 && !isRhs &&
                <ChannelsWrapper/>
            }
        </>
    );
};

export default Widgets;