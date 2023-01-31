import React, {useState} from 'react';
import styled from 'styled-components';

import {CreateAChannel} from 'src/components/channels/channel_access';
import {Section} from 'src/components/channels/styles';
import {Product} from 'src/types/product';
import {convertProductToChannelProduct} from 'src/hooks';

import {CreateProductChannel} from './controls';

interface Props {
    product: Product;
    teamId: string;
}

const ChannelBox = ({product, teamId}: Props) => {
    const [selectErrorMessage, setSelectErrorMessage] = useState('');
    const [nameErrorMessage, setNameErrorMessage] = useState('');

    const channelProduct = convertProductToChannelProduct(product);
    const [productForCreateChannel, setProductForCreateChannel] = useState(channelProduct);

    const cleanErrorMessages = () => {
        setSelectErrorMessage('');
        setNameErrorMessage('');
    };
    return (
        <StyledSection>
            <Setting id={'product-channel-action'}>
                <CreateAChannel
                    product={productForCreateChannel}
                    selectErrorMessage={selectErrorMessage}
                    nameErrorMessage={nameErrorMessage}
                    setProduct={setProductForCreateChannel}
                    cleanErrorMessages={cleanErrorMessages}
                />
            </Setting>
            <CreateProductChannel
                product={productForCreateChannel}
                teamId={teamId}
                setSelectErrorMessage={setSelectErrorMessage}
                setNameErrorMessage={setNameErrorMessage}
            />
        </StyledSection>
    );
};

const StyledSection = styled(Section)`
    border: 1px solid rgba(var(--center-channel-color-rgb), 0.08);
    padding: 2rem;
    padding-bottom: 0;
    margin: 0;
    margin-bottom: 20px;
    border-radius: 8px;
`;

const Setting = styled.div`
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export default ChannelBox;