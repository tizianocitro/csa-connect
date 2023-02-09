import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';

// import qs from 'qs';
// import {useLocation} from 'react-router-dom';
import {getCurrentChannelId} from 'mattermost-webapp/packages/mattermost-redux/src/selectors/entities/common';

export const ChannelHeaderButtonIcon = () => {
    const channelID = useSelector(getCurrentChannelId);
    const icon = useRef<HTMLElement>(null);

    // const location = useLocation();
    // const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});

    // const parent = document.getElementById('open-product-rhs')?.parentElement;
    useEffect(() => {
        const parent = icon.current?.parentElement;
        parent?.click();
        return () => {
            parent?.click();
        };
    }, [channelID]);

    /* const updateStorage = () => {
        localStorage.setItem('refresh', 'true');
    };
    useEffect(() => {
        window.addEventListener('beforeunload', updateStorage);
        return () => {
            window.removeEventListener('beforeunload', updateStorage);
        };
    }, []);

    useEffect(() => {
        if (localStorage.getItem('refresh') === 'true') {
            const parent = icon.current?.parentElement;
            parent?.click();
            localStorage.setItem('refresh', 'false');
        }
    }, []); */

    return (
        <i
            className='icon fa fa-plug'
            style={{fontSize: '15px', position: 'relative', top: '-1px'}}
            id={'open-product-rhs'}
            ref={icon}
        />
    );
};

export const MainMenuMobileIcon = () => (
    <i className='icon fa fa-plug'/>
);