// const inputPosts = require('../data/Post-Export-2026-May-24-185043.json');
// const inputPosts2 = require('../data/Page-Export-2026-May-24-185203.json');
require('dotenv').config();
const fs = require('fs');

const DIRECTUS_URL = 'https://dtus.enspire.science';
const DIRECTUS_API_TOKEN = 'u6p_mo3TJjgd8ChngDLnW6NYecAOtSRg';
const NEXT_PUBLIC_DIRECTUS_TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN;

const currentFailedPosts = [
    {
        postId: 3518,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 4029,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 5371,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 5772,
        reason: 'Value for field "slug" in collection "posts" has to be unique. ({"collection":"posts","field":"slug","value":"","code":"RECORD_NOT_UNIQUE"})'
    },
    {
        postId: 6082,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 6551,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 6552,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 6563,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 6578,
        reason: 'Value for field "slug" in collection "posts" has to be unique. ({"collection":"posts","field":"slug","value":"","code":"RECORD_NOT_UNIQUE"})'
    },
    {
        postId: 6691,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 7022,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 7344,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 7450,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 7451,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 7929,
        reason: 'Invalid payload. "url" must be a string. ({"reason":"\\"url\\" must be a string","code":"INVALID_PAYLOAD"})'
    },
    {
        postId: 8022,
        reason: 'Value for field "slug" in collection "posts" has to be unique. ({"collection":"posts","field":"slug","value":"","code":"RECORD_NOT_UNIQUE"})'
    },
    {
        postId: 8996,
        reason: 'Value for field "slug" in collection "posts" has to be unique. ({"collection":"posts","field":"slug","value":"","code":"RECORD_NOT_UNIQUE"})'
    }
]
const makeFirstLetterUppercase = (str) => {
    if (!str || typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const getSlugFromUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    const parts = url.split('/');
    return parts.filter(part => part.trim() !== '').pop() || '';
};

const directusRequest = async ({
    method = 'GET',
    endpoint = '',
    payload = null,
    params = {}
}) => {
    let resObj = {
        success: false,
        warning: false,
        message: '',
        data: null,
    }
    const isPost = ['POST', 'PATCH', 'PUT'].includes(method.toUpperCase());

    if (!DIRECTUS_URL || !DIRECTUS_API_TOKEN) {
        resObj.message = 'DIRECTUS_URL or DIRECTUS_API_TOKEN is not set in environment variables';
        return resObj;
    }

    if (!endpoint || typeof endpoint !== 'string') {
        resObj.message = 'Path is required and must be a string';
        return resObj;
    }

    if (!payload && isPost) {
        resObj.message = 'Payload is required';
        return resObj;
    }


    try {
        // Handle nested objects in params (especially filter objects)
        let queryString = '';
        if (Object.keys(params).length) {
            const searchParams = new URLSearchParams();

            Object.entries(params).forEach(([key, _value]) => {
                const value = Array.isArray(_value)
                    ? _value.join(',')
                    : _value;
                // console.log('key, value ==> ', key, value);

                if (typeof value === 'object' && value !== null) {
                    // Handle nested objects (like filter objects) by JSON stringifying
                    searchParams.append(key, JSON.stringify(value));
                } else {
                    searchParams.append(key, value);
                }
            });

            queryString = '?' + searchParams.toString();
        }

        const url = `${DIRECTUS_URL}${endpoint}${queryString}`;
        // console.log('url: ', url);

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`
            },

        };
        if (isPost) {
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(url, options);
        const json = await response.json();

        // console.log('json ==> ', json.errors);

        if (json.errors) {
            let msg = '';
            if (Array.isArray(json.errors)) {

                json.errors.forEach(err => {
                    msg += err.message;
                    if (err.extensions) {
                        msg += ` (${JSON.stringify(err.extensions)})`;
                    }
                });
            } else if (typeof json.errors === 'object' && json.errors.message) {
                msg = json.errors.message;
            } else {
                msg = 'An error occurred';
            }

            resObj.message = msg;
            return resObj;
        }

        resObj.success = response.ok;
        resObj.message = json.message || '';
        resObj.data = json.data || null;
        return resObj;

    } catch (error) {
        console.error(error);
        resObj.message = error.message || 'An error occurred';
        return resObj;
    }
};
const saveToFile = (filename, data) => {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`Data saved to ${filename}`);
    } catch (error) {
        console.error(`Error saving data to ${filename}: `, error);
    }
};
const correctCategories = (str) => {
    if (!str || typeof str !== 'string') return [];

    const normalizeCategory = (value) => {
        if (!value || typeof value !== 'string') return '';
        return value
            .trim()
            .replace(/^["']+|["',]+$/g, '')
            .trim();
    };

    const categorySet = new Set();
    const categories = str
        .split(/[,|>]/)
        .map(cat => normalizeCategory(cat))
        .filter(cat => cat !== '');
    categories.forEach(cat => categorySet.add(cat))

    return Array.from(categorySet);
}
const toDirectusDateFormat = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString();
};

//============= main  ==============================================

const test = async () => {
    try {
        console.log('wpPosts: ', wpPosts.length);

        const faildPosts = [];
        // const testBatch = wpPosts;
        // const testBatch = wpPosts.slice(2, 3);
        // console.log('testBatch: ', testBatch);
        // const testBatch = wpPosts.filter(post => post.ID === 2717);
        const testBatch = wpPosts.filter(post => currentFailedPosts.some(f => f.postId === post.ID));
        console.log('testBatch: ', testBatch.length);
        // return;


        const processesPost = async (post, index) => {
            try {
                console.log(`=============== post ${index + 1}/${testBatch.length} ============== ${post.ID}`);

                const thisCategories = (() => {
                    const set = new Set();
                    const categoriesStr = post?.['Categories'] || '';
                    // Split on both ',' and '|', then trim and filter
                    const categories = categoriesStr
                        .split(/[,|]/)
                        .map(cat => cat.trim())
                        .filter(cat => cat !== '');
                    categories.forEach(cat => set.add(cat));
                    const arr = Array.from(set);

                    const foundCategories = arr
                        .map(catName => categoryMapping[catName])
                        .filter(catId => catId !== undefined);
                    return foundCategories.map(catId => ({ categories_id: catId }));
                })();
                const getStatus = (statusStr) => {
                    if (statusStr === 'publish') {
                        return 'published';
                    } else if (statusStr === 'archive') {
                        return 'archived';
                    } else {
                        return 'araft';
                    }
                }
                const getInitialImge = () => {
                    let i = post?.['Image URL'] || null;
                    if (!i) {
                        return null;
                    }
                    // if has more than one image wit separate by comma or |, take first one
                    if (i.includes(',') || i.includes('|')) {
                        const parts = i.split(/[,|]/).map(part => part.trim()).filter(part => part !== '');
                        i = parts[0] || null;
                    }
                    return i;
                }
                const initalImage = getInitialImge();

                // console.log('thisCategories: ', thisCategories);
                // return;
                let data = {
                    status: getStatus(post?.['Status']),
                    type: 'post',
                    websites: [1], // default website
                    title: post?.['Title'] || 'Untitled Post',
                    slug: post?.['Slug'],
                    description: post?.['Description'] || post?.['Title'] || '',
                    categories: thisCategories,
                    // categories: [{
                    //     // id: 2
                    //     // categories_id: 'ee210c39-9c5a-465a-b81c-4f4ae57a7169'
                    //     categories_id
                    // }],
                    image: post?.['Image URL'] || null,
                    content: post?.['Content'] || '',
                    // Add other necessary fields here
                }

                // if image is null, upload it first
                if (initalImage) {
                    const imageRes = await directusRequest({
                        method: 'POST',
                        endpoint: '/files/import',
                        payload: {
                            url: initalImage,
                            // url: 'https://luxembourgofficial.com/wp-content/uploads/2023/08/finance.webp',
                            // title: 'finance.webp'
                        }
                    });
                    console.log('Image upload response: ', imageRes.success, imageRes.message, initalImage);
                    if (!imageRes.success) {
                        console.error('Image upload failed: ', imageRes.message);
                        faildPosts.push({ postId: post.ID, reason: imageRes.message });
                        return;
                    }
                    data.image = imageRes?.data?.id || null;
                }

                const logObj = {
                    status: data.status,
                    type: data.type,
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    categories: data.categories,
                    image: data.image,
                }
                // console.log('Processed post data: ', logObj);
                // save to directus
                const res = await directusRequest({
                    method: 'POST',
                    endpoint: '/items/posts',
                    payload: data,
                });
                if (!res.success) {
                    faildPosts.push({ postId: post.ID, reason: res.message });
                    return;
                }
                console.log('Directus response: ', res.success, res.message);
            } catch (error) {
                console.error('Error processing post: ', post.ID, error);
            }
        };

        for (let index = 0; index < testBatch.length; index++) {
            const post = testBatch[index];
            await processesPost(post, index);
        }

        console.log('Migration completed. Failed posts: ', faildPosts);
    } catch (error) {
        console.error('Migration error: ', error);
    }
};

const correctFieldValues = (posts) => {
    try {
        const keys = [
            {
                key: 'Status',
                transform: (value, row) => {
                    if (value === 'publish') {
                        return 'published';
                    } else {
                        return value;
                    }
                }
            },
            {
                key: 'Permalink',
                transform: (value, row) => {
                    if (!value || typeof value !== 'string') return '';
                    if (value === '/') {
                        return 'home'; // homepage case
                    }
                    const url = value.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '');
                    return url || 'home'; // homepage case
                }
            },
            {
                key: 'Description',
                transform: (value, row) => {
                    return row['_yoast_wpseo_metadesc'] || row['_yoast_wpseo_metadesc'] || value || '';
                }
            }

        ]

        const correctedPosts = posts.map(post => {
            const correctedPost = { ...post };
            keys.forEach(({ key, transform }) => {
                if (correctedPost[key]) {
                    correctedPost[key] = transform(correctedPost[key], correctedPost);
                }
            });
            return correctedPost;
        });

        // // save corrected posts to file
        // fs.writeFileSync('data/corrected_posts.json', JSON.stringify(correctedPosts, null, 2));
        // console.log('Field values corrected and saved to data/corrected_posts.json');

        return correctedPosts;

    } catch (error) {
        console.error('correctFieldValues:Error correcting field values: ', error);
    }
};
const addFields = (posts) => {
    try {
        const keys = [
            {
                key: 'slug_corrected',
                transform: (value) => {
                    if (!value || typeof value !== 'string') return '';
                    const url = value.replace(/^https?:\/\/[^/]+\//, ''); // strip protocol + domain
                    return url.replace(/\/$/, ''); // strip trailing slash
                }
            },
            {
                key: 'Description',
                transform: (value, row) => {
                    let v = row['_yoast_wpseo_metadesc'] || row['_yoast_wpseo_metadesc'] || value || '';
                    // if includes || split and send first if all the same otherwise aggregate with comma
                    if (v.includes('||')) {
                        const parts = v.split('||').map(part => part.trim()).filter(part => part !== '');
                        const uniqueParts = Array.from(new Set(parts));
                        if (uniqueParts.length === 1) {
                            return uniqueParts[0];
                        } else {
                            return uniqueParts.join(', ');
                        }
                    }
                    return v;
                }
            },
            {
                key: 'directus_category_names',
                transform: (value, row) => {
                    return correctCategories(value);
                }
            }
        ]

        const updatedPosts = posts.map(post => {
            const updatedPost = { ...post };
            keys.forEach(({ key, transform }) => {
                updatedPost[key] = transform(post['Permalink'], post);
            }
            ); return updatedPost;
        });

        // // save updated posts to file
        // fs.writeFileSync('data/updated_posts.json', JSON.stringify(updatedPosts, null, 2));
        // console.log('Fields added and saved to data/updated_posts.json');

        return updatedPosts;
    } catch (error) {
        console.error('addFields:Error adding fields: ', error);
    }
};
const getUniqueCategories = (posts) => {
    try {
        const categorySet = new Set();
        posts.forEach(post => {
            const cats = correctCategories(post['Categories'] || '');
            cats.forEach(cat => categorySet.add(cat));
        });
        const uniqueCategories = Array.from(categorySet);
        // console.log('Unique categories: ', uniqueCategories);
        return uniqueCategories;
    } catch (error) {
        console.error('getUniqueCategories: Error getting unique categories: ', error);
    }
};
const unqualifiedPostsForMigration = (posts) => {
    // check if the following fields exist
    const keys = [
        "slug_corrected",
        "Title", "Status",
        "Description",
        // "Content"
    ];

    const unqualifiedPosts = posts.filter(post => {
        for (const key of keys) {
            if (!post[key] || typeof post[key] !== 'string' || post[key].trim() === '') {
                return true; // unqualified if any key is missing or empty
            }
        } return false; // qualified if all keys are present and non-empty
    });
    return unqualifiedPosts;
};
const upsertCategoriesToDirectus = async (categories) => {
    try {

        const currentDirectusCategoriesRes = await directusRequest({
            method: 'GET',
            endpoint: '/items/categories',
            params: {
                limit: -1,
            }
        });
        const currentDirectusCategories = Array.isArray(currentDirectusCategoriesRes.data)
            ? currentDirectusCategoriesRes.data
            : [];

        const diff = categories.filter(cat => {
            return !currentDirectusCategories.some(dc => dc.name === cat);
        });
        console.log('Categories to upsert: ', diff);

        const newCats = [];
        for (const categoryName of diff) {
            const data = {
                name: categoryName,
                status: 'published',
            };
            const res = await directusRequest({
                method: 'POST',
                endpoint: '/items/categories',
                payload: data,
            });
            // console.log('Upsert category response: ', res.success, res.message, categoryName);
            if (Array.isArray(res.data)) {
                newCats.push(...res.data);
            } else if (res.data) {
                newCats.push(res.data);
            }

        }

        return [
            ...currentDirectusCategories,
            ...newCats
        ];

    } catch (error) {
        console.error('Upsert categories error: ', error);
    }
};
const insertPostsToDirectus = async ({ posts, directusCategories, websiteId }) => {

    const result = {
        success: [],
        failed: [],
    }

    try {
        const processImages = async (post) => {
            let imageUrl = post?.['Image URL'] || null;
            // console.log('Processing imageUrl: ', imageUrl);

            if (!imageUrl || typeof imageUrl !== 'string') {
                return null;
            }

            if (imageUrl.includes(',') || imageUrl.includes('|')) {
                const parts = imageUrl
                    .split(/[,|]/)
                    .map(part => part.trim())
                    .filter(part => part !== '');
                imageUrl = parts[0] || null;
            }

            if (!imageUrl) {
                return null;
            }

            const imageRes = await directusRequest({
                method: 'POST',
                endpoint: '/files/import',
                payload: {
                    url: imageUrl,
                }
            });

            if (!imageRes.success) {
                console.error('Image upload failed: ', imageRes.message, imageUrl);
                return null;
            }

            return imageRes?.data?.id || null;
        };
        const processContent = async (content) => {
            try {
                if (!content || typeof content !== 'string') {
                    return content || '';
                }

                // Parse each <img ... src="..."> and update only that src attribute.
                const imgTagRegex = /<img\b[^>]*\bsrc=(['"])([^'"]+)\1[^>]*>/gi;
                const srcAttrRegex = /\bsrc=(['"])([^'"]+)\1/i;
                const importedMap = new Map();
                const shouldSkipUrl = (url) => {
                    if (!url || typeof url !== 'string') return true;
                    if (url.startsWith('/assets/')) return true;
                    if (/^(data:|blob:)/i.test(url)) return true;
                    if (!/^https?:\/\//i.test(url)) return true;
                    return false;
                };

                let updatedContent = content;
                const matches = Array.from(content.matchAll(imgTagRegex));

                for (const match of matches) {
                    const fullTag = match[0];
                    const imageUrl = match[2];

                    if (shouldSkipUrl(imageUrl)) {
                        continue;
                    }

                    let replacementUrl = importedMap.get(imageUrl);
                    if (!replacementUrl) {
                        const imageId = await processImages({ 'Image URL': imageUrl });
                        if (!imageId) {
                            continue;
                        }
                        replacementUrl = `${DIRECTUS_URL}/assets/${imageId}`;
                        importedMap.set(imageUrl, replacementUrl);
                    }

                    const updatedTag = fullTag.replace(srcAttrRegex, `src="${replacementUrl}"`);
                    updatedContent = updatedContent.replace(fullTag, updatedTag);
                }

                return updatedContent;
            } catch (error) {
                console.error('Error processing content: ', error);
                return content;
            }
        }

        for (let i = 0; i < posts.length; i++) {
            const p = posts[i];
            const data = {
                status: p['Status'] ? p['Status'].toLowerCase() : 'draft',
                type: p['Post Type'] || 'post',
                websites: [{ websites_id: websiteId }],
                categories: (() => {
                    const cats = correctCategories(p['Categories'] || '');
                    const categoryIds = cats
                        .map(catName => {
                            const found = directusCategories.find(dc => dc.name === catName);
                            return found ? { categories_id: found.id } : null;
                        })
                        .filter(c => c !== null);

                    return categoryIds.map(c => ({ categories_id: c.categories_id }));
                })(),
                title: p['Title'] || 'Untitled Post',
                slug: p['slug_corrected'] || p['Slug'] || '',
                description: p['Description'] || (p['Title'] || 'Untitled Post'),
                content: await processContent(p['Content'] || ''),
                image: await processImages(p),
                date_created: toDirectusDateFormat(p['Date']),
                date_updated: toDirectusDateFormat(p['Post Modified Date']),
            };
            // console.log('p[\'Content\'].length: ', p['Content'].length);
            // console.log(data);

            //save to directus
            const res = await directusRequest({
                method: 'POST',
                endpoint: '/items/posts',
                payload: data,
            });

            if (!res.success) {
                console.error(`Failed to insert post ID ${p.ID}: `, res.message);
                result.failed.push(p.ID);
            } else {
                console.log(`post inserted `, i);
                result.success.push(p.ID);
            }
        }

        return result;
    } catch (error) {
        console.error('Insert posts error: ', error);
        return result;
    }
};
const specialCasesOnly = (posts) => {
    try {
        // check posts with "Discover the inside" in content and log their ids and count
        // const postIds = []
        // const count = posts.reduce((acc, post) => {
        //     if (post['Content'] && post['Content'].includes('Discover the')) {
        //         postIds.push(post.ID);
        //         return acc + 1;
        //     }
        //     return acc;
        // }, 0);
        // console.log('Posts with "Discover the inside" in content: ', count);
        // console.log('Post IDs: ', postIds);


        // check posts with images inside content 
        const postIdsWithImages = [];
        const countWithImages = posts.reduce((acc, post) => {
            if (post['Content'] && /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(post['Content'])) {
                postIdsWithImages.push(post.ID);
                return acc + 1;
            }
            return acc;
        }, 0);
        console.log('Posts with images inside content: ', countWithImages);
        console.log('Post IDs with images: ', postIdsWithImages);


        // check how many with button in content
        const postIdsWithButtons = [];
        const countWithButtons = posts.reduce((acc, post) => {
            if (post['Content'] && /<a\s+[^>]*class=["'][^"']*button[^"']*["'][^>]*>/i.test(post['Content'])) {
                postIdsWithButtons.push(post.ID);
                return acc + 1;
            }
            return acc;
        }, 0);
        console.log('Posts with buttons inside content: ', countWithButtons);
        // console.log('Post IDs with buttons: ', postIdsWithButtons);

    } catch (error) {
        console.error('Error in specialCasesOnly: ', error);
    }
};

const updatePostsCustom = async () => {
    // fetch all posts that have their slug starting with "?p="
    const fetchRes = await directusRequest({
        method: 'GET',
        endpoint: '/items/posts',
        params: {
            filter: {
                slug: {
                    _starts_with: '?p='
                }
            },
            fields: 'id,slug',
            limit: -1,
        }
    });

    const postsToUpdate = Array.isArray(fetchRes.data) ? fetchRes.data : [];
    console.log('Posts to update: ', postsToUpdate.length);

    // update all of them to remove "?p=" from slug
    for (const post of postsToUpdate) {
        const newSlug = post.slug.replace(/^\?p=/, '');
        const updateRes = await directusRequest({
            method: 'PATCH',
            endpoint: `/items/posts/${post.id}`,
            payload: {
                slug: newSlug,
            }
        });
        if (!updateRes.success) {
            console.error(`Failed to update post ID ${post.id}: `, updateRes.message);
        }
    }
}




const getCategories1 = async (posts) => {
    try {
        // creat eunique categories
        // and upload to directus
        // return
        const aallUniqueCategories = new Set();
        posts.forEach(post => {
            const categoriesStr = post?.['Categories'] || '';
            // Split on both ',' and '|', then trim and filter
            const categories = categoriesStr
                .split(/[,|]/)
                .map(cat => cat.trim())
                .filter(cat => cat !== '');
            categories.forEach(cat => aallUniqueCategories.add(cat));
        });

        const arr = Array.from(aallUniqueCategories);
        console.log('Unique categories count: ', arr);
        // add all to directus
        for (const categoryName of arr) {
            const data = {
                name: categoryName,
                description: '',
            };
            const res = await directusRequest({
                method: 'POST',
                endpoint: '/items/categories',
                payload: data,
            });
            console.log('Added category: ', categoryName, res.success, res.message);
        }

    } catch (error) {
        console.error('Get categories error: ', error);
    }
};
const getCategories2 = async () => {
    try {
        // get all categories from directus
        const res = await directusRequest({
            method: 'GET',
            endpoint: '/items/categories',
            params: {
                limit: -1,
            }
        });
        console.log('Fetched categories: ', res.success, res.message);
        const categories = res.data || [];
        // categories.forEach(cat => {
        //     console.log('Category: ', cat.id, cat.name);
        // });
        // console.log('categories[1]: ', categories[1]);

        const objectMapping = {};
        categories.forEach(cat => {
            objectMapping[cat.name] = cat.id;
        });

        console.log('objectMapping: ', objectMapping);

    } catch (error) {
        console.error('Get categories error: ', error);
    }
};
const countPosts = () => {
    console.log('Total posts to migrate: ', wpPosts.length);

    // // log any with slug horizon-europe
    // const horizonPosts = wpPosts.filter(post => post?.['Slug']?.includes('horizon-europe'));
    // // console.log('Posts with "horizon-europe" in slug: ', horizonPosts.length);
    // // save in data
    // fs.writeFileSync('data/horizon_posts.json', JSON.stringify(horizonPosts, null, 2));
};
// generate sitemap function
const generateSitemap = () => {
    // get all posts from directus
    // generate sitemap.xml file
    const allPosts = wpPosts;
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    allPosts.forEach(post => {
        const url = `https://luxembourgofficial.com/${post['Slug']}`;
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${url}</loc>\n`;
        sitemap += `    <lastmod>2026-01-29T13:43:50Z</lastmod>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.8</priority>\n`;
        sitemap += `  </url>\n`;
    });
    sitemap += `</urlset>`;

    // save sitemap to file
    const fs = require('fs');
    fs.writeFileSync('sitemap.xml', sitemap);
    console.log('Sitemap generated: sitemap.xml');
};
const datesUpdate = async () => {
    // const posts = wpPosts.slice(0, 2); 
    const posts = wpPosts;

    // 1. Fetch all postsx with id and slug
    const fetchRes = await directusRequest({
        method: 'GET',
        endpoint: '/items/posts',
        params: { fields: 'id,slug', limit: -1 }
    });
    const slugToId = {};
    if (fetchRes.data) {
        fetchRes.data.forEach(p => {
            slugToId[p.slug] = p.id;
        });
    }
    console.log('slugToId: ', Object.keys(slugToId).length);

    for (let i = 0; i < posts.length; i++) {
        const postId = posts[i]['ID'];
        data_created = posts[i]['Date'];
        data_modified = posts[i]['Post Modified Date'];
        slug = posts[i]['Slug'];

        const sIso = new Date(data_created).toISOString();
        const mIso = new Date(data_modified).toISOString();

        // console.log(`post ${i + 1}/${posts.length}: ID-${postId} ${sIso} ${mIso}`);

        if (i === 0) {

            // 2. Build updates array
            const updates = posts.map(post => ({
                id: slugToId[post.Slug],
                slug: post.Slug,
                date_created: new Date(post.Date).toISOString(),
                date_modified: new Date(post['Post Modified Date']).toISOString(),
            })).filter(u => u.id);
            console.log('Updates to be made: ', updates);

            // 3. Batch update
            const res = await directusRequest({
                method: 'PATCH',
                endpoint: '/items/posts',
                payload: updates,
            });
            console.log('Batch update response:', res.success, res.message);
        }
    }
};
const addWebsiteToPosts = async () => {
    // get all posts from directus
    const fetchRes = await directusRequest({
        method: 'GET',
        endpoint: '/items/posts',
        params: { fields: 'id,websites', limit: -1 }
    });
    const posts = fetchRes.data || [];
    console.log('Total posts fetched: ', posts.length);

    const updates = posts.map(post => {
        return {
            id: post.id,
            websites: [
                {
                    websites_id: '70fd0b42-628d-43da-acb0-16e1598039bc'
                }
            ]
        };
    }).filter(u => u.id)

    console.log('Total posts to update: ', updates.length);
    // batch update
    const res = await directusRequest({
        method: 'PATCH',
        endpoint: '/items/posts',
        payload: updates,
    });
    console.log('Batch update response:', res.success, res.message);
};

const mediamigrate = async () => {
    try {
        const mediaDir = './media';
        if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir, { recursive: true });
        }

        // Fetch in pages to avoid API-side limits truncating results.
        const pageSize = 200;
        let offset = 0;
        const allFiles = [];

        while (true) {
            const fetchRes = await directusRequest({
                method: 'GET',
                endpoint: '/files',
                params: {
                    limit: pageSize,
                    offset,
                    fields: 'id,filename_download'
                }
            });

            if (!fetchRes.success || !Array.isArray(fetchRes.data)) {
                console.error('Failed to fetch files page:', fetchRes.message || 'Unknown error');
                break;
            }

            const page = fetchRes.data;
            allFiles.push(...page);
            console.log('Fetched files page:', page.length, 'offset:', offset);

            if (page.length < pageSize) {
                break;
            }

            offset += pageSize;
        }

        console.log('Total files fetched: ', allFiles.length);

        const sanitizeFilename = (name) => {
            const fallback = 'unnamed-file';
            const input = (typeof name === 'string' && name.trim()) ? name.trim() : fallback;
            // Windows-invalid chars: <>:"/\|?* and control chars.
            return input.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
        };

        let downloaded = 0;
        const failed = [];

        // Download files; continue on per-file failures instead of aborting whole run.
        for (let i = 0; i < allFiles.length; i++) {
            const file = allFiles[i];
            try {
                if (!file?.id) {
                    failed.push({ index: i, reason: 'Missing file id' });
                    continue;
                }

                const safeName = sanitizeFilename(file.filename_download);
                const fileUrl = `${DIRECTUS_URL}/assets/${file.id}`;
                const filePath = `${mediaDir}/${file.id}__${safeName}`;

                const res = await fetch(fileUrl, {
                    headers: {
                        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`
                    }
                });
                if (!res.ok) {
                    failed.push({ id: file.id, name: file.filename_download, reason: `HTTP ${res.status}` });
                    continue;
                }

                const buffer = await res.arrayBuffer();
                fs.writeFileSync(filePath, Buffer.from(buffer));
                downloaded++;
                console.log('Downloaded file: ', i + 1, '/', allFiles.length, file.filename_download);
            } catch (fileError) {
                failed.push({ id: file?.id, name: file?.filename_download, reason: fileError.message || 'Unknown error' });
            }
        }

        console.log('Media migration done. Downloaded:', downloaded, 'Failed:', failed.length);
        if (failed.length) {
            saveToFile('./media/_failed_downloads.json', failed);
        }

    } catch (error) {
        console.error('Media migrate error: ', error);
    }
}



// correctFieldValues(posts);
// getCategories1();
// getCategories2();
// test();
// countPosts();
// generateSitemap();
// datesUpdate();
// addWebsiteToPosts();



const start = async () => {
    await mediamigrate();

    // const allInputPosts = [...inputPosts, ...inputPosts2];
    // updatePostsCustom();

    // // posts/pages
    // console.log('input post 1: ', inputPosts.length);
    // console.log('input post 2: ', inputPosts2.length);
    // let newPosts = correctFieldValues(allInputPosts);
    // newPosts = addFields(newPosts);
    // // log count of posts in each category
    // console.log('newPosts: ', newPosts.length);

    // const unqualifiedPosts = unqualifiedPostsForMigration(newPosts);
    // if (unqualifiedPosts.length > 0) {
    //     // save in unqualified_posts.json
    //     console.log('Unqualified posts for migration: ', unqualifiedPosts.length);
    //     saveToFile('data/unqualified_posts.json', unqualifiedPosts);
    //     return;
    // }

    // // specialCasesOnly(newPosts);
    // // return;

    // // categories
    // const uniqueCategories = getUniqueCategories(newPosts);
    // console.log('Unique categories: ', uniqueCategories.length);
    // const upsertedCategories = await upsertCategoriesToDirectus(uniqueCategories);
    // console.log('Upserted categories: ', upsertedCategories.length);

    // // save newPosts to file
    // saveToFile('data/output.json', newPosts);


    // // insert posts to directus
    // const result = await insertPostsToDirectus({
    //     // posts: newPosts.filter(p => p.ID === '3070'),
    //     posts: newPosts,
    //     directusCategories: upsertedCategories,
    //     websiteId: 'dffb44f9-eaea-4dc7-8985-ff22f492e65a'
    // });

    // // save result to file
    // saveToFile('data/migration_result.json', result);

    // console.log('>>>>>>>> completed');
    // // save in output.json
};
start();