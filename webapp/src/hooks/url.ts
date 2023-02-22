import {getSiteUrl} from 'src/clients';

export const isReferencedByUrlHash = (urlHash: string, id: string): boolean => {
    return urlHash === `#${id}`;
};

export const buildIdForUrlHashReference = (prefix: string, id: string): string => {
    return `${prefix}-${id}`;
};

export const buildToForCopy = (to: string): string => {
    return `${getSiteUrl()}${to}`;
};