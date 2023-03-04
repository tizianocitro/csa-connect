export interface StepData {
    title: string;
    options: StepValue[];
}

interface StepValue {
    name: string;
    description?: string;
    id: string;
    organizationId: string;
    parentId: string;
}