import React, {useContext} from 'react';
import {List} from 'antd';
import styled from 'styled-components';
import {useLocation, useRouteMatch} from 'react-router-dom';

import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {CopyLinkMenuItem} from 'src/components/backstage/header/controls';
import {IsEcosystemRhsContext} from 'src/components/rhs/rhs_widgets';
import {FullUrlContext} from 'src/components/rhs/rhs';
import {
    buildQuery,
    buildTo,
    buildToForCopy,
    formatName,
    isReferencedByUrlHash,
} from 'src/hooks';
import {ListData} from 'src/types/list';

const {Item} = List;
const {Meta} = Item;

type Props = {
    data: ListData;
    name: string;
    parentId: string;
    sectionId: string;
};

const ItemsList = ({
    data,
    name = 'default',
    parentId,
    sectionId,
}: Props) => {
    const isEcosystemRhs = useContext(IsEcosystemRhsContext);
    const fullUrl = useContext(FullUrlContext);
    const {url} = useRouteMatch();
    const {hash: urlHash} = useLocation();

    const {items} = data;
    const id = `${formatName(name)}-${sectionId}-${parentId}-widget`;
    const query = buildQuery(parentId, sectionId);

    return (
        <Container
            id={id}
            data-testid={id}
        >
            <ListHeader>
                <AnchorLinkTitle
                    fullUrl={fullUrl}
                    id={id}
                    query={isEcosystemRhs ? '' : query}
                    text={name}
                    title={name}
                />
            </ListHeader>
            <List
                itemLayout='horizontal'
                size='small'
                dataSource={items}
                renderItem={(item) => {
                    const itemId = `list-item-${item.id}`;
                    return (
                        <Item
                            id={itemId}
                            actions={[
                                <CopyLinkMenuItem
                                    key={`copy-list-item-${item.id}`}
                                    path={buildToForCopy(buildTo(fullUrl, itemId, query, url))}
                                    showPlaceholder={false}
                                    svgMarginRight={'0px'}
                                    text={item.text}
                                />,
                            ]}
                            style={{
                                backgroundColor: isReferencedByUrlHash(urlHash, itemId) ? 'rgba(var(--center-channel-color-rgb), 0.08)' : 'var(--center-channel-bg)',
                            }}
                        >
                            <Meta title={item.text}/>
                        </Item>
                    );
                }}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

const ListHeader = styled(Header)`
    box-shadow: inset 0px -1px 0px rgba(var(--center-channel-color-rgb), 0.16);
`;

export default ItemsList;