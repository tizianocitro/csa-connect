import React, {useContext} from 'react';

import {IsRhsContext} from 'src/components/backstage/sections_widgets/sections_widgets_container';
import {Widget} from 'src/types/organization';

import ChannelsWrapper from './channels/wrappers/channels_wrapper';
import GraphWrapper from './graph/wrappers/graph_wrapper';
import PaginatedTableWrapper from './paginated_table/wrappers/paginated_table_wrapper';
import SingleChannelWrapper from './single_channel/wrappers/single_channel_wrapper';
import TableWrapper from './table/wrappers/table_wrapper';
import TextBoxWrapper from './text_box/wrappers/text_box_wrapper';

export enum WidgetType {
    Channels = 'channels',
    Graph = 'graph',
    PaginatedTable = 'paginated-table',
    SingleChannel = 'channel',
    Table = 'table',
    TextBox = 'text-box',
}

type Props = {
    widgets: Widget[];
};

const buildWidgetByType = (
    {name, type, url}: Widget,
    index: number,
): JSX.Element => {
    const key = `${name}-${type}-${index}`;
    const props = {key, name, url};

    switch (type) {
    case WidgetType.Graph:
        return <GraphWrapper {...props}/>;
    case WidgetType.PaginatedTable:
        return <PaginatedTableWrapper {...props}/>;
    case WidgetType.Table:
        return <TableWrapper {...props}/>;
    case WidgetType.TextBox:
        return <TextBoxWrapper {...props}/>;
    default:
        return <></>;
    }
};

const filterWidgetsByType = (widgets: Widget[], type: string): Widget[] => {
    if (!widgets) {
        return [];
    }
    return widgets.filter((widget) => widget.type === type);
};

const Widgets = ({widgets}: Props) => {
    const isRhs = useContext(IsRhsContext);
    const channelsWidgets = filterWidgetsByType(widgets, WidgetType.Channels);
    const singleChannelWidgets = filterWidgetsByType(widgets, WidgetType.SingleChannel);

    return (
        <>
            {widgets && widgets.map((widget, index) => buildWidgetByType(widget, index))}
            {channelsWidgets.length > 0 && !isRhs &&
                <ChannelsWrapper/>
            }
            {singleChannelWidgets.length > 0 && !isRhs &&
                <SingleChannelWrapper/>
            }
        </>
    );
};

export default Widgets;