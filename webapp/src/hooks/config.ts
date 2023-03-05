import {Section} from 'src/types/organization';
import {getOrganizations} from 'src/config/config';

export const getSection = (id: string): Section => {
    return getOrganizations().
        map((o) => o.sections).
        flat().
        filter((s: Section) => s.id === id)[0];
};