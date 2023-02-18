import React from 'react';
import styled from 'styled-components';
import {
    Handle,
    Node,
    NodeProps,
    Position,
} from 'reactflow';

import {CopyLinkMenuItem} from 'src/components/backstage/header/controls';
import {getSiteUrl} from 'src/clients';
import {SECTION_ID_PARAM} from 'src/constants';

export const buildEdgeType = () => {
    return 'step';
};

export const buildNodeType = () => {
    return 'graphNodeType';
};

export const buildNodeIsUrlHashed = (node: Node, sectionUrlHash: string) => {
    return `#${node.id}` === sectionUrlHash;
};

export const buildNodeUrl = (sectionId: string, sectionUrl: string) => {
    let nodeUrl = `${getSiteUrl()}${sectionUrl}`;
    if (sectionId) {
        nodeUrl = `${nodeUrl}?${SECTION_ID_PARAM}=${sectionId}`;
    }
    return nodeUrl;
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