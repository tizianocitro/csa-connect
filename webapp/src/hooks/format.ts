export const formatName = (name: string) => {
    return name.replace(/\s/g, '-').toLowerCase();
};

export const formatStringToLowerCase = (s: string) => {
    return s.toLowerCase();
};

export const formatUrlWithId = (url: string, id: string) => {
    return url.replace(':id', id);
};
