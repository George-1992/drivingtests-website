import { directusRequest, getFileUrlDirectus } from "@/services/directus";
import NotFound from "@/components/other/notFound";
import ErrorPage from "@/components/other/error";
import { logger } from "@/utils/logger";

const IS_DEV = process.env.NODE_ENV === 'development';
const DOMAIN = process.env.DOMAIN || 'localhost:3000';
const PROTOCOL = IS_DEV ? 'http' : 'https';
const FULL_DOMAIN = `${PROTOCOL}://${DOMAIN}`;


export const getPageData = async (pathname) => {
    let data = null;
    const spreadKeys = [
        { inputKey: 'websites', outputKey: 'website', type: 'object' },
        { inputKey: 'categories', outputKey: 'categories', type: 'array' },
    ];
    try {
        // const response = dummyPage;
        // fetch page data here if needed
        const response = await directusRequest({
            method: 'GET',
            endpoint: '/items/posts',
            params: {
                filter: {
                    slug: {
                        // _eq: 'chrishayward',
                        _eq: pathname,
                    },
                    status: {
                        _eq: 'published',
                    }
                },
                limit: 1,
                // include related websites data (junction + actual website record)
                fields: ['*', 'websites.*', 'websites.websites_id.*'],
            },
        });

        logger.log('Directus response ==> ', response);

        if (response.success) {
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                data = response.data[0];
                for (const so of spreadKeys) {
                    if (data[so.inputKey] && Array.isArray(data[so.inputKey]) && data[so.inputKey].length > 0) {

                        if (so.type === 'object') {
                            let outputData = data[so.inputKey][0] && data[so.inputKey][0][so.inputKey + '_id']
                                ? data[so.inputKey][0][so.inputKey + '_id']
                                : null;
                            data[so.outputKey] = outputData;
                            delete data[so.inputKey];
                        } else if (so.type === 'array') {
                            data[so.outputKey] = data[so.inputKey];
                            // loop over to bring _id field to top level and remove nested object
                            data[so.outputKey] = data[so.outputKey].map(item => {
                                if (item[so.inputKey + '_id']) {
                                    return {
                                        ...item,
                                        ...item[so.inputKey + '_id'],
                                        [so.inputKey + '_id']: undefined,
                                    };
                                }
                                return item;
                            });
                            delete data[so.inputKey];
                        }
                    } else {
                        data[so.outputKey] = so.type === 'object' ? null : [];
                    }
                }
            } else {
                data = {
                    title: 'Not Found',
                    description: 'The page you are looking for does not exist.',
                    children: <NotFound text={"The page you are looking for does not exist." + (response.message ? ` ${response.message}` : '')} />
                };
            }
        } else {
            data = {
                title: 'Error',
                description: 'An error occurred while fetching the page data.',
                children: <ErrorPage text={"An error occurred while fetching the page data." + (response.message ? ` ${response.message}` : '')} />
            };
            logger.error('getPageData Directus response not successful ==> ', response);
        };


    } catch (error) {
        data = {
            title: 'Error',
            description: 'An error occurred while fetching the page data.',
            content: `<div class="error">An error occurred while fetching the page data: ${error.message}</div>`,
        };
        logger.error('getPageData error ==> ', error);
    } finally {
        // logger.log('getPageData final data ==> ', data);
        return data;
    }
};
export const getWebsiteData = async (domain) => {
    let data = null;
    try {
        const response = await directusRequest({
            method: 'GET',
            endpoint: '/items/websites',
            params: {
                filter: {
                    name: {
                        _eq: domain,
                    },
                },
                limit: 1,
            },
        });
        logger.log('getWebsiteData Directus response ==> ', response);
        if (response.success) {
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                data = response.data[0];
            }
        } else {
            logger.warn('getWebsiteData Directus response not successful ==> ', response);
        }

    } catch (error) {
        logger.error('getWebsiteData error ==> ', error);
    }
    return data;
};
export const getEnvVars = () => {
    return {
        ...process.env,
        DOMAIN: DOMAIN,
        FULL_DOMAIN: FULL_DOMAIN,
        PROTOCOL: PROTOCOL,
        IS_DEV: IS_DEV,
    };
};
export const getFileUrl = (fileId) => {
    if (!fileId) return null;
    return getFileUrlDirectus(fileId);
};