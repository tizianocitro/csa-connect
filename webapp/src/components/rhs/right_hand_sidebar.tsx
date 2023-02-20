import React, {createContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import qs from 'qs';
import {getCurrentChannelId} from 'mattermost-webapp/packages/mattermost-redux/src/selectors/entities/common';
import {getCurrentTeamId, getTeam} from 'mattermost-redux/selectors/entities/teams';
import {getChannel} from 'mattermost-redux/selectors/entities/channels';
import {GlobalState} from 'mattermost-webapp/packages/types/src/store';
import {Team} from 'mattermost-webapp/packages/types/src/teams';
import {Channel} from 'mattermost-webapp/packages/types/src/channels';

import {useSection, useSectionInfo} from 'src/hooks';
import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';
import SectionsWidgetsContainerWithRhs from 'src/components/backstage/sections_widgets/rhs_sections_widgets_container';
import {getSiteUrl} from 'src/clients';
import {ToastProvider} from 'src/components/backstage/toast_banner';

type SectionContextOptions = {
    parentId: string;
    sectionId: string;
};

export const IsRhsClosedContext = createContext(true);
export const FullUrlContext = createContext('');
export const SectionContext = createContext<SectionContextOptions>({parentId: '', sectionId: ''});

const teamNameSelector = (teamId: string) => (state: GlobalState): Team => getTeam(state, teamId);
const channelNameSelector = (channelId: string) => (state: GlobalState): Channel => getChannel(state, channelId);

// Test: http://localhost:8065/lab/channels/demo?sectionId=0&parentId=0
const RHSView = () => {
    const [closed, setClosed] = useState(true);
    const updateClosed = () => {
        setClosed((prevClosed) => !prevClosed);
    };
    const resetClosed = () => {
        setClosed(true);
    };

    const {search} = useLocation();
    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const sectionIdParam = queryParams.sectionId as string;
    const parentIdParam = queryParams.parentId as string;
    const sectionContextOptions: SectionContextOptions = {parentId: parentIdParam, sectionId: sectionIdParam};
    const section = useSection(parentIdParam);
    const sectionInfo = useSectionInfo(sectionIdParam, section.url);

    const channelId = useSelector(getCurrentChannelId);
    const teamId = useSelector(getCurrentTeamId);
    const team = useSelector(teamNameSelector(teamId));
    const channel = useSelector(channelNameSelector(channelId));

    const fullUrl = `/${team.name}/channels/${channel.name}`;

    useEffect(() => {
        resetClosed();
    }, [channelId]);

    useEffect(() => {
        (document.getElementsByClassName('sidebar--right__expand btn-icon')[0] as HTMLElement).
            addEventListener('click', updateClosed);

        return () => {
            (document.getElementsByClassName('sidebar--right__expand btn-icon')[0] as HTMLElement).
                removeEventListener('click', updateClosed);
        };
    }, [closed]);

    return (
        <Container>
            <h1>
                {`${closed} - ${channel.display_name}`}
            </h1>
            <br/>
            <FullUrlContext.Provider value={fullUrl}>
                <IsRhsClosedContext.Provider value={closed}>
                    <SectionContext.Provider value={sectionContextOptions}>
                        <ToastProvider>
                            <SectionsWidgetsContainerWithRhs
                                headerPath={`${getSiteUrl()}${fullUrl}?${SECTION_ID_PARAM}=${section.id}&${PARENT_ID_PARAM}=${parentIdParam}`}
                                name={sectionInfo.name}
                                url={fullUrl}
                                widgets={section.widgets}
                            />
                        </ToastProvider>
                    </SectionContext.Provider>
                </IsRhsClosedContext.Provider>
            </FullUrlContext.Provider>
        </Container>
    );
};

const Container = styled.div`
    padding: 10px;
`;

export default RHSView;