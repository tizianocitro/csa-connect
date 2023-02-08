import React from 'react';
import {useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';

import {getCurrentChannelId} from 'mattermost-webapp/packages/mattermost-redux/src/selectors/entities/common';
import {getCurrentTeamId, getTeam} from 'mattermost-redux/selectors/entities/teams';
import {getChannel} from 'mattermost-redux/selectors/entities/channels';
import {GlobalState} from 'mattermost-webapp/packages/types/src/store';
import {Team} from 'mattermost-webapp/packages/types/src/teams';
import {Channel} from 'mattermost-webapp/packages/types/src/channels';

import {useProduct} from 'src/hooks';
import {Product} from 'src/types/product';
import Table from 'src/components/backstage/products/table/table';

export enum RhsSections {
    SectionTable = 'product-table',
}

const teamNameSelector = (teamId: string) => (state: GlobalState): Team => getTeam(state, teamId);
const channelNameSelector = (channelId: string) => (state: GlobalState): Channel => getChannel(state, channelId);

const RHSView = () => {
    const maybeProduct = useProduct('1');
    const product = maybeProduct as Product;
    const {hash: urlHash} = useLocation();

    const channelID = useSelector(getCurrentChannelId);
    const teamId = useSelector(getCurrentTeamId);
    const team = useSelector(teamNameSelector(teamId));
    const channel = useSelector(channelNameSelector(channelID));

    const fullUrl = `${team.name}/channels/${channel.name}`;
    return (
        <div style={style.rhs}>
            <h1>
                <FormattedMessage defaultMessage='Whatever'/>
            </h1>
            <br/>
            <Table
                id={RhsSections.SectionTable}
                product={product}
                urlHash={urlHash}
                fullUrl={fullUrl}
            />
        </div>
    );
};

const style = {
    rhs: {
        padding: '10px',
    },
};

export default RHSView;