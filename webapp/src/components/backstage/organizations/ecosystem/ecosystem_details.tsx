import React, {useContext, useEffect, useState} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';
import styled from 'styled-components';

import {getSiteUrl} from 'src/clients';
import {DEFAULT_PATH, ORGANIZATIONS_PATH} from 'src/constants';
import {useOrganization, useOrganizionsNoEcosystem, useScrollIntoView} from 'src/hooks';
import {StepData} from 'src/types/steps_modal';
import SectionsWidgetsContainer from 'src/components/backstage/sections_widgets/sections_widgets_container';
import {OrganizationIdContext} from 'src/components/backstage/organizations/organization_details';
import StepsModal from 'src/components/backstage/widgets/steps_modal/steps_modal';

const EcosystemDetails = () => {
    const {url, path} = useRouteMatch();
    const {hash: urlHash} = useLocation();
    const organizationId = useContext(OrganizationIdContext);
    const ecosystem = useOrganization(organizationId);
    const organizations = useOrganizionsNoEcosystem();
    const [stepData, setStepData] = useState<StepData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result: any = {};
                for (const organization of organizations) {
                    for (const section of organization.sections) {
                        const response = await fetch(section.url);
                        const data = await response.json();
                        for (const row of data.rows) {
                            row.organizationId = organization.id;
                            row.parentId = section.id;
                        }
                        if (result[section.name]) {
                            result[section.name] = result[section.name].concat(data.rows);
                        } else {
                            result[section.name] = data.rows;
                        }
                    }
                }
                const steps: StepData[] = [];
                Object.keys(result).forEach((key) => {
                    const step: StepData = {
                        title: key,
                        options: result[key],
                    };
                    steps.push(step);
                });
                setStepData(steps);
            } catch (error) {
                // TODO: Carch error
            }
        };

        fetchData();
    }, []);

    useScrollIntoView(urlHash);

    return (
        <Container>
            <OrganizationIdContext.Provider value={ecosystem.id}>
                <SectionsWidgetsContainer
                    headerPath={`${getSiteUrl()}/${DEFAULT_PATH}/${ORGANIZATIONS_PATH}/${ecosystem.id}`}
                    name={ecosystem.name}
                    sectionPath={path}
                    sections={ecosystem.sections}
                    url={url}
                    widgets={ecosystem.widgets}
                />
            </OrganizationIdContext.Provider>
            {stepData.length > 0 &&
                <StepsModal
                    elementKind='issues'
                    data={stepData}
                />}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export default EcosystemDetails;