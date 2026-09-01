import { getEnvVars, getFileUrl } from "@/actions/globals";

export default function SeoHeader({ pageData }) {

    const { DOMAIN, FULL_DOMAIN } = getEnvVars();
    const p = pageData || {};

    const thisSlug = p.slug === '/' || p.slug === 'home' ? '' : p.slug || '';
    const url = `${FULL_DOMAIN}${thisSlug || ''}`;
    const title = p?.seo_title || p.title || '';
    const desc = p?.seo_description || p.description || '';
    const image = getFileUrl(p.og_image) || getFileUrl(p.website?.icon) || '/images/og-default.png';
    const siteName = p.website?.name || '';
    const icon = getFileUrl(p.website?.icon) || '/images/logo/icon.png';

    return (
        <>
            {/* Base */}
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{title}</title>
            <meta name="description" content={desc} />
            <link rel="icon" href={icon} />
            <link rel="canonical" href={url} />

            {/* Robots */}
            <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

            {/* Open Graph */}
            <meta property="og:type" content={p.og_type || 'website'} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter / X */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={image} />

            {/* Preloads */}
            <link rel="preload" as="script" href="https://www.googletagmanager.com/gtag/js" />

            {/* Profile */}
            <link rel="profile" href="https://gmpg.org/xfn/11" />
        </>
    );
}