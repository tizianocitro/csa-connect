import {Organization, PlatformConfig} from 'src/types/organization';

export const platformConfigPath = '/configs/platform';

let platformConfig: PlatformConfig = {
    organizations: [],
};

export const getPlatformConfig = (): PlatformConfig => {
    return platformConfig;
};

export const setPlatformConfig = (config: PlatformConfig) => {
    platformConfig = config;
};

export const getOrganizations = (): Organization[] => {
    return getPlatformConfig().organizations;
};