import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

// import {FormattedMessage} from 'react-intl';
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
    const [status, setStatus] = useState('Closed');
    const updateStatus = () => {
        if (status === 'Closed') {
            setStatus('Open');
        } else {
            setStatus('Closed');
        }
    };
    const resetStatus = () => {
        setStatus('Closed');
    };

    // const [closed, setClosed] = useState(false);
    // const updateClosed = () => {
    //     setClosed(true);
    // };
    // const resetClosed = () => {
    //     setClosed(false);
    // };

    // TODO: Make the productId dynamic using an API that gives back the id given the channel name
    // If the channel is not associated to a product, show a message that tells so
    const maybeProduct = useProduct('1');
    const product = maybeProduct as Product;
    const {hash: urlHash} = useLocation();

    const channelID = useSelector(getCurrentChannelId);
    const teamId = useSelector(getCurrentTeamId);
    const team = useSelector(teamNameSelector(teamId));
    const channel = useSelector(channelNameSelector(channelID));
    const fullUrl = `${team.name}/channels/${channel.name}`;

    useEffect(() => {
        resetStatus();
    }, [channelID]);

    useEffect(() => {
        (document.getElementsByClassName('sidebar--right__expand btn-icon')[0] as HTMLElement).addEventListener('click', updateStatus);

        return () => {
            (document.getElementsByClassName('sidebar--right__expand btn-icon')[0] as HTMLElement).removeEventListener('click', updateStatus);
        };
    }, [status]);

    // useEffect(() => {
    //    if (closed) {
    //    const parent = document.getElementById('open-product-rhs')?.parentElement;
    //    parent?.click();
    //        resetClosed();
    //    }
    // }, [channelID]);

    // document.getElementsByClassName('icon icon-close')[0].click();
    // useEffect(() => {
    //    (document.getElementsByClassName('icon icon-close')[0] as HTMLElement)?.addEventListener('click', updateClosed);
    //    return () => {
    //        (document.getElementsByClassName('icon icon-close')[0] as HTMLElement)?.removeEventListener('click', updateStatus);
    //    };
    // }, [closed]);

    return (
        <div style={style.rhs}>
            <h1>
                {`${status} - ${channel.display_name}`}
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