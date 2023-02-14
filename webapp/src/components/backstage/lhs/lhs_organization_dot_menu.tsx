// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {DotsVerticalIcon} from '@mattermost/compass-icons/components';

import DotMenu from 'src/components/dot_menu';
import {getSiteUrl} from 'src/clients';
import {DEFAULT_PATH, ORGANIZATIONS_PATH} from 'src/constants';
import {CopyLinkMenuItem} from 'src/components/backstage/header/controls';
import {DotMenuButtonStyled} from 'src/components/backstage/shared';

interface Props {
    organizationId: string;
    organizationName: string;
}

export const LHSOrganizationDotMenu = ({organizationId, organizationName}: Props) => {
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
                    path={`${getSiteUrl()}/${DEFAULT_PATH}/${ORGANIZATIONS_PATH}/${organizationId}`}
                    text={organizationName}
                />
            </DotMenu>
        </>
    );
};
