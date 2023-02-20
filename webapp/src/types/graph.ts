import {Edge, Node} from 'reactflow';

export interface GraphData {
    description?: GraphDescription,
    edges: Edge[];
    nodes: Node[];
}

export interface GraphDescription {
    name: string;
    text: string;
}

export const emptyDescription = {
    name: '',
    text: '',
};