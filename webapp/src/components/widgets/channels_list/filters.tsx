// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {useIntl} from 'react-intl';

import debounce from 'debounce';
import styled from 'styled-components';

import SearchInput from 'src/components/backstage/search_input';
import {FetchChannelsParams} from 'src/types/channels';

interface Props {
    fetchParams: FetchChannelsParams;
    setFetchParams: React.Dispatch<React.SetStateAction<FetchChannelsParams>>;
}

const searchDebounceDelayMilliseconds = 300;

const Filters = ({fetchParams, setFetchParams}: Props) => {
    const {formatMessage} = useIntl();

    const setSearchTerm = (term: string) => {
        setFetchParams((oldParams) => {
            return {...oldParams, search_term: term, page: 0};
        });
    };

    const onSearch = useMemo(
        () => debounce(setSearchTerm, searchDebounceDelayMilliseconds),
        [setSearchTerm],
    );

    return (
        <ChannelListFilters>
            <SearchInput
                testId={'search-filter'}
                default={fetchParams.search_term}
                onSearch={onSearch}
                placeholder={formatMessage({defaultMessage: 'Search by channel name'})}
            />
        </ChannelListFilters>
    );
};

const ChannelListFilters = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem 16px;
    gap: 4px;
`;

export default Filters;
