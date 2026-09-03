const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;
const NEXT_PUBLIC_DIRECTUS_TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || process.env.PUBLIC_DIRECTUS_TOKEN;

const parseJsonWithRecovery = (rawText) => {
    const text = (rawText || '').trim();
    if (!text) return { ok: true, data: null, recovered: false };

    try {
        return { ok: true, data: JSON.parse(text), recovered: false };
    } catch (error) {
        // Some proxies append characters after a valid JSON payload.
        const firstChar = text[0];
        if (firstChar !== '{' && firstChar !== '[') {
            return { ok: false, error, recovered: false };
        }

        let depth = 0;
        let inString = false;
        let escaped = false;

        for (let i = 0; i < text.length; i++) {
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
                const candidate = text.slice(0, i + 1);
                try {
                    return { ok: true, data: JSON.parse(candidate), recovered: true };
                } catch {
                    // keep scanning until we find a valid balanced JSON candidate
                }
            }
        }

        return { ok: false, error, recovered: false };
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
        console.log('directusRequest url: ', url);

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
        const contentType = response.headers.get('content-type') || 'unknown';
        const rawText = await response.text();
        const parsed = parseJsonWithRecovery(rawText);

        if (!parsed.ok) {
            const bodyPreview = rawText.slice(0, 300).replace(/\s+/g, ' ').trim();
            resObj.message = `Failed to parse JSON response. Status: ${response.status}. Content-Type: ${contentType}. URL: ${url}. Preview: ${bodyPreview}`;
            return resObj;
        }

        const json = parsed.data;

        if (parsed.recovered) {
            resObj.warning = true;
            resObj.message = 'Response contained trailing non-JSON characters; payload was recovered.';
            console.warn('directusRequest: Recovered JSON from malformed response. URL:', url);
        }

        console.log('json ==> ', json);

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