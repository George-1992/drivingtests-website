const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// const inputPosts = require('../data/Posts-Export-2026-August-31-0830.json');
const inputPosts = require('./fetchedUrls.json');
const wpPagesAndPosts = [...inputPosts];
const domain = 'https://www.drivingtests.co.nz';

const DIRECTUS_URL = process.env.DIRECTUS_URL || '';

const aiRequest = async ({
    prompt,
    model = 'gpt-5.6-luna',
    inputPrice = 0,
    outputPrice = 0,
    max_tokens = 4096,
    provider = 'openai' // Optional: 'openai' | 'anthropic'
}) => {
    try {
        // 1. Determine provider from model name if not explicitly passed
        const isClaude = provider === 'anthropic' || model.toLowerCase().includes('claude');

        // 2. Configure endpoint, headers, and payload based on provider
        const url = isClaude
            ? 'https://api.anthropic.com/v1/messages'
            : 'https://api.openai.com/v1/chat/completions';

        const headers = isClaude
            ? {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            }
            : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            };

        const body = isClaude
            ? {
                model,
                // max_tokens,
                messages: [{ role: 'user', content: prompt }]
            }
            : {
                model,
                // max_completion_tokens: max_tokens,
                messages: [{ role: 'user', content: prompt }]
            };

        // 3. Make HTTP request
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error(`${isClaude ? 'Anthropic' : 'OpenAI'} request failed:`, data.error || data);
            return null;
        }

        // 4. Extract generated text into a standardized format
        let textContent = '';
        if (isClaude) {
            textContent = data.content?.[0]?.text || '';
        } else {
            textContent = data.choices?.[0]?.message?.content || '';
        }

        if (!textContent) {
            console.error('API response contains no valid text content:', data);
            return null;
        }

        let totalPriceUsd = 0;
        if (isClaude) {
            const inputTokens = data.usage?.input_tokens || 0;
            const outputTokens = data.usage?.output_tokens || 0;

            totalPriceUsd =
                (inputTokens / 1_000_000) * inputPrice +
                (outputTokens / 1_000_000) * outputPrice;
        } else {
            const inputTokens = data.usage?.prompt_tokens || 0;
            const outputTokens = data.usage?.completion_tokens || 0;

            totalPriceUsd =
                (inputTokens / 1_000_000) * inputPrice +
                (outputTokens / 1_000_000) * outputPrice;
        }

        // Return unified object with raw payload attached
        return {
            text: textContent,
            raw: data,
            totalPriceUsd
        };

    } catch (error) {
        console.error('Error making AI request:', error);
        return null;
    }
};


const directusRequest = async ({
    method = 'GET',
    path,
    headers = {},
    body = null,
}) => {
    try {

        let reqData = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
                ...headers
            },
        }
        if (body) {
            reqData.body = JSON.stringify(body);
        }

        const resultRaw = await fetch(`${process.env.DIRECTUS_URL}/${path}`, reqData);

        if (!resultRaw.ok) {
            console.error(`directusRequest: Error during Directus request. Status: ${resultRaw.status} ${resultRaw.statusText}`);
            const errorText = await resultRaw.text();
            console.error('Response body:', errorText);
            return null;
        }

        const result = await resultRaw.json();
        return result?.data || result || null;

    } catch (error) {
        console.error('directusRequest: Error during Directus request:', error);
        return null;
    }
};

const beatifyHtml = async (htmlContent) => {
    try {
        // make ai request to beatify html content
        // remove all none tailwind classes and inline styles
        // style only with tailwind classes
        const prompt = `
    You are an expert web developer. 
    Your task is to beatify the following HTML content. 
    Remove all non-Tailwind CSS classes and inline styles. 
    Style the content only with Tailwind CSS classes. 
    Ensure the output is clean, semantic, and visually appealing.
    Ensure no html, head, body, main tags present in the output HTML as it will be inserted into an existing page.

    HTML Content:
    ${htmlContent}
    Please provide the beatified HTML content only, without any additional explanations or comments.
    `;

        const aiResponse = await aiRequest({
            prompt,
            model: 'gpt-5.6-luna',
            inputPrice: 0.0004, // hypothetical price per 1M tokens
            outputPrice: 0.0004, // hypothetical price per 1M tokens
            max_tokens: 4096,
            provider: 'openai'
        });

        if (!aiResponse || !aiResponse.text) {
            console.error('beatifyHtml: AI response is invalid or empty.');
            return htmlContent; // Return original content if AI fails
        }
        return aiResponse.text;
    } catch (error) {
        console.error('beatifyHtml: Error during HTML beatification:', error);
        return htmlContent; // Return original content if error occurs
    }
};

const extractAllWpCategories = (wpPagesAndPosts) => {
    try {
        // input :"Categories": "Advice|crane|Dangerous goods|News|Sideloader", 
        // output: ["Advice", "crane", "Dangerous goods", "News", "Sideloader"]

        const allWpCategories = new Set();
        wpPagesAndPosts.forEach(wpItem => {
            const c = wpItem['Categories'] || wpItem['categories'] || '';
            if (typeof c === 'string') {
                const categoriesString = wpItem['Categories'] || wpItem['categories'] || '';
                const categoriesArray = categoriesString.split('|').map(cat => cat.trim()).filter(cat => cat);
                categoriesArray.forEach(category => allWpCategories.add(category));
            } else if (Array.isArray(c)) {
                c.forEach(category => {
                    if (typeof category === 'string') {
                        allWpCategories.add(category.trim());
                    }
                });
            } else {
                console.warn(`extractAllWpCategories: Unexpected category format for item with slug "${wpItem.slug || wpItem['Slug']}". Expected string or array, got:`, c);
            }
        });

        return Array.from(allWpCategories);
    } catch (error) {
        console.error('extractAllWpCategories: Error during category extraction:', error);
        return [];
    }
};
const processImages = async (post) => {
    try {
        let imageUrl = post?.['Image URL'] || post?.['image'] || post?.['Image'] || post?.['image_url'] || null;
        // console.log('Processing imageUrl: ', imageUrl);

        if (!imageUrl || typeof imageUrl !== 'string') {
            return null;
        }

        const fileName = path.basename(imageUrl);
        // console.log('Processing image fileName:', fileName);

        // check if already uploaded to Directus by filename
        const existingFiles = await directusRequest({
            method: 'GET',
            path: `files?filter[filename_download][_eq]=${encodeURIComponent(fileName)}`,
        });
        // console.log('existingFiles: ', existingFiles);
        if (existingFiles?.id || existingFiles?.[0]?.id) {
            return existingFiles?.id || existingFiles?.[0]?.id
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
            path: 'files/import',
            body: {
                url: imageUrl,
            }
        });

        // console.log('imageRes: ', imageRes);

        return imageRes?.id || null;
    } catch (error) {
        console.error('processImages: Error during image processing:', error);
        return null;
    }
};
const processContent = async (content, options) => {
    try {
        if (!content || typeof content !== 'string') {
            return content || '';
        }

        const $ = cheerio.load(content, { decodeEntities: false });
        const importedMap = new Map();

        const shouldSkipUrl = (url) => {
            if (!url || typeof url !== 'string') return true;
            if (url.startsWith('/assets/')) return true;
            if (/^(data:|blob:)/i.test(url)) return true;
            if (!/^https?:\/\//i.test(url)) return true;
            return false;
        };

        // update all relative images src to absolute
        $('img').each((_, el) => {
            const src = $(el).attr('src');
            if (src && !src.startsWith('http')) {
                const absoluteSrc = new URL(src, domain).href;
                $(el).attr('src', absoluteSrc);
            }
        });

        const imageNodes = $('img').toArray();

        for (const imageNode of imageNodes) {
            const imageUrl = $(imageNode).attr('src');

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

            $(imageNode).attr('src', replacementUrl);
        }

        let updatedContent = $.root().html() || content;

        if (options?.beatifyHtml) {
            updatedContent = await beatifyHtml(updatedContent);
        }

        return updatedContent;
    } catch (error) {
        console.error('Error processing content: ', error);
        return content;
    }
};

const directusDatesCorrection = async () => {
    try {
        console.log('Starting directusDatesCorrection...');

        const directusPosts = await directusRequest({
            method: 'GET',
            path: 'items/posts?limit=-1&fields=id,slug,date_created',
        });

        const postWithoutDates = directusPosts.filter(post => !post.date_created);
        console.log('Posts Total: ', directusPosts.length);
        console.log('Posts without dates: ', postWithoutDates.length);

        const dates = {};
        for (const post of directusPosts) {
            const date = post.date_created || null;
            const formatedDate = date ? new Date(date).toISOString().split('T')[0] : null;

            if (formatedDate) {
                if (!dates[formatedDate]) {
                    dates[formatedDate] = [];
                }
                dates[formatedDate].push(post);
            }
        }
        // console.log('dates: ', Object.keys(dates));


        const startDate = Object.keys(dates).reduce((earliest, current) => {
            return current < earliest ? current : earliest;
        }, new Date().toISOString().split('T')[0]);
        const endDate = Object.keys(dates).reduce((latest, current) => {
            return current > latest ? current : latest;
        }, new Date(0).toISOString().split('T')[0]);

        // fill dates with all the days between startDate and endDate
        for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
            const ds = d.toISOString().split('T')[0];
            if (!dates[ds]) {
                dates[ds] = [];
            }
        }


        console.log('dates: ', Object.keys(dates).length);
        fs.writeFileSync(path.resolve(__dirname, 'directusDates.json'), JSON.stringify(dates, null, 2));

        const MAX_PER_DATE = 2;
        const counts = {};
        for (const date in dates) {
            counts[date] = dates[date].length;
        }

        const toUpdatePosts = [];

        for (const date in dates) {
            if (dates[date].length > MAX_PER_DATE) {
                const excessPosts = dates[date].slice(MAX_PER_DATE);
                console.log(`Date: ${date} has ${dates[date].length} posts, moving ${excessPosts.length}`);

                for (const post of excessPosts) {
                    const availableDates = Object.keys(counts).filter(
                        d => d !== date && counts[d] < MAX_PER_DATE
                    );

                    if (availableDates.length === 0) {
                        console.warn(`No available date for post ${post.id}, leaving on ${date}`);
                        continue;
                    }

                    const randomDate = availableDates[Math.floor(Math.random() * availableDates.length)];
                    counts[date] -= 1;
                    counts[randomDate] += 1;

                    toUpdatePosts.push({
                        id: post.id,
                        date_created: randomDate,
                    });
                }
            }
        }

        console.log('Posts to update: ', toUpdatePosts.length);
        fs.writeFileSync(path.resolve(__dirname, 'directusDatesToUpdate.json'), JSON.stringify(toUpdatePosts, null, 2));


        // Update posts in Directus in batches of 50
        const BATCH_SIZE = 50;
        for (let i = 0; i < toUpdatePosts.length; i += BATCH_SIZE) {
            const batch = toUpdatePosts.slice(i, i + BATCH_SIZE);
            const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
            const totalBatches = Math.ceil(toUpdatePosts.length / BATCH_SIZE);

            console.log(`Updating batch ${batchNumber}/${totalBatches} (${batch.length} posts)...`);

            const results = await Promise.allSettled(
                batch.map((post) =>
                    directusRequest({
                        method: 'PATCH',
                        path: `items/posts/${post.id}`,
                        body: {
                            date_created: post.date_created,
                        },
                    })
                )
            );

            results.forEach((result, index) => {
                const post = batch[index];
                if (result.status === 'fulfilled' && result.value) {
                    console.log(`Updated post ${post.id} to date ${post.date_created}`);
                } else {
                    console.warn(
                        `Failed to update post ${post.id} to date ${post.date_created}`,
                        result.status === 'rejected' ? result.reason : 'No response data'
                    );
                }
            });
        }


    } catch (error) {
        console.error('directusDatesCorrection: Error during date correction:', error);
    }
};


const prepareDtusData = async ({
    websiteId = null,
    currentDirectusItems = [],
    wpPagesAndPosts = [],
    dtusCategories = [],
}) => {
    try {


        const getStatus = (item) => {
            const wpStatus = item['Status'] || item.status || 'published';
            if (!wpStatus) return 'published';
            const statusMap = {
                'publish': 'published',
                'draft': 'draft',
                'pending': 'draft',
                'private': 'draft',
                'future': 'draft',
                'trash': 'draft',
            };
            return statusMap[wpStatus.toLowerCase()] || 'published';
        };



        const dtusData = wpPagesAndPosts.map(async wpItem => {
            const thisCategoriesString = wpItem['Categories'] || wpItem['categories'] || '';
            const thisCategoriesArray = thisCategoriesString.split('|').map(cat => cat.trim()).filter(cat => cat);
            const thisCategoriesIds = thisCategoriesArray.map(catName => {
                const foundCategory = dtusCategories.find(dtusCat => dtusCat.name === catName);
                return foundCategory ? foundCategory.id : null;
            }).filter(id => id !== null);


            const existingDirectusItem = currentDirectusItems.find(item => item.slug === (wpItem.slug || wpItem['Slug']));
            // console.log('existingDirectusItem: ', existingDirectusItem);

            return {
                id: existingDirectusItem?.id || null,
                type: wpItem['Type'] || wpItem['Post Type'] || wpItem.type || 'post',
                action: existingDirectusItem ? 'update' : 'create',
                slug: wpItem.slug || wpItem['Slug'] || '',
                title: wpItem['rank_math_title'] || wpItem['Title'] || wpItem.title || '',
                description: wpItem['rank_math_description'] || wpItem['Description'] || wpItem.description || '',
                websites: [{ websites_id: websiteId }],
                categories: thisCategoriesIds.map(catId => ({ categories_id: catId })),
                status: getStatus(wpItem),
                date_created: wpItem['Date'] || wpItem['date_created'] || wpItem.date || null,
                date_updated: wpItem['Post Modified Date'] || wpItem['date_updated'] || wpItem.modified || null,

                content: await processContent(wpItem.content || wpItem['Content'] || ''),
                image: await processImages(wpItem),
            };
        });
        return Promise.all(dtusData);

    } catch (error) {
        console.error('prepareDtusData: Error during data preparation:', error);
        return [];
    }
};

const parseCsvRecords = (raw) => {
    const records = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < raw.length; i += 1) {
        const char = raw[i];
        const next = raw[i + 1];

        if (char === '"') {
            current += char;
            if (inQuotes && next === '"') {
                current += next;
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if ((char === '\n' || char === '\r') && !inQuotes) {
            if (current.trim() !== '') {
                records.push(current);
            }

            current = '';
            if (char === '\r' && next === '\n') {
                i += 1;
            }
            continue;
        }

        current += char;
    }

    if (current.trim() !== '') {
        records.push(current);
    }

    return records;
};

const parseCsvLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        const next = line[i + 1];

        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
            continue;
        }

        current += char;
    }

    values.push(current);
    return values;
};

const parseCsvToObjects = (filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const records = parseCsvRecords(raw);

    if (records.length === 0) {
        return [];
    }

    const headers = parseCsvLine(records[0]).map((header) => header.trim());

    return records.slice(1).map((record) => {
        const values = parseCsvLine(record);
        const item = {};

        headers.forEach((header, index) => {
            item[header] = values[index] ?? '';
        });

        return item;
    });
};

const handleSpeedLimitContent = async () => {
    try {
        console.log('handleSpeedLimitContent ...');

        const csvPath = path.resolve(__dirname, 'SpeedLimitZoneFull__View_-4771110835017720689.csv');
        const data = parseCsvToObjects(csvPath);
        console.log('data: ', data.length);
        fs.writeFileSync(path.resolve(__dirname, 'speedLimitZoneFull.json'), JSON.stringify(data, null, 2));

        const dtusSample = {
            "object_id": "29092092",
            "speed_limit_record_id": "c90eb798-a45f-49ea-86d1-6e34efe9f280",
            "rca_zone_id": "91acf343-007b-41db-b1ac-a524f572140d",
            "rca_zone_name": "Wellington City",
            "legal_reference": "Wellington City Consolidated Bylaw 2008",
            "speed_category": "Permanent",
            "speed_limit_value": "10",
            "speed_limit_max_value": "10 km/h",
            "speed_limit_min_value": "10 km/h",
            "speed_limit_variable_speed_values": "",
            "speed_limit_reason": "CBD",
            "speed_limit_start_date": "1/1/1900 1:00:00 AM",
            "speed_limit_end_date": "",
            "when_effective": "1/1/1900 1:00:00 AM",
            "when_ineffective": "",
            "speed_limit_record_name": "CUBA STREET"
        };

        const keyMapping = {
            "OBJECTID": "object_id",
            "GlobalID": "global_id",
            "Certified Geometry Id": "certified_geometry_id",
            "Speed Limit Record Id": "speed_limit_record_id",
            "RCA Zone Id": "rca_zone_id",
            "RCA Zone Name": "rca_zone_name",
            "Legal Reference": "legal_reference",
            "Legal Instrument Title": "legal_instrument_title",
            "Legal Instrument URL": "legal_instrument_url",
            "Speed Management Plan": "speed_management_plan",
            "Speed Management Plan URL": "speed_management_plan_url",
            "Speed Category": "speed_category",
            "Speed Limit Value": "speed_limit_value",
            "Speed Limit Max Value": "speed_limit_max_value",
            "Speed Limit Min Value": "speed_limit_min_value",
            "Speed Limit Variable Speed Values": "speed_limit_variable_speed_values",
            "Speed Limit Reason": "speed_limit_reason",
            "Speed Limit Structure": "speed_limit_structure",
            "Speed Limit Zone Lane Purpose": "speed_limit_zone_lane_purpose",
            "Speed Limit Seasonal Recurring": "speed_limit_seasonal_recurring",
            "Speed Limit Zone Description": "speed_limit_zone_description",
            "Speed Limit Start Date": "speed_limit_start_date",
            "Speed Limit End Date": "speed_limit_end_date",
            "When Effective": "when_effective",
            "When Ineffective": "when_ineffective",
            "Seperate Lane Speeds": "seperate_lane_speeds",
            "Speed Limit Variable Description": "speed_limit_variable_description",
            "Shape__Area": "shape__area",
            "Shape__Length": "shape__length",
            "Speed Limit Record Name": "speed_limit_record_name"
        };


        // // using sample make request to directus speed_limits colelction
        // // shcem and add fields as text fields
        // const fieldsToCreate = Object.keys(dtusSample).map(key => ({
        //     field: keyMapping[key] || key.toLowerCase().replace(/\s+/g, '_'),
        //     type: 'string',
        //     schema: {
        //         data_type: 'varchar',
        //         is_nullable: true
        //     },
        //     meta: {
        //         interface: 'input',
        //         options: {},
        //         required: false,
        //         readonly: false,
        //         hidden: false,
        //         note: `Imported from CSV field "${key}"`
        //     }
        // }));
        // // Create fields sequentially
        // const createdFields = [];
        // for (const fieldPayload of fieldsToCreate) {
        //     const response = await directusRequest({
        //         method: 'POST',
        //         path: 'fields/speed_limits',
        //         body: fieldPayload,
        //     });
        //     createdFields.push(response);
        // }



        // upload data batch of 100 to directus speed_limits collection
        let preData = data.map(item => {
            const newItem = {};
            for (const key in item) {
                const newKey = keyMapping[key] || key.toLowerCase().replace(/\s+/g, '_');
                newItem[newKey] = item[key];
            }
            return newItem;
        });
        // preData = preData.slice(0, 200); // limit to first 200 records for testing
        // console.log('preData: ', preData[0]);
        // return;

        const itemsNoObjectId = preData.filter(item => !item.object_id);
        if (itemsNoObjectId.length > 0) {
            console.warn(`Warning: ${itemsNoObjectId.length} items do not have an object_id. They will be skipped.`);
            return;
        }

        // Directus bulk PATCH requires the collection primary key on every item.
        // object_id is our external identifier, so we first look up existing items by object_id,
        // then split the batch into creates and updates.
        
        const BATCH_SIZE = 100;
        for (let i = 0; i < preData.length; i += BATCH_SIZE) {
            const batch = preData.slice(i, i + BATCH_SIZE);
            console.log(`Upserting batch ${i / BATCH_SIZE + 1} of ${Math.ceil(preData.length / BATCH_SIZE)} (${batch.length} records)...`);


            // make batch only fields from sample dtusSample
            const filteredBatch = batch.map(item => {
                const newItem = {};
                for (const key in dtusSample) {
                    newItem[key] = item[key] || '';
                }
                return newItem;
            });

            const objectIds = filteredBatch
                .map((item) => item.object_id)
                .filter(Boolean)
                .map((value) => encodeURIComponent(String(value)));

            const existingItems = await directusRequest({
                method: 'GET',
                path: `items/speed_limits?fields=id,object_id&filter[object_id][_in]=${objectIds.join(',')}&limit=${filteredBatch.length}`,
            }) || [];

            const existingByObjectId = new Map(
                existingItems.map((item) => [String(item.object_id), item.id])
            );

            const toCreate = [];
            const toUpdate = [];

            filteredBatch.forEach((item) => {
                const existingId = existingByObjectId.get(String(item.object_id));
                if (existingId) {
                    toUpdate.push({
                        id: existingId,
                        ...item,
                    });
                } else {
                    toCreate.push(item);
                }
            });

            let createdCount = 0;
            let updatedCount = 0;

            if (toCreate.length > 0) {
                const createResponse = await directusRequest({
                    method: 'POST',
                    path: 'items/speed_limits',
                    body: toCreate,
                });

                if (!createResponse) {
                    console.log('failed create sample: ', toCreate[0]);
                } else {
                    createdCount = Array.isArray(createResponse) ? createResponse.length : toCreate.length;
                }
            }

            if (toUpdate.length > 0) {
                const updateResults = await Promise.allSettled(
                    toUpdate.map((item) =>
                        directusRequest({
                            method: 'PATCH',
                            path: `items/speed_limits/${item.id}`,
                            body: item,
                        })
                    )
                );

                updatedCount = updateResults.filter(
                    (result) => result.status === 'fulfilled' && result.value
                ).length;

                const failedUpdate = updateResults.find((result) => !(result.status === 'fulfilled' && result.value));
                if (failedUpdate) {
                    console.log('failed update sample: ', toUpdate[updateResults.indexOf(failedUpdate)]);
                }
            }

            console.log(`Upserted batch ${i / BATCH_SIZE + 1}: created=${createdCount}, updated=${updatedCount}`);
        }

    } catch (error) {
        console.error('handleSpeedLimitContent: Error processing content:', error);
    }
};




(async () => {
    try {
 

        console.log('=================================================================');
        console.log('Starting migration...');
        console.log('Total pages and posts to migrate:', wpPagesAndPosts.length);


        // // ***********************************
        // // directus pages only
        // // ***********************************
        // const directusSlugs = [
        //     {
        //         slug: 'courses',
        //         peraprahse: false,
        //         cleanHtml: true,
        //         beatifyHtml: true,
        //     }
        // ]

        // // fetch based on slugs
        // for (const page of directusSlugs) {
        //     console.log(`Fetching Directus page for slug: ${page.slug}`);

        //     const directusPage = await directusRequest({
        //         method: 'GET',
        //         path: `items/posts?filter[slug][_eq]=${page.slug}`,
        //     });
        //     page.directusData = directusPage?.[0] || null;

        //     console.log(`processing content for slug "${page.slug}". Original length: ${page.directusData?.content?.length || 0} characters....`);
        //     let updatedContent = await processContent(page.directusData?.content || '', {
        //         beatifyHtml: page.beatifyHtml,
        //     });
        //     console.log(`Processed content for slug "${page.slug}". Length: ${updatedContent.length} characters.`);

        //     // update directus page content if changed
        //     if (updatedContent !== page.directusData?.content) {
        //         const updatedPage = await directusRequest({
        //             method: 'PATCH',
        //             path: `items/posts/${page.directusData.id}`,
        //             body: {
        //                 content: updatedContent,
        //             },
        //         });
        //     }
        //     console.log(`==Finished processing Directus page for slug: ${page.slug}`);

        // }
        // console.log('directusSlugs: ', directusSlugs);
        // return;
        // // ***********************************


        const currentDirectusItems = await directusRequest({
            method: 'GET',
            path: 'items/posts?limit=-1&fields=id,slug,title,content',
        });
        console.log('currentDirectusItems: ', currentDirectusItems.length);

        //************************
        // categories
        //************************
        const finalCategories = [];
        const allWpCategories = extractAllWpCategories(wpPagesAndPosts);
        console.log('allWpCategories: ', allWpCategories.length);

        const allDirectusCategories = await directusRequest({
            method: 'GET',
            path: 'items/categories?limit=-1&fields=id,name',
        });
        console.log('allDirectusCategories: ', allDirectusCategories.length);

        // create categories in Directus if they don't exist if exist map with category name to id
        const allUniqueCategories = new Set([...allWpCategories, ...allDirectusCategories.map(cat => cat.name)]);

        for (const categoryName of allUniqueCategories) {
            // console.log(`Processing category: ${categoryName}`);
            if (!allDirectusCategories.some(cat => cat.name === categoryName)) {
                // console.log(`Category "${categoryName}" does not exist in Directus. Creating...`);
                const newCategory = await directusRequest({
                    method: 'POST',
                    path: 'items/categories',
                    body: {
                        status: 'published',
                        name: categoryName,
                    },
                });
                console.log(`Created new category in Directus: ${newCategory.name} (ID: ${newCategory.id})`);
                finalCategories.push(newCategory);
            } else {
                const existingCategory = allDirectusCategories.find(cat => cat.name === categoryName);
                // console.log(`Category "${categoryName}" already exists in Directus. ID: ${existingCategory.id}`);
                finalCategories.push(existingCategory);
            }
        }
        console.log('finalCategories: ', finalCategories.length);
        //************************




        const dtusData = await prepareDtusData({
            websiteId: 'b8bb7176-08b8-41ec-9748-55522a2ee373',
            currentDirectusItems,
            wpPagesAndPosts: wpPagesAndPosts,
            dtusCategories: finalCategories,
        });
        console.log('dtusData prepared: ', dtusData.length);
        fs.writeFileSync('dtusData.json', JSON.stringify(dtusData, null, 2));


        // update or create items in Directus
        const toUpload = dtusData;
        for (const item of toUpload) {
            if (item.action === 'update') {
                const updatedItem = await directusRequest({
                    method: 'PATCH',
                    path: `items/posts/${item.id}`,
                    body: {
                        ...item,
                        // title: item.title,
                        // content: item.content,
                        // status: item.status,
                        // slug: item.slug,
                        // category: item.category,
                        // image: item.image,
                    },
                });
                console.log(`Updated item in Directus: ${updatedItem.id}`);

            } else if (item.action === 'create') {
                const newItem = await directusRequest({
                    method: 'POST',
                    path: 'items/posts',
                    body: {
                        ...item,
                        // title: item.title,
                        // content: item.content,
                        // status: item.status,
                        // slug: item.slug,
                        // category: item.category,
                        // image: item.image,
                        // websites: item.websites,
                        // categories: item.categories,
                    },
                });
                console.log(`Created new item in Directus: ${newItem?.id}`);
            }
        }
        // debug only save html in data
        // fs.writeFileSync('./__debug_toUpload.json', JSON.stringify(toUpload, null, 2));



        console.log(' ');
        console.log(' ');
        console.log(' ');

    } catch (error) {
        console.error('Error during migration:', error);
    }
})()