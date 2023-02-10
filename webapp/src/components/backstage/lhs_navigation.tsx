import React from 'react';
import styled from 'styled-components';

import ProductsSidebar from 'src/components/sidebar/products_sidebar';

const LHSNavigation = () => {
    return (
        <LHSContainer data-testid='lhs-navigation'>
            <ProductsSidebar/>
        </LHSContainer>
    );
};

const LHSContainer = styled.div`
    width: 240px;
    background-color: var(--sidebar-bg);

    display: flex;
    flex-direction: column;
`;

export default LHSNavigation;
