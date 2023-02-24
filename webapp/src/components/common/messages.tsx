import styled from 'styled-components';

export const ErrorMessage = styled.div<{display?: boolean}>`
    color: var(--error-text);
    margin-left: auto;
    display: ${(props) => (props.display ? 'inline-block' : 'none')};
`;