const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const inputPosts = require('../data/Posts-Export-2026-August-31-0830.json');
const allPosts = [...inputPosts];

const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;

const normalizePath = (urlOrPath = '') => {
    if (!urlOrPath) return '';

    try {
        const url = new URL(urlOrPath, 'https://company.science');
        return url.pathname.replace(/\/+$/, '').toLowerCase();
    } catch {
        return String(urlOrPath).replace(/\/+$/, '').toLowerCase();
    }
};
const findMatchingSourcePost = (page) => {
    const pageId = String(page?.id ?? '');
    const pagePath = normalizePath(page?.link || page?.slug || '');

    return allPosts.find((p) => {
        const exportId = String(p?.id ?? p?.ID ?? '');
        if (exportId && pageId && exportId === pageId) {
            return true;
        }

        const exportPath = normalizePath(p?.Permalink || p?.slug || '');
        return !!(pagePath && exportPath && pagePath === exportPath);
    });
};

const aiRequest = async ({ messages = [], model = 'gpt-5.4-nano', max_tokens = 2000 }) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model,
                messages,
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response?.status}; body: ${errorBody}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in aiRequest:', error);
        return null;
    }
};


const aiRequestAntropic = async ({ messages = [], model = 'claude-sonnet-4-6', max_tokens = 1000 }) => {
    try {
        // Extract system message and convert remaining messages to Anthropic format
        const systemMessage = messages.find(m => m.role === 'system');
        const anthropicMessages = messages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content }));

        const body = {
            model,
            messages: anthropicMessages,
            max_tokens
        };

        if (systemMessage) {
            body.system = systemMessage.content;
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.ANTHROPIC_API_KEY,
                'Anthropic-Version': '2023-06-01'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response?.status}; body: ${errorBody}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in aiRequestAntropic:', error);
        return null;
    }
};

const test = async () => {

    const slug = 'erc-quick-dive-review-service';
    const sourceHtml = fs.readFileSync('./migrate/aa.html', 'utf-8');

    console.log('====================================');
    console.log(slug);
    console.log('');


    function replaceITags(html, page) {
        const pageTitle = page?.title?.rendered || page?.title || '';
        const pageSlogan = page?.slogan || '';

        const $ = cheerio.load(html);

        $('i').each(function () {
            const innerHtml = $(this).html();
            $(this).replaceWith(
                $('<span>')
                    .attr(this.attribs) // Copies existing attributes (like id, data-*, etc.)
                    .addClass('icon')    // Adds the 'icon' class to the <span>
                    .html(innerHtml || '&#8203;') // Keep content, or add a zero-width placeholder
            );
        });

        const h1 = $('h1').first();
        const hasH1 = h1.length > 0;
        const hasSloganInContent = pageSlogan ? $.root().text().includes(pageSlogan) : false;
        const shouldAddH1 = !hasH1 && !!pageTitle;
        const shouldAddSlogan = !!pageSlogan && !hasSloganInContent;

        if (shouldAddH1 || shouldAddSlogan) {
            let headerWrapper;

            if (hasH1) {
                h1.addClass('text-center');
                const h1Parent = h1.parent();
                const alreadyWrapped = h1Parent.length > 0
                    && h1Parent.hasClass('flex')
                    && h1Parent.hasClass('flex-col')
                    && h1Parent.hasClass('items-center');

                if (alreadyWrapped) {
                    headerWrapper = h1Parent;
                } else {
                    headerWrapper = $('<div class="flex flex-col items-center"></div>');
                    h1.replaceWith(headerWrapper);
                    headerWrapper.append(h1);
                }
            } else {
                headerWrapper = $('<div class="flex flex-col items-center"></div>');
                const firstDiv = $('div').first();

                if (firstDiv.length > 0) {
                    firstDiv.prepend(headerWrapper);
                } else {
                    $('body').prepend(headerWrapper);
                }
            }

            if (shouldAddH1) {
                headerWrapper.append($('<h1 class="text-center"></h1>').text(pageTitle));
            }

            if (shouldAddSlogan) {
                headerWrapper.append($('<p class="slogan text-center"></p>').text(pageSlogan));
            }
        }


        return $('body').html() || $.html();
    };

    try {
        // wordpress
        const url = `https://company.science/wp-json/wp/v2/pages?per_page=5&slug=${slug}`;
        const wpResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${WP_USERNAME}:${WP_PASSWORD}`)
            }
        });

        if (!wpResponse.ok) {
            throw new Error(`HTTP error! status: ${wpResponse.status}`);
        }
        const wpData = await wpResponse.json();
        console.log('Wordpress Fetched data:', wpData?.length, 'items');
        const pageFromAllPosts = findMatchingSourcePost(wpData?.[0] || {});
        console.log('pageFromAllPosts: ', pageFromAllPosts ? true : false);


        // directus
        const response = await fetch(`${process.env.DIRECTUS_URL}/items/posts`, {
            method: 'SEARCH', // <--- Change 'POST' to 'SEARCH'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
            },
            body: JSON.stringify({
                query: { // <--- Note: Directus expects the filter wrapped in a 'query' object here
                    filter: {
                        slug: {
                            _eq: slug
                        }
                    }
                }
            })
        });
        const directusData = await response.json();
        const data = directusData?.data || [];
        console.log('Directus fetched pages:', data.length, 'items');

        const thisPageData = {
            directus: data?.[0] || {},
            wordpress: wpData?.[0] || {},
            source: pageFromAllPosts || {}
        }

        // save directus content 
        // fs.writeFileSync('./migrate/directus_current.html', data?.[0]?.content || '', 'utf-8');



        // process the content with ai to match the example structure
        const exampleHtml = fs.readFileSync('./migrate/course_example.html', 'utf-8');
        if (thisPageData?.wordpress) {
            // // const updatedHtml = page.content.rendered; // replaceITags(page.content.rendered, page);
            // const updatedHtml = replaceITags(content, page);
            // page.content.rendered = updatedHtml;

            // request to ai
            const response = await aiRequest({
                messages: [
                    {
                        role: "system",
                        content: `
                        You are an HTML transformation engine.

                        CRITICAL RULE:
                        You are NOT allowed to remove, summarize, merge, or invent content.

                        You must behave like a deterministic DOM transformer:
                        - Every text node in input MUST appear exactly once in output.
                        - You may only change:
                        - tag names
                        - class names
                        - structure wrapping
                        - make sure to include all content from user's provide example unless there is a reason not to
                        - if any element has both elementor-hidden-desktop AND elementor-hidden-mobile then remove that element, but be extra carefull and if unsure keep it in the output
                        - make sure to have h1 at the top of the page, if not present add it with the title from the page data, if present make sure it is centered

                        Rules:
                        - Return ONLY valid HTML
                        - Do NOT explain anything
                        - Do NOT use markdown
                        - Do NOT invent or summarize content, text you use must be from the input
                        - Do NOT remove any content unless is absolutely necessary (like the element with both elementor-hidden-desktop AND elementor-hidden-mobile classes) and if you are not sure about it keep it in the output
                        - Output must start with an HTML tag
                        - for cards 
                        - if something looks like can be a button then add btn btn-primary, btn-secondary, btn-tertiary, btn-cta, btn-cta-secondary, btn-cta-tertiary, round_button, or round_button_secondary class to it depending on the context and styling of the link.

                        Example HTML:
                        ${exampleHtml}
                        `
                    },
                    {
                        role: "user",
                        content: thisPageData.wordpress?.content?.rendered || ''
                        // content: thisPageData.directus?.content || ''
                    },
                    // {
                    //     role: "user",
                    //     content: `
                    //     at least make one card component (following the rest of the instructions) , 
                    //     the title is 
                    //     "MSCA-DN course", 
                    //     make sure to create the card, and dont leave duplicated images or opther card elemetns, if included in the component then no need to repeat them in the rest of the content,
                    //     find the rest yourself and when component is create dont include duplicated content.
                    //     Also if card has learn more then just add to the card description and no need for read more.
                    //     Replace anything href src https://tools.company.science and https://company.science with empty links in href's so the links are relative,
                    //     For example https://tools.company.science/contact- m-for-groups/?course=HE_Implementation should become /contact-m-for-groups/?course=HE_Implementation
                    //     `
                    // },
                    // {
                    //     role: "user",
                    //     content: `
                    //     also any image in the provided HTMK should be matched and replaced with image links from ${thisPageData?.directus?.content || ''} and if not found then keep the original image link, but make sure to keep all images in the output.
                    //     `
                    // }
                ],
                model: "gpt-5.4-2026-03-05",
                // model: "claude-haiku-4-5-20251001",
            });
            const responseContent = response?.choices?.[0]?.message?.content || response?.content?.[0]?.text || '';

            fs.writeFileSync('./migrate/ai_response.json', JSON.stringify(response, null, 2), 'utf-8');
            console.log('AI response saved to ai_response.json');
            // fs.writeFileSync(`./migrate/outpu.html`, updatedHtml, 'utf-8');
            fs.writeFileSync(`./migrate/response.html`, responseContent, 'utf-8');
        }


        // romantica ?
        return;











        // map the custom fields from the allPosts to the fetched data
        data.forEach((page, index) => {
            const pageFromAllPosts = findMatchingSourcePost(page);
            console.log('pageFromAllPosts: ', pageFromAllPosts
                ? `Found for page ID ${page.id} (${page.link || page.slug})`
                : `Not found for page ID ${page.id} (${page.link || page.slug})`);

            // map some keys
            ['slogan'].forEach(key => {
                if (pageFromAllPosts && pageFromAllPosts[key]) {
                    page[key] = pageFromAllPosts[key];
                }
            });

        });
        fs.writeFileSync('./migrate/fetched_data.json', JSON.stringify(data, null, 2), 'utf-8');

    } catch (error) {
        console.error('Error in test function:', error);
    }
};
// test();



// ===============================================
const permalinkToLink = (permalink) => {
    // 1. Handle null, undefined, or empty strings
    if (!permalink) return '';

    // 2. Remove backslashes used for escaping forward slashes
    return permalink.replace(/\\\//g, '/');
};
const permalinkToSlug = (permalink) => {
    if (!permalink) return '';

    const cleanUrl = permalinkToLink(permalink);

    // 1. Strip query params, hashes, and trailing slashes first
    const cleanPath = cleanUrl
        .replace(/[?#].*$/, '')
        .replace(/\/+$/, '');

    // 2. Extract just the path portion after the domain
    // This looks for "protocol://domain.com" and grabs everything after it
    const pathOnly = cleanPath.replace(/^https?:\/\/[^\/]+/, '');

    // 3. Clean up file extensions (like .html) if they exist at the very end
    const finalPath = pathOnly.replace(/\.html?$/, '');

    // 4. Remove leading slash if you don't want it (e.g., "about-us/..." instead of "/about-us/...")
    return finalPath.replace(/^\//, '') || '';
};

const saveToJson = (path, data) => {
    // 1. Ensure data is always an array to prevent loop crashes
    const incomingData = Array.isArray(data) ? data : [data];

    // 2. First read the file and check if it exists, if not create it
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify([], null, 2), 'utf-8');
    }

    const existingData = JSON.parse(fs.readFileSync(path, 'utf-8'));

    // 3. Create a Map using the 'slug' as the unique key
    // Map remembers the original insertion order of the keys
    const dataMap = new Map();

    // 4. Load existing data into the map first
    for (const item of existingData) {
        if (item?.slug) {
            dataMap.set(item.slug, item);
        }
    }

    // 5. Load incoming data into the map. 
    // This automatically OVERWRITES the old entry if the slug matches!
    for (const item of incomingData) {
        if (item?.slug) {
            dataMap.set(item.slug, item);
        }
    }

    // 6. Convert the unique Map back into an array
    const uniqueData = Array.from(dataMap.values());

    // 7. Write back to disk
    fs.writeFileSync(path, JSON.stringify(uniqueData, null, 2), 'utf-8');
    console.log(`Data saved to ${path}. Total entries: ${uniqueData.length}`);
};
const parseWpPage = async ({ page = '' }) => {
    const url = page || '';
    try {

        // const slug = 'erc-deep-dive-review';
        // const sourceHtml = fs.readFileSync('./migrate/aa.html', 'utf-8');
        const exampleHtml = fs.readFileSync('./migrate/course_example.html', 'utf-8');

        console.log('=====================================');
        console.log('Starting content transformation with AI...');
        const slug = permalinkToSlug(url);
        console.log('url:', url);
        console.log('slug:', slug);

        // fetch page and get entry-content element
        const urlResponse = await fetch(url);
        const html = await urlResponse.text();
        const $ = cheerio.load(html);
        const entryContentHtml = $('.entry-content').html() || '';
        const firstH1 = $('h1').first().text() || '';
        if (!entryContentHtml) {
            console.error('No entry-content found for URL:', url);
            return null;
        }
        if (!firstH1) {
            console.warn('No H1 found for URL:', url);
            return null;
        }
        // console.log('First H1 text: >>>>', firstH1.trim(), '<<<<');
        // console.log('Fetched entry-content HTML length:', entryContentHtml.length);
        const fullContent = '<div class="entry-content">' + '<h1>' + firstH1 + '</h1>' + entryContentHtml + '</div>';



        // find in directus
        const foundDirectusItemResponse = await fetch(`${process.env.DIRECTUS_URL}/items/posts?filter[slug][_eq]=${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
            }
        });
        const foundDirectusItemData = await foundDirectusItemResponse.json();
        const postData = foundDirectusItemData?.data?.[0] || null;
        console.log('Directus Post: ', postData ? true : false, 'id:', postData?.id);

        if (!postData) {
            console.error('Post not found in Directus for slug:', slug);
            return null;
        }


        // ai request to transform the content
        const response = await aiRequest({
            messages: [
                {
                    role: "system",
                    content: `
                You are a deterministic HTML transformation engine.

                Your job is to transform HTML structure while preserving content exactly.

                CRITICAL RULES:
                - Never remove, summarize, merge, rewrite, or invent content.
                - Every text node from source HTML must appear in output exactly once.
                - Text content must remain unchanged (same words, punctuation, numbers).

                Allowed modifications only:
                - tag names
                - class names
                - wrapper structure (div/section/article)
                - Tailwind utility classes for styling

                NOT ALLOWED:
                - changing text
                - duplicating text
                - inserting new text
                - copying text from example HTML

                Example HTML is ONLY a structural/style reference.
                Use its layout patterns, wrappers, spacing, and styling.
                Never copy its textual content unless that exact text already exists in source HTML.

                Hidden elements:
                - Remove an element only if its class list contains BOTH:
                - elementor-hidden-desktop
                - elementor-hidden-mobile
                - If removed, remove the entire subtree.
                - If unsure, keep the element.

                Heading rules:
                - If source HTML contains no <h1>, insert exactly one <h1> at the top using page title.
                - If source already contains an <h1>, do not add another.
                - Ensure the final <h1> is visually centered.

                Styling rules:
                - Use only standard HTML tags.
                - Do NOT create custom components or React tags.
                - You may transform repeated structures into card-like layouts using div/article and Tailwind classes.
                - Only convert to cards when all original content remains preserved exactly once.
                - If uncertain, keep original structure.
                - maintain spacing and padding using Tailwind utility classes.
                - card text must be text-gray-800, if there is any text color style then remove from the card and its children.
                - all links should be underlined
                - if something looks like can be a button then add btn btn-primary, btn-secondary, btn-tertiary, btn-cta, btn-cta-secondary, btn-cta-tertiary, round_button, or round_button_secondary class to it depending on the context and styling of the link.
                - always make sure to have proper spacing between sections, cards, and other elements using Tailwind spacing classes.
                - replace any form with a button link to contact-us page with the current URL as a query parameter and center items, for example if the form is in /services/individual-services/erc-interview-training then the link should be /contact-us?from=/services/individual-services/erc-interview-training
                - if its reviews thenfirst add big title that its reviews, then make wrap them on desktop to be 3 columns and on mobile to be 1 column, and make sure to have, title color text-green-800, and the card should have border border-gray-200 bg-white p-4 shadow-sm, and make sure to have proper spacing between cards and sections using Tailwind spacing classes.
                - remove any color:#ffffff
                - if src is not set for image but data-src is set then use data-src as src.
                - if the link text is not clear then just put "Learn more" as the link text nect put full URL as text.

                Output rules:
                - Return only valid HTML
                - No explanations
                - No markdown
                - Output must begin with an HTML tag

                Before responding, verify:
                1. Output is valid HTML
                2. All source text exists
                3. No extra text exists
                4. No duplicated text exists

                Example HTML:
                ${exampleHtml}
                `
                },
                {
                    role: "user",
                    content: fullContent || ''
                },
            ],
            model: "gpt-5.4-2026-03-05",
            // model: "claude-haiku-4-5-20251001",
        });
        const responseContent = response?.choices?.[0]?.message?.content || response?.content?.[0]?.text || '';

        // fs.writeFileSync('./migrate/ai_response.json', JSON.stringify(response, null, 2), 'utf-8');
        // console.log('AI response saved to ai_response.json');
        // // fs.writeFileSync(`./migrate/outpu.html`, updatedHtml, 'utf-8');
        // fs.writeFileSync(`./migrate/response.html`, responseContent, 'utf-8');
        // console.log('Transformed content saved to response.html');

        // update content in directus
        if (postData) {
            const updateResponse = await fetch(`${process.env.DIRECTUS_URL}/items/posts/${postData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
                },
                body: JSON.stringify({
                    content: responseContent || ''
                })
            });
            if (updateResponse.ok) {
                console.log('Directus content updated successfully for post ID:', postData.id);
            } else {
                console.error('Failed to update Directus content for post ID:', postData.id, 'Status:', updateResponse.status);
            }
        } else {
            console.error('Post not found in Directus for slug:', slug);
        }

        return response
    } catch (error) {
        console.error('Error in parseWpPage function:', url, error);
        return null;
    }
};

const updateLinksInHtml = async (slug) => {
    try {
        const foundDirectusItemResponse = await fetch(
            `${process.env.DIRECTUS_URL}/items/posts?filter[slug][_eq]=${slug}&limit=1`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
                }
            }
        );

        const foundDirectusItemData = await foundDirectusItemResponse.json();
        const postData = foundDirectusItemData?.data?.[0] || null;
        console.log('Directus Post: ', postData ? true : false, 'id:', postData?.id);

        if (postData) {
            let updatedHtmlString = postData.content || '';
            let replacedCount = 0;

            const hrefAttrRegex = /href\s*=\s*(['"])(https:\/\/(?:tools\.)?company\.science[^'"]*)\1/g;

            updatedHtmlString = updatedHtmlString.replace(hrefAttrRegex, (match, quote, rawHref) => {
                replacedCount++;
                const relativeLink = rawHref.replace(/^https:\/\/(?:tools\.)?company\.science/, '');
                return `href=${quote}${relativeLink}${quote}`;
            });

            console.log(replacedCount, 'links replaced');

            const updateResponse = await fetch(`${process.env.DIRECTUS_URL}/items/posts/${postData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
                },
                body: JSON.stringify({ content: updatedHtmlString })
            });

            if (updateResponse.ok) {
                console.log('Directus content updated successfully for post ID:', postData.id);
            } else {
                console.error('Failed to update Directus content for post ID:', postData.id, 'Status:', updateResponse.status);
            }
        }

        return postData;
    } catch (error) {
        console.error('Error in updateLinksInHtml function:', slug, error);
        return null;
    }
};


const getAllWordpressPages = async ({ type = 'pages' }) => {

    try {
        const baseUrl = `https://company.science/wp-json/wp/v2/${type}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${WP_USERNAME}:${WP_PASSWORD}`)
        };

        // 1. Fetch the first page with the maximum allowed items per page (100)
        const firstPageUrl = `${baseUrl}?page=1&per_page=100`;
        const response = await fetch(firstPageUrl, { method: 'GET', headers });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const firstPageData = await response.json();

        // 2. Read the total number of pages from the response headers
        const totalPages = parseInt(response.headers.get('X-WP-TotalPages'), 10) || 1;

        let allPagesData = [...firstPageData];

        // 3. If there are more pages, fetch the rest concurrently
        if (totalPages > 1) {
            const pagePromises = [];

            for (let i = 2; i <= totalPages; i++) {
                const pageUrl = `${baseUrl}?page=${i}&per_page=100`;
                pagePromises.push(
                    fetch(pageUrl, { method: 'GET', headers }).then(res => {
                        if (!res.ok) throw new Error(`HTTP error on page ${i}! status: ${res.status}`);
                        return res.json();
                    })
                );
            }

            // Wait for all remaining pages to resolve
            const remainingPagesData = await Promise.all(pagePromises);

            // Flatten the array of arrays into our main list
            allPagesData = allPagesData.concat(remainingPagesData.flat());
        }

        return allPagesData;

    } catch (error) {
        console.error('Error in getAllWordpressPages function:', error);
        return []; // Return an empty array so the app doesn't crash on await
    }
};


(async () => {

    // // console.log('allPosts: ', allPosts.length);
    // const fetchedPages = await getAllWordpressPages({ type: 'pages' });
    // const fetchedPosts = await getAllWordpressPages({ type: 'posts' });
    // console.log('fetchedPages', fetchedPages.length);
    // console.log('fetchedPosts', fetchedPosts.length);
    // const allFetched = [...fetchedPages, ...fetchedPosts];

    // fs.writeFileSync('./migrate/fetchedPages.json', JSON.stringify(fetchedPages, null, 2), 'utf-8');
    // fs.writeFileSync('./migrate/fetchedPosts.json', JSON.stringify(fetchedPosts, null, 2), 'utf-8');

    // // compare allPosts with fetchedPages and fetchedPosts 
    // // to see if there are any missing or extra items
    // const missingInAllPosts = [];
    // const allFetched = [...fetchedPages, ...fetchedPosts];
    // allFetched.forEach(fetchedItem => {
    //     const foundInAllPosts = allPosts.find(post => {
    //         const postId = String(post?.id ?? post?.ID ?? '');
    //         const fetchedId = String(fetchedItem?.id ?? '');
    //         if (postId && fetchedId && postId === fetchedId) {
    //             return true;
    //         }
    //     });
    //     if (!foundInAllPosts) {
    //         missingInAllPosts.push(fetchedItem);
    //     }
    // });
    // console.log('missingInAllPosts', missingInAllPosts.length);
    // fs.writeFileSync('./migrate/missing__InAllPosts.json', JSON.stringify(missingInAllPosts, null, 2), 'utf-8');


    const allFetched = [...allPosts];
    const thisDtusUrl = `${process.env.DIRECTUS_URL}/items/posts?fields=id,slug,title,description&limit=-1`;
    console.log('Fetching all Directus pages from:', thisDtusUrl);
    const allDirectusPagesRes = await fetch(thisDtusUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
        }
    });

    const allDirectusPages = await allDirectusPagesRes.json();
    const directusPages = allDirectusPages?.data || [];
    console.log('directusPages', directusPages.length);
    fs.writeFileSync('./directusPages.json', JSON.stringify(directusPages, null, 2), 'utf-8');


    // comapre based on slug
    const missingInDirectus = [];
    allFetched.forEach(fetchedItem => {
        const fetchedSlug = fetchedItem?.slug || permalinkToSlug(fetchedItem?.link || fetchedItem?.slug || fetchedItem?.['Slug'] || '');
        const foundInDirectus = directusPages.find(page => {
            const directusSlug = page?.slug || page['Slug'] || '';
            return fetchedSlug === directusSlug;
        });
        if (!foundInDirectus) {
            missingInDirectus.push(fetchedItem);
        }
    });
    console.log('missingInDirectus', missingInDirectus.length);
    fs.writeFileSync('./__missing.json', JSON.stringify(missingInDirectus, null, 2), 'utf-8');

    // // find item that match with title but not with slug
    // const titleMatchNotSlug = [];
    // allFetched.forEach(fetchedItem => {
    //     const fetchedSlug = fetchedItem?.slug || permalinkToSlug(fetchedItem?.link || fetchedItem?.slug || '');
    //     const foundInDirectus = directusPages.find(page => {
    //         const directusSlug = page?.slug || '';
    //         const directusTitle = page?.title || '';
    //         const fetchedTitle = fetchedItem?.title?.rendered || fetchedItem?.title || '';
    //         return fetchedTitle === directusTitle && fetchedSlug !== directusSlug;
    //     });
    //     if (foundInDirectus) {
    //         titleMatchNotSlug.push({
    //             fetched: {
    //                 id: fetchedItem?.id,
    //                 title: fetchedItem?.title?.rendered || fetchedItem?.title || '',
    //                 slug: fetchedSlug,
    //             },
    //             directus: {
    //                 id: foundInDirectus?.id,
    //                 title: foundInDirectus?.title || '',
    //                 slug: foundInDirectus?.slug || '',
    //             }
    //         });
    //     }
    // });
    // console.log('titleMatchNotSlug', titleMatchNotSlug.length);
    // fs.writeFileSync('./__titleMatchNotSlug.json', JSON.stringify(titleMatchNotSlug, null, 2), 'utf-8');


    // // filter pages where slug is a number only
    // const directusPages2 = []
    // directusPages.forEach(page => {
    //     const slug = page?.slug || '';
    //     if (/^\d+$/.test(slug)) {
    //         const matchedFetched = allFetched.find(fetchedItem => {
    //             const a = parseInt(fetchedItem?.id ?? '');
    //             const b = parseInt(slug);
    //             return a === b;
    //         });
    //         directusPages2.push({
    //             id: page?.id,
    //             title: page?.title || '',
    //             slug: slug,
    //             matchedFetched: matchedFetched || {}
    //         });
    //     }
    // });
    // console.log('directusPages2', directusPages2.length);
    // fs.writeFileSync('./__directusPages2.json', JSON.stringify(directusPages2, null, 2), 'utf-8');

    const toUpdateInDirectus = [];
    directusPages.forEach(async (page, index) => {
        const foundInAllPosts = allPosts.find(post => {
            return post['Slug'] === page.slug || permalinkToSlug(post?.['Permalink'] || '') === page.slug;
        });
        if (foundInAllPosts) {
            console.log(`Page ${index + 1}: Found in allPosts , Slug: ${page.slug}`);
            const seoTitle = foundInAllPosts?.['rank_math_title'] || '';
            const seoDescription = foundInAllPosts?.['rank_math_description'] || '';

            console.log('SEO title', seoTitle ? true : false);
            console.log('SEO description', seoDescription ? true : false);

            toUpdateInDirectus.push({
                id: page.id,
                slug: page.slug,
                title: page.title,
                description: page.description,
                seo_title: seoTitle,
                seo_description: seoDescription,
                updated: false,
            });
        }
    });
    fs.writeFileSync('./__toUpdateInDirectus.json', JSON.stringify(toUpdateInDirectus, null, 2), 'utf-8');


    const toUpdateInDirectus2 = require('./__toUpdateInDirectus.json');
    console.log('toUpdateInDirectus2', toUpdateInDirectus2.length);
    for (const item of toUpdateInDirectus2) { // limit to first 10 items for testing
        if (item.updated) {
            console.log(`Skipping already updated item with ID: ${item.id}`);
            continue; // skip already updated items
        }
        try {
            const updateResponse = await fetch(`${process.env.DIRECTUS_URL}/items/posts/${item.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
                },
                body: JSON.stringify({
                    seo_title: item.seo_title || '',
                    description: item.seo_description || item.description || '',
                })
            });
            if (updateResponse.ok) {
                item.updated = true;
                // console.log('Directus item updated successfully for ID:', item.id);
            }
        } catch (error) {
            console.error('Error updating Directus item for ID:', item.id, error);
        }
    }


    // const emptyDirectusItems = directusPages.filter((page) => {
    //     return !page.content && !page.title && !page.slug;
    // });
    // console.log('emptyDirectusItems', emptyDirectusItems);


    const emptyDirectusItems = directusPages.filter((page) => {
        return page.seo_title === '%title% %page%'
    });
    console.log('emptyDirectusItems', emptyDirectusItems.length);

    // update and remove the %title% %page% from seo_title
    for (const page of emptyDirectusItems) {
        try {
            const updateResponse = await fetch(`${process.env.DIRECTUS_URL}/items/posts/${page.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
                },
                body: JSON.stringify({
                    seo_title: '',
                })
            });
            if (updateResponse.ok) {
                console.log('Directus item updated successfully for ID:', page.id);
            }
        } catch (error) {
            console.error('Error updating Directus item for ID:', page.id, error);
        }
    }















    // let redoList = false;
    // let thisPagesList = basePages;

    // if (redoList) {
    //     fs.writeFileSync('./migrate/base.json', JSON.stringify([], null, 2), 'utf-8');
    // }

    // if (thisPagesList.length === 0 || redoList) {
    //     console.log('total posts+pages: ', allPosts.length);
    //     // console.log(allPosts[0]);
    //     const pages = allPosts.filter(p => p?.["Post Type"] === 'page');
    //     console.log('total pages: ', pages.length);
    //     const posts = allPosts.filter(p => p?.["Post Type"] === 'post');
    //     console.log('total posts: ', posts.length);

    //     const publishedPages = pages.filter(p => p?.Status === 'publish');
    //     console.log('total published pages: ', publishedPages.length);

    //     thisPagesList = publishedPages.map((p, i) => {
    //         return {
    //             id: p?.['ID'],
    //             link: permalinkToLink(p?.['Permalink']),
    //             slug: permalinkToSlug(p?.['Permalink']),
    //             title: p?.['Title'],
    //             contentLength: (p?.['Content'] || '').length,
    //             converted: false,
    //         }
    //     });
    // }
    // console.log('thisPagesList: ', thisPagesList.length);
    // // console.log(thisPagesList[0]);


    // const excludedSlugs = [
    //     '/', 'home', 'company-science-courses',
    //     'services/individual-services', 'project-management',
    //     'blog-preview', 'blog', 'contact-us', 'contact-m-for-groups',
    //     'company-science-news', 'about-us/meet-the-team', 'why-were-different',
    //     'about-us/track-record', 'about-us/testimonials',
    //     "erc-eligibility-calculator",
    //     "erc-panel-members-database",
    //     "msca-pf-eligibility-calculator",
    //     "horizon-europe-partner-database",
    //     "free-webinar-library", "dist", 'new-calc-copy',

    //     //already done
    //     'quick-dive-review-service',
    //     'erc-quick-dive-review-service',

    //     "company-science-courses",
    //     "services/individual-services",
    //     "project-management",
    //     "blog-preview",
    //     "company-sciences-free-tools",
    //     "company-science-news",
    //     "about-us/meet-the-team",
    //     "why-were-different",
    //     "about-us/track-record",
    //     "about-us/testimonials",
    //     "contact-us",
    //     "writing-competitive-erc-proposal",
    //     "erc-interview-course",
    //     "horizon-europe-course",
    //     "workshops/budget-in-horizon-europe-projects",
    //     "lump-sum-funding",
    //     "workshops/impact-in-horizon-europe",
    //     "the-excellence-section-in-horizon-europe",
    //     "the-implementation-section-in-horizon-europe",
    //     "twinning",
    //     "teaming-for-excellence",
    //     "workshops/eic-pathfinder-open-course",
    //     "workshops/eic-transition-open",
    //     "msca-pf-course",
    //     "msca-dn-course",
    //     "customized-courses-for-research-managers-and-funding-advisors",
    //     "being-a-horizon-europe-coordinator-understanding-the-coordinator-role/",
    //     "the-horizon-europe-project-set-up/",
    //     "technical-management-and-reporting/",
    //     "horizon-europe-financial-rules/",
    //     "working-with-the-budget-in-actual-cost-model-projects/",
    //     "managing-a-lump-sum-project/",
    //     "financial-management-and-reporting-inc-ec-reviews-and-audits/",
    //     "understanding-the-grant-agreement-ga-and-the-description-of-action-doa/",
    //     "understanding-the-consortium-agreement/",
    //     "company/18285478/",
    //     "YoramBarZeev", 
    //     "start-preparing-your-portugal-2030-application",
    //     "oportunidades-de-financiamento-a-fundo-no-portugal-2030",
    //     "funding-opportunities-in-portugal-2030",
    //     "privacy-policy",
    //     "terms-of-service",
    //     "company-science-terms-of-use"
    // ];
    // let filteredPagesList = thisPagesList;
    // // filteredPagesList = thisPagesList.filter(page => !excludedSlugs.includes(page.slug));
    // // filteredPagesList = filteredPagesList.filter(page => !page.converted);
    // // console.log('excludedSlugs: ', excludedSlugs.length);
    // console.log('filteredPagesList: ', filteredPagesList.length);

    // filteredPagesList = filteredPagesList.slice(10)

    //================================
    // convert pages to new structure using ai
    //  
    // ===============================
    // for (const page of filteredPagesList) {
    //     if (excludedSlugs.includes(page.slug)) {
    //         console.log('Skipping excluded page:', page.slug);
    //         continue;
    //     }
    //     if (page.converted) {
    //         console.log('Skipping already converted page:', page.slug);
    //         continue;
    //     }
    //     // console.log('Processing page:', page.slug);
    //     const parseResponse = await parseWpPage({ page: page.link });
    //     if (parseResponse) {
    //         page.converted = true;
    //         page.aiResponse = {
    //             ...parseResponse,
    //             choices: []
    //         };
    //     }
    // }
    // // save to base.json
    // saveToJson('./migrate/base.json', thisPagesList);



    //================================
    //  update links in the content to be relative instead 
    // of absolute, 
    // for example https://tools.company.science/contact-m-for-groups/?course=HE_Implementation 
    // should become /contact-m-for-groups/?course=HE_Implementation
    //  
    // ===============================
    // filteredPagesList = filteredPagesList.filter(page => page.slug === 'services/individual-services/deep-dive-review')
    // const result = []
    // for (const page of filteredPagesList) {
    //     console.log('===============================');
    //     console.log('Processing page:', page.slug);
    //     const updateResult = await updateLinksInHtml(page.slug);
    //     if (updateResult) {
    //         result.push({
    //             slug: page.slug,
    //             linksDone: true,
    //         });
    //         // console.log('Directus update result:', result);
    //     } else {
    //         result.push({
    //             slug: page.slug,
    //             linksDone: false,
    //         });
    //         // console.log('No result for page:', page.slug);
    //     }
    // }
    // console.log('All pages processed. Total:', result);

    // parseWpPage({
    //     page: "https://company.science/grants/erc/erc-review-panel-members-database/"
    // });


    // ===============================
    // just fetc all pages to warm cache
    // console.log(allPosts.length, 'Starting to fetch all pages to warm cache...');
    // for (let i = 0; i < allPosts.length; i++) {
    //     // if (i > 2) {
    //     //     break;
    //     // }
    //     const page = allPosts[i];

    //     const slug = permalinkToSlug(page?.['Permalink']);
    //     console.log(page?.['Permalink'], '=>', slug);

    //     const url = 'https://dev.company.science/' + slug;
    //     console.log(i, 'fetching url:', url);
    //     fetch(url)
    // }

})()


