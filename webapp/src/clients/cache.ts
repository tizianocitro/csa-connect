export const getCachedResponse = async (
    cacheName: string,
    key: string,
): Promise<any> => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(key);
    if (!cachedResponse) {
        return null;
    }
    return cachedResponse.json();
};

export const putCacheResponse = async (
    cacheName: string,
    key: string,
    value: any,
): Promise<void> => {
    const cache = await caches.open(cacheName);
    if (value === null) {
        return;
    }
    cache.put(key, value.clone());
};