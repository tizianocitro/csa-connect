import React from 'react';
import styled from 'styled-components';

import ProductsSidebar from 'src/components/sidebar/products_sidebar';

const LHSContainer = styled.div`
    width: 240px;
    background-color: var(--sidebar-bg);

    display: flex;
    flex-direction: column;
`;

const LHSNavigation = () => {
    return (
        <LHSContainer data-testid='lhs-navigation'>
            <ProductsSidebar/>
        </LHSContainer>
    );
};

export default LHSNavigation;
