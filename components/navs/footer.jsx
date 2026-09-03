'use client';
import Link from "next/link";
import Image from "next/image";
import cn from 'clsx';


export default function Footer({ items, className = '' }) {

    const footerCols = items || [
        {
            title: 'Company',
            items: [
                { name: 'Services', href: '#services' },
                { name: 'Process', href: '#process' },
                { name: 'Challenges', href: '#challenges' },
                { name: 'Testimonials', href: '#testimonials' },
            ]
        },
        {
            title: 'Quick Links',
            items: [
                { name: 'AlignIQ™ Talent Report', href: '#aligniq-report' },
                { name: 'Privacy & Terms', href: '/privacy-terms' },
            ]
        },

    ]


    return (
        <div
            // className="page-max-width w-11/12 md:w-full py-8 px-3 mt-10 flex flex-col items-center bg-white mb-20"
            className={
                cn(
                    'relative w-full py-10 sm:py-12 px-4 sm:px-6 flex flex-col items-center justify-between overflow-hidden lg:h-screen lg:min-h-[640px]',
                    'bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70',
                    'shadow-md bg-gray-950 text-gray-100 ',
                    '',
                    className
                )
            }
        >
            <Image
                src="/images/bg/bgs-1.svg"
                width={1000}
                height={600}
                className="absolute inset-0 h-full w-full object-bottom pointer-events-none -z-10"
                alt="Sticky Counter Background"
            />
            <div
                className="absolute inset-0 h-full w-full -z-10 bg-gray-900/20"
            />
            <div className="w-full h-6 sm:h-10"></div>
            <div className="w-full max-w-6xl flex flex-col gap-y-8 sm:gap-y-10 lg:flex-row lg:flex-nowrap lg:items-start lg:justify-between lg:gap-x-14">
                {
                    footerCols.map((col, index) => (
                        <div key={index} className="min-w-0 w-full lg:flex-1">
                            <h6 className="text-lg text-gold-500 font-bold mb-4">{col.title}</h6>
                            <div className="flex flex-col gap-2 min-w-0">
                                {
                                    col.items && col.items.map((item, itemIndex) => {

                                        return (
                                            <Link
                                                key={itemIndex}
                                                href={item.href}
                                                className="block max-w-full break-words whitespace-normal leading-snug hover:scale-105 duration-200"
                                                target={item.target || ""}
                                            >
                                                {item.name}
                                            </Link>
                                        )
                                    })
                                }
                                {col.component}
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="text-sm text-gold-500 mt-10 sm:mt-14 pb-2 w-full max-w-xs text-center">
                <p>© All rights reserved.</p>
                {/* <p>2055 Limestone Rd STE 200-C Wilmington, DE 19808 United States</p> */}
            </div>
        </div >
    );
}