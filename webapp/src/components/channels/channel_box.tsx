import React, {useReducer} from 'react';
import styled from 'styled-components';

import {CreateAChannel} from 'src/components/channels/channel_access';
import {Section} from 'src/components/channels/styles';
import {Product} from 'src/types/product';
import {convertProductToChannelProduct} from 'src/hooks';
import {setNameErrorMessage, setProductForCreateChannel, setSelectErrorMessage} from 'src/reducer';
import {nameErrorMessageAction, selectErrorMessageAction} from 'src/actions';

import {CreateProductChannel} from './controls';

interface Props {
    product: Product;
    teamId: string;
}

// const [productForCreateChannel, setProductForCreateChannel] = useState(channelProduct);
const ChannelBox = ({product, teamId}: Props) => {
    const [selectErrorMessage, dispatchSelectErrorMessage] = useReducer(setSelectErrorMessage, '');
    const [nameErrorMessage, dispatchNameErrorMessage] = useReducer(setNameErrorMessage, '');

    const channelProduct = convertProductToChannelProduct(product);
    const [productForCreateChannel, dispatchProductForCreateChannel] = useReducer(setProductForCreateChannel, channelProduct);

    const cleanErrorMessages = () => {
        dispatchSelectErrorMessage(selectErrorMessageAction(''));
        dispatchNameErrorMessage(nameErrorMessageAction(''));
    };
    return (
        <StyledSection>
            <Setting id={'product-channel-action'}>
                <CreateAChannel
                    product={productForCreateChannel}
                    selectErrorMessage={selectErrorMessage}
                    nameErrorMessage={nameErrorMessage}
                    dispatchProductForCreateChannel={dispatchProductForCreateChannel}
                    cleanErrorMessages={cleanErrorMessages}
                />
            </Setting>
            <CreateProductChannel
                product={productForCreateChannel}
                teamId={teamId}
                dispatchSelectErrorMessage={dispatchSelectErrorMessage}
                dispatchNameErrorMessage={dispatchNameErrorMessage}
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