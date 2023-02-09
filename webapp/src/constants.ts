// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DateTime} from 'luxon';

export const OVERLAY_DELAY = 400;

export enum ErrorPageTypes {
    DEFAULT = 'default',
}

export const TEMPLATE_TITLE_KEY = 'template_title';

export const BACKSTAGE_LIST_PER_PAGE = 15;

export const PROFILE_CHUNK_SIZE = 200;

export const RUN_NAME_MAX_LENGTH = 64;

export const DateTimeFormats = {
    // eslint-disable-next-line no-undefined
    DATE_MED_NO_YEAR: {...DateTime.DATE_MED, year: undefined},
};

export const DEFAULT_PATH = 'cs-aware-connect';