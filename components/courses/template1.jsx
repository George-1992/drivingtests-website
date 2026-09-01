'use client';

import { getPathname } from "@/utils/other";
import { CircleCheckIcon, GraduationCapIcon, InfoIcon } from "lucide-react";
import Image from "next/image";
import allCourses from "@/data/courses.json";
import { useState } from "react";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/modals/popup";



export default function Template1(props) {
    const {
        title,
        description,
        price,
        priceSuffix = "+GST",
        buttonText = "Request Access",
        onButtonClick,
        videoUrl,
        imageUrl,
        benefits = [],
        provider = {},
        contentSections = [],
        conclusion,
    } = props;

    const [isAccessRequest, setIsAccessRequest] = useState(false);

    const handleAccessRequestClick = () => {
        if (typeof onButtonClick === "function") {
            onButtonClick();
        }
        setIsAccessRequest(true);
    };

    const pathname = getPathname(props?.params?.slug || []);
    const courseItem = allCourses.find(course => course.slug === pathname);
    const data = courseItem?.data || {};

    const resolvedTitle = title || data.title || "";
    const resolvedDescription = description || data.description || "";
    const resolvedPrice = price || data.price || "";
    const resolvedVideoUrl = videoUrl || data.videoUrl || "";
    const resolvedImageUrl = imageUrl || data.imageUrl || "";
    const resolvedBenefits = Array.isArray(benefits) && benefits.length > 0
        ? benefits
        : Array.isArray(data.benefits)
            ? data.benefits
            : [];
    const resolvedProvider = provider && Object.keys(provider).length > 0
        ? provider
        : {
            name: "TR Driver Training",
            description: "TR Driver Training specialises in heavy and light commercial and rural vehicle training nationwide.",
            logo: "/images/other/tr_course_logo.png"
        };
    const resolvedContentSections = Array.isArray(contentSections) && contentSections.length > 0
        ? contentSections
        : Array.isArray(data.otherContent)
            ? data.otherContent.map(section => ({
                title: section?.title || section?.sectionTitle || "",
                text: "",
                content: Array.isArray(section?.content) ? section.content : [],
                subSections: section?.subSections || []
            }))
            : [];
    const resolvedConclusion = conclusion ?? data.conclusion ?? "";


    

    return (
        <div className="w-full flex flex-col gap-8 p-2 md:p-4 text-gray-800">
            {/* Header Banner */}
            {resolvedTitle && (
                <div className="w-full rounded-xl bg-slate-900 text-white p-6 shadow-xl border border-slate-800">
                    <GraduationCapIcon className="w-10 h-10 text-amber-400" />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 tracking-tight mb-2">
                        {resolvedTitle}
                    </h1>
                    {resolvedDescription && (
                        <p className="text-slate-300 text-lg md:text-xl font-medium">
                            {resolvedDescription}
                        </p>
                    )}
                </div>
            )}

            {/* Pricing & Action Bar */}
            {(resolvedPrice || buttonText) && (
                <div className="w-full relative rounded-xl bg-blue-50/80 border border-blue-100 p-5 flex flex-col items-start justify-between gap-3 shadow-sm">
                    <div className="w-full flex flex-col sm:flex-row items-center gap-6 justify-between">
                        {resolvedPrice && (
                            <div className="flex items-start gap-1">
                                <span className="text-4xl font-black text-slate-900">{'$ ' + resolvedPrice}</span>
                                {priceSuffix && (
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                        {priceSuffix}
                                    </span>
                                )}
                            </div>
                        )}

                        {buttonText && (
                            <button
                                onClick={handleAccessRequestClick}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-8 py-3.5 rounded-lg shadow-md transition duration-200"
                            >
                                {buttonText}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-blue-600  text-xs">
                        <InfoIcon className="w-6 h-6 text-blue-400" />
                        Prices are per user per month. Contact us for team pricing and discounts.
                    </div>

                </div>
            )}

            {/* Video & Benefits Section */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Video Player */}
                {resolvedVideoUrl && (
                    <div className="md:w-2/3">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                            <iframe
                                src={resolvedVideoUrl}
                                className="absolute top-0 left-0 w-full h-full border-0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                                title={resolvedTitle || "Course Video"}
                            />
                        </div>
                    </div>
                )}

                {
                    resolvedImageUrl && !resolvedVideoUrl && (
                        <div className="md:w-2/3">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                                <Image
                                    src={resolvedImageUrl}
                                    alt={resolvedTitle || "Course Image"}
                                    width={1280}
                                    height={720}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )
                }

                {/* Benefits Sidebar */}
                {((resolvedBenefits && resolvedBenefits.length > 0) || resolvedProvider.name) && (
                    <div
                        className="flex flex-col justify-between rounded-xl bg-slate-50 border border-slate-200 p-6 shadow-sm md:w-1/3"
                    >
                        {resolvedBenefits && resolvedBenefits.length > 0 && (
                            <ul className="space-y-3.5">
                                {resolvedBenefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CircleCheckIcon className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-1" />
                                        <span className="text-sm font-medium text-slate-700 leading-snug">
                                            {benefit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}


                    </div>
                )}
            </div>

            <div className="w-full rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50 px-5 py-5 shadow-sm md:px-6 md:py-6">
                <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:text-left">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:h-24 md:w-24">
                        <Image
                            src="/images/other/tr_course_logo.png"
                            alt="TR Driver Training"
                            width={140}
                            height={140}
                            className="h-auto w-16 md:w-20"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                            Course provider
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 md:text-xl">
                            Course provided by {resolvedProvider.name || "TR Driver Training"}
                        </h4>
                        <p className="text-sm leading-6 text-slate-600 md:text-base">
                            {resolvedProvider.description || "TR Driver Training specialises in heavy and light commercial and rural vehicle training nationwide."} Call us on
                            <a href="tel:0800 637 000" className="mx-2 text-blue-600 font-semibold hover:underline">
                                0800 637 000
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Dynamic Main Body Content & Sections */}
            {(resolvedContentSections.length > 0 || resolvedConclusion) && (
                <div className="w-full bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
                    {resolvedContentSections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="space-y-4">
                            {sectionIdx > 0 && <hr className="border-slate-100 mb-6" />}
                            {section.title && (
                                <h2 className="text-xl font-bold text-slate-900">
                                    {section.title}
                                </h2>
                            )}

                            {Array.isArray(section.content) && section.content.length > 0 && (
                                <div className="space-y-3 text-slate-700">
                                    {section.content.map((item, itemIdx) => (
                                        <p key={itemIdx} className="text-base leading-relaxed md:text-lg">
                                            {item}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {!Array.isArray(section.content) && section.text && (
                                <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                                    {section.text}
                                </p>
                            )}
                        </div>
                    ))}

                    {resolvedConclusion && (
                        <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <p className="font-semibold text-amber-900">{resolvedConclusion}</p>
                        </div>
                    )}
                </div>
            )}

            <Popup
                open={isAccessRequest}
                onClose={() => setIsAccessRequest(false)}
                title={resolvedTitle ? `Request access for ${resolvedTitle}` : "Request access"}
                maxWidth="max-w-md"
            >
                <p className="mb-4 text-sm text-slate-600">
                    Enter your email and we will send the access details for this course.
                </p>

                <FormBuilder
                    fields={[
                        {
                            name: "email",
                            label: "Email",
                            type: "email",
                            required: true,
                            placeholder: "you@example.com",
                        },
                    ]}
                    data={{
                        action: "course-access-request",
                        courseTitle: resolvedTitle,
                        courseSlug: pathname,
                    }}
                    submitLabel="Send access request"
                    successMessage="Thanks! We will email you the access details shortly."
                    className="w-full rounded-xl border border-slate-200 bg-white p-0 shadow-none"
                />
            </Popup>

            <div className="h-5 sm:h-8"></div>
        </div>
    );
}