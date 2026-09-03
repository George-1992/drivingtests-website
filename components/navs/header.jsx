'use client';

import Image from "next/image";
import cn from 'clsx';
import Link from "next/link";
import { ChevronDown, Menu, X, SearchIcon } from "lucide-react";
import { isValidElement, useEffect, useState } from "react";
import { logger } from "@/utils/logger";


export default function Header({
    pageData = null,
    logo = '/images/logo/main.png',
    title = '',
    items = [],
    className = '',
}) {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);

    const menuItems = items || [
        { name: 'Contact', href: '/contact-us' },
        { name: 'About', href: '/about' },
    ];


    //on click outside close isDesktopSearchOpen if true
    useEffect(() => {
        function handleClickOutside(event) {
            const searchBox = document.querySelector('.SearchBox');
            if (searchBox && !searchBox.contains(event.target)) {
                setIsDesktopSearchOpen(false);
            }
        }
        if (isDesktopSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDesktopSearchOpen]);

    return (
        <>
            <div className={
                cn(
                    'header w-full fixed z-40 text-accent ',
                    'top-0 h-20 backdrop-filter backdrop-blur-sm bg-opacity-70',
                    // 'bg-clip-padding top-2 h-16 my-2 pr-5 backdrop-filter backdrop-blur-sm bg-opacity-70 rounded-full bg-white',
                    // 'shadow-sm border border-gray-200/50',
                    `${className}`,
                )
            }>
                <div className="w-content h-full flex justify-between items-center transition-all duration-300">
                    <Link
                        className="w-60 h-full max-h-full rounded-l-2xl rounded-md flex items-center"
                        href="/"
                    >
                        <div className="w-full h-full p-5 flex items-center justify-start">
                            <Image
                                src={logo || '/images/logo/logo_main.png'}
                                alt="logo"
                                width={120}
                                height={80}
                                className="h-full w-auto object-contain"
                            />
                            <p className="px-2 text-xl flex-shrink-0 text-gray-900 font-bold font-mono">
                                Dttraining
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex gap-3 items-center ">

                        {
                            menuItems.map((item, index) => {
                                if (item?.component) {
                                    const componentNode = typeof item.component === 'function'
                                        ? item.component(item.props || {})
                                        : item.component;

                                    return (
                                        <div key={item?.key || index} className="flex items-center">
                                            {isValidElement(componentNode) ? componentNode : (componentNode ?? null)}
                                        </div>
                                    );
                                }

                                if (item?.items?.length) {
                                    return (
                                        <div
                                            key={item?.key || index}
                                            className="group relative flex items-center after:absolute after:left-0 after:top-full after:h-3 after:w-full after:content-['']"
                                        >
                                            <Link
                                                href={item.href || '#'}
                                                arial-label={item.name}
                                                className={cn(
                                                    'inline-flex items-center gap-1 rounded-full px-3 py-2 transition-colors hover:bg-slate-50/20 [text-shadow:_0_0.5px_5px_white,_0_0_3px_white]',
                                                    item.className || ''
                                                )}
                                            >
                                                {item.name}
                                                <ChevronDown className="size-4 transition duration-200 group-hover:rotate-180 [text-shadow:_0_0.5px_5px_white,_0_0_3px_white]" />
                                            </Link>

                                            <div className="pointer-events-none invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                                {item.items.map((subItem, subIndex) => (
                                                    <Link
                                                        key={`${index}-${subIndex}`}
                                                        href={subItem.href}
                                                        arial-label={subItem.name}
                                                        className="block rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700 "
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item?.key || index}
                                        href={item.href}
                                        arial-label={item.name}
                                        className={cn(
                                            'rounded-full px-3 py-2 transition-colors hover:bg-slate-50/20 [text-shadow:_0_0.5px_5px_white,_0_0_3px_white]',
                                            item.className || ''
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })
                        }
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-lg "
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>


            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={cn(
                    'lg:hidden fixed top-[65px] left-0 right-0 z-30 mx-auto w-11/12',
                    'bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-95',
                    'rounded-2xl p-4 flex flex-col gap-2'
                )}>
                    {menuItems.map((item, index) => {
                        if (item?.component) {
                            const componentNode = typeof item.component === 'function'
                                ? item.component(item.props || {})
                                : item.component;

                            return (
                                <div key={item?.key || index} className="rounded-xl border border-slate-200 bg-white p-2">
                                    {isValidElement(componentNode) ? componentNode : (componentNode ?? null)}
                                </div>
                            );
                        }

                        return (
                            <div key={item?.key || index} className="rounded-xl border border-slate-200 bg-white p-2">
                                <Link
                                    href={item.href || '#'}
                                    aria-label={item.name}
                                    className="block rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>

                                {item?.items?.length ? (
                                    <div className="mt-1 flex flex-col gap-1 border-t border-slate-100 pt-2 pl-3">
                                        {item.items.map((subItem, subIndex) => (
                                            <Link
                                                key={`${index}-${subIndex}`}
                                                href={subItem.href}
                                                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-emerald-700"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}