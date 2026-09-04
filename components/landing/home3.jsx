import { getFileUrl } from "@/actions/globals";
import { directusRequest } from "@/services/directus";
import { displayDate } from "@/utils/other";
import { ArrowRightIcon, BookIcon, BriefcaseBusinessIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon, FlaskConicalIcon, GaugeIcon, GraduationCapIcon, LayersIcon, StarIcon, StepBackIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home3() {



    const knowledgeBaseArticles = [
        {
            category: "Horizon Europe",
            topic: "Grant basics",
            title: "Don't wait for the call: how to start preparing your Portugal 2030 application...",
            href: "/start-preparing-your-portugal-2030-application/",
        },
        {
            category: "Horizon Europe",
            topic: "Grant basics",
            title: "Como encontrar oportunidades de financiamento a fundo perdido (que são mesmo pa...",
            href: "/oportunidades-de-financiamento-a-fundo-no-portugal-2030/",
        },
        {
            category: "Horizon Europe",
            topic: "Grant basics",
            title: "How to find non-refundable funding opportunities (that are truly right for you) ...",
            href: "/funding-opportunities-in-portugal-2030/",
        },
    ];
    const numbers = [
        {
            stat: "130k+",
            title: "Licenses and certifications",
            label: "Licenses and certifications obtained by our clients through our training programs",
        },
        {
            stat: "7k+",
            title: "Companies and organizations",
            label: "Companies and organizations that have benefited from our training and consulting services",
        },
        {
            stat: "60k+",
            title: "Hours of training delivered",
            label: "Hours of training delivered to individuals and teams across various industries, enhancing skills and knowledge",
        },
    ];
    const testimonials = [
        {
            quote: "We have a 100% pass rate for our learner-clients for all classes. Some are not able to come in and do in-house training for the theory section, so we have given them your site address and instructions on how to make best use of the resource. Your site has been and is of great help to road code learners of all classes of vehicles.",
            author: "Sheryl Barnett-Rolston",
            role: "G & R Driver Training",
        },
        {
            quote: "As a resource for aspiring motorcyclists wanting to prepare for their theory assessment, we have found the online sample tests available from drivingtests.co.nz to be invaluable. To be honest we have yet to have someone fail who has prepared using these free online test questions. Great stuff!",
            author: "Ross Gratton",
            role: "Two Bald Bikers Motorcycle Training",
        },
        {
            quote: "I would like to thank you very much regarding the tests on this site. I am driving car in NZ for last 15 years and I have recently applied for my motorbike license, just followed all the question from this site for motorbikes and I have passed at the first attempt. It's a great site and thank you very much.",
            author: "Raj C",
            role: "Motorcycle License Graduate",
        },
        {
            quote: "We use this wonderful resource to help our students learn the road code in preparation for sitting their Learner Licence.",
            author: "Jan Blair",
            role: "Front-line Training",
        },
    ];

    //fetch latest 10 posts from the knowledge base
    const _articles = [];
    const _fetchedPostsRes = await directusRequest({
        method: 'GET',
        endpoint: '/items/posts',
        params: {
            filter: {
                type: {
                    _eq: 'post'
                }
            },
            limit: 6,
            sort: '-date_created',
            fields: 'id,type,title,description,image,slug,date_created',
        },
    });
    _articles.push(..._fetchedPostsRes.data || []);
    console.log('_articles ==> ', _articles.length);



    return (
        <div className="w-full">

            {/* articles */}
            <div className="w-full ">
                {(_articles?.length ? _articles : knowledgeBaseArticles).length > 0 && (
                    <>
                        <div className="grid gap-5 lg:grid-cols-[2.2fr_1fr]">
                            <Link
                                href={`/${(_articles?.length ? _articles : knowledgeBaseArticles)[0].slug}`}
                                className="group relative min-h-[420px] overflow-hidden rounded-3xl border border-slate-200 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-yellow-600/50 to-orange-100/60" />
                                <Image
                                    src={getFileUrl((_articles?.length ? _articles : knowledgeBaseArticles)[0].image) || "/images/other/gggrain.svg"}
                                    alt={(_articles?.length ? _articles : knowledgeBaseArticles)[0].title}
                                    width={800}
                                    height={400}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                <div className="relative z-10 flex h-full flex-col justify-between">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-700">Resources</p>
                                        <h3 data-lag="0.3" className="mt-3 text-3xl font-semibold leading-tight text-yellow-50 bg-gray-800/50">
                                            {(_articles?.length ? _articles : knowledgeBaseArticles)[0].title}
                                        </h3>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-xs font-medium uppercase tracking-[0.18em] bg-gray-50 px-3 py-1 rounded-full shadow-sm text-slate-500">
                                            {displayDate(_articles?.[0]?.date_created)}
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-yellow-700 shadow-sm">
                                            Read
                                            <ChevronRightIcon className="size-4 transition group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <div className="flex flex-col gap-5">
                                {(_articles?.length ? _articles : knowledgeBaseArticles)
                                    .slice(1, 3)
                                    .map((article, index) => (
                                        <Link
                                            key={article.slug || article.title || index}
                                            href={`/${article.slug}`}
                                            className="group relative min-h-[200px] overflow-hidden rounded-3xl border border-slate-200 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-yellow-600/50 to-orange-100/60" />
                                            <Image
                                                src={getFileUrl(article.image) || "/images/other/gggrain.svg"}
                                                alt={article.title}
                                                width={800}
                                                height={400}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />

                                            <div className="relative z-10 flex h-full flex-col justify-between">
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-700">Resources</p>
                                                    <h3 className="mt-3 text-xl font-semibold leading-snug text-yellow-50 bg-gray-800/50">
                                                        {article.title}
                                                    </h3>
                                                </div>

                                                <div className="mt-5 flex items-center justify-between">
                                                    <span className="text-xs font-medium uppercase tracking-[0.18em] bg-gray-50 px-3 py-1 rounded-full shadow-sm text-slate-500">
                                                        {displayDate(article?.date_created)}
                                                    </span>
                                                    <ChevronRightIcon className="size-5 text-yellow-700 transition group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-3">
                            {(_articles?.length ? _articles : knowledgeBaseArticles)
                                .slice(3, 6)
                                .map((article, index) => (
                                    <Link
                                        key={article.slug || article.title || index}
                                        href={article.href || `/${article.slug || article.title?.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="group relative overflow-hidden rounded-3xl border border-slate-200 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg"
                                    >
                                        <div className={[
                                            "absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-yellow-600/50 to-orange-100/60",
                                            "opacity-60",
                                        ].join(" ")} />
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div className="flex-1">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-700">
                                                    {article.category || "Resources"}
                                                </p>
                                                <h3 className="text-xl font-semibold text-yellow-50 bg-gray-800/50">
                                                    {article.title}
                                                </h3>
                                            </div>
                                            <div className="mt-5 flex items-center justify-between bg-white/50 w-fit rounded-full px-3 py-1 shadow-sm">
                                                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                                    {displayDate(article?.date_created)}
                                                </span>
                                                <ChevronRightIcon className="size-5 text-yellow-700 transition group-hover:translate-x-1" />
                                            </div>
                                        </div>

                                        <Image
                                            src={getFileUrl(article.image) || "/images/other/gggrain.svg"}
                                            alt={article.title}
                                            width={800}
                                            height={400}
                                            className={'absolute inset-0 h-full w-full object-cover -z-10'}
                                        />
                                    </Link>
                                ))}
                        </div>
                    </>
                )}

                <div className="mb-8 flex items-end justify-between gap-4 border-b border-slate-200 py-4 sm:mb-12">
                    <p className="opacity-55">
                        We have thousands of articles to help you to get your license
                    </p>
                    <Link href="/blog" className="text-sm font-semibold text-yellow-700 hover:text-yellow-600">
                        View all articles
                    </Link>
                </div>
            </div>

            {/* speed limits */}
            <div className="">
                <div className="text-center mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                        New Zealand Speed Limits
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Explore the speed limits across New Zealand with our interactive map, helping you stay informed and drive safely.
                    </p>
                </div>
                <Link href="/speed-limits-map" className="my-10 w-full group relative h-40 sm:h-60 flex items-center justify-center text-amber-600 hover:text-amber-700 transition-colors shadow-lg rounded-lg overflow-hidden">
                    <Image
                        src="/images/other/new-zealand-physical-map-2.jpg"
                        alt="New Zealand Physical Map"
                        width={800}
                        height={600}
                        className="object-cover scale-105 absolute left-0 top-0 w-full h-full opacity-60 -z-10 group-hover:opacity-80 transition-opacity duration-300"
                    />
                    <div className="w-full justify-center flex items-center gap-3 text-lg font-semibold ">
                        <span className="bg-orange-200 p-3 rounded-xl">
                            View Speed Limit Map
                        </span>
                    </div>
                </Link>
            </div>

            {/* courses */}
            <section className="py-8 sm:py-16 relative overflow-hidden rounded-2xl mx-auto ">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                    Online Driver &amp; Workplace Training
                </span>
                <div className="mb-8 py-6 flex flex-col md:flex-row items-start justify-between gap-4 sm:mb-12">
                    <div className="md:w-1/2">

                        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-4 mb-3 leading-snug">
                            Master the Roads &amp; Elevate Your Career
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                            From passing your NZ learner licence test on the first try to getting certified for workplace machinery and commercial endorsements—our online courses are designed to take you from complete beginner to confident, qualified operator. Whether you are preparing for your first road test or working toward forklift, crane, or heavy vehicle certification, you will find structured, easy-to-follow modules that break down exactly what you need to know. Study whenever it suits you, revisit tricky sections as often as you like, and track your progress every step of the way.
                        </p>
                    </div>
                    <div className="md:w-1/2 flex items-center justify-center">
                        <Image
                            src="/images/other/courses-image.png"
                            alt="Road Code Illustration"
                            width={600}
                            height={400}
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                            <BookIcon className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-amber-600 font-bold text-base mb-1">Licence Theory Prep</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Car, Heavy Vehicle, and Motorbike Road Code tests available in 76 languages.</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                            <LayersIcon className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-amber-600 font-bold text-base mb-1">Workplace Endorsements</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Forklift (OSH &amp; F), EWP, Telehandler, Load Security, and Dangerous Goods.</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                            <BriefcaseBusinessIcon className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-amber-600 font-bold text-base mb-1">Fleet &amp; Business</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Health &amp; safety compliance, driver assessments, and defensive driving modules.</p>
                    </div>
                </div>

                <div data-lag={'0.4'} className="flex flex-col md:flex-row items-center gap-6 pt-2 border border-gray-100 rounded-xl bg-gray-50 p-6 shadow-sm relative overflow-hidden">
                    {/* Subtle accent line */}

                    <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-bold text-gray-800">
                            Find Your Course
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Pass your road code test, get certified for workplace machinery, and unlock new opportunities with our expert-led courses and resources.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                100% Free Practice Tests
                            </span>
                            <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                Industry-Recognized Certifications
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
                        <Link
                            href="/courses"
                            className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group animate-pulse"
                        >
                            <span>Explore All Courses</span>
                            <ChevronRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>


                {/* lms dashboard */}
                <div className="my-8 sm:my-14 first:border border-gray-100 rounded-xl bg-gray-50 p-6 shadow-sm relative overflow-hidden">
                    {/* Subtle accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/60 rounded-t-xl"></div>

                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/60 rounded-full text-amber-700 text-xs font-semibold uppercase tracking-wider">
                                    <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    Included Free
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                                    A world-class LMS, included free with every course
                                </h3>
                            </div>

                            <p className="text-gray-600 leading-relaxed max-w-2xl">
                                No per-user fees. No hidden extras. Purchase any course and get full access to our Learning Management System, whether you have 1 staff or 100,000.
                            </p>

                            {/* Key features */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <CheckIcon className="size-5 text-green-500" />
                                    <span>Unlimited <strong>users</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <CheckIcon className="size-5 text-green-500" />
                                    <span>No <strong>per-seat fees</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <CheckIcon className="size-5 text-green-500" />
                                    <span><strong>Enterprise-grade</strong> features</span>
                                </div>
                            </div>


                        </div>
                        <div className="w-full md:w-[55%] flex-shrink-0">
                            <Image
                                src="/images/other/lms-preview.png"
                                alt="LMS Dashboard"
                                width={800}
                                height={400}
                                className="w-full h-auto rounded-xl border border-gray-200/50"
                            />
                        </div>
                    </div>

                    <div className="w-full flex justify-end">
                        <Link
                            href="/lms-features"
                            className="mt-6 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                        >
                            <span>Explore LMS</span>
                            <ChevronRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

            </section>

            {/* stats */}
            <div className="py-8 sm:py-16">
                <div className="overflow-hidden rounded-[2rem] border border-yellow-100 bg-gradient-to-br from-yellow-950 via-yellow-900 to-teal-700 px-6 py-8 text-white shadow-[0_24px_80px_rgba(6,78,59,0.18)]  ">
                    <div className="flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h3 className="mt-3 text-3xl text-gray-50 font-semibold leading-tight sm:text-4xl">
                                Dttraining in Numbers
                            </h3>
                        </div>
                        <p className="max-w-xl text-sm leading-relaxed text-yellow-50/80 sm:text-base">
                            Dttraining has helped thousands of people to get trained and licensed, from theory exams to practical lessons and mock tests.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {numbers.map((item) => (
                            <div key={item.stat} className="rounded-[1.75rem] border border-white/15 bg-white/10 p-7 text-center shadow-lg backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/15">
                                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-yellow-100/75">{item?.title}</p>
                                <p className="mt-5 bg-gradient-to-r from-white via-yellow-100 to-teal-100 bg-clip-text text-5xl font-semibold text-transparent lg:text-6xl">{item.stat}</p>
                                <div className="mx-auto mt-5 h-px w-16 bg-white/30" />
                                <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-yellow-50/85">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* testimonials */}
            <div className="py-6">

                {/* Section Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/60 rounded-full text-amber-700 text-xs font-semibold uppercase tracking-wider mb-3">
                        <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Testimonials
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                        What Our Students & Partners Say
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Real stories from real people who have passed with our help
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((item) => (
                        <div
                            key={`${item.author}-${item.role}`}
                            className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                        >
                            <div className="flex items-start gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className="size-4 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <blockquote className="flex-1">
                                <p className="text-gray-700 text-sm leading-relaxed italic">
                                    {item.quote}
                                </p>
                            </blockquote>
                            <footer className="mt-4 pt-3 border-t border-gray-100">
                                <strong className="text-gray-800 text-sm">{item.author}</strong>
                                <span className="block text-gray-500 text-xs">{item.role}</span>
                            </footer>
                        </div>
                    ))}
                </div>
            </div>


            {/* endorsement     */}
            <div className="py-8 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/60 rounded-full text-amber-700 text-xs font-semibold uppercase tracking-wider">
                        <GraduationCapIcon className="size-3.5" />
                        Endorsement
                    </div>

                    {/* Heading */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        Prepare for an <span className="text-amber-600">I endorsement</span>
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        If you are thinking of becoming a driving instructor, the first step is to ensure you know the Road Code and can pass a 100-question theory quiz. Use our free resource to help you prepare, then you are ready to{' '}
                        <Link
                            href="https://trdrivertraining.co.nz/courses/driving-instructor-endorsement/"
                            className="text-amber-600 hover:text-amber-700 font-medium underline-offset-2 hover:underline transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            book your I endorsement course
                        </Link>
                        .
                    </p>

                    {/* Quick stats */}
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-1">
                        <div className="flex items-center gap-2">
                            <CheckIcon className="size-5 text-emerald-500" />
                            <span className="text-sm text-gray-700"><strong>100</strong> practice questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckIcon className="size-5 text-emerald-500" />
                            <span className="text-sm text-gray-700"><strong>Free</strong> study resource</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckIcon className="size-5 text-emerald-500" />
                            <span className="text-sm text-gray-700"><strong>100%</strong> pass rate for users</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                        <Link
                            href="https://trdrivertraining.co.nz/courses/driving-instructor-endorsement/"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Book I Endorsement Course</span>
                            <ChevronRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                        <p className="text-xs text-gray-400 mt-2">
                            Powered by TR Driver Training
                        </p>
                    </div>
                </div>
            </div>

            {/* contact us */}
            <section className="py-8 mx-auto w-full pb-20 sm:px-6 lg:px-8 lg:pb-24">
                <div className="overflow-hidden rounded-3xl border border-yellow-200 bg-gradient-to-r from-yellow-600 to-teal-600 p-8 text-white sm:p-10 lg:p-12">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-100">Need guidance?</p>
                    <h2 className="mt-4 max-w-3xl text-3xl text-gray-50 font-semibold leading-tight sm:text-4xl">
                        Have a question about our courses or services?
                    </h2>
                    <p className="mt-4 max-w-2xl text-yellow-50">
                        Talk with our team to map out your learning journey, get advice on the best courses for your goals.Our team is here to help you find the right solution for your learning and licensing needs.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-50"
                        >
                            Contact Us
                        </Link>
                        {/* <Link
                            href="mailto:contact@drivingtests.co.nz"
                            className="inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            contact@drivingtests.co.nz
                        </Link> */}
                    </div>

                </div>
            </section>



            <section className="py-8 mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
                <p className="text-center text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">

                    {`DriveReady is the most experienced driving school in the industry, built on years of dedicated work helping people become safe, confident, and fully licensed drivers. Our reputation rests on a simple foundation: qualified instructors, proven training materials, and a genuine commitment to every learner's success.
                    Our team is made up of certified, highly trained instructors who bring real expertise to every lesson. They understand the driving test process inside and out, from the nuances of the theory exam to the specific skills examiners look for during the practical test. This depth of experience means our students aren't just memorizing rules, they're building real driving competence.`}
                </p>
            </section>

        </div >
    );
}
