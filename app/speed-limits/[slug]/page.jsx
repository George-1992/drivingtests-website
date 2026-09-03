import FormBuilder from "@/components/formBuilder";
import ContactForm from "@/components/other/contactForm";
import ShareButtons from "@/components/other/shareButtons";
import PageWrapper from "@/components/pageWrapper";
import { directusRequest } from "@/services/directus";
import { CheckCircle2Icon, ChevronLeftIcon, ChevronRightIcon, MessageSquareQuoteIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page(props) {

    const objectId = props?.params?.slug || '';
    // console.log('objectId: ', objectId);


    const getItem = async () => {
        try {
            if (!objectId) return null;

            //fetch the item from directus
            const d = await directusRequest({
                method: 'GET',
                endpoint: `/items/speed_limits`,
                params: {
                    filter: {
                        object_id: {
                            _eq: objectId
                        }
                    },
                },
            });
            return d?.data?.[0] || null;
        } catch (error) {
            console.error('Error parsing objectId: ', error);
            return null;
        }
    };
    // Ensure the promise is resolved
    const item = await getItem() || {};
    // console.log('item: ', item);

    return (
        <PageWrapper
            params={{
                slug: ['contact-us'],
            }}
            pageData={{
                title: 'Speed Limit Details - ' + (item?.rca_zone_name ? ' Location: ' + item.rca_zone_name : '') + ' ' + (item?.speed_limit_record_name || 'Speed Limit Record'),
                description: 'Explore the details of the selected speed limit record in New Zealand.' + (item?.speed_limit_reason ? ' Reason: ' + item.speed_limit_reason : '') + (item?.rca_zone_name ? ' Location: ' + item.rca_zone_name : '') + (item?.legal_reference ? ' Legal Reference: ' + item.legal_reference : ''),
            }}
        >
            <div className="w-full py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/speed-limits"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 text-sm font-medium transition-colors mb-6 group"
                    >
                        <ChevronLeftIcon className="size-4 group-hover:translate-x-[-2px] transition-transform" />
                        Back to Speed Limits
                    </Link>

                    {/* Main Card */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        {/* Accent Bar */}
                        <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>

                        <div className="p-6 md:p-8">
                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                <div className="space-y-2">
                                    {/* Category Badge */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {item?.speed_category && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                {item.speed_category}
                                            </span>
                                        )}
                                        {item?.rca_zone_name && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                                {item.rca_zone_name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        {item?.speed_limit_record_name || 'Speed Limit Record'}
                                    </h1>

                                    {/* Legal Reference */}
                                    {item?.legal_reference && (
                                        <p className="text-sm text-gray-500">
                                            {item.legal_reference}
                                        </p>
                                    )}
                                </div>

                                {/* Speed Limit Badge */}
                                {item?.speed_limit_value && (
                                    <div className="flex-shrink-0">
                                        <div className="flex flex-col items-center justify-center bg-amber-500/10 rounded-2xl px-8 py-4 border-2 border-amber-500/20">
                                            <span className="text-4xl md:text-5xl font-bold text-amber-600">
                                                {item.speed_limit_value}
                                            </span>
                                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                                                km/h
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Location */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-100/50 rounded-lg">
                                            <svg className="size-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Location</p>
                                            <p className="text-gray-800 font-medium">{item?.rca_zone_name || 'N/A'}</p>
                                            {item?.rca_zone_id && (
                                                <p className="text-sm text-gray-500">RCA Zone ID: {item.rca_zone_id.substring(0, 8)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-100/50 rounded-lg">
                                            <svg className="size-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Reason</p>
                                            <p className="text-gray-800 font-medium">{item?.speed_limit_reason || 'N/A'}</p>
                                            {item?.object_id && (
                                                <p className="text-sm text-gray-500">Object ID: {item.object_id}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Effective Date */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-100/50 rounded-lg">
                                            <svg className="size-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Effective Date</p>
                                            <p className="text-gray-800 font-medium">
                                                {item?.speed_limit_start_date ? new Date(item.speed_limit_start_date).toLocaleDateString('en-NZ', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-500">When effective</p>
                                        </div>
                                    </div>
                                </div>

                                {/* End Date */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-100/50 rounded-lg">
                                            <svg className="size-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">End Date</p>
                                            <p className="text-gray-800 font-medium">
                                                {item?.speed_limit_end_date ? new Date(item.speed_limit_end_date).toLocaleDateString('en-NZ', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'Ongoing'}
                                            </p>
                                            <p className="text-sm text-gray-500">When ineffective</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-gradient-to-r from-amber-50 to-amber-50/50 rounded-xl p-4 border border-amber-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <svg className="size-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Record Details</p>
                                            {item?.id && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Record ID:</span> {item.id.substring(0, 8)}...
                                                </p>
                                            )}
                                            {item?.date_created && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Created:</span> {new Date(item.date_created).toLocaleDateString('en-NZ', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            )}
                                            {item?.date_updated && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Updated:</span> {new Date(item.date_updated).toLocaleDateString('en-NZ', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {/* <div className="flex flex-wrap items-center gap-2">
                                        <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                                            Print Details
                                        </button>
                                        <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-colors">
                                            Share
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full my-5 flex flex-wrap items-center justify-center gap-2">

                        <div className="w-full my-8 mx-auto">
                            <Link
                                href="/courses"
                                className="group relativeborder border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block bg-orange-100 "
                            >
                                <div className="relative h-56 md:h-64 overflow-hidden">
                                    <Image
                                        src="/images/other/courses.jpg"
                                        alt="Online Courses"
                                        fill
                                        className="object-center object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
                                            <svg className="size-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                            </svg>
                                            Popular
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
                                            Free Access
                                        </span>
                                    </div>

                                    {/* Overlay Text */}
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <span className="inline-block text-white/80 text-sm font-medium mb-1">Start Learning Today</span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white">Online Courses</h2>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="space-y-2">
                                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                                Expert-led training for road code and workplace certifications.
                                                <span className="hidden sm:inline"> Get certified and advance your career with our comprehensive courses.</span>
                                            </p>

                                            {/* Feature tags */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                    <svg className="size-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    100+ Courses
                                                </span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                    <svg className="size-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Self-Paced
                                                </span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                    <svg className="size-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Certificate Included
                                                </span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 group">
                                                Explore All Courses
                                                <ChevronRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper >
    );
}
