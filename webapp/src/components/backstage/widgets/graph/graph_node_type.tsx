import {
    Edge,
    Handle,
    Node,
    NodeProps,
    Position,
} from 'reactflow';
import React from 'react';
import styled from 'styled-components';

import {PARENT_ID_PARAM, SECTION_ID_PARAM} from 'src/constants';
import {CopyLinkMenuItem} from 'src/components/backstage/header/controls';
import {getSiteUrl} from 'src/clients';
import {GraphSectionOptions} from 'src/types/graph';

export const edgeType = 'step';
export const nodeType = 'graphNodeType';

export const buildNodeUrl = (options: GraphSectionOptions) => {
    const {applyOptions, parentId, sectionId, sectionUrl} = options;
    let nodeUrl = `${getSiteUrl()}${sectionUrl}`;
    if (!applyOptions) {
        return nodeUrl;
    }

    if (parentId) {
        nodeUrl = `${nodeUrl}?${PARENT_ID_PARAM}=${parentId}`;
    }
    if (parentId && sectionId) {
        nodeUrl = `${nodeUrl}&${SECTION_ID_PARAM}=${sectionId}`;
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

export const fillNodes = (
    nodes: Node[],
    options: GraphSectionOptions,
) => {
    const filledNodes: Node[] = [];
    nodes.forEach((node) => {
        const {parentId, sectionId, sectionUrlHash} = options;
        const url = buildNodeUrl(options);
        filledNodes.push({
            ...node,
            data: {
                ...node.data,
                url,
                isUrlHashed: `#${node.id}-${sectionId}-${parentId}` === sectionUrlHash,
                parentId,
                sectionId,
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
            <NodeContainer
                id={`${id}-${data.sectionId}-${data.parentId}`}
                isUrlHashed={data.isUrlHashed}
            >
                <CopyLinkMenuItem
                    path={`${data.url}#${id}-${data.sectionId}-${data.parentId}`}
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
    border-radius: 5;
`;

export default GraphNodeType;