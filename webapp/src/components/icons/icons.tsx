import React, {useEffect, useRef} from 'react';
import {getCurrentChannelId} from 'mattermost-webapp/packages/mattermost-redux/src/selectors/entities/common';
import {useSelector} from 'react-redux';

import {RHS_OPEN, ROOT} from 'src/components/rhs/rhs';

export const ChannelHeaderButtonIcon = () => {
    const channelId = useSelector(getCurrentChannelId);
    const icon = useRef<HTMLElement>(null);

    useEffect(() => {
        const iconButton = icon.current?.parentElement;
        const root = document.getElementById(ROOT) as HTMLElement;
        if (!root.classList.contains(RHS_OPEN)) {
            iconButton?.click();
        }
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