// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {useOrganizationsList} from 'src/hooks';
import {BACKSTAGE_LIST_PER_PAGE} from 'src/constants';
import Header from 'src/components/common/header';

import OrganizationsList from './organizations_list/organizations_list';

const defaultOrganizationsFetchParams = {
    page: 0,
    per_page: BACKSTAGE_LIST_PER_PAGE,
    sort: 'name',
};

const ProductsPage = () => {
    const {formatMessage} = useIntl();
    const [organizations, totalCount, fetchParams, setFetchParams] = useOrganizationsList(defaultOrganizationsFetchParams);

    return (
        <ProductListContainer>
            <Header
                data-testid='titleOrganization'
                level={2}
                heading={formatMessage({defaultMessage: 'Organizations'})}
                subtitle={formatMessage({defaultMessage: 'All the organizations will show here'})}
                css={`
                    border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
                `}
            />
            <OrganizationsList
                organizations={organizations}
                totalCount={totalCount}
                fetchParams={fetchParams}
                setFetchParams={setFetchParams}
                filterPill={null}
            />
        </ProductListContainer>
    );
};

const ProductListContainer = styled.div`
    flex: 1 1 auto;
`;

export default ProductsPage;
