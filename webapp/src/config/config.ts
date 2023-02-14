import {Config, Organization} from 'src/types/organization';

const config = require('../data/data.json');

const getConfig = (): Config | {} => {
    return config;
};

const organizations = (getConfig() as Config).organizations;

export const getOrganizations = (): Organization[] => {
    return organizations;
};