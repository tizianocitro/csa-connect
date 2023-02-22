import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import qs from 'qs';
import {getCurrentChannelId} from 'mattermost-webapp/packages/mattermost-redux/src/selectors/entities/common';

export const ChannelHeaderButtonIcon = () => {
    const channelId = useSelector(getCurrentChannelId);
    const icon = useRef<HTMLElement>(null);

    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});

    // const parent = document.getElementById('open-product-rhs')?.parentElement;
    useEffect(() => {
        const parent = icon.current?.parentElement;
        if (typeof queryParams.from === 'undefined') {
            parent?.click();
        }
        return () => {
            if (typeof queryParams.from === 'undefined') {
                parent?.click();
            }
        };
    }, [channelId]);

    useEffect(() => {
        const parent = icon.current?.parentElement;
        let timer: NodeJS.Timer;
        if (typeof queryParams.from !== 'undefined') {
            timer = setTimeout(() => parent?.click(), 300);
        }
        return () => {
            if (typeof queryParams.from !== 'undefined') {
                clearTimeout(timer);
            }
        };
    }, [channelId]);

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