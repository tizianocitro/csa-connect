import React from 'react';
import styled from 'styled-components';
import {Handle, Position} from 'reactflow';

import {CopyLinkMenuItem} from 'src/components/backstage/header/controls';

// background: 'rgb(var(--button-bg-rgb), 0.4)',
// border: '1px solid rgb(var(--button-bg-rgb), 0.2)',
const GraphNode = ({id, data}: any) => {
    return (
        <>
            <Handle
                type={'target'}
                position={Position.Top}
            />
            <NodeContainer>
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

const NodeContainer = styled.div`
    background: rgb(var(--center-channel-color-rgb), 0.4);
    border: 1px solid rgb(var(--center-channel-color-rgb), 0.2);
    borderRadius: 5;
`;

export default GraphNode;