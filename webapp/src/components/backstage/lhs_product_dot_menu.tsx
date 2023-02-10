// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {DotsVerticalIcon} from '@mattermost/compass-icons/components';

import DotMenu from 'src/components/dot_menu';

import {CopyOrganizationLinkMenuItem} from './organizations/controls';
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
                <CopyOrganizationLinkMenuItem
                    organizationId={organizationId}
                />
            </DotMenu>
        </>
    );
};
