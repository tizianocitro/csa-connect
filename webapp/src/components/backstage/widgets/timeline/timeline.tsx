import React, {useMemo} from 'react';
import {Timeline} from 'antd';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

import CopyLink from 'src/components/commons/copy_link';
import {buildIdForUrlHashReference, isReferencedByUrlHash} from 'src/hooks';

const ItemsTimeline = () => {
    const {hash: urlHash} = useLocation();

    const items = useMemo<any[]>(() => (data.map(({id, text}) => {
        const itemId = buildIdForUrlHashReference('timeline-item', id);
        return {
            color: isReferencedByUrlHash(urlHash, itemId) ? 'green' : 'blue',
            children: (
                <TimelineItem
                    id={itemId}
                    key={itemId}
                >
                    <TimelineText>{text}</TimelineText>
                    <CopyLink
                        id={itemId}
                        text={text}
                        to={'to'}
                        name={text}
                        area-hidden={true}
                        iconWidth={'1.45em'}
                        iconHeight={'1.45em'}
                    />
                </TimelineItem>
            ),
        };
    })), [data, urlHash]);

    return (
        <Timeline
            mode='left'
            items={items}
        />
    );
};

const TimelineItem = styled.span<{isUrlHashed?: boolean, pointer?: boolean}>`
    display: flex;
    align-items: center;
    background: ${(props) => (props.isUrlHashed ? 'rgba(var(--center-channel-color-rgb), 0.08)' : 'var(--center-channel-bg)')};
    cursor: ${(props) => (props.pointer ? 'pointer' : 'auto')};
    ${CopyLink} {
        margin-left: 8px;
        opacity: 1;
        transition: opacity ease 0.15s;
    }

    &:not(:hover) ${CopyLink}:not(:hover) {
        opacity: 0;
    }
`;

const TimelineText = styled.span`
    font-weight: 600;
    font-size: 14px;
    line-height: 12px;
`;

const data = [
    {
        id: 'item-1',
        label: 'blue',
        text: 'An incident occurred',
    },
    {
        id: 'item-2',
        label: 'blue',
        text: 'Another incident occurred',
    },
    {
        id: 'item-3',
        label: 'blue',
        text: 'Incident solved',
    },
    {
        id: 'item-4',
        label: 'blue',
        text: 'Incident report',
    },
];

export default ItemsTimeline;