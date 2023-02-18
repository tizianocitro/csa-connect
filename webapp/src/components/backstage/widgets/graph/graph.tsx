import React, {useMemo} from 'react';
import styled from 'styled-components';
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

    const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);

    const id = `${formatName(name)}-graph-widget`;
    return (
        <>
            {JSON.stringify(data, null, 2)}
            <br/>
            <br/>
            <br/>
            {JSON.stringify({edges: initialEdges, nodes: initialNodes} as GraphData, null, 2)}
            <br/>
            <br/>
            <br/>
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
        </>
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

const initialNodes = [
    {
        id: 'n1',
        position: {
            x: 0,
            y: 0,
        },
        type: 'graphNodeType',
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
        type: 'graphNodeType',
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
