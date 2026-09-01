const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const { urlsInput } = require('./urls_input');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const outputFileName = 'fetchedUrls.json';
const urls = urlsInput;
const fetchedData = require(`./${outputFileName}`);
const domain = 'https://www.drivingtests.co.nz';

const makeBatchArr = (arr, batchSize) => {
    const batches = [];
    for (let i = 0; i < arr.length; i += batchSize) {
        batches.push(arr.slice(i, i + batchSize));
    }
    return batches;
}

const urlToPathname = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.replace(/^\//, '').replace(/\/$/, '');
    }
    catch (error) {
        console.error(`Invalid URL: ${url}`);
        return null;
    }
};
const getCategoriesFromHtml = (html) => {
    try {
        const $ = cheerio.load(html);

        // Extract text nodes inside .post-data to locate "Posted in"
        const postData = $('.post-data');

        // Find all <a> elements inside .post-data that do NOT have rel="tag"
        const categories = postData
            .find('a:not([rel="tag"])')
            .map((_, el) => $(el).text().trim())
            .get();

        return categories.join(' | ');
    } catch (error) {
        console.error('Error parsing HTML for categories:', error);
        return '';
    }
};
const addRandomDates = ({ data, start, end }) => {
    try {
        if (!Array.isArray(data) || data.length === 0) return [];

        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();

        if (isNaN(startTime) || isNaN(endTime)) {
            throw new Error('Invalid start or end date provided.');
        }

        const totalRange = endTime - startTime;
        const interval = totalRange / data.length;

        return data.map((item, index) => {
            // Create a specific bucket for each item to guarantee even distribution
            const bucketStart = startTime + index * interval;
            const bucketEnd = bucketStart + interval;

            // Pick a random timestamp within that bucket to introduce natural variance
            const randomTimestamp = bucketStart + Math.random() * (bucketEnd - bucketStart);

            // Format timestamp as YYYY-MM-DD
            const dateCreated = new Date(randomTimestamp).toISOString().split('T')[0];

            return {
                ...item,
                date_created: dateCreated
            };
        });

    } catch (error) {
        console.error('Error adding random dates:', error);
        return data;
    }
};
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

const processItem = async (item) => {
    try {
        const prompt = `
        You are an expert editor and web content writer.

        Task:
        Paraphrase the HTML content below to have the same content but with different wording.
        Make sure html, body, main, aside..etc tags are removed as it will be inserted into an existing page.

        Requirements:
        1. Preserve Meaning: Maintain the core message, key details, and original tone. Do not invent facts or omit important context.
        2. Structure & Formatting: You may break long paragraphs into multiple <p> tags, use headings (e.g., <h2>, <h3>), or re-organize into sections where logical to improve clarity.
        3. Strict Output Format: Return ONLY valid, unbroken HTML. Do NOT wrap the response in Markdown code blocks, and do NOT include any introductory or concluding conversational text.
        4. Use only tailwind classes for styling anything else should be removed.

        Content to paraphrase:
        ${item.content}
    `;

        const aiResponse = await aiRequest({
            model: 'gpt-5.6-luna',
            inputPrice: 0.20,
            outputPrice: 1.20,
            prompt
        });

        const newItem = {
            ...item,
        };

        if (aiResponse.text) {
            newItem.content = aiResponse.text;

            console.log(
                `Price USD: ${aiResponse.totalPriceUsd.toFixed(4)}, Paraphrased content for URL: ${item.url}`
            );
        } else {
            console.error(
                `No paraphrased content returned for URL: ${item.url}`
            );
        }

        return newItem;

    } catch (error) {
        console.error(
            `Error paraphrasing content for URL: ${item.url}`,
            error
        );
        return null;
    }
};



const fetchUrls = async ({
    urls = [], outputFileName,
    selector = '.course-details', selectors = [],
    paraphrase = false
}) => {
    const data = [];

    console.log('====================================');
    console.log('Fetching URLs:', urls.length);


    try {
        for (const obj of urls) {

            const url = obj?.url || obj;
            const preHtml = obj?.html || null;

            console.log(`Fetching URL: ${url}`);

            let textHtml = '';
            if (!preHtml) {
                const response = await fetch(url);
                textHtml = await response.text();
            } else {
                textHtml = preHtml;
            }
            console.log(`Fetched HTML length for ${url}: ${textHtml.length} characters`);

            const html = textHtml;
            const $ = cheerio.load(html);

            // update all relative images src to absolute
            $('img').each((_, el) => {
                const src = $(el).attr('src');
                if (src && !src.startsWith('http')) {
                    const absoluteSrc = new URL(src, domain).href;
                    $(el).attr('src', absoluteSrc);
                }
            });

            const extractMediaFromString = (htmlString) => {
                if (typeof htmlString !== 'string') return { videoUrl: '', imageUrl: '' };

                const normalizeUrl = (value) => {
                    if (!value) return '';
                    let url = value.trim();
                    if (url.startsWith('//')) url = `https:${url}`;
                    return url;
                };

                const directVideoPatterns = [
                    /https?:\/\/(?:www\.)?youtube\.com\/embed\/[A-Za-z0-9_-]+[^\s"'<>]*/i,
                    /https?:\/\/(?:www\.)?youtu\.be\/[A-Za-z0-9_-]+[^\s"'<>]*/i,
                    /https?:\/\/player\.vimeo\.com\/video\/\d+[^\s"'<>]*/i,
                    /https?:\/\/vimeo\.com\/(?:video\/)?\d+[^\s"'<>]*/i,
                    /https?:\/\/[^\s"'<>]+\.(?:mp4|webm|mov|m4v)(?:\?[^\s"'<>]*)?/i
                ];

                const directImagePatterns = [
                    /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|avif|svg)(?:\?[^\s"'<>]*)?/i,
                    /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|avif|svg)[^\s"'<>]*/i
                ];

                let videoUrl = '';
                for (const pattern of directVideoPatterns) {
                    const match = htmlString.match(pattern);
                    if (match) {
                        videoUrl = normalizeUrl(match[0]);
                        break;
                    }
                }

                if (!videoUrl) {
                    const iframeMatch = htmlString.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i) ||
                        htmlString.match(/<video[^>]+src=["']([^"']+)["'][^>]*>/i) ||
                        htmlString.match(/<source[^>]+src=["']([^"']+)["'][^>]*>/i);

                    if (iframeMatch) videoUrl = normalizeUrl(iframeMatch[1]);
                }

                let imageUrl = '';
                const imgMatch = htmlString.match(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/i);
                if (imgMatch) {
                    imageUrl = normalizeUrl(imgMatch[1]);
                } else {
                    const bgMatch = htmlString.match(/background-image\s*:\s*url\(["']?([^"'\)]+)["']?\)/i);
                    if (bgMatch) imageUrl = normalizeUrl(bgMatch[1]);
                }

                if (!imageUrl) {
                    for (const pattern of directImagePatterns) {
                        const match = htmlString.match(pattern);
                        if (match) {
                            imageUrl = normalizeUrl(match[0]);
                            break;
                        }
                    }
                }

                return { videoUrl, imageUrl };
            };
            const getImage = ($) => {
                let img = $('.video').find('.video-content-wrapper').find('img').attr('src') || '';
                // if doenst have domain add https://www.drivingtests.co.nz/
                if (img && !img.startsWith('http')) {
                    img = `https://www.drivingtests.co.nz/${img.replace(/^\//, '')}`;

                    return img.trim() || '';
                };
            };
            // 1. Remove non-content / bloat elements inside the page
            $('script, style, iframe, nav, footer, header, .ads, .social-share').remove();




            const el = $(selector).first();
            let content = el.prop('outerHTML') || '';

            if (paraphrase) {
                // paraphrase content using AI
                console.log(`Paraphrasing content for URL: ${url}`, content.length, 'characters');
                let newPt = await processItem({ content, url });
                // console.log('paraphrase', newPt);
                content = newPt.content || content;
            }

            const coursesOnlyContent = () => {
                if (!url.includes('/course')) {
                    console.log(`Skipping courses content extraction for URL: ${url} (not a course page)`);
                    return null;
                }
                const cleanText = (text) => {
                    if (!text) return '';
                    return String(text)
                        .replace(/&nbsp;/gi, ' ')            // Replace HTML non-breaking space entities
                        .replace(/&quot;/gi, '"')           // Decode HTML quotes
                        .replace(/[\r\n\t\f\v\xa0]+/g, ' ') // Replace line breaks, tabs, non-breaking spaces
                        .replace(/\s+/g, ' ')               // Collapse multiple spaces into one
                        .trim();                            // Strip leading/trailing space
                };
                try {
                    // build new html
                    const media = extractMediaFromString(content);
                    const title = $('h1').first().text().trim();
                    const description = $('.heading ').eq(1).text().trim();
                    const price = $('.course-price ').eq(0).text().trim();
                    const { videoUrl } = media;
                    const imageUrl = getImage($) || media.imageUrl || '';
                    const benefits = $('.benefits .buying-info-benefit')
                        .map((_, el) => {
                            // Get text and remove the green checkmark/bullet span content if it exists
                            const text = $(el).contents().not('span').text().trim();
                            // If the span is empty and text is just in the p tag:
                            return text || $(el).text().trim();
                        })
                        .get()
                        .filter(text => text.length > 0); // Remove empty strings

                    const otherContent = [];


                    const shortDescription = $('.short-description').text().trim();
                    otherContent.push({
                        title: 'Description',
                        content: [shortDescription],
                        subSections: []
                    });

                    // get text from .description
                    $('section.description > ul > li').each((i, el) => {
                        const sectionTitle = $(el).find('h2 .title').text().trim();
                        const content = [];

                        // Find all text or list items inside the content div
                        $(el).find('div > ul > li').each((j, li) => {
                            content.push($(li).text().trim());
                        });

                        // If there are subheadings (h3) like "Driver health and safety"
                        const subSections = {};
                        $(el).find('div h3').each((k, h3) => {
                            const subTitle = $(h3).text().trim();
                            const items = [];
                            $(h3).next('ul').find('li').each((l, li) => {
                                items.push($(li).text().trim());
                            });
                            subSections[subTitle] = items;
                        });

                        otherContent.push({
                            title: sectionTitle,
                            content,
                            subSections: Object.entries(subSections).map(([title, content]) => ({ title, content }))
                        });
                    });


                    let html = `
                    <div>{{${cleanText(`component.courses.template1({})`)}}}</div>
                    `;


                    const data = {
                        title: cleanText(title),
                        description: cleanText(description),
                        price: cleanText(price),
                        videoUrl: cleanText(videoUrl),
                        imageUrl: cleanText(imageUrl),
                        benefits: benefits.map(cleanText),
                        conclusion: '',
                        otherContent,
                    };

                    return { html, data };

                } catch (error) {
                    console.error(`Error extracting courses content for URL: ${url}`, error);
                    return { html: '', data: {} };
                }
            }

            const pd = {
                type: 'page',
                title: $('title').text().trim(),
                description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
                // content: coursesOnlyContent().html || content,
                content: content,
                image: $('meta[property="og:image"]').attr('content') || '',
                slug: typeof urlToPathname === 'function' ? urlToPathname(url) : new URL(url).pathname,
                categories: typeof getCategoriesFromHtml === 'function' ? getCategoriesFromHtml(html) : '',
                url: url,
                // data: coursesOnlyContent().data || {}
            };

            data.push(pd);
        }

        fs.writeFileSync(path.resolve(__dirname, `./${outputFileName}`), JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Fetched data saved to ${outputFileName}\n\n`);

        return data;

    } catch (error) {
        console.error('Error fetching URLs:', error);
        return data;
    }
};




(async () => {
    await fetchUrls({
        urls,
        outputFileName,
        selector: '.content-frame',
        paraphrase: true,
    });

    // const data = await addRandomDates({ data: fetchedData, start: '2022-01-01', end: '2025-06-06' });
    // fs.writeFileSync(path.resolve(`./${outputFileName}`), JSON.stringify(data, null, 2), 'utf-8');


    // // clean data 
    // const newData = fetchedData.map(item => {
    //     let newContent = item.content;
    //     newContent = newContent
    //         .trim()
    //         .replace('       \n\t\t\t\t\n                \n\t\t\t\t', '')
    //         .replaceAll(/&quot;/g, '');


    //     // // locate and remove h1 tag 
    //     // newContent = newContent.replace(/<h1[^>]*>.*?<\/h1>/is, '');

    //     const newItem = {
    //         ...item,
    //         content: newContent
    //     };
    //     return newItem;
    // });
    // fs.writeFileSync(path.resolve(`./${outputFileName}`), JSON.stringify(newData, null, 2), 'utf-8');
    // console.log(`Cleaned data saved to ${outputFileName}`);

    // // paraphrase content using AI
    // const processItem = async (item) => {
    //     try {
    //         const prompt = `
    //         You are an expert editor and web content writer.

    //         Task:
    //         Paraphrase the HTML content below to have the same content but with different wording.

    //         Requirements:
    //         1. Preserve Meaning: Maintain the core message, key details, and original tone. Do not invent facts or omit important context.
    //         2. Structure & Formatting: You may break long paragraphs into multiple <p> tags, use headings (e.g., <h2>, <h3>), or re-organize into sections where logical to improve clarity.
    //         3. Strict Output Format: Return ONLY valid, unbroken HTML. Do NOT wrap the response in Markdown code blocks, and do NOT include any introductory or concluding conversational text.

    //         Content to paraphrase:
    //         ${item.content}
    //     `;

    //         const aiResponse = await aiRequest({
    //             model: 'gpt-5.6-luna',
    //             inputPrice: 0.20,
    //             outputPrice: 1.20,
    //             prompt
    //         });

    //         const newItem = {
    //             ...item,
    //         };

    //         if (aiResponse.text) {
    //             newItem.content = aiResponse.text;

    //             console.log(
    //                 `Price USD: ${aiResponse.totalPriceUsd.toFixed(4)}, Paraphrased content for URL: ${item.url}`
    //             );
    //         } else {
    //             console.error(
    //                 `No paraphrased content returned for URL: ${item.url}`
    //             );
    //         }

    //         return newItem;

    //     } catch (error) {
    //         console.error(
    //             `Error paraphrasing content for URL: ${item.url}`,
    //             error
    //         );
    //         return null;
    //     }
    // };
    // const toParaphrase = fetchedData;
    // const batch = makeBatchArr(toParaphrase, 20);
    // const paraphraseData = [];

    // for (let i = 0; i < batch.length; i++) {
    //     const currentBatch = batch[i];

    //     console.log(`Processing batch ${i + 1} of ${batch.length}...`);

    //     const results = await Promise.all(
    //         currentBatch.map(item => processItem(item))
    //     );

    //     paraphraseData.push(
    //         ...results.filter(Boolean)
    //     );
    // }
    // console.log('Finished:', paraphraseData.length);
    // console.log('paraphraseData: ', paraphraseData.length);
    // fs.writeFileSync(path.resolve('./fetchedUrlsParaphrased.json'), JSON.stringify(paraphraseData, null, 2), 'utf-8');

})();