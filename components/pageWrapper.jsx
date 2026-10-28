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
    // _pageData.content = (_pageData.content || '').replace('component.landing.home1', 'component.landing.home2');

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>
                    Dttraining.co.nz is under construction. Please check back later for updates and new content.
                </title>
            </head>
            <body>

                <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
                    <Image
                        src="/images/logo/icon.png"
                        alt="Under Construction"
                        width={80}
                        height={80}
                        className="mb-6"
                    />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                       Under Construction
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Please check back later for updates and new content.
                    </p>
                    <Link href="https://www.drivingtests.co.nz/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                        Go to Live Site
                    </Link>
                </div>

            </body>
        </html>
    )


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
                        { name: 'Speed Limits', href: '/speed-limits' },
                        { name: 'LMS', href: '/lms-features' },
                        { name: 'Blog', href: '/blog' },
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
                        {
                            title: 'auth',
                            component: (
                                <div className="w-44 z-0 flex gap-2 rounded-xl border border-gray-300 items-center justify-center p-1 shadow-sm">
                                    <Link
                                        href="/auth/signin"
                                        className="w-full z-0 py-2 px-3 text-xs font-semibold rounded-lg text-center text-slate-700 hover:scale-[103%] hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <div className="h-4 border-r border-gray-300"></div>

                                    <Link
                                        href="/auth/signup"
                                        className="w-full z-0 py-2 px-3 text-xs font-semibold rounded-lg text-center text-slate-700 hover:scale-[103%] hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )
                        }
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
                                        title: '',
                                        component: <div className="flex flex-col gap-2 text">
                                            <div className="flex gap-3 items-center justify-start">
                                                <Image
                                                    src={getFileUrl(_pageData?.website?.logo) || '/images/logo/logo_main.png'}
                                                    alt="logo"
                                                    width={200}
                                                    height={80}
                                                    className="rounded-md shadow-sm size-20"
                                                />
                                                <Image
                                                    src={'/images/logo/tr-logo.png'}
                                                    alt="logo"
                                                    width={200}
                                                    height={80}
                                                    className="rounded-md shadow-sm size-20"
                                                />
                                            </div>

                                            <p className="text-sm opacity-75 w-full py-5">
                                                Copyright 2010-2026 DT Driver Training Ltd, PO Box 12541, Penrose, Auckland, 1642. All rights reserved. Learner licence questions and images are used with permission from NZTA. Other questions and all answers are proprietary.
                                            </p>
                                            <div className="w-full h-40 ">
                                                <p className="text-sm">
                                                    Download Our Mobile App
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Link href={"https://play.google.com/store/apps/details?id=com.zeeroapps.drivingtests"}
                                                        className="hover:scale-105 duration-300 rounded-md p-1 "
                                                        aria-label="Visit Dttraining on Google Play"
                                                    >
                                                        <Image
                                                            src={"/images/other/icon-playstore.png"}
                                                            alt="playstore"
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </Link>
                                                    <Link href={"https://apps.apple.com/nz/app/dt-driving-tests-theory/id913821658"}
                                                        className="hover:scale-105 duration-300 rounded-md p-1"
                                                        aria-label="Visit Dttraining on the App Store"
                                                    >
                                                        <Image
                                                            src={"/images/other/icon-appstore.png"}
                                                            alt="appstore"
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </Link>

                                                </div>
                                            </div>

                                            {/* <span>Find Us on</span> */}
                                            {/* <SocialLinks /> */}
                                        </div>,
                                    },
                                    {
                                        title: 'Categories',
                                        items: [
                                            { name: 'Car', href: '/category/car/' },
                                            { name: 'News', href: '/category/news/' },
                                            { name: 'Forklift', href: '/category/forklift/' },
                                            { name: 'Motorbike', href: '/category/motorbike/' },
                                            { name: 'First Aid', href: '/category/first-aid/' },
                                            { name: 'Heavy Vehicles', href: '/category/heavy-vehicles/' },
                                        ]
                                    },
                                    {
                                        title: 'Help',
                                        items: [
                                            { name: 'Advice', href: '/category/advice/' },
                                            { name: 'Reviews', href: '/category/reviews/' },
                                            { name: 'Quizzes', href: '/category/quizzes/' },
                                            { name: 'First Aid', href: '/category/first-aid/' },
                                            { name: 'Speed Limits', href: '/speed-limits' },
                                            { name: 'Logbooks and Work-Time', href: '/category/logbooks-and-work-time/' },
                                        ]
                                    },
                                    {
                                        title: 'Resources',
                                        items: [
                                            { name: 'Blog', href: '/blog' },
                                            { name: 'Courses', href: '/courses' },
                                            { name: 'Learning Portal', href: '/auth/signin' },
                                            { name: 'Learning management system', href: '/lms-features' },
                                        ]
                                    },
                                    {
                                        title: 'About',
                                        items: [
                                            { name: 'About Us', href: '/about-us/' },
                                            { name: 'Contact Us', href: '/contact-us/' },
                                            { name: 'Privacy Policy', href: '/privacy-policy/' },
                                            { name: 'Terms and Conditions', href: '/terms-and-conditions/' },
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

