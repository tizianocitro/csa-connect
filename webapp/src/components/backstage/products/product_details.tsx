// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import styled from 'styled-components';
import {Redirect, useLocation, useRouteMatch} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {useProduct} from 'src/hooks';
import {pluginErrorUrl} from 'src/browser_routing';
import {ErrorPageTypes} from 'src/constants';

// import {useDefaultRedirectOnTeamChange} from 'src/components/backstage/main_body';
import Summary from 'src/components/backstage/summary';
import ChannelsSection from 'src/components/channels/channels';

import {Product} from 'src/types/product';

import {ProductHeader} from './header';
import Table from './table/table';

export enum ProductSections {
    SectionSummary = 'product-summary',
    SectionGraph = 'product-graph',
    SectionTable = 'product-table',
    SectionChannelBox = 'product-channel-box',
}

const ProductDetails = () => {
    const teamId = useSelector(getCurrentTeamId);

    const match = useRouteMatch<{productId: string}>();
    const productId = match.params.productId;
    const {hash: urlHash} = useLocation();
    const maybeProduct = useProduct(productId);
    const product = maybeProduct as Product;

    // This may be needed in future to get the channel related to something
    // const [channel] = useChannel(product?.channel_id ?? '');
    // The following useEffect would break the sidebar because it would retrigger useProductNoPage
    // because it changes the teamId
    // useEffect(() => {
    //    const teamId = product?.team_id;
    //    if (!teamId) {
    //        return;
    //    }
    //    dispatch(selectTeam(teamId));
    // }, [dispatch, product?.team_id]);
    // TODO: Check if this may ever be useful
    // useDefaultRedirectOnTeamChange(product?.team_id);

    // When first loading the page, the element with the ID corresponding to the URL
    // hash is not mounted, so the browser fails to automatically scroll to such section.
    // To fix this, we need to manually scroll to the component
    useEffect(() => {
        if (urlHash !== '') {
            setTimeout(() => {
                document.querySelector(urlHash)?.scrollIntoView();
            }, 300);
        }
    }, [urlHash]);

    // not found or error
    if (!maybeProduct) {
        return <Redirect to={pluginErrorUrl(ErrorPageTypes.DEFAULT)}/>;
    }

    // Loading state
    if (!product) {
        return null;
    }

    return (
        <Container>
            <MainWrapper>
                <Header>
                    <ProductHeader
                        product={product}
                    />
                </Header>
                <Main>
                    <Body>
                        <Summary
                            id={ProductSections.SectionSummary}
                            product={product}
                        />
                        <Table
                            id={ProductSections.SectionTable}
                            product={product}
                        />
                        <ChannelsSection
                            id={ProductSections.SectionChannelBox}
                            product={product}
                            teamId={teamId}
                        />
                    </Body>
                </Main>
            </MainWrapper>
        </Container>
    );
};

const RowContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(400px, 2fr) minmax(400px, 1fr);
    overflow-y: hidden;

    @media screen and (min-width: 1600px) {
        grid-auto-columns: 2.5fr 500px;
    }
`;

const MainWrapper = styled.div`
    display: grid;
    grid-template-rows: 56px 1fr;
    grid-auto-flow: row;
    overflow-y: hidden;
    grid-auto-columns: minmax(0, 1fr);
`;

const Main = styled.main`
    min-height: 0;
    padding: 0 20px 60px;
    display: grid;
    overflow-y: auto;
    place-content: start center;
    grid-auto-columns: min(780px, 100%);
`;
const Body = styled(RowContainer)`
`;

const Header = styled.header`
    height: 56px;
    min-height: 56px;
    background-color: var(--center-channel-bg);
`;

export default ProductDetails;