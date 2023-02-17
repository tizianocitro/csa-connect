import React, {useCallback, useMemo} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import styled from 'styled-components';
import qs from 'qs';
import ReactFlow, {
    Background,
    Controls,
    FitViewOptions,
    MiniMap,
    useEdgesState,
    useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {formatName} from 'src/hooks';
import {SECTION_ID_PARAM} from 'src/constants';
import {getSiteUrl} from 'src/clients';

import GraphNode from './graph_node';

const initialNodes = [
    {
        id: 'n1',
        position: {
            x: 0,
            y: 0,
        },
        type: 'graphNode',
        data: {
            label: 'Node 1',
        },
    },
    {
        id: 'n2',
        position: {
            x: 100,
            y: 100,
        },
        type: 'graphNode',
        data: {
            label: 'Node 2',
        },
    },
];

const initialEdges = [
    {
        id: 'n1-n2',
        source: 'n1',
        target: 'n2',
        type: 'step',
    },
];

type Props = {
    name: string;
    parentId: string;
};

const Graph = ({name, parentId}: Props) => {
    const nodeTypes = useMemo(() => ({graphNode: GraphNode}), []);

    const {url} = useRouteMatch();
    const location = useLocation();
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const sectionIdParam = queryParams.sectionId as string;

    const fillNodesUrl = useCallback((sectionUrl: string, sectionId: string) => {
        initialNodes.forEach((n: any) => {
            n.data.url = `${getSiteUrl()}${sectionUrl}?${SECTION_ID_PARAM}=${sectionId}`;
        });
    }, [url, sectionIdParam]);

    fillNodesUrl(url, sectionIdParam);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const id = `${formatName(name)}-graph-widget`;
    return (
        <Container
            id={id}
            data-testid={id}
        >
            <Header>
                <AnchorLinkTitle
                    id={id}
                    query={`sectionId=${parentId}`}
                    text={name}
                    title={name}
                />
            </Header>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView={true}
                fitViewOptions={fitViewOptions}
                proOptions={hideOptions}
            >
                <Background/>
                <Controls/>
                <MiniMap
                    style={minimapStyle}
                    zoomable={true}
                    pannable={true}
                />
            </ReactFlow>
        </Container>
    );
};

const fitViewOptions: FitViewOptions = {
    padding: 1,
};

const minimapStyle = {
    height: 90,
    width: 180,
};

const hideOptions = {
    hideAttribution: true,
};

const Container = styled.div`
    width: 100%;
    height: 40vh;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

export default Graph;