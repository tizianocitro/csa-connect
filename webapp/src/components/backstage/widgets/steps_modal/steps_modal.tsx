import React, {
    ChangeEvent,
    useCallback,
    useContext,
    useState,
} from 'react';
import {
    Button,
    Checkbox,
    Input,
    Modal,
    Steps,
} from 'antd';
import {useRouteMatch} from 'react-router-dom';
import styled from 'styled-components';
import {FormattedMessage} from 'react-intl';

import {StepData} from 'src/types/steps_modal';
import {formatSectionPath, formatStringToCapitalize, formatStringToLowerCase} from 'src/hooks';
import {saveSectionInfo} from 'src/clients';
import {navigateToUrl} from 'src/browser_routing';
import {PARENT_ID_PARAM} from 'src/constants';
import {OrganizationIdContext} from 'src/components/backstage/organizations/organization_details';
import {PaddedErrorMessage} from 'src/components/commons/messages';
import {PrimaryButtonLarger} from 'src/components/backstage/widgets/shared';

const {Step} = Steps;

type Props = {
    data: StepData[];
    fields: string[];
    name: string;
    parentId: string;
    targetUrl: string;
};

type SectionInfoState = any;

const StepsModal = ({
    data,
    fields,
    name,
    parentId,
    targetUrl,
}: Props) => {
    const {path} = useRouteMatch();
    const organizationId = useContext(OrganizationIdContext);
    const [visible, setVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [stepValues, setStepValues] = useState<any>({});

    const initSectionInfoState = useCallback<SectionInfoState>(() => {
        const state: SectionInfoState = {};
        fields.forEach((key) => {
            state[key] = '';
        });
        return state;
    }, []);
    const [inputValues, setInputValues] = useState<SectionInfoState>(initSectionInfoState());
    const [errors, setErrors] = useState<SectionInfoState>(initSectionInfoState());

    const cleanModal = useCallback(() => {
        setCurrentStep(0);
        setStepValues({});
        setInputValues(initSectionInfoState());
        setErrors(initSectionInfoState());
    }, []);

    const handleInputChange = ({target}: ChangeEvent<HTMLInputElement>, key: string) => {
        setInputValues({...inputValues, [key]: target.value});
        setErrors({...errors, [key]: ''});
    };

    const handleOk = () => {
        const addRowErrors: SectionInfoState = initSectionInfoState();
        let allKeysNotEmpty = true;
        Object.keys(inputValues).forEach((key) => {
            if (!inputValues[key] || inputValues[key].trim() === '') {
                addRowErrors[key] = `${formatStringToCapitalize(key)} is missing.`;
                allKeysNotEmpty = false;
            }
        });
        if (!allKeysNotEmpty) {
            setErrors(addRowErrors);
            return;
        }

        setVisible(false);

        // TODO: this function has to be passed as a prop, to make the widget generic
        saveSectionInfo({
            ...inputValues,
            elements: Object.values(stepValues).flat(),
        }, targetUrl).
            then((result) => {
                cleanModal();

                const basePath = `${formatSectionPath(path, organizationId)}/${formatStringToLowerCase(name)}`;
                navigateToUrl(`${basePath}/${result.id}?${PARENT_ID_PARAM}=${parentId}`);
            }).
            catch(() => {
                // TODO: Do something in case of error
            });
    };

    const handleCancel = () => {
        setVisible(false);
        cleanModal();
    };

    const steps = data.map((step) => {
        const title = step.title;
        return {
            title,
            content: (
                <Checkbox.Group
                    onChange={(values) => setStepValues({...stepValues, [title]: values})}
                    value={stepValues[title]}
                    style={{display: 'flex', flexDirection: 'column', overflowY: 'scroll'}}
                >
                    {step.options.map((option, index) => (
                        <Checkbox
                            key={`${option.name}-${index}`}
                            value={option}
                            style={{marginLeft: '8px', marginTop: '2px', borderBottom: '1px solid', borderBottomColor: '#888'}}
                        >
                            <div>{option.name}</div>
                            <div style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>
                                {option.description}
                            </div>
                        </Checkbox>))}
                </Checkbox.Group>
            ),
        };
    });

    return (
        <Container>
            <PrimaryButtonLarger onClick={() => setVisible(true)}>
                <FormattedMessage defaultMessage='Create New'/>
            </PrimaryButtonLarger>
            <Modal
                centered={true}
                open={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button
                        key='back'
                        onClick={() => setCurrentStep(currentStep - 1)}
                        disabled={currentStep === 0}
                    >
                        <FormattedMessage defaultMessage='Previous'/>
                    </Button>,
                    <Button
                        key='next'
                        onClick={() => setCurrentStep(data.length - 1 === currentStep ? currentStep : currentStep + 1)}
                        disabled={currentStep === steps.length - 1}
                    >
                        <FormattedMessage defaultMessage='Next'/>
                    </Button>,
                    <Button
                        key='submit'
                        type='primary'
                        onClick={handleOk}
                    >
                        <FormattedMessage defaultMessage='Create'/>
                    </Button>,
                ]}
            >
                {fields.map((key) => (
                    <>
                        <Text>{formatStringToCapitalize(key)}</Text>
                        <TextInput
                            key={key}
                            placeholder={key}
                            value={inputValues[key] || ''}
                            onChange={(e) => handleInputChange(e, key)}
                        />
                        <PaddedErrorMessage
                            display={errors[key] && errors[key] !== ''}
                            marginBottom={'12px'}
                            marginLeft={'0px'}
                        >
                            {errors[key]}
                        </PaddedErrorMessage>
                    </>
                ))}
                <Steps
                    current={currentStep}
                    progressDot={true}
                    size='small'
                    style={{margin: '12px 0 12px 0'}}
                >
                    {steps.map((item) => (
                        <Step
                            key={item.title}
                            title={item.title}
                        />))}
                </Steps>
                {steps[currentStep].content}
            </Modal>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;

const TextInput = styled(Input)`
    margin-bottom: 12px;
`;

const Text = styled.div`
    text-align: left;
`;

export default StepsModal;
