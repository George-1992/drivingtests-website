import { breakTextFade, wordReveal } from "@/components/animations/functions";
import ScrollPath from "@/components/animations/scrollPath";
import FormBuilder from "@/components/formBuilder";
import BgEl from "@/components/other/bg";
import Card2 from "@/components/other/card2";
 import NeatEl from "@/components/other/neat";
import { ArrowRightIcon, ChevronDownIcon, ChevronRightIcon, FlaskConicalIcon, MicroscopeIcon, SparkleIcon, ToolboxIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home2() {

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

    const cards1 = [
        {
            variant: 'default',
            title: 'Strategic consultation',
            subtitle: 'Quick Dive',
            description: 'A focused one-on-one consultation with our experts at any stage.',
            idealWhen: 'You want an experienced view on fit or positioning, testing an early concept, looking for a strategic reflection on a proposal mid-way or focused feedback before submission.',
            linkText: 'Learn more',
            backgroundImage: true,
        },
        {
            variant: 'default',
            title: 'In-depth proposal development',
            subtitle: 'Deep Dive',
            description: 'Hands-on support through to the deadline.',
            idealWhen: 'You want sustained support in developing a competitive proposal and strengthening all parts of the application.',
            linkText: 'Learn more',
            backgroundImage: true,
        },
        {
            variant: 'default',
            title: 'Project Coordination & Management',
            subtitle: '', // Left empty as no sublabel was provided
            description: 'Administrative and financial project coordination support, including dissemination, communication, and exploitation planning and delivery.',
            idealWhen: 'You need an experienced coordinating partner during proposal development and throughout project execution.',
            linkText: 'Learn more',
            backgroundImage: true,
        },
        {
            variant: 'default',
            title: 'Training and courses',
            subtitle: '', // Left empty as no sublabel was provided
            description: 'Online and on-site courses for applicants, institutions and support professionals.',
            idealWhen: 'You are looking for practical capability-building around proposal development, EU funding strategy, or project implementation.',
            linkText: 'Learn more',
            backgroundImage: true,
        },
    ];



    return (
        <div className="w-full expand-full">
            {/* Outer bounding box handles scroll length and timeline positioning */}
            <div className="gsap-morph-scene relative w-full h-[100vh] ">

                {/* The isolated frame holds the clean CSS background image components */}
                <div className="w-full h-[100vh] gsap-morph-scene-container gsap-svg-morph-container fixed top-0 left-0 -z-10 pointer-events-none">
                    <div className="gsap-morph-part-1 w-full h-full relative ">
                        <div className="w-content gsap-morph-text-1 absolute inset-0 z-10  text-gray-50 h-screen px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-6 pointer-events-auto">
                            <div data-lag="0.3" className="w-[550px]">
                                <h1 className="text-left m-0 p-0 text-gray-50 leading-tight ">
                                    {breakTextFade([
                                        {
                                            text: "Expert guidance across EU funding.",
                                            className: "text-4xl sm:text-6xl"
                                        },
                                        {
                                            text: "Your Ambition. Our Strategy.",
                                            className: "text-md",
                                        }
                                    ])}
                                </h1>
                            </div>
                            <div className="flex flex-col items-start justify-center gap-5 text-left" data-lag="0.3" data-speed="0.65">
                                <p className="text-base sm:text-lg max-w-xl  gsap-fade-down">
                                    <span className="opacity-0">____________________</span>
                                    company Science helps applicants and organizations across Horizon Europe, STEP-relevant opportunities, and selected national funding routes.
                                </p>
                                <button className="btn btn-primary gsap-fade-up">
                                    Get in touch
                                </button>
                            </div>
                        </div>
                        <Image
                            src="/images/home/vJzjZEQ7XEcIpUiaWAlM8HVcE.jpg"
                            width={1000}
                            height={600}
                            className="gsap-morph-img gsap-morph-1 absolute inset-0 h-full w-full object-cover object-top opacity-0 header-white"
                            alt="State One Background"
                        />


                        <ScrollPath path="1" />
                        <ScrollPath path="2" />

                        <div className="gsap-fade-away absolute bottom-2 left-0 right-0 z-10 flex flex-col items-center gap-4 pb-10 px-6 text-center pointer-events-auto">
                            <div className="w-fit border-y border-gray-200/40 py-4">
                                <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-center sm:text-left">
                                    <div className="flex flex-col items-center sm:items-start">
                                        <span className="text-xl sm:text-2xl font-semibold text-gray-100">3,500+</span>
                                        <span className="text-xs text-gray-100 mt-0.5">ERC applicants supported</span>
                                    </div>
                                    <div className="hidden sm:block w-px mx-3 h-8 bg-gray-200" />
                                    <div className="flex flex-col items-center sm:items-start">
                                        <span className="text-xl sm:text-2xl font-semibold text-gray-100">Thousands</span>
                                        <span className="text-xs text-gray-100 mt-0.5">of applicants &amp; research managers trained</span>
                                    </div>
                                    <div className="hidden sm:block w-px mx-3 h-8 bg-gray-200" />
                                    <div className="flex flex-col items-center sm:items-start">
                                        <span className="text-xl sm:text-2xl font-semibold text-gray-100">1,000+</span>
                                        <span className="text-xs text-gray-100 mt-0.5">collaborative projects advised</span>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                    <div className="gsap-morph-part-2 w-full">
                        <div className="w-content gsap-morph-text-2 absolute inset-0 z-10 w-full h-screen flex items-center px-6 sm:px-12 lg:px-20 opacity-0">
                            <div className="max-w-2xl text-gray-50">
                                <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-emerald-100">company Science help</p>
                                <h2 className="mt-4 text-xl sm:text-3xl font-semibold leading-tight text-gray-700">
                                    company Science helps applicants and organizations across Horizon Europe,  <br />
                                    STEP-relevant opportunities,   <br />
                                    and selected national funding routes
                                </h2>
                                <p className="mt-5 text-base sm:text-lg text-gray-100/95">
                                    — helping strengthen proposals, improve positioning, <br />
                                    and plan for successful project delivery.
                                </p>
                            </div>
                        </div>
                        <img
                            src="/images/home/A6yz8YhmbQkg8ACTADACAMNk7s.jpg"
                            className="gsap-morph-img gsap-morph-2 absolute inset-0 h-full w-full object-cover opacity-0"
                            alt="State Two Background"
                        />

                    </div>
                    <div className="gsap-morph-part-3 w-full ">
                        <div className="gsap-morph-text-3 absolute inset-0 z-10 w-full h-screen flex items-center justify-center px-6 text-center opacity-0">

                            <div className="max-w-3xl text-gray-50">
                                <div className=" flex flex-col items-center gap-4 pb-5 px-6 text-center pointer-events-auto">
                                    <div className="w-4 h-4 bg-yellow-500/50 rounded-full animate-pulse">
                                    </div>
                                    <p className="max-w-lg text-xs sm:text-sm uppercase tracking-[0.24em] text-emerald-700">
                                        There is no one-size-fits-all route through EU funding, but we can help you find yours.
                                    </p>

                                    <div className="w-8/12 sm:w-96 border-t border-gray-600/50 animate-pulse">
                                    </div>
                                </div>
                                <h2 className="mt-4 text-xl sm:text-2xl font-semibold leading-tight max-w-3xl">
                                    Knowledge- and Research-Intensive Companies • Researchers and Developers
                                    • Universities and research organisations • Non-profits
                                    • Public bodies • Grant offices and research managers
                                    • National Contact Points
                                </h2>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
                <defs>
                    <filter id="liquid-morph-filter" className="gsap-morph-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="displacement" />
                    </filter>
                </defs>
            </svg>


            <div className="w-content">
                <div className="w-full sm:h-[500px] flex flex-col sm:flex-row items-center justify-center gap-6 py-10 sm:py-20" >
                    {
                        cards1.map((card, index) => {
                            return (
                                <div key={index} className="">
                                    <Card2
                                        index={index + 1}
                                        variant={card.variant}
                                        title={card.title}
                                        subtitle={card.subtitle}
                                        description={card.description}
                                        backgroundImage={card.backgroundImage}
                                    />
                                </div>
                            )
                        })
                    }
                </div>


                <div className="flex flex-col items-center justify-center gap-4 py-10 sm:py-20">
                    <h3 className="text-center text-2xl sm:text-3xl font-semibold text-slate-900 ">
                        Not sure which option fits you?
                    </h3>
                    <p className="max-w-3xl text-center text-xl sm:text-2xl">
                        {
                            wordReveal([
                                {
                                    text: "Whether you are exploring an idea, developing a draft, or planning ahead we can help you identify the most relevant next step.",
                                    className: "text-xl sm:text-2xl ",
                                }
                            ])
                        }
                    </p>
                    <button className="btn btn-primary" >
                        Talk To Us
                    </button>
                </div>

            </div>

            {/* Programme finder strip */}
            <div className="w-full  py-10 sm:py-16 px-6 sm:px-12 border-t border-gray-100">
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
                    <p className="text-sm text-gray-500">
                        Looking for a specific programme or funding route?{" "}
                        <Link href="/resource-hub/" className="text-emerald-700 font-semibold hover:text-emerald-600">
                            Explore our Resource hub
                        </Link>
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        {[
                            { label: "Horizon Europe Collaborative Projects", sub: "", href: "/grants/horizon-europe/", icon: "🌐" },
                            { label: "ERC", sub: "", href: "/grants/erc/", icon: "🔬" },
                            { label: "MSCA", sub: "", href: "/grants/prepare-msca-grants/", icon: "🎓" },
                            { label: "EIC", sub: "", href: "/grants/eic/", icon: "💡" },
                            { label: "National Grants", sub: "", href: "/grants/", icon: "🏛️" },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex flex-col items-center justify-between gap-2 w-10/12 sm:w-60 h-40 p-5 rounded-xl border border-gray-200 hover:border-emerald-400 hover:scale-105 transition-all duration-200 group`}
                            >
                                <MicroscopeIcon className="size-10 text-emerald-700 group-hover:text-emerald-900" />
                                <span className="text-xl font-semibold text-gray-800 group-hover:text-emerald-700 leading-tight">{item.label}</span>
                                <span className="text-base text-gray-400 leading-tight text-center">{item.sub}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why company */}
            <div className="w-full py-10 sm:py-16 px-6 sm:px-12 flex flex-col items-center gap-3 text-center header-white">
                <h3 className="text-center text-2xl sm:text-3xl font-semibold text-slate-900 ">
                    Why company?
                </h3>
                <p className="max-w-3xl ">
                    {
                        wordReveal([
                            {
                                text: "We combine broad funding experience with the ability to engage with the language of the project itself. Across disciplines and sectors, that helps us ask better questions and build stronger proposals.",
                                className: "text-xl sm:text-2xl ",
                            }
                        ])
                    }
                </p>

            </div>
            <div className="sm:h-20"></div>

            {/* sticky counter section */}
            <div className="w-full gsap-sticky-counter relative overflow-hidden">
                <div className="w-full gsap-sticky-counter-display h-screen flex items-center px-6 sm:px-12">
                    <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row gap-12 sm:gap-44 items-start sm:items-center">

                        {/* left: 0 + digit */}
                        <div className="flex items-end leading-none select-none shrink-0">
                            <span className="text-[8rem] sm:text-[14rem] font-bold text-gray-300">0</span>
                            <div className="relative">
                                {[1, 2, 3, 4].map((n, i) => (
                                    <span
                                        key={n}
                                        className="gsap-counter-digit text-gray-300 absolute inset-0 flex items-end text-[8rem] sm:text-[14rem] font-bold "
                                        style={{ opacity: i === 0 ? 1 : 0 }}
                                    >{n}</span>
                                ))}
                            </div>
                        </div>

                        {/* right: content */}
                        <div className="relative flex-1 ">
                            {[
                                { title: "We understand the funding logic", body: "We help clients navigate complex programmes, requirements and evaluation realities." },
                                { title: "We think like evaluators, not applicants", body: "Our support is built around how proposals are assessed and discussed." },
                                { title: "We combine scientific depth with strategy", body: "We work across disciplines and contexts while keeping focus on positioning, competitiveness, and structure." },
                                { title: "We work hands-on with each client", body: "No generic templates — just close, practical support adapted to your context." },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="gsap-counter-content absolute top-0 left-0 flex flex-col gap-3"
                                    style={{ opacity: i === 0 ? 1 : 0 }}
                                >
                                    <h4 className="text-2xl sm:text-4xl font-semibold text-white leading-snug">{item.title}</h4>
                                    <p className="text-base text-gray-100 leading-relaxed max-w-lg">{item.body}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                    <Image
                        src="/images/card-bg/2.jpg"
                        width={1000}
                        height={600}
                        className="absolute inset-0 h-full w-full object-cover object-top pointer-events-none -z-10"
                        alt="Sticky Counter Background"
                    />
                </div>

                {/* extra scroll room for 3 more steps */}
                <div className="w-full relative h-screen">
                </div>
            </div>
            <div className="sm:h-20"></div>

            {/* Proof strip 2 + Resources */}
            <div className="w-full">

                {/* Trust + logos + testimonials */}
                <div className="max-w-5xl mx-auto px-6 sm:px-12 py-10 sm:py-12 flex flex-col gap-12">
                    <p className="text-lg sm:text-2xl  uppercase tracking-[0.2em] text-gray-400 text-center border-t border-b border-gray-300 py-4">
                        Trusted by universities, research organisations, companies and public institutions across Europe
                    </p>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            {
                                quote: "company helped us completely rethink the structure of our ERC proposal. The feedback was sharp, direct, and exactly what we needed.",
                                name: "Principal Investigator",
                                org: "European Research University",
                            },
                            {
                                quote: "Their understanding of how evaluators read proposals made the difference. We wouldn't have succeeded without their input.",
                                name: "Research Manager",
                                org: "Innovation-Driven SME",
                            },
                        ].map((t) => (
                            <div key={t.name} className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-600 leading-relaxed italic">{t.quote}</p>
                                <div className="mt-auto flex flex-col gap-0.5 pt-3 border-t border-gray-100">
                                    <span className="text-xs font-semibold text-gray-800">{t.name}</span>
                                    <span className="text-xs text-gray-400">{t.org}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Resources and tools */}
                <div className="max-w-5xl mx-auto px-6 sm:px-12 py-16 sm:py-20 flex flex-col gap-10">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl sm:text-3xl text-center font-semibold text-gray-900">
                            Explore practical resources developed from hands-on work across the EU funding process.
                        </h3>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        {[
                            { label: "Horizon Europe Partner Database", icon: "🌐", href: "#" },
                            { label: "ERC Calculator", icon: "🔬", href: "#" },
                            { label: "MSCA Calculator", icon: "🎓", href: "#" },
                            { label: "Panel Members Database", icon: "👥", href: "#" },
                            { label: "Funded Projects Database", icon: "📁", href: "#" },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="w-60 h-28 flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
                            >
                                <ToolboxIcon className="size-8 flex-shrink-0 text-emerald-700 group-hover:text-emerald-900 transition-colors" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">{item.label}</span>
                                <ArrowRightIcon className="size-6 ml-auto text-gray-300 group-hover:text-emerald-500 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* newsletter */}
                <div className="w-content p-5">
                    <div className="w-full h-32 my-10">
                        <Image
                            src="/images/other/newsletter-2.png"
                            width={300}
                            height={200}
                            className="w-auto h-full m-auto"
                            alt="Newsletter Background"
                            data-lag="0.6"
                            data-speed="1.1"
                        />
                    </div>

                    <div className="">
                        <FormBuilder
                            title="Subscribe to our newsletter"
                            className={'w-10/12 sm:w-6/12 m-auto rounded-lg border border-gray-200 shadow-md p-6 sm:p-10 bg-white'}
                            afterText="GDPR: This form collects your name and email address. Read our privacy policy"
                            submitLabel="Subscribe"
                            fields={[
                                { name: 'email', label: 'Email', type: 'email', required: true },
                                { name: 'name', label: 'Name', type: 'text', required: true },
                                { name: 'gdpr', label: 'GDPR', type: 'checkbox', required: true, checkboxLabel: 'I agree to the GDPR terms' }
                            ]}
                            data={{
                                action: 'newsletter-subscription',
                            }}
                        />
                    </div>
                </div>



            </div>

            <div className="h-20 sm:h-40"></div>

        </div>
    );
}
