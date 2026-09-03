import ScrollPath from "@/components/animations/scrollPath";
import FormBuilder from "@/components/formBuilder";
import ShareButtons from "@/components/other/shareButtons";
import SearchBox from "@/components/posts/searchBox";
import { getFileUrlDirectus } from "@/services/directus";
import { displayDate } from "@/utils/other";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function PostTemplate({ pageData, children, post }) {

    // console.log('PostTemplate pageData: ', pageData);
    const grants = [
        {
            "name": "Courses",
            "link": "/courses/"
        },
        {
            "name": "Resources",
            "link": "/blog/"
        },
        {
            "name": "LMS",
            "link": "/lms-features/"
        }, 
    ];

    return (
        <div className="w-full md:px-10">
            {/* <div className="w-full mb-5">

                <div className="w-full relative h-64 md:h-96 overflow-hidden rounded-3xl bg-white">
                    <Image
                        src={getFileUrlDirectus(pageData.image) || '/images/bg/bg-3.svg'}
                        alt={pageData.title}
                        width={1200}
                        height={800}
                        className="w-full h-full object-cover mt-0 mb-0 -z-10"
                    />

                    <div className="absolute bottom-6 left-0">
                        <div className="bg-gray-50/60 w-10/12 py-1.5 px-1 rounded-r-lg border-2 border-gray-300/50 backdrop-blur-sm">
                            <h1 className="text-2xl sm:text-5xl font-bold  ">{pageData.title}</h1>
                        </div>
                    </div>
                </div>
                <div className="w-fit px-8 py-1 my-2 mx-2 rounded-full bg-orange-100 border border-orange-200  ">
                    <p className="text-sm mt-0 mb-0 text-orange-700 ">{displayDate(pageData.date_created)}</p>
                </div>
            </div> */}

            <div className="post w-full px-1 md:px-3 flex md:flex-row flex-col gap-10">
                {/* main content */}
                <div className="w-full sm:w-8/12">
                    <div className="w-full">
                        <h1 className="text-2xl sm:text-5xl font-bold mb-6">{pageData.title}</h1>
                        {/* <div className="w-full my-2">
                            <ShareButtons socialMedias={['x', 'facebook', 'linkedin']} />
                        </div> */}
                        <Image
                            src={getFileUrlDirectus(pageData.image) || '/images/bg/bg-3.svg'}
                            alt={pageData.title}
                            width={1200}
                            height={800}
                            data-lag='0.1'
                            className=" overflow-hidden shadow-sm rounded-3xl object-contain mt-0 mb-6"
                        />
                        <div className="w-full flex gap-4 mb-5 mt-2 sm:flex-row flex-col items-start">
                            <ShareButtons socialMedias={['x', 'facebook', 'linkedin']} />

                            <div className="w-fit h-fit text-nowrap px-8 py-1 my-2 mx-2 rounded-full bg-orange-100 border border-orange-200  ">
                                <p className="text-sm mt-0 mb-0 text-orange-700 ">{displayDate(pageData.date_updated || pageData.date_created)}</p>
                            </div>
                        </div>
                    </div>
                    {children}


                    {/* <div className="absolute w-[70%] h-[150vh] top-0 left-0 pointer-events-none z-10 opacity-50">
                        <ScrollPath path="3" color="#7fa69b" />
                    </div> */}

                </div>

                {/* sidebar */}
                <div className="w-full sm:w-4/12 flex flex-col gap-5 ">
                    {/* search */}
                    <div className="w-full">
                        <div className="w-full h-60 rounded-lg shadow-sm bg-gradient-to-br from-yellow-50 via-white to-orange-100 p-6 gap-5 flex flex-col items-start justify-center">
                            <h5 className="text-2xl font-semibold text-neutral-900">
                                Search our articles
                            </h5>
                            <SearchBox
                                placeholder="Search posts by title or description..."
                                defaultValue=""
                            />
                        </div>
                    </div>
                    {/* grants */}
                    <div className="w-full">
                        <div className="flex flex-col gap-2">
                            {
                                grants.map((item, index) => (
                                    <Link
                                        href={item.link}
                                        key={index}
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5)), url('/images/bg/bg-${(index % 3) + 1}.svg')`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                        className={`w-full py-3 bg-indigo-600/20 rounded-lg shadow-sm flex items-center justify-center transition-transform duration-200 hover:scale-105 cursor-pointer`}
                                    >
                                        <p className="text-lg font-medium">{item.name}</p>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                    {/* banner */}
                    {/* <div className="w-full h-80 rounded-2xl border border-neutral-200 bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-6 shadow-sm flex flex-col items-start justify-center">
                        <h5 className="text-3xl font-semibold text-neutral-900">Discover our EU grants knowledge base</h5>
                        <div className="mt-4">
                            <p className="mb-0 mt-0">
                                <Link
                                    href="/blog-preview"
                                    target="_blank"
                                    rel="noopener"
                                    className="inline-flex items-center gap-3 font-medium text-emerald-700 transition-colors duration-200 hover:text-emerald-900 border border-emerald-700 hover:border-emerald-900 rounded-full px-4 py-2"
                                >
                                    <span>Read more</span>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white transition-transform duration-200 hover:translate-x-0.5">
                                        <ChevronRightIcon className="size-6" />
                                    </span>
                                </Link>
                            </p>
                        </div>
                    </div> */}
                    {/* newsletter */}
                    <div className="w-full bg-white rounded-2xl">
                        <FormBuilder
                            title="Subscribe to our newsletter"
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

            {/* spacer */}
            <div className="h-16 sm:h-24"></div>
        </div>
    );
}