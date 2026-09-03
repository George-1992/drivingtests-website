const DIRECTUS_URL = (process.env.DIRECTUS_URL || '').trim();
const DIRECTUS_API_TOKEN = (process.env.DIRECTUS_API_TOKEN || '').replace(/[\r\n]+/g, '').trim();
const NEXT_PUBLIC_DIRECTUS_TOKEN = (process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || process.env.PUBLIC_DIRECTUS_TOKEN || '').trim();

const extractBalancedJsonAt = (text, startIndex) => {
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = startIndex; i < text.length; i++) {
        const ch = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
            } else if (ch === '\\') {
                escaped = true;
            } else if (ch === '"') {
                inString = false;
            }
            continue;
        }

        if (ch === '"') {
            inString = true;
            continue;
        }

        if (ch === '{' || ch === '[') depth++;
        if (ch === '}' || ch === ']') depth--;

        if (depth === 0) {
            const candidate = text.slice(startIndex, i + 1);
            try {
                return { ok: true, data: JSON.parse(candidate) };
            } catch {
                return { ok: false, data: null };
            }
        }
    }

    return { ok: false, data: null };
};

const parseJsonWithRecovery = (rawText) => {
    const text = (rawText || '').trim();
    if (!text) return { ok: true, data: null, recovered: false };

    try {
        return { ok: true, data: JSON.parse(text), recovered: false };
    } catch {
        // Remove NUL bytes often introduced by broken upstream/proxy framing.
        const cleaned = text.replace(/\u0000/g, '');

        const likelyStarts = [
            cleaned.indexOf('{"data"'),
            cleaned.indexOf('{"errors"'),
            cleaned.indexOf('{"meta"'),
            cleaned.indexOf('{'),
            cleaned.indexOf('['),
        ].filter((idx) => idx >= 0);

        for (const startIndex of likelyStarts) {
            const parsed = extractBalancedJsonAt(cleaned, startIndex);
            if (parsed.ok) {
                return { ok: true, data: parsed.data, recovered: true };
            }
        }

        return { ok: false, data: null, recovered: false };
    }
};



export const directusRequest = async ({
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
        meta: null,
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


    const _dtusUrl = DIRECTUS_URL.endsWith('/') ? DIRECTUS_URL.slice(0, -1) : DIRECTUS_URL;


    try {
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

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

            queryString = `?${searchParams.toString()}`;
        }

        const randomString = Math.random().toString(36).substring(2, 8);
        const randomParam = `${queryString ? '&' : '?'}random=${randomString}`;
        const url = `${_dtusUrl}${normalizedEndpoint}${queryString}${randomParam}`;

        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`
        };


        // Avoid sending Content-Type on GET/HEAD because some proxies reject it.
        if (isPost) {
            headers['Content-Type'] = 'application/json';
        }

        const options = {
            method,
            headers,
        };
        if (isPost) {
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type') || 'unknown';
        const rawText = await response.text();

        if (!response.ok) {
            resObj.success = false;
            resObj.message = `Directus request failed:  ${JSON.stringify(response)}`;
            resObj.data = {
                response: JSON.stringify(response),
            }
            return resObj;
        }

        const parsed = parseJsonWithRecovery(rawText);
        if (!parsed.ok) {
            const preview = rawText
                .replace(/\u0000/g, '')
                .replace(/\s+/g, ' ')
                .slice(0, 240)
                .trim();

            resObj.success = false;
            resObj.message = `Failed to parse JSON response. Status: ${response.status}. Content-Type: ${contentType}.`;
            resObj.data = {
                preview,
            }
            return resObj;
        }

        const json = parsed.data;

        if (parsed.recovered) {
            resObj.warning = true;
            resObj.message = 'Recovered JSON from mixed upstream payload.';
            console.warn('directusRequest: recovered JSON from noisy upstream response:', url);
        }

        // console.log('json ==> ', json);

        if (json?.errors) {
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
        resObj.message = json?.message || resObj.message || '';
        resObj.data = json?.data || null;
        resObj.meta = json?.meta || null;
        return resObj;

    } catch (error) {
        console.error('directusRequest: Error during Directus request:', error);
        resObj.message = error.message || 'An error occurred';
        return resObj;
    }
}

export const getFileUrlDirectus = (fileId) => {

    const isUrl = typeof fileId === 'string' && (fileId.startsWith('http://') || fileId.startsWith('https://'));
    const isId = !isUrl && typeof fileId === 'string' && /^[a-zA-Z0-9_-]+$/.test(fileId);

    if (isUrl && !fileId.includes(NEXT_PUBLIC_DIRECTUS_TOKEN)) {
        // if its already a url but doesn't have the token, append it
        return fileId + `?access_token=${NEXT_PUBLIC_DIRECTUS_TOKEN}`;
    } else if (isId) {
        // if its an id, construct the url
        return `${DIRECTUS_URL}/assets/${fileId}?access_token=${NEXT_PUBLIC_DIRECTUS_TOKEN}`;
    } else {
        return fileId; // return as is (could be a url with token or some other string)
    }

};

// example request
// directusRequest({
//     method: 'GET',
//     endpoint: '/items/posts',
//     params: {
//         filter: {
//             status: {_eq: 'published'}
//         },
//         sort: '-created_at',
//         limit: 10
//     }
// })