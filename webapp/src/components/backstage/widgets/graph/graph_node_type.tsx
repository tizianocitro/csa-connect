import React from 'react';
import styled from 'styled-components';
import {
    Edge,
    Handle,
    Node,
    NodeProps,
    Position,
} from 'reactflow';

import {CopyLinkMenuItem} from 'src/components/backstage/header/controls';
import {getSiteUrl} from 'src/clients';
import {SECTION_ID_PARAM} from 'src/constants';

export const edgeType = 'step';
export const nodeType = 'graphNodeType';

export const buildNodeUrl = (sectionId: string, sectionUrl: string) => {
    let nodeUrl = `${getSiteUrl()}${sectionUrl}`;
    if (sectionId) {
        nodeUrl = `${nodeUrl}?${SECTION_ID_PARAM}=${sectionId}`;
    }
    return nodeUrl;
};

export const fillEdges = (edges: Edge[]) => {
    const filledEdges: Edge[] = [];
    edges.forEach((edge) => {
        filledEdges.push({
            ...edge,
            type: edgeType,
        });
    });
    return filledEdges;
};

export const fillNodes = (nodes: Node[], sectionId: string, sectionUrl: string, sectionUrlHash: string) => {
    const filledNodes: Node[] = [];
    nodes.forEach((node) => {
        filledNodes.push({
            ...node,
            data: {
                ...node.data,
                url: buildNodeUrl(sectionId, sectionUrl),
                isUrlHashed: `#${node.id}` === sectionUrlHash,
            },
            type: nodeType,
        });
    });
    return filledNodes;
};

// These can be alternatives to nodes color
// background: 'rgb(var(--button-bg-rgb), 0.4)',
// border: '1px solid rgb(var(--button-bg-rgb), 0.2)',
const GraphNodeType = ({id, data}: NodeProps) => {
    return (
        <>
            <Handle
                type={'target'}
                position={Position.Top}
            />
            <NodeContainer isUrlHashed={data.isUrlHashed}>
                <CopyLinkMenuItem
                    path={`${data.url}#${id}`}
                    placeholder={data.label}
                    showIcon={false}
                    text={data.label}
                />
            </NodeContainer>
            <Handle
                type={'source'}
                position={Position.Bottom}
            />
        </>
    );
};

const NodeContainer = styled.div<{isUrlHashed: boolean}>`
    background: ${(props) => (props.isUrlHashed ? 'rgba(var(--center-channel-color-rgb), 0.08)' : 'var(--center-channel-bg)')};
    border: 1px solid rgba(var(--center-channel-color-rgb), 0.8);
    borderRadius: 5;
`;

export default GraphNodeType;