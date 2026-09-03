const path = require('path');
const fs = require('fs');
require('dotenv').config();

const fullDomain = `https://${process.env.DOMAIN}`;

const directusRequest = async ({
    method = 'GET',
    endpoint,
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

        const resultRaw = await fetch(`${process.env.DIRECTUS_URL}/${endpoint}`, reqData);

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




const sitemap = async ({
    SITE_URL = fullDomain,
    BATCH_SIZE = 5000,
    OUTPUT_DIR = path.join(__dirname, './public'),
}) => {
    try {
        console.log('Generating sitemap...');


        // get all posts from directus
        const posts = await directusRequest({
            method: 'GET',
            endpoint: 'items/posts?fields=id,slug,date_created,date_updated&limit=-1',
        });

        console.log('posts: ', posts.length);

        // ************************************
        // special parts for speedlimit

        const speedLimits = await directusRequest({
            method: 'GET',
            endpoint: 'items/speed_limits?limit=-1&fields=object_id,date_created,date_updated',
        });

        console.log('speedLimits: ', speedLimits.length);

        // mapt tp the posts array
        speedLimits.forEach((speedLimit) => {
            posts.push({
                id: speedLimit.object_id,
                slug: `speed-limits/${speedLimit.object_id}`,
                date_created: speedLimit.date_created,
                date_updated: speedLimit.date_updated,
            });
        });
        // ************************************


        const batches = [];
        for (let i = 0; i < posts.length; i += BATCH_SIZE) {
            batches.push(posts.slice(i, i + BATCH_SIZE));
        }

        // write each batched sitemap
        batches.forEach((batch, index) => {
            const urls = batch.map((post) => {
                const lastmod = (post.date_updated || post.date_created || '').split('T')[0];
                const fullUrl = `${SITE_URL}${post.slug.startsWith('/') ? '' : '/'}${post.slug}`;
                return `  <url>
                <loc>${fullUrl}</loc>
                ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
            </url>`;
            }).join('\n');

            const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls}
            </urlset>`;

            fs.writeFileSync(path.join(OUTPUT_DIR, `sitemap-${index + 1}.xml`), xml);
            console.log(`Written sitemap-${index + 1}.xml (${batch.length} urls)`);
        });

        console.log(`Total batches: ${batches.length}`);

        // write sitemap index pointing to all batches
        const sitemapEntries = batches.map((_, index) => {
            return `  <sitemap>
                <loc>${SITE_URL}/sitemap-${index + 1}.xml</loc>
            </sitemap>`;
        }).join('\n');

        const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
            <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemapEntries}
            </sitemapindex>`;

        fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), indexXml);
        console.log('Written sitemap.xml (index)');

    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}


const robotsTxt = async ({
    SITE_URL = fullDomain,
    OUTPUT_DIR = path.join(__dirname, './public'),
}) => {
    try {
        console.log('Generating robots.txt...');

        const content = `User-agent: *
            Disallow: /admin/

            Sitemap: ${SITE_URL}/sitemap.xml
        `;

        fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), content);
        console.log('Written robots.txt');

    } catch (error) {
        console.error('Error generating robots.txt:', error);
    }
};

const llmsTxt = async ({
    SITE_URL = fullDomain,
    OUTPUT_DIR = path.join(__dirname, './public'),
}) => {
    try {
        console.log('Generating llms.txt...');

        // fetch all titles and descriptions from directus
    

    } catch (error) {
        console.error('Error generating llms.txt:', error);
    }
};


// sitemap({});
robotsTxt({});