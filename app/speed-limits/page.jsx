import SpeedLimitClient from "@/app/speed-limits/client";
import FormBuilder from "@/components/formBuilder";
import ContactForm from "@/components/other/contactForm";
import ShareButtons from "@/components/other/shareButtons";
import PageWrapper from "@/components/pageWrapper";
import { directusRequest } from "@/services/directus";

export default async function Page(props) {

    // console.log('props: ', props);
    const query = props?.searchParams?.query || '';
    // console.log('query: ', query);

    const items = [];
    if (query) {
        // fetch items based on query
        const searchItemsRes = await directusRequest({
            method: 'GET',
            endpoint: '/items/speed_limits',
            params: {
                filter: {
                    _or: [
                        { rca_zone_name: { _contains: query } },
                        { legal_reference: { _contains: query } },
                    ]
                },
                limit: 20,
                sort: '-date_created',
            },
        });
        const searchItems = searchItemsRes?.data || [];
        items.push(...searchItems);

    } else {
        // fetch last 20 items
        const lastItemsRes = await directusRequest({
            method: 'GET',
            endpoint: '/items/speed_limits',
            params: {
                limit: 20,
                sort: '-date_created',
            },
        });
        const lastItems = lastItemsRes?.data || [];
        // console.log('lastItems: ', lastItems.length);
        items.push(...lastItems);
    }


    return (
        <PageWrapper
            params={{
                slug: ['contact-us'],
            }}
            pageData={{
                title: 'Speed Limits New Zealand',
                description: 'Explore the national speed limit register for New Zealand.',
            }}
            {...props}
        >

            <SpeedLimitClient items={items} />

            {query && !items.length && (
                <div className="max-w-4xl mx-auto text-center py-10 opacity-70">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                        No results found for <span className="text-amber-600 italic">{query}</span>
                    </h3>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        We could not find any speed limit entries matching your search. Please try a different term or check back later.
                    </p>
                </div>
            )}
        </PageWrapper >
    );
}
