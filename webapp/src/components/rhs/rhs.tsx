import React, {createContext, useEffect, useState} from 'react';
import {getCurrentChannelId} from 'mattermost-webapp/packages/mattermost-redux/src/selectors/entities/common';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import qs from 'qs';
import {useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {channelNameSelector, teamNameSelector} from 'src/selectors';
import {ToastProvider} from 'src/components/backstage/toast_banner';
import {useChannelById} from 'src/hooks';

import RHSWidgets from './rhs_widgets';

type SectionContextOptions = {
    parentId: string;
    sectionId: string;
};

export const IsRhsClosedContext = createContext(true);
export const FullUrlContext = createContext('');
export const SectionContext = createContext<SectionContextOptions>({parentId: '', sectionId: ''});

const RHS = 'sidebar-right';
export const RHS_OPEN = 'rhs-open';
export const ROOT = 'root';

const RHSView = () => {
    const [closed, setClosed] = useState(true);
    const updateClosed = () => {
        setClosed((prevClosed) => !prevClosed);
    };

    const {search} = useLocation();
    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const sectionIdParam = queryParams.sectionId as string;
    const parentIdParam = queryParams.parentId as string;

    const channelId = useSelector(getCurrentChannelId);
    const teamId = useSelector(getCurrentTeamId);
    const team = useSelector(teamNameSelector(teamId));
    const channel = useSelector(channelNameSelector(channelId));
    const fullUrl = `/${team.name}/channels/${channel.name}`;

    const channelByID = useChannelById(channelId);

    const sectionContextOptions: SectionContextOptions = {
        parentId: typeof parentIdParam === 'undefined' ? channelByID.parentId : parentIdParam,
        sectionId: typeof sectionIdParam === 'undefined' ? channelByID.sectionId : sectionIdParam,
    };

    useEffect(() => {
        // Select the node that will be observed for mutations
        const targetNode = document.getElementById(RHS) as HTMLElement;

        // Options for the observer (which mutations to observe)
        const config = {attributes: true};

        // Callback function to execute when mutations are observed
        const callback = (mutationList: any, observer: any) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'class') {
                        updateClosed();
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        return () => {
            // Later, you can stop observing
            observer.disconnect();
        };
    });

    return (
        <FullUrlContext.Provider value={fullUrl}>
            <IsRhsClosedContext.Provider value={closed}>
                <SectionContext.Provider value={sectionContextOptions}>
                    <ToastProvider>
                        <RHSWidgets
                            parentId={sectionContextOptions.parentId}
                            sectionId={sectionContextOptions.sectionId}
                        />
                    </ToastProvider>
                </SectionContext.Provider>
            </IsRhsClosedContext.Provider>
        </FullUrlContext.Provider>
    );
};

export default RHSView;