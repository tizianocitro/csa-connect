export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export interface GraphNode {
    data: GraphNodeData;
    id: string;
    position: GraphNodePosition;
    type: string;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    type: string;
}

interface GraphNodeData {
    isUrlHashed: boolean;
    label: string;
    url: string;
}

interface GraphNodePosition {
    x: number;
    y: number;
}