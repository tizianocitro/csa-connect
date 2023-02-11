// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DateTime} from 'luxon';

export const OVERLAY_DELAY = 400;

export enum ErrorPageTypes {
    DEFAULT = 'default',
}

export const TEMPLATE_TITLE_KEY = 'template_title';

export const BACKSTAGE_LIST_PER_PAGE = 15;

export const DateTimeFormats = {
    // eslint-disable-next-line no-undefined
    DATE_MED_NO_YEAR: {...DateTime.DATE_MED, year: undefined},
};

export const PRODUCT_NAME = 'CS-AWARE CONNECT';

export const DEFAULT_PATH = 'cs-aware-connect';

export const ORGANIZATIONS_PATH = 'organizations';
export const ORGANIZATION_PATH = 'organization';

export const STORIES_PATH = 'stories';
export const POLICIES_PATH = 'policies';

// In case you change this, pay attention to change the files
// where it was not possible to use the constant
export const ORGANIZATION_ID_PARAM = 'organizationId';

export const ECOSYSTEM = 'ecosystem';