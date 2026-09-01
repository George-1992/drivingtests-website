import localFont from "next/font/local";
import "../app/globals.scss";
import { getPathname, isFilePath } from "@/utils/other";
import Renderer from "@/components/renderer";
import Header from "@/components/navs/header";
import Footer from "@/components/navs/footer";
import Image from "next/image";
import { logger } from "@/utils/logger";
import { getPageData, getFileUrl } from "@/actions/globals";
import Unavailable from "@/components/other/unavailable";
import Link from "next/link";
import { LinkedinIcon, XIcon } from "lucide-react";
import HeadEl from "@/components/renderer/head";
import GsapEl from "@/components/animations/gsap";

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



export default async function PageWrapper({ params, searchParams, pageData, children }) {

    const pathname = getPathname(params.slug);
    logger.log('PageWrapper render ==> ', pathname ? pathname : children ? 'has children' : 'no pathname or children');

    // if its a file path leave for nextjs router to handle
    if (isFilePath(pathname)) {
        return <Unavailable />;
    }

    const _pageData = pageData || await getPageData(pathname);
    // logger.log('_pageData ==> ', _pageData);

    _pageData.content = (_pageData.content || '').replace('component.landing.home1', 'component.landing.home2');


    return (
        <html lang="en">
            <HeadEl params={params} pageData={_pageData} searchParams={searchParams} />
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen overflow-hidden`}
            >
                <Header
                    className=""
                    pageData={_pageData}
                    logo={getFileUrl(_pageData?.website?.logo || null)}
                    items={[
                        { name: 'Home', href: '/' },
                        { name: 'Courses', href: '/courses' },
                        { name: 'About us', href: '/about-us' },
                        // {
                        //     name: 'Resource Hub',
                        //     items: [
                        //         { name: 'Horizon Europe Collaborative projects', href: '/' },
                        //         { name: 'ERC page', href: '/' },
                        //         { name: 'MSCA page', href: '/' },
                        //         { name: 'EIC', href: '/' },
                        //         { name: 'National grants', href: '/' },
                        //         { name: 'General knowledge base', href: '/' },
                        //     ]
                        // },
                        // {
                        //     name: 'About', href: '#', className: '',
                        //     items: [
                        //         { name: 'About us', href: '/about-us/meet-the-team/' },
                        //         { name: 'Our clients', href: '/about-us/track-record/' },
                        //         { name: 'Our Testimonials', href: '/about-us/testimonials/' },
                        //     ]
                        // },
                        { name: 'Contact', href: '/contact-us', className: '' },
                    ]}
                />
                <div id="smooth-wrapper" className="w-full h-screen overflow-y-auto overflow-x-hidden" >
                    <div id="smooth-content" className="page-container" >
                        <div className="w-full h-full min-h-screen flex flex-col">
                            <div className="content-container">
                                {
                                    (children || _pageData.children) ? (
                                        (children || _pageData.children)
                                    ) : (
                                        <Renderer
                                            pageData={_pageData}
                                            content={_pageData.content || ''}
                                            className='page-max-width'
                                            params={params}
                                            searchParams={searchParams}
                                        />
                                    )
                                }
                            </div>
                            <Footer
                                pageData={_pageData}
                                className="text-gray-50"
                                items={[
                                    {
                                        title: 'Contact',
                                        component: <div className="w-44 flex flex-col gap-2 text">
                                            <Image
                                                src={getFileUrl(_pageData?.website?.logo) || '/images/logo/logo_main.png'}
                                                alt="logo"
                                                width={200}
                                                height={80}
                                                className="rounded-md shadow-sm size-24"
                                            />
                                            <p className="text-sm">
                                                info@enspire-science.com
                                            </p>
                                            <p className="text-sm opacity-75">
                                                Rua de Camões
                                                437 - Escritório 202, 4000-147 Porto
                                                Portugal
                                            </p>
                                            <div className="w-full h-40 ">
                                                <p >
                                                    Follow our EU grant conversation
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Link href={"https://www.linkedin.com/company/18285478/"}
                                                        className="hover:scale-105 duration-300 border rounded-md p-1 shadow-sm"
                                                        aria-label="Visit Enspire Science on LinkedIn"
                                                    >
                                                        <LinkedinIcon className="h-7 w-7 " />
                                                    </Link>
                                                    <Link href={"https://independent.academia.edu/YoramBarZeev"}
                                                        className="hover:scale-105 duration-300 border rounded-md p-1 shadow-sm"
                                                        aria-label="Visit Yoram Bar Zeev on Academia"
                                                    >
                                                        <span className="inline-flex h-7 w-7 items-center justify-center leading-none">A</span>
                                                    </Link>
                                                    <Link href={"https://twitter.com/ybz_enspire"}
                                                        className="hover:scale-105 duration-300 border rounded-md p-1 shadow-sm"
                                                        aria-label="Visit Yoram Bar Zeev on Twitter"
                                                    >
                                                        <XIcon className="h-7 w-7 " />
                                                        <span className="sr-only">Visit Yoram Bar Zeev on Twitter</span>
                                                    </Link>

                                                </div>
                                            </div>

                                            {/* <span>Find Us on</span> */}
                                            {/* <SocialLinks /> */}
                                        </div>,
                                    },
                                    {
                                        title: 'Recent Posts',
                                        items: [
                                            { name: 'Don\'t wait for the call: how to start preparing your Portugal 2030 application now', href: '/start-preparing-your-portugal-2030-application/' },
                                            { name: 'Como encontrar oportunidades de financiamento a fundo perdido (que são mesmo para si) no Portugal 2030?', href: '/oportunidades-de-financiamento-a-fundo-no-portugal-2030/' },
                                            { name: 'How to find non-refundable funding opportunities (that are truly right for you) under Portugal 2030?', href: '/funding-opportunities-in-portugal-2030/' }
                                        ]
                                    },
                                    {
                                        title: 'Explore',
                                        items: [
                                            { name: 'EU Funding Courses', href: '/enspire-science-courses/' },
                                            { name: 'Consulting Services', href: '/services/individual-services/' },
                                            { name: 'Project Management', href: '/project-management/' },
                                            { name: 'Knowledge Base', href: '/blog-preview/' },
                                            { name: 'Free Tools', href: '/enspire-sciences-free-tools/' }
                                        ]
                                    },
                                    {
                                        title: 'Legal',
                                        items: [
                                            { name: 'Privacy Policy', href: '/privacy-policy/' },
                                            { name: 'Terms of Service', href: '/terms-of-service/' },
                                            { name: 'Terms of Use', href: '/enspire-science-terms-of-use/' }
                                        ]
                                    },

                                ]}
                            />
                        </div>
                    </div>
                </div>
            </body>
            <GsapEl />
        </html>
    );
}

