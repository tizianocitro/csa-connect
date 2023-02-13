// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {DotsVerticalIcon} from '@mattermost/compass-icons/components';

import DotMenu from 'src/components/dot_menu';
import {getSiteUrl} from 'src/clients';
import {DEFAULT_PATH, ORGANIZATIONS_PATH} from 'src/constants';

import {CopyLinkMenuItem} from './header/controls';
import {DotMenuButtonStyled} from './shared';

interface Props {
    organizationId: string;
}

export const LHSOrganizationDotMenu = ({organizationId}: Props) => {
    return (
        <>
            <DotMenu
                placement='bottom-start'
                icon={(
                    <DotsVerticalIcon
                        size={14.4}
                        color={'var(--button-color)'}
                    />
                )}
                dotMenuButton={DotMenuButtonStyled}
            >
                <CopyLinkMenuItem
                    path={getSiteUrl() + '/' + DEFAULT_PATH + '/' + ORGANIZATIONS_PATH + '/' + organizationId}
                />
            </DotMenu>
        </>
    );
};
