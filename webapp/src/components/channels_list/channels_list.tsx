// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import styled from 'styled-components';

import {FormattedMessage} from 'react-intl';

import InfiniteScroll from 'react-infinite-scroll-component';

import LoadingSpinner from 'src/components/assets/loading_spinner';
import {FetchChannelsParams, ProductChannel} from 'src/types/channels';

import ChannelsListHeader from './channels_list_header';
import Filters from './filters';
import Row from './row';

interface Props {
    channels: ProductChannel[];
    totalCount: number;
    fetchParams: FetchChannelsParams;
    setFetchParams: React.Dispatch<React.SetStateAction<FetchChannelsParams>>;
    filterPill: React.ReactNode | null;
}

const ChannelsList = ({
    channels,
    totalCount,
    fetchParams,
    setFetchParams,
    filterPill,
}: Props) => {
    const isFiltering = (
        (fetchParams?.search_term?.length ?? 0) > 0
    );

    const nextPage = () => {
        setFetchParams((oldParam: FetchChannelsParams) => ({...oldParam, page: oldParam.page + 1}));
    };

    return (
        <ChannelList
            id='channelsList'
            className='channelsList'
        >
            <Filters
                fetchParams={fetchParams}
                setFetchParams={setFetchParams}
            />
            {filterPill}
            <ChannelsListHeader
                fetchParams={fetchParams}
                setFetchParams={setFetchParams}
            />
            {channels == null &&
                <div className='text-center pt-8'>
                    <FormattedMessage defaultMessage='There are no channels for this product.'/>
                </div>
            }
            {channels?.length === 0 && isFiltering &&
                <div className='text-center pt-8'>
                    <FormattedMessage defaultMessage='There are no channels matching those filters.'/>
                </div>
            }
            <InfiniteScroll
                dataLength={channels?.length}
                next={nextPage}
                hasMore={channels?.length < totalCount}
                loader={<SpinnerContainer><StyledSpinner/></SpinnerContainer>}
                scrollableTarget={'product-channels-backstageRoot'}
            >
                {channels?.map((channel) => (
                    <Row
                        key={channel.id}
                        channel={channel}
                    />
                ))}
            </InfiniteScroll>
            <Footer>
                <Count>
                    <FormattedMessage
                        defaultMessage='{total, number} total'
                        values={{total: totalCount}}
                    />
                </Count>
            </Footer>
        </ChannelList>
    );
};

const ChannelList = styled.div`
    font-family: 'Open Sans', sans-serif;
    color: rgba(var(--center-channel-color-rgb), 0.90);
`;

const Footer = styled.div`
    margin: 10px 0 20px;
    font-size: 14px;
`;

const Count = styled.div`
    padding-top: 8px;
    width: 100%;
    text-align: center;
    color: rgba(var(--center-channel-color-rgb), 0.56);
`;

const SpinnerContainer = styled.div`
    width: 100%;
    height: 24px;
    text-align: center;
    margin-top: 10px;
    overflow: visible;
`;

const StyledSpinner = styled(LoadingSpinner)`
    width: auto;
    height: 100%;
`;

export default ChannelsList;
