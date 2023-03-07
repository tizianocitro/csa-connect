import {Section} from 'src/types/organization';
import {getOrganizations} from 'src/config/config';

import {formatStringToLowerCase} from './format';

export const getSection = (id: string): Section => {
    return getOrganizations().
        map((o) => o.sections).
        flat().
        filter((s: Section) => s.id === id)[0];
};

export const hideOptions = () => {
    (document.getElementsByClassName('AddChannelDropdown_dropdownButton')[0] as HTMLElement).style.display = 'none';

    // TODO: Check if it is possible to lower the timeout
    setTimeout(() => {
        const groups = document.getElementsByClassName('SidebarChannelGroup a11y__section') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            if (formatStringToLowerCase(group.innerText).includes('direct messages')) {
                group.style.display = 'none';
                break;
            }
        }
    }, 50);
};