'use client';

import { Calendar1Icon, CheckCircle2Icon, CheckCircleIcon, GaugeIcon, InfoIcon, LocateIcon, MapPinCheckInsideIcon, MessageSquareQuoteIcon, SearchIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_SIZE = 20;

export default function SpeedLimitClient({ items }) {

    const [_items, setItems] = useState(items || []);
    const [_searchTerm, setSearchTerm] = useState('');
    const [_isLoadingMore, setIsLoadingMore] = useState(false);
    const [_hasMore, setHasMore] = useState((items || []).length >= PAGE_SIZE);
    const router = useRouter();
    const searchParams = useSearchParams();


    const handleSearchValueChange = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value);
    };
    const handleSearchEnter = (event) => {
        event.preventDefault();

        const value = _searchTerm.trim();

        const normalizedQuery = value.trim();
        // if (!normalizedQuery) {
        //     router.push('/search');
        //     return;
        // }

        router.push(`/speed-limits?query=${encodeURIComponent(normalizedQuery)}`);
    };

    // console.log('items: ', items);

    useEffect(() => {
        setItems(items || []);
        setHasMore((items || []).length >= PAGE_SIZE);
    }, [items]);

    const handleLoadMore = async () => {
        if (_isLoadingMore || !_hasMore) {
            return;
        }

        setIsLoadingMore(true);

        try {
            const queryParam = (_searchTerm.trim() || searchParams?.get('query') || '').trim();
            const url = `/api/speed-limits?offset=${_items.length}&limit=${PAGE_SIZE}${queryParam ? `&query=${encodeURIComponent(queryParam)}` : ''}`;
            const response = await fetch(url, { method: 'GET' });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                setIsLoadingMore(false);
                return;
            }

            const nextItems = Array.isArray(result.data) ? result.data : [];

            if (!nextItems.length) {
                setHasMore(false);
                setIsLoadingMore(false);
                return;
            }

            setItems((prev) => {
                const seen = new Set(prev.map((item) => item?.id || item?.object_id));
                const merged = [...prev];

                nextItems.forEach((item) => {
                    const key = item?.id || item?.object_id;
                    if (!seen.has(key)) {
                        seen.add(key);
                        merged.push(item);
                    }
                });

                return merged;
            });

            setHasMore(nextItems.length >= PAGE_SIZE);
        } catch (_error) {
            setHasMore(false);
        } finally {
            setIsLoadingMore(false);
        }
    };



    return (
        <div className="w-full py-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/60 rounded-full text-amber-700 text-xs font-semibold uppercase tracking-wider mb-4">
                    <GaugeIcon className="size-4" />
                    Speed Limits
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                    New Zealand <span className="text-amber-600">Speed Limits</span>
                </h1>

                {/* Subtitle / Description */}
                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    Everything you need to know about speed limits across New Zealand — from urban streets to open highways.
                </p>
                <span className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed block mt-2">
                    76k + speed limits, 100% free
                </span>

                {/* Optional: Quick stats or info chips */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        <CheckCircleIcon className="size-3.5 text-emerald-500" />
                        Updated 2026
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        <CheckCircleIcon className="size-3.5 text-emerald-500" />
                        Free Resource
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        <CheckCircleIcon className="size-3.5 text-emerald-500" />
                        NZTA Compliant
                    </span>
                </div>


                {/* search */}
                <div className="py-6">
                    <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
                        <div className="pl-2 text-neutral-500">
                            <SearchIcon className="size-4" />
                        </div>
                        <input
                            type="text"
                            value={_searchTerm}
                            onChange={handleSearchValueChange}
                            placeholder={'WELLINGTON CITY UTA...'}
                            className="h-11 w-full border-none bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
                            aria-label="Search posts"
                        />

                        <button
                            onClick={handleSearchEnter}
                            className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                    {_items.map((item) => (
                        <div
                            key={item.id || item.object_id}
                            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                        >

                            <div className="flex flex-wrap gap-4">
                                {/* Left - Speed Limit Badge */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                    <div className="inline-flex flex-col items-center justify-center bg-amber-500/10 rounded-xl px-5 py-3 min-w-[80px]">
                                        <span className="text-2xl font-bold text-amber-600">
                                            {item.speed_limit_value}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            km/h
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-slate-900">
                                        {item.speed_category}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5 justify-start items-start content-start">
                                    <span className="text-base font-bold text-gray-800">
                                        {item.speed_limit_record_name}
                                    </span>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {item.legal_reference}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <MapPinCheckInsideIcon className="size-4 text-gray-400" />
                                            {item.rca_zone_name}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar1Icon className="size-4 text-gray-400" />
                                            {item.speed_limit_start_date ? new Date(item.speed_limit_start_date).toLocaleDateString('en-NZ', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <InfoIcon className="size-4 text-gray-400" />
                                            {item.speed_limit_reason}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 flex items-center justify-end">
                                    <Link href={`/speed-limits/${item.object_id}`} className="text-amber-500 hover:text-amber-600 text-sm font-medium transition-colors hover:underline">
                                        View Details
                                    </Link>
                                </div>
                            </div>



                        </div>
                    ))}
                </div>

                {_items.length > 0 && (
                    <div className="mt-6 flex items-center justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={_isLoadingMore || !_hasMore}
                            className="inline-flex items-center justify-center rounded-xl border border-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400"
                        >
                            {_isLoadingMore ? 'Loading...' : _hasMore ? 'Load more' : 'No more results'}
                        </button>
                    </div>
                )}


                <Link href="/speed-limits-map" className="my-10 w-full group relative h-40 sm:h-60 inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors shadow-lg rounded-lg overflow-hidden">
                    <Image
                        src="/images/other/new-zealand-physical-map-2.jpg"
                        alt="New Zealand Physical Map"
                        width={800}
                        height={600}
                        className="object-cover scale-105 absolute left-0 top-0 w-full h-full opacity-60 -z-10 group-hover:opacity-80 transition-opacity duration-300"
                    />
                    <div className="w-full justify-end">
                        <span className="bg-orange-200 p-3 rounded-xl">
                            View Speed Limit Map
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}