import PostTemplate from "@/components/renderer/templates/post";
import { getFileUrlDirectus } from "@/services/directus";
import { logger } from "@/utils/logger";
import Image from "next/image";
import Link from "next/link";



export const replaceHtmlEntities = (str) => {
    let _str = str;
    if (!_str || typeof _str !== 'string') {
        return _str;
    }
    _str = _str
        .replaceAll(/&amp;/g, '&')
        .replaceAll(/&lt;/g, '<')
        .replaceAll(/&gt;/g, '>')
        // .replaceAll(/&quot;/g, '"')
        .replaceAll(/&ldquo;|&rdquo;/g, '"')
        .replaceAll(/&#39;/g, "'")
        .replaceAll(/&apos;/g, "'")
        .replaceAll(/&lsquo;|&rsquo;/g, "'")
        .replaceAll(/&nbsp;/g, ' ')
        .replaceAll(/&ndash;/g, '-')
        .replaceAll(/&mdash;/g, '--')
        .replaceAll(/&hellip;/g, '...')
        .replaceAll(/&copy;/g, '©')
        .replaceAll(/&reg;/g, '®')
        .replaceAll(/&euro;/g, '€')
        .replaceAll(/&pound;/g, '£')
        .replaceAll(/&yen;/g, '¥')
        .replaceAll(/&bull;/g, '•')
        .replaceAll(/&trade;/g, '™')
        .replaceAll(/&frasl;/g, '/')
        .replaceAll(/&uuml;/g, 'ü')
        .replaceAll(/&auml;/g, 'ä')
        .replaceAll(/&ouml;/g, 'ö')
        .replaceAll(/&szlig;/g, 'ß')
        .replaceAll(/&szlig;/g, 'ß')
        .replaceAll(/&lt;/g, '<')
        .replaceAll(/&gt;/g, '>')
        .replaceAll('frameborder', 'frameBorder')
        .replaceAll('referrerpolicy', 'referrerPolicy')
        .replaceAll(/\\r\\n/g, '\n')
        .replaceAll(/\\n/g, '\n')
        .replaceAll(/\\t/g, '\t')
        .replaceAll(/[\u2018\u2019]/g, "'")
        .replaceAll(/[\u201C\u201D]/g, '"')
        .replaceAll(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replaceAll(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // just in case
    // .replaceAll('&quot', '')
    // .replaceAll('&quot;', '')


    // debug only save html in data
    // fs.writeFileSync('./data/content.html', _str);

    return _str;
};

const resolveImportedComponent = async (componentRef) => {
    const normalizeComponentKey = (componentRef) => {
        if (!componentRef || typeof componentRef !== 'string') {
            return '';
        }

        return componentRef
            .trim()
            .replace(/^@components\//, '')
            .replace(/\./g, '/')
            .replace(/\/+/g, '/')
            .replace(/^\/+|\/+$/g, '');
    };
    const componentKey = normalizeComponentKey(componentRef);

    if (!componentKey) {
        return null;
    }

    // logger.log(`Attempting to load component: ${componentKey}`);

    try {
        const importedComponent = await import(`../${componentKey}`);
        return importedComponent?.default || null;
    } catch (error) {
        console.error(`Error loading component ${componentRef}:`, error);
        return null;
    }
};

const extractBlockPayload = (content) => {
    const blockStart = content.indexOf('{{block:');

    if (blockStart === -1) {
        return null;
    }

    const jsonStart = blockStart + '{{block:'.length;
    if (content[jsonStart] !== '{') {
        return null;
    }

    let depth = 0;
    let inString = false;
    let stringDelimiter = '';
    let isEscaped = false;

    for (let index = jsonStart; index < content.length; index += 1) {
        const char = content[index];

        if (inString) {
            if (isEscaped) {
                isEscaped = false;
                continue;
            }

            if (char === '\\') {
                isEscaped = true;
                continue;
            }

            if (char === stringDelimiter) {
                inString = false;
                stringDelimiter = '';
            }

            continue;
        }

        if (char === '"' || char === "'") {
            inString = true;
            stringDelimiter = char;
            continue;
        }

        if (char === '{') {
            depth += 1;
            continue;
        }

        if (char === '}') {
            depth -= 1;

            if (depth === 0) {
                const payload = content.slice(jsonStart, index + 1);
                const closing = content.slice(index + 1, index + 3);

                if (closing === '}}') {
                    return payload;
                }

                return null;
            }
        }
    }

    return null;
};
const VOID_TAGS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr', 'hr',
]);

const parseAttributes = (rawAttrs = '') => {
    const attributes = {};
    if (!rawAttrs || typeof rawAttrs !== 'string') {
        return attributes;
    }

    let remainingAttrs = rawAttrs;
    let maxTries = 1000; // Prevent infinite loops

    const isValidAttributeName = (name) => {
        if (!name || typeof name !== 'string') {
            return false;
        }

        // Reject obvious malformed names that usually come from broken JSON fragments.
        if (/["'{}(),]/.test(name)) {
            return false;
        }

        // HTML-compatible attribute names, including data-* and aria-*.
        return /^[a-zA-Z_:][a-zA-Z0-9:._-]*$/.test(name);
    };

    const getAttributeValue = (quoted, singleQuoted, unquoted) => {
        return quoted ?? singleQuoted ?? unquoted ?? true;
    };

    // 1) Handle explicit special-case mappings first.
    const specialMapping = {
        'class': 'className',
        'for': 'htmlFor',
        'tabindex': 'tabIndex',
        'srcset': 'srcSet',
        'aria-controls': 'aria-controls',
        'aria-describedby': 'aria-describedby',
        'aria-hidden': 'aria-hidden',
        'allowfullscreen': 'allowFullScreen',
        'aria-c': 'aria-controls',
        'SmushPlaceholderWidth': 'SmushPlaceholderWidth',
    };

    const extractMappedAttribute = (htmlName, reactName) => {
        const mappedRegex = new RegExp(`(?:^|\\s)${htmlName}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+)))?(?=\\s|$)`, 'i');
        const match = remainingAttrs.match(mappedRegex);
        if (!match) {
            return;
        }

        const hasExplicitValue = match[1] !== undefined || match[2] !== undefined || match[3] !== undefined;
        if (isValidAttributeName(reactName)) {
            if (hasExplicitValue) {
                attributes[reactName] = getAttributeValue(match[1], match[2], match[3]);
            }
        }
        remainingAttrs = remainingAttrs.replace(match[0], ' ');
    };

    Object.entries(specialMapping).forEach(([htmlName, reactName]) => {
        extractMappedAttribute(htmlName, reactName);
    });

    // 2) Extract remaining aria-* and data-* attributes and preserve their names.
    const ariaDataRegex = /\b((?:aria|data)-[a-zA-Z0-9_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+)))?/gi;
    remainingAttrs = remainingAttrs.replace(ariaDataRegex, (_, name, quoted, singleQuoted, unquoted) => {
        if (quoted !== undefined || singleQuoted !== undefined || unquoted !== undefined) {
            attributes[name.toLowerCase()] = getAttributeValue(quoted, singleQuoted, unquoted);
        }
        return ' ';
    });

    // 3) Parse all remaining attributes.
    const attrRegex = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+)))?/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(remainingAttrs)) !== null) {
        const name = attrMatch[1];
        if (!isValidAttributeName(name)) {
            continue;
        }

        const value = getAttributeValue(attrMatch[2], attrMatch[3], attrMatch[4]);
        attributes[name] = value;

        if (--maxTries <= 0) {
            console.error('Max tries reached while parsing attributes. Possible malformed HTML.');
            break;
        }
    }


    return attributes;
};

const cssStringToObject = (styleString) => {
    if (!styleString || typeof styleString !== 'string') {
        return {};
    }

    const styleObject = {};
    const declarations = styleString.split(';');

    for (const decl of declarations) {
        if (!decl.trim()) continue;

        const [property, ...valueParts] = decl.split(':');
        const cleanProp = property.trim();
        const cleanValue = valueParts.join(':').trim();

        if (cleanProp && cleanValue) {
            const camelCaseProp = cleanProp.replace(/-([a-z])/g, (match, char) => char.toUpperCase());
            styleObject[camelCaseProp] = cleanValue;
        }
    }

    return styleObject;
};

const VIDEO_BOOLEAN_ATTRIBUTES = new Set([
    'controls',
    'autoPlay',
    'loop',
    'muted',
    'playsInline',
]);

const normalizeVideoAttributes = (attributes = {}) => {
    const normalizedAttributes = {};

    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'autoplay') {
            normalizedAttributes.autoPlay = value === true ? true : value;
            return;
        }

        if (key === 'playsinline') {
            normalizedAttributes.playsInline = value === true ? true : value;
            return;
        }

        if (key === 'controlslist') {
            normalizedAttributes.controlsList = value;
            return;
        }

        if (value === true && !VIDEO_BOOLEAN_ATTRIBUTES.has(key)) {
            return;
        }

        normalizedAttributes[key] = value;
    });

    return normalizedAttributes;
};

const parseHtmlToNestedArray = (content) => {
    const COMPONENT_START = '{{component.';

    if (!content || typeof content !== 'string') {
        return [];
    }
    // fs.writeFileSync('./data/parser/content.txt', JSON.stringify(content, null, 2));


    const getTokens = (html) => {
        const tokenRegex = /<!--[\s\S]*?-->|<[^>]+>|[^<]+/g;
        const tokens = [];
        let match;
        let maxTries = 10000; // Prevent infinite loops
        while ((match = tokenRegex.exec(html)) !== null) {
            tokens.push(match[0]);
            if (--maxTries <= 0) {
                logger.error('Max tries reached while tokenizing HTML. Possible malformed HTML.');
                break;
            }
        } return tokens;
    };

    const parseInlineComponentNodes = (textContent) => {
        const nodes = [];
        let cursor = 0;
        let maxTries = 10000;

        while (cursor < textContent.length) {
            if (--maxTries <= 0) {
                logger.error('Max tries reached while parsing inline components. Possible malformed content.');
                break;
            }

            const start = textContent.indexOf(COMPONENT_START, cursor);
            if (start === -1) {
                const trailing = textContent.slice(cursor);
                if (trailing) {
                    nodes.push({ type: 'text', content: trailing });
                }
                break;
            }

            const before = textContent.slice(cursor, start);
            if (before) {
                nodes.push({ type: 'text', content: before });
            }

            const typeStart = start + COMPONENT_START.length;
            const openParen = textContent.indexOf('(', typeStart);
            if (openParen === -1) {
                nodes.push({ type: 'text', content: textContent.slice(start) });
                break;
            }

            const blockType = textContent.slice(typeStart, openParen).trim();
            const jsonStart = openParen + 1;

            const emptyParamsMatch = textContent.slice(jsonStart).match(/^\s*\)\}\}/);
            if (emptyParamsMatch) {
                nodes.push({
                    type: 'component',
                    blockType,
                    props: {},
                });
                cursor = jsonStart + emptyParamsMatch[0].length;
                continue;
            }

            if (textContent[jsonStart] !== '{') {
                nodes.push({ type: 'text', content: textContent.slice(start, openParen + 1) });
                cursor = openParen + 1;
                continue;
            }

            let depth = 0;
            let inString = false;
            let stringDelimiter = '';
            let isEscaped = false;
            let jsonEnd = -1;

            for (let index = jsonStart; index < textContent.length; index += 1) {
                const char = textContent[index];

                if (inString) {
                    if (isEscaped) {
                        isEscaped = false;
                        continue;
                    }
                    if (char === '\\') {
                        isEscaped = true;
                        continue;
                    }
                    if (char === stringDelimiter) {
                        inString = false;
                        stringDelimiter = '';
                    }
                    continue;
                }

                if (char === '"' || char === "'") {
                    inString = true;
                    stringDelimiter = char;
                    continue;
                }

                if (char === '{') {
                    depth += 1;
                    continue;
                }

                if (char === '}') {
                    depth -= 1;
                    if (depth === 0) {
                        jsonEnd = index;
                        break;
                    }
                }
            }

            if (jsonEnd === -1) {
                nodes.push({ type: 'text', content: textContent.slice(start) });
                break;
            }

            const tail = textContent.slice(jsonEnd + 1);
            const closingMatch = tail.match(/^\s*\)\}\}/);
            if (!closingMatch) {
                nodes.push({ type: 'text', content: textContent.slice(start, jsonEnd + 1) });
                cursor = jsonEnd + 1;
                continue;
            }

            const payload = textContent.slice(jsonStart, jsonEnd + 1);
            try {
                nodes.push({
                    type: 'component',
                    blockType,
                    props: JSON.parse(payload),
                });
            } catch (e) {
                logger.warn('Failed to parse component JSON payload:', payload, e);
                const rawBlockEnd = jsonEnd + 1 + closingMatch[0].length;
                nodes.push({ type: 'text', content: textContent.slice(start, rawBlockEnd) });
                cursor = rawBlockEnd;
                continue;
            }

            cursor = jsonEnd + 1 + closingMatch[0].length;
        }

        return nodes;
    };

    const processToken = (token) => {
        if (!token) return null;

        if (token.startsWith('<!--')) {
            return {
                action: 'append',
                node: {
                    type: 'comment',
                    content: token.slice(4, -3),
                },
            };
        }

        if (token.startsWith('</')) {
            const closeTag = token.replace(/^<\//, '').replace(/>$/, '').trim().toLowerCase();
            return {
                action: 'close',
                closeTag,
            };
        }

        if (token.startsWith('<')) {
            const isSelfClosing = /\/>$/.test(token);
            const rawTagContent = token.slice(1, token.length - (isSelfClosing ? 2 : 1)).trim();
            const firstSpace = rawTagContent.search(/\s/);
            const tag = (firstSpace === -1 ? rawTagContent : rawTagContent.slice(0, firstSpace)).trim();
            const rawAttrs = firstSpace === -1 ? '' : rawTagContent.slice(firstSpace + 1);

            if (!tag) return null;

            return {
                action: 'open',
                node: {
                    type: 'element',
                    tag,
                    attributes: parseAttributes(rawAttrs),
                    children: [],
                },
                shouldNest: !isSelfClosing && !VOID_TAGS.has(tag.toLowerCase()),
            };
        }

        const textContent = token;
        if (!textContent.trim()) return null;

        const nodes = parseInlineComponentNodes(textContent).filter((node) => {
            return !(node.type === 'text' && !node.content.trim());
        });

        if (!nodes.length) return null;

        return {
            action: 'appendMany',
            nodes,
        };
    };
    const adjustChildrenForComponents = (nodes) => {
        // If a component exists inside an element subtree, force that element tag to div.
        // Attributes and children are preserved.
        let maxTries = 10000; // Prevent infinite loops

        const walk = (node) => {
            if (!node || maxTries <= 0) {
                return false;
            }

            maxTries -= 1;
            if (maxTries <= 0) {
                logger.error('Max tries reached while adjusting component parents. Possible malformed HTML.');
                return false;
            }

            if (node.type === 'component') {
                return true;
            }

            if (node.type !== 'element') {
                return false;
            }

            let hasComponentDescendant = false;
            if (Array.isArray(node.children) && node.children.length > 0) {
                for (const child of node.children) {
                    if (walk(child)) {
                        hasComponentDescendant = true;
                    }
                }
            }

            if (hasComponentDescendant && (node.tag || '').toLowerCase() !== 'div') {
                node.tag = 'div';
            }

            return hasComponentDescendant;
        };

        for (const node of nodes) {
            walk(node);
            if (maxTries <= 0) {
                break;
            }
        }

        return nodes;
    };



    const sanitizedHtml = content
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
        .replace(/on\w+\s*=\s*(['"])[\s\S]*?\1/gi, '');

    const tokens = getTokens(sanitizedHtml);


    const root = { type: 'root', children: [] };
    const stack = [root];
    let maxTries = 5000;

    for (const token of tokens) {
        const item = processToken(token);
        if (!item) continue;

        if (item.action === 'close') {
            while (stack.length > 1) {
                const currentTag = (stack[stack.length - 1].tag || '').toLowerCase();
                stack.pop();
                if (currentTag === item.closeTag) break;
                if (--maxTries <= 0) {
                    logger.error('Max tries reached while closing tags.');
                    break;
                }
            }
            continue;
        }

        if (item.action === 'appendMany' && Array.isArray(item.nodes)) {
            for (const node of item.nodes) {
                stack[stack.length - 1].children.push(node);
            }
            continue;
        }

        stack[stack.length - 1].children.push(item.node);

        if (item.action === 'open' && item.shouldNest) {
            stack.push(item.node);
        }
    }

    // ======================= debugging logs =======================
    // save in this dir 
    // fs.writeFileSync('./data/parser/debug_tokens.json', JSON.stringify(adjustChildrenForComponents(root.children), null, 2));


    // ======================= debugging logs end=======================


    // return root.children
    return adjustChildrenForComponents(root.children);
};


export const RenderNode = async ({ node, params, searchParams }) => {
    if (!node) {
        return null;
    }

    // component block
    if (node.type === 'component') {
        const Component = await resolveImportedComponent(node.blockType);
        return Component ? <Component {...node.props} params={params} searchParams={searchParams} /> : null;
    }

    if (node.type === 'text') {
        return node.content;
    }

    if (node.type === 'comment') {
        return null;
    }

    const tagName = (node.tag || 'div').toLowerCase();
    let Tag = tagName;

    // if a tag use Link
    if (tagName === 'a') {
        Tag = Link;
    }

    if (Tag === 'img') {
        // logger.log('Rendering image with attributes:', node);
        // return null;
        return (
            <Image
                src={node.attributes.src ? getFileUrlDirectus(node.attributes.src) : ''}
                alt={node.attributes.alt || ''}
                width={node.attributes.width ? parseInt(node.attributes.width, 10) : 800}
                height={node.attributes.height ? parseInt(node.attributes.height, 10) : 600}
                style={node.attributes.style ? cssStringToObject(node.attributes.style) : {}}
                className={node.attributes.className || ''}
            />
        );

    }
    // // debug
    // // if its a with existign href save attributes in data
    // if (tagName === 'a' && node.attributes.href) {
    //     fs.writeFileSync(`./data/renderer/${node.attributes.href.replace(/\//g, '_')}.json`, JSON.stringify(node.attributes, null, 2));
    // }

    const processedAttributes = { ...node.attributes };
    if (processedAttributes.style && typeof processedAttributes.style === 'string') {
        processedAttributes.style = cssStringToObject(processedAttributes.style);
    }

    // video tag handling
    if (Tag === 'video') {
        const videoAttributes = normalizeVideoAttributes(processedAttributes);

        if (videoAttributes.src) {
            videoAttributes.src = getFileUrlDirectus(videoAttributes.src);
        }

        return (
            <video {...videoAttributes}>
                {node.children && node.children.map((child, index) => (
                    <RenderNode key={index} node={child} params={params} searchParams={searchParams} />
                ))}
            </video>
        );
    }

    if (VOID_TAGS.has(tagName)) {
        return <Tag {...processedAttributes} />;
    }

    // if (tagName === 'i') {
    //     logger.log('Processing <i> tag with attributes:', node.attributes);
    // }



    return <Tag {...processedAttributes}>
        {node.children && node.children.map((child, index) => (
            <RenderNode key={index} node={child} params={params} searchParams={searchParams} />
        ))}
    </Tag>
};

export default async function Renderer({ pageData, content, className, params, searchParams }) {
    const parsedContent = parseHtmlToNestedArray(replaceHtmlEntities(content));
    const isPost = pageData?.type === 'post';

    // logger.log('Renderer - parsedContent: ', JSON.stringify(parsedContent));
    // logger.log('Renderer - parsedContent: ', JSON.stringify(parsedContent));

    return (
        <>
            {
                isPost ? (
                    <PostTemplate pageData={pageData} params={params} searchParams={searchParams}>
                        {parsedContent.map((node, index) => (
                            <RenderNode key={index} node={node} params={params} searchParams={searchParams} />
                        ))}
                    </PostTemplate>
                ) : (
                    parsedContent.map((node, index) => (
                        <RenderNode key={index} node={node} params={params} searchParams={searchParams} />
                    ))
                )
            }
        </>
    )
};
