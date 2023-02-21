import {ECOSYSTEM} from 'src/constants';
import {Organization, PlatformConfig} from 'src/types/organization';

export const DEFAULT_PLATFORM_CONFIG_PATH = '/configs/platform';

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

export const getOrganizationsNoEcosystem = (): Organization[] => {
    return getOrganizations().filter((o) => o.name.toLowerCase() !== ECOSYSTEM);
};

export const getEcosystem = (): Organization => {
    return getOrganizations().filter((o) => o.name.toLowerCase() === ECOSYSTEM)[0];
};

export const getOrganizationById = (id: string): Organization => {
    return getOrganizations().filter((o) => o.id === id)[0];
};