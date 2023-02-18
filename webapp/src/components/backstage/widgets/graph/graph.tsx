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
import TextBox, {TextBoxStyle} from 'src/components/backstage/widgets/text_box/text_box';

import GraphNode, {setIsUrlHashed, setType, setUrl} from './graph_node';

const initialNodes = [
    {
        id: 'n1',
        position: {
            x: 0,
            y: 0,
        },
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

type GraphStyle = {
    containerDirection: string,
    graphWidth: string;
    textBoxStyle?: TextBoxStyle;
};

type Props = {
    isRhsClosed?: boolean;
    name: string;
    parentId: string;
};

const defaultGraphStyle: GraphStyle = {
    containerDirection: 'row',
    graphWidth: '75%',
    textBoxStyle: {
        height: '5vh',
        marginTop: '0px',
        width: '25%',
    },
};

const rhsGraphStyle: GraphStyle = {
    containerDirection: 'column',
    graphWidth: '100%',
};

const fitViewOptions: FitViewOptions = {
    padding: 1,
};

const hideOptions = {
    hideAttribution: true,
};

const minimapStyle = {
    height: 90,
    width: 180,
};

const Graph = ({
    isRhsClosed = false,
    name,
    parentId,
}: Props) => {
    const nodeTypes = useMemo(() => ({graphNode: GraphNode}), []);

    const {url} = useRouteMatch();
    const {hash: urlHash, search} = useLocation();
    const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
    const sectionIdParam = queryParams.sectionId as string;

    const fillNodes = useCallback((sectionId: string, sectionUrl: string, sectionUrlHash: string) => {
        initialNodes.forEach((node: any) => {
            setType(node);
            setUrl(node, sectionId, sectionUrl);
            setIsUrlHashed(node, sectionUrlHash);
        });
    }, [url, urlHash, sectionIdParam]);

    fillNodes(sectionIdParam, url, urlHash);

    const graphStyle = isRhsClosed ? rhsGraphStyle : defaultGraphStyle;

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const id = `${formatName(name)}-graph-widget`;
    return (
        <Container
            containerDirection={graphStyle.containerDirection}
        >
            <GraphContainer
                id={id}
                data-testid={id}
                width={graphStyle.graphWidth}
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
            </GraphContainer>
            <TextBox
                name={'My Graph Description'}
                parentId={parentId}
                text={'Graph Description'}
                style={graphStyle.textBoxStyle}
            />
        </Container>
    );
};

const GraphContainer = styled.div<{width: string}>`
    width: ${(props) => props.width};
    height: 40vh;
    margin-bottom: 24px;
`;

const Container = styled.div<{containerDirection: string}>`
    width: 100%;
    display: flex;
    flex-direction: ${(props) => props.containerDirection};
    margin-top: 24px;
`;

export default Graph;