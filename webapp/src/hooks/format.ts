export const formatName = (name: string): string => {
    return name.replace(/\s/g, '-').toLowerCase();
};

export const formatStringToLowerCase = (s: string): string => {
    return s.toLowerCase();
};

export const formatUrlWithId = (url: string, id: string): string => {
    return url.replace(':id', id);
};
