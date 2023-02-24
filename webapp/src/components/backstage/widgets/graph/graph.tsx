import 'reactflow/dist/style.css';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
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
import styled from 'styled-components';

import {AnchorLinkTitle, Header} from 'src/components/backstage/widgets/shared';
import {FullUrlContext, IsRhsClosedContext} from 'src/components/rhs/rhs';
import {GraphData, GraphDescription, emptyDescription} from 'src/types/graph';
import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';
import TextBox, {TextBoxStyle} from 'src/components/backstage/widgets/text_box/text_box';
import {IsRhsContext} from 'src/components/backstage/sections_widgets/sections_widgets_container';
import {formatName} from 'src/hooks';

import GraphNodeType from './graph_node_type';

type GraphStyle = {
    containerDirection: string,
    graphWidth: string;
    textBoxStyle?: TextBoxStyle;
};

type Props = {
    data: GraphData;
    name: string;
    sectionId: string;
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

const isDescriptionProvided = ({name, text}: GraphDescription) => {
    return name !== '' && text !== '';
};

const Graph = ({
    data,
    name,
    sectionId,
    parentId,
}: Props) => {
    const fullUrl = useContext(FullUrlContext);
    const isRhsClosed = useContext(IsRhsClosedContext);
    const isRhs = useContext(IsRhsContext);

    const nodeTypes = useMemo(() => ({graphNodeType: GraphNodeType}), []);
    const [description, setDescription] = useState<GraphDescription>(emptyDescription);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    useEffect(() => {
        setDescription(data.description || emptyDescription);
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

    const graphStyle = (isRhsClosed && isRhs) || !isDescriptionProvided(description) ? rhsGraphStyle : defaultGraphStyle;
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
                        fullUrl={fullUrl}
                        id={id}
                        query={`${SECTION_ID_PARAM}=${sectionId}&${PARENT_ID_PARAM}=${parentId}`}
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
            {isDescriptionProvided(description) &&
                <TextBox
                    name={description.name}
                    sectionId={sectionId}
                    style={graphStyle.textBoxStyle}
                    parentId={parentId}
                    text={description.text}
                />
            }
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
