// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {useForceDocumentTitle} from 'src/hooks';

const Backstage = () => {
    useForceDocumentTitle('Mattermost Product');

    return (
        <div>
            <h1>{'Mattermost Product'}</h1>
        </div>
    );
};

export default Backstage;

