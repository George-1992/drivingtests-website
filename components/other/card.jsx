
'use client';

import { getFileUrlDirectus } from "@/services/directus";
import ImageCarousel from "@/components/other/imageCarusel";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";

export default function Card({
    title, description, href, hrefTitle, href1, href1Title, href2, href2Title, destination2,
    image, images,
    variant = "1"
}) {
    const DESCRIPTION_COLLAPSE_LIMIT = 220;
    const _thisImages = images || image || "";
    const safeTitle = title || "Untitled";
    const safeDescription = description || "";
    const safeImage = image ? getFileUrlDirectus(image) : '';
    const safeImages = Array.isArray(_thisImages)
        ? _thisImages.map((img) => getFileUrlDirectus(img))
        : typeof _thisImages === 'string'
            ? _thisImages.split(',').map((item) => getFileUrlDirectus(item.trim())).filter(Boolean)
            : [];
    const safeDestination2 = destination2 || "";

    const primaryHref = href || href1 || null;
    const primaryHrefTitle = hrefTitle || href1Title || "Read more";

    const secondaryHref = href2 || null;
    const secondaryHrefTitle = href2Title || "Learn more";

    const [_isExpanded, _setIsExpanded] = useState(false);
    const handleToggleExpand = () => {
        _setIsExpanded((prev) => !prev);
    };



    // console.log(` >>>>>>>>> safeImage:  `, JSON.stringify(getFileUrlDirectus(image)));

    // if iamges change re-render
    useEffect(() => {
        // console.log("Card component re-rendered due to images change:", safeImage);
    }, [safeImage, safeImages]);



    const renderDescription = (className) => {
        if (!safeDescription) {
            return null;
        }

        if (safeDescription.length <= DESCRIPTION_COLLAPSE_LIMIT) {
            return <p className={className}>{safeDescription}</p>;
        }

        const shortDescription = `${safeDescription.slice(0, DESCRIPTION_COLLAPSE_LIMIT).trimEnd()}...`;

        return (
            <details className="group mt-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 open:bg-white open:border-emerald-200">

                {/* The summary stays visible when closed. We style it to switch layout elements on open. */}
                <summary className={`${className} cursor-pointer list-none outline-none select-none`}>

                    {/* 1. Closed State: Shows short text + Read more */}
                    <span className="group-open:hidden">
                        {shortDescription}
                        <span className="ml-1 font-semibold text-emerald-800 hover:underline">
                            Read more
                        </span>
                    </span>

                    {/* 2. Open State: Shows full text */}
                    <p className={`${className} hidden group-open:block animate-fadeIn pointer-events-text`}>
                        {safeDescription}
                    </p>

                    {/* 3. Open State: Shows Read Less button right under the full text */}
                    <span className="hidden group-open:inline-block mt-2 text-sm font-semibold text-emerald-800 hover:underline">
                        Read less
                    </span>

                </summary>

            </details>
        );
    };


    if (variant === "course-card") {
        return (
            <div className="group overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
                <div className="grid gap-0 md:grid-cols-2">
                    <div className="relative min-h-56 bg-gradient-to-br from-emerald-100 via-white to-orange-50 p-4 flex items-center justify-center">
                        {safeImages.length > 0 ? (
                            <div className="w-full h-full">
                                <ImageCarousel
                                    images={safeImages}
                                    type="grid"
                                    page={1}
                                    pageSize={1}
                                    motion={false}
                                    gapClassName="gap-0"
                                    className="w-full"
                                    itemClassName="!w-full !aspect-[16/10] bg-white"
                                    imageClassName="h-full w-full object-contain bg-white p-2"
                                />
                            </div>
                        ) : (
                            <div className="flex h-full w-full min-h-56 items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-white/70 px-4 text-center">
                                <div className="max-w-[200px]">
                                    <p className="font-semibold uppercase tracking-[0.2em] text-emerald-700">ERC Academy</p>
                                    <p className="mt-2 text-slate-600">Slide deck preview</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-7">
                        <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                            Course
                        </div>

                        <h3 className="mt-4 text-2xl font-semibold leading-tight text-slate-900">
                            {safeTitle}
                        </h3>

                        {renderDescription("leading-7 text-slate-700 md:text-[15px]")}


                        {safeDestination2 ? (
                            <p className="mt-4 leading-7 text-slate-700 md:text-[15px]">
                                {safeDestination2}
                            </p>
                        ) : null}

                        <div className="mt-6 flex flex-wrap gap-3 border-t border-emerald-100 pt-5">
                            {primaryHref ? (
                                <Link
                                    href={primaryHref}
                                    className="inline-flex items-center rounded-full bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
                                >
                                    {primaryHrefTitle}
                                    <ChevronRightIcon className="ml-1 size-4" />
                                </Link>
                            ) : null}

                            {secondaryHref ? (
                                <Link
                                    href={secondaryHref}
                                    className="inline-flex items-center rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-800 transition-colors duration-200 hover:bg-emerald-50"
                                >
                                    {secondaryHrefTitle}
                                    <ChevronRightIcon className="ml-1 size-4" />
                                </Link>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === "3") {
        return (
            <article className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                <div className="relative">
                    <p className="text-xl font-semibold leading-tight text-slate-900 md:text-2xl">
                        {safeTitle}
                    </p>

                    {renderDescription("text-[15px] leading-7 text-slate-700")}

                    {(primaryHref || secondaryHref) ? (
                        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-emerald-100 pt-4">
                            {primaryHref ? (
                                <Link
                                    href={primaryHref}
                                    className="inline-flex items-center rounded-full bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
                                >
                                    {primaryHrefTitle}
                                    <ChevronRightIcon className="ml-1 size-4" />
                                </Link>
                            ) : null}

                            {secondaryHref ? (
                                <Link
                                    href={secondaryHref}
                                    className="inline-flex items-center rounded-full border border-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-800 transition-colors duration-200 hover:bg-emerald-50"
                                >
                                    {secondaryHrefTitle}
                                    <ChevronRightIcon className="ml-1 size-4" />
                                </Link>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </article>
        );
    }

    if (variant === "2") {
        return (
            <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md">
                <div className="relative p-2 bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center">
                    {safeImage ? (
                        <Image
                            src={safeImage}
                            alt={safeTitle}
                            width={800}
                            height={800}
                            className="w-auto h-36 rounded-3xl shadow-md  "
                        />
                    ) : (
                        <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-orange-100">
                            <span className="text-sm font-medium text-slate-500">Team member photo</span>
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <p className="text-xl font-semibold tracking-tight text-slate-900">
                        {safeTitle}
                    </p>

                    {renderDescription("text-sm leading-6 text-slate-600")}

                    <div className="mt-4 flex flex-wrap gap-2">
                        {primaryHref ? (
                            <Link
                                href={primaryHref}
                                className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-700"
                            >
                                {primaryHrefTitle}
                                <ChevronRightIcon className="ml-1 size-4" />
                            </Link>
                        ) : null}

                        {secondaryHref ? (
                            <Link
                                href={secondaryHref}
                                className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100"
                            >
                                {secondaryHrefTitle}
                                <ChevronRightIcon className="ml-1 size-4" />
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="group rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-200 hover:-translate-y-[0.5px] hover:border-slate-300 hover:shadow-lg bg-gradient-to-br from-orange-50 via-white to-emerald-50">
            {safeImage ? (
                <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <Image
                        src={safeImage}
                        alt={safeTitle}
                        width={800}
                        height={480}
                        className="h-44 w-full object-cover"
                    />
                </div>
            ) : null}

            <p className="text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-700">
                {safeTitle}
            </p>

            {renderDescription("text-sm leading-6 text-slate-600")}

            <div className="mt-4 border-t border-slate-200 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                    {primaryHref ? (
                        <Link
                            href={primaryHref}
                            className="inline-flex items-center rounded-full border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-800"
                        >
                            {primaryHrefTitle}
                            <ChevronRightIcon className="ml-1 size-4" />
                        </Link>
                    ) : null}

                    {secondaryHref ? (
                        <Link
                            href={secondaryHref}
                            className="inline-flex items-center rounded-full border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                            {secondaryHrefTitle}
                            <ChevronRightIcon className="ml-1 size-4" />
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
