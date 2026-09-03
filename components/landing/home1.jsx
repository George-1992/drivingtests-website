import BgEl from "@/components/other/bg";
import NeatEl from "@/components/other/neat";
import { ArrowRightIcon, ChevronDownIcon, ChevronRightIcon, FlaskConicalIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home1() {
    const fundingSchemes = [
        {
            title: "Horizon Europe Pillar 2",
            body: "Horizon Europe funds Collaborative Projects between academia, industry, and other types of entities, to address grand societal challenges or strategic industrial technologies.",
            href: "/grants/horizon-europe/",
        },
        {
            title: "European Research Council (ERC)",
            body: "The ERC supports investigator-driven frontier research across all academic disciplines, on the basis of scientific excellence.",
            href: "/grants/erc/",
        },
        {
            title: "Marie Sklodowska-Curie Actions",
            body: "The MSCA provide grants for all stages of researchers' careers and encourage transnational, intersectoral and interdisciplinary mobility.",
            href: "/grants/prepare-msca-grants/",
        },
        {
            title: "European Innovation Council (EIC)",
            body: "The EIC aims to support top-class innovators, entrepreneurs, small companies and researchers with bright ideas and the ambition to scale-up internationally.",
            href: "/grants/eic/",
        },
        {
            title: "Widening participation and strengthening the European Research Area (WIDERA)",
            body: "The WIDERA programme fosters partnerships and builds capacity to boost research excellence in underrepresented European countries.",
            href: "/grants/widera/",
        },
        {
            title: "EU Funding for Companies",
            body: "Discover unique European funding opportunities for your company.",
            href: "/grants/horizon-europe-public-funding-for-companies/",
        },
    ];

    const numbers = [
        {
            stat: "3k+",
            label: "Researchers supported in ERC applications",
        },
        {
            stat: "1k+",
            label: "Collaborative projects consulted across EU framework programs",
        },
        {
            stat: "15k+",
            label: "Researchers and managers trained through EU funding courses",
        },
    ];

    const news = [
        {
            date: "26 February 2026",
            title: "ERC calls ahead, EIC Pathfinder Open and FRONTIERS Call 4",
            href: "/company-science-news/",
        },
        {
            date: "29 January 2026",
            title: "New services and upcoming MSCA Staff Exchanges and Twinning deadlines",
            href: "/company-science-news/",
        },
        {
            date: "13 December 2025",
            title: "Season greetings from the company Science team",
            href: "/company-science-news/",
        },
    ];

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



    return (
        <div className="w-full">

            {/* hero section */}
            <div className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-7rem)] relative">
                <div className="w-full">
                    <h1 className="p-0 m-0 text-3xl md:text-6xl bg-gradient-to-r from-emerald-900 to-teal-200 bg-clip-text text-center font-semibold text-transparent">
                        The future of your research <br /> starts here.
                    </h1>
                </div>
                <div className="w-full h-[40%] sm:h-[50%] flex flex-col items-center">
                    <div className="w-full h-full relative my-10">
                        {/* <Image
                        src="/images/other/gggrain.svg"
                        alt="Home Image"
                        width={800}
                        height={400}
                        className="w-full h-full object-cover rounded-full"
                    /> */}

                        {/* <Image
                        src="/images/other/artturi-jalli-gYrYa37fAKI-unsplash.jpg"
                        alt="Home Image"
                        width={800}
                        height={400}
                        className="w-full h-full object-cover rounded-full"
                    /> */}
                        <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-900 to-teal-500 relative overflow-hidden flex items-center justify-center shadow-lg">
                            {/* <Image
                                src="/images/other/vitaly-gariev-2.jpg"
                                alt="Home Image"
                                width={800}
                                height={400}
                                quality={20}
                                className="w-full h-full object-cover opacity-30"
                            /> */}
                            <Image
                                src="/images/other/erc.webp"
                                alt="Home Image"
                                fill
                                quality={20}
                                className="object-cover opacity-30"
                            />

                            <NeatEl
                                variant={'v2'}
                                className="absolute w-full h-full top-0 left-0 object-cover opacity-35"
                            />
                            <BgEl
                                variant={5}
                                className="absolute w-full h-full top-0 left-0 object-cover opacity-60 "
                            />
                            <button className="absolute bottom-5 btn btn-primary text-base sm:text-xl hover:scale-105 duration-300 border-2 border-green-100" >
                                Explore Funding Schemes
                                <FlaskConicalIcon className="size-6" />
                            </button>

                        </div>
                    </div>
                </div>

                {/* text section 1 */}
                <div className="max-w-5xl py-0 sm:py-10 m-auto flex flex-col items-center ms:px-4 gap-5 text-center">
                    <h2 className="text-center text-xl md:text-2xl font-semibold text-slate-900 ">
                        DISCOVER THE RIGHT FUNDING SCHEME FOR YOUR RESEARCH
                    </h2>
                    <p className="leading-relaxed text-slate-600 sm:text-lg">
                        company Science offers customized services and resources for a large variety of EU funding schemes. Discover the unique characteristics, specific requirements, and the comprehensive tools and guidance we provide to help you successfully navigate your funding journey.
                    </p>
                    <div className="w-full h-12">

                    </div>
                </div>
                <div className="absolute left-0 right-0 bottom-[605px] sm:bottom-2 w-full flex justify-center">
                    <div className="flex flex-col items-center">
                        <span className="text-xs mt-3 w-36 md:w-48 m-auto rounded-full text-center text-emerald-700 bg-orange-200 border border-orange-300 px-2 py-1 font-semibold uppercase md:tracking-[0.24em] animate-pulse">
                            company Science
                        </span>
                        <ChevronDownIcon className="size-5 text-emerald-700 animate-bounce" />
                    </div>
                </div>
            </div>


            {/* cards 1 */}
            <div className="py-8 sm:py-16" >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {fundingSchemes.map((item, index) => {
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group p-5 h-[350px] relative rounded-2xl border border-slate-200 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg overflow-hidden"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2)), url('/images/bg/bg-${(index % 2) + 1}.svg')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {/* <BgEl
                                    variant={9}
                                    className="absolute w-full h-full top-0 left-0 object-cover -z-10 opacity-80 "
                                /> */}

                                <div className="w-full h-2/6">
                                    <h3 className="mt-2 text-2xl font-semibold leading-snug text-gray-700 transition ">{item.title}</h3>
                                </div>
                                <div className="w-full h-4/6 flex flex-col justify-between">
                                    <p className="leading-relaxed text-gray-500 group-hover:text-gray-600">{item.body}</p>
                                    <span className="mt-6 inline-flex items-center gap-1 font-medium text-emerald-600 rounded-2xl px-4 bg-orange-50 w-fit">
                                        Explore
                                        <ChevronRightIcon className="size-6 transition group-hover:translate-x-1" />
                                    </span>

                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* latest news */}
            <div className="py-8 sm:py-16">
                <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Latest Updates</p>
                        <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">company Science News</h2>
                    </div>
                    <Link href="/company-science-news/" className="text-sm font-semibold text-emerald-700 hover:text-emerald-600">
                        Read all news
                    </Link>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {news.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-md"
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.date}</p>
                            <h3 className="mt-4 text-xl font-semibold leading-snug text-slate-900 transition group-hover:text-emerald-700">{item.title}</h3>
                            <p className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                                Read here
                                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* stats */}
            <div className="py-8 sm:py-16">
                <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-700 px-6 py-8 text-white shadow-[0_24px_80px_rgba(6,78,59,0.18)]  ">
                    <div className="flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h3 className="mt-3 text-3xl text-gray-50 font-semibold leading-tight sm:text-4xl">company Science in Numbers</h3>
                        </div>
                        <p className="max-w-xl text-sm leading-relaxed text-emerald-50/80 sm:text-base">
                            company Science has employed its unique methodology on thousands of projects from all scientific domains. Get to know us through key figures that reflect our experience, achievements, and impact in the EU funding landscape.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {numbers.map((item) => (
                            <div key={item.stat} className="rounded-[1.75rem] border border-white/15 bg-white/10 p-7 text-center shadow-lg backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/15">
                                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-100/75">Metric</p>
                                <p className="mt-5 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-5xl font-semibold text-transparent lg:text-6xl">{item.stat}</p>
                                <div className="mx-auto mt-5 h-px w-16 bg-white/30" />
                                <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-emerald-50/85">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* clients */}
            <div className="w-full py-10">
                <div className="max-w-[650px] m-auto py-5">
                    <h3 className="text-xl sm:text-2xl text-center"> OUR CLIENTS  </h3>
                    <p className="text-center">
                        company Science has worked with hundreds of research organisations and companies over the years.
                        View the full list of our clients
                        <Link href="/about-us/track-record/" className="underline" aria-label="View the full list of our clients"> here</Link>
                    </p>
                </div>

            </div>

            {/* knowledge base */}
            <div className="py-8 sm:py-16">
                <div className="mb-8 text-center sm:mb-12">
                    <h3 className="text-2xl font-semibold text-slate-900 sm:text-4xl">EU GRANTS KNOWLEDGE BASE</h3>
                    <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        Our experienced team of consultants shares practical articles to help you navigate every stage of the grant journey, from proposal writing to project management and beyond. Explore our latest articles below.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {knowledgeBaseArticles.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]">
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">{item.category}</span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{item.topic}</span>
                            </div>
                            <h4 className="mt-4 text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-emerald-700">
                                {item.title}
                            </h4>
                            <p className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                                Read More
                                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                            </p>
                        </Link>
                    ))}
                </div>

                <Link href="/knowledge-base/" className="my-10 flex justify-center items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-600 ">
                    Explore the Knowledge Base
                    <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
            </div>



            <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
                <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white sm:p-10 lg:p-12">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">Need guidance?</p>
                    <h2 className="mt-4 max-w-3xl text-3xl text-gray-50 font-semibold leading-tight sm:text-4xl">
                        Have a question about our services or the funding schemes we support?
                    </h2>
                    <p className="mt-4 max-w-2xl text-emerald-50">
                        Talk with our team to map your next steps and identify the most suitable funding opportunities for your goals.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="mailto:info@company-science.com"
                            className="inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            info@company-science.com
                        </Link>
                    </div>

                </div>
            </section>
        </div>
    );
}
