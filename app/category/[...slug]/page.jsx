import PageWrapper from "@/components/pageWrapper";
import Blog from "@/components/posts/blog";
import { logger } from "@/utils/logger";
import { toDisplayStr } from "@/utils/other";

export default function Page({ params, searchParams }) {

    logger.log("params", params);
    logger.log("searchParams", searchParams);

    const slug = params?.slug || [];
    const title = params?.slug
        ? toDisplayStr(params.slug[params.slug.length - 1])
        : "Category";

    return (
        <PageWrapper
            params={{
                slug: slug,
            }}
            pageData={{
                title: `${title} - Dttraining`,
                description: 'Driving Tests Training - Explore all posts in the ' + title + ' category. Stay updated with the latest insights, tips, and updates on ' + title + '.',
            }}
        >
            <div className="w-full">
                <div className="w-full flex flex-col gap-4 items-center">
                    <h1>
                        {title}
                    </h1>

                    <p className="py-3">
                        View all posts in the {title} category. Explore our latest insights, tips, and updates on {title} to stay informed and inspired.
                    </p>
                </div>

                <div>
                    <Blog searchParams={{ ...searchParams, category: title }} />
                </div>
            </div>
        </PageWrapper >
    );
}
