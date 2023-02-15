import React from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import qs from 'qs';

import ChannelsSection from './channels';

const ChannelsWrapper = () => {
    const {params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const parentId = queryParams.sectionId as string;
    const teamId = useSelector(getCurrentTeamId);
    return (
        <ChannelsSection
            parentId={parentId}
            sectionId={sectionId}
            teamId={teamId}
        />
    );
};

export default ChannelsWrapper;