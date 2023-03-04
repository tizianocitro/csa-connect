import React, {useState} from 'react';
import {
    Button,
    Checkbox,
    Modal,
    Steps,
} from 'antd';

import {StepData} from 'src/types/steps_modal';
import {formatStringToCapitalize} from 'src/hooks';

const {Step} = Steps;

type Props = {
    data: StepData[];
    elementKind?: string;
};

const StepsModal = ({data, elementKind}: Props) => {
    const [visible, setVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [stepValues, setStepValues] = useState<any>({});

    // TODO: here API call
    const handleOk = () => {
        setVisible(false);
        setCurrentStep(0);
    };

    const handleCancel = () => {
        setVisible(false);
        setStepValues({});
        setCurrentStep(0);
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
                            value={option.name}
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

    const openText = elementKind ? `Create new of ${formatStringToCapitalize(elementKind)}` : 'Create new';
    return (
        <>
            <Button onClick={() => setVisible(true)}>{openText}</Button>
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
                        {'Previous'}
                    </Button>,
                    <Button
                        key='next'
                        onClick={() => setCurrentStep(data.length - 1 === currentStep ? currentStep : currentStep + 1)}
                        disabled={currentStep === steps.length - 1}
                    >
                        {'Next'}
                    </Button>,
                    <Button
                        key='submit'
                        type='primary'
                        onClick={handleOk}
                    >
                        {'Submit'}
                    </Button>,
                ]}
            >
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
        </>
    );
};

export default StepsModal;
