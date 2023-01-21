import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {GlobalState} from '@mattermost/types/store';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

const selectSiteName = (state: GlobalState) => getConfig(state).SiteName;

export function useForceDocumentTitle(title: string) {
    const siteName = useSelector(selectSiteName);

    // Restore original title
    useEffect(() => {
        const original = document.title;
        return () => {
            document.title = original;
        };
    }, []);

    // Update title
    useEffect(() => {
        document.title = title + ' - ' + siteName;
    }, [title, siteName]);
}
