const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

let featuredDataCache: any = null;
let featuredDataCacheTime = 0;

export const getFeaturedDataCache = () => {
    const isExpired = Date.now() - featuredDataCacheTime > CACHE_DURATION;

    if (isExpired) {
        featuredDataCache = null;
        return null;
    }

    return featuredDataCache;
};

export const setFeaturedDataCache = (data: any) => {
    featuredDataCache = data;
    featuredDataCacheTime = Date.now();
};

export const clearFeaturedDataCache = () => {
    featuredDataCache = null;
    featuredDataCacheTime = 0;
};
