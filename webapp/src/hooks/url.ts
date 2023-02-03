import {getSiteUrl} from 'src/client';

export const isReferencedByUrlHash = (urlHash: string, id: string) => {
    return urlHash === `#${id}`;
};

export const buildIdForUrlHashReference = (prefix: string, id: string) => {
    return `${prefix}-${id}`;
};

export const buildToForCopy = (to: string) => {
    return `${getSiteUrl()}${to}`;
};