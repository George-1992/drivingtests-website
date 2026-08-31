import localFont from "next/font/local";
import "../app/globals.scss";
import { isFilePath } from "@/utils/other";
import ErrorPage from "@/components/other/error";
import NotFound from "@/components/other/notFound";
import { directusRequest, getFileUrl } from "@/services/directus";

const geistSans = localFont({
    src: "../app/fonts/GeistMonoVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../app/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

const DOMAIN = process.env.DOMAIN || 'localhost:3000';


export default async function PageWrapper({ params, searchParams, pageData, children, }) {


    const pathname = params?.slug?.[0] ? `/${params.slug.join('/')}` : null;
    console.log('PageWrapper render ==> ', pathname ? pathname : children ? 'has children' : 'no pathname or children');


    // if its a file path leave for nextjs router to handle
    if (isFilePath(pathname)) {
        return null;
    }

    let _isError = false;
    let _notFound = false;
    let _pageData = pageData || {};

    if (pathname) {
        // fetch page data here if needed
        const response = await directusRequest({
            method: 'GET',
            endpoint: '/items/posts',
            params: {
                filter: {
                    slug: {
                        // _eq: 'chrishayward',
                        _eq: pathname.startsWith('/') ? pathname.slice(1) : pathname,
                    },
                },
                limit: 1,
                // include related websites data (junction + actual website record)
                fields: ['*', 'websites.*', 'websites.websites_id.*'],
            },
        });
        if (!response.success) {
            _isError = response.message || true;
        }
        if (response.success) {
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                _pageData = response.data[0];
                if (_pageData && _pageData.websites && Array.isArray(_pageData.websites)) {
                    // flatten websites data
                    _pageData.websites = _pageData.websites.map(ws => {
                        return {
                            ...ws,
                            ...ws.websites_id,
                        };
                    });
                    _pageData.website = _pageData.websites[0] || null;
                    delete _pageData.websites;
                    delete _pageData.website.websites_id;
                }
            } else {
                _notFound = true;
            }
        }
        // console.log('directus page data response ==> ', response);
    } else {
        if (!pathname && !children) {
            _isError = true;
        }
    }

    const getTitle = () => {
        if (_isError) {
            return "Error";
        }
        if (_notFound) {
            return "Not Found";
        }

        if (_pageData && _pageData.title) {
            return _pageData.title;
        }
        return "Unknown Page";
    };
    const getDescription = () => {
        if (_pageData && _pageData.description) {
            return _pageData.description;
        }
        return "";
    };
    const getIcon = () => {
        return getFileUrl(_pageData?.website?.icon || null);
    }

    console.log('_pageData ==> ', _pageData);

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{getTitle()}</title>
                <meta name="description" content={getDescription()} />
                <meta property="og:title" content={getTitle()} />
                <meta property="og:description" content={getDescription()} />
                <meta property="og:url" content={`${DOMAIN}${pathname || ''}`} />

                <link rel="icon" href={getIcon() || "/images/logos/main.png"} />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
            >
                <div className="page-container">
                    {_isError && <ErrorPage text="No pathname or children provided." />}
                    {_notFound && <NotFound text="No pathname or children provided." />}
                    {!_isError && (
                        <>
                            <div dangerouslySetInnerHTML={{ __html: _pageData.content || '' }} />
                            {children}
                        </>
                    )}
                </div>
            </body>
        </html>
    );
}