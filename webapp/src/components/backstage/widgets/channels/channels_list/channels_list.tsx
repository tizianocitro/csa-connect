import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'react-intl';

import InfiniteScroll from 'react-infinite-scroll-component';

import LoadingSpinner from 'src/components/assets/loading_spinner';
import {WidgetChannel} from 'src/types/channels';

import Row from './row';

interface Props {
    channels: WidgetChannel[];
    totalCount: number;
}

const ChannelsList = ({channels, totalCount}: Props) => {
    const nextPage = () => null;

    return (
        <ChannelList
            id='channelsList'
            className='channelsList'
        >
            {channels === null &&
                <div className='text-center pt-8'>
                    <FormattedMessage defaultMessage='Channels have not been added yet.'/>
                </div>
            }
            <InfiniteScroll
                dataLength={channels?.length}
                next={nextPage}
                hasMore={false}
                loader={<SpinnerContainer><StyledSpinner/></SpinnerContainer>}
                scrollableTarget={'channels-backstageRoot'}
            >
                {channels?.map((channel) => (
                    <Row
                        key={channel.channelId}
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
