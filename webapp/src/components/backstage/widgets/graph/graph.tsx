import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import styled from 'styled-components';
import ReactFlow, {
    Background,
    Controls,
    Edge,
    EdgeChange,
    FitViewOptions,
    MiniMap,
    Node,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {formatName} from 'src/hooks';
import TextBox, {TextBoxStyle} from 'src/components/backstage/widgets/text_box/text_box';
import {GraphData} from 'src/types/graph';

import GraphNodeType from './graph_node_type';

type GraphStyle = {
    containerDirection: string,
    graphWidth: string;
    textBoxStyle?: TextBoxStyle;
};

type Props = {
    isRhsClosed?: boolean;
    name: string;
    data: GraphData;
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
    data,
    parentId,
}: Props) => {
    const nodeTypes = useMemo(() => ({graphNodeType: GraphNodeType}), []);
    const graphStyle = isRhsClosed ? rhsGraphStyle : defaultGraphStyle;

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    useEffect(() => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
    }, [data]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

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
