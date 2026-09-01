import Link from "next/link";
import { directusRequest, getFileUrlDirectus } from "@/services/directus";
import { logger } from "@/utils/logger";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";

export default async function PostSearch({ params = {}, searchParams = {} }) {
    const query = (searchParams?.query || '').trim();
    const currentPage = Math.max(1, Number.parseInt(searchParams?.page || '1', 10) || 1);
    const limit = 10;

    logger.log("PostSearch params", params);

    if (!query) {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-neutral-900">Search posts</h2>
                <p className="mt-2 text-sm text-neutral-600">Enter a query string to search post titles and descriptions.</p>
            </div>
        );
    }

    const result = await directusRequest({
        method: 'GET',
        endpoint: '/items/posts',
        params: {
            fields: 'id,title,slug,description,image,date_created,date_updated',
            limit,
            page: currentPage,
            meta: 'filter_count',
            filter: {
                _or: [
                    { title: { _icontains: query } },
                    { description: { _icontains: query } },
                ],
                status: {
                    _eq: 'published',
                }
            },
            sort: '-date_updated',
        },
    });

    // logger.log('PostSearch query: ', query);
    // logger.log('PostSearch result: ', result);

    let posts = Array.isArray(result.data) ? result.data : [];
    const totalItems = result.meta?.filter_count ?? posts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage = Math.min(currentPage, totalPages);

    if (safePage !== currentPage) {
        const correctedResult = await directusRequest({
            method: 'GET',
            endpoint: '/items/posts',
            params: {
                fields: 'id,title,slug,description,image,date_created,date_updated',
                limit,
                page: safePage,
                meta: 'filter_count',
                filter: {
                    _or: [
                        { title: { _icontains: query } },
                        { description: { _icontains: query } },
                    ],
                },
                sort: '-date_updated',
            },
        });

        posts = Array.isArray(correctedResult.data) ? correctedResult.data : [];
    }

    const buildPageHref = (page) => {
        const hrefSearchParams = new URLSearchParams();

        if (query) {
            hrefSearchParams.set('query', query);
        }

        if (page > 1) {
            hrefSearchParams.set('page', String(page));
        }

        const queryString = hrefSearchParams.toString();
        return queryString ? `?${queryString}` : '?';
    };

    const pageStart = Math.max(1, safePage - 2);
    const pageEnd = Math.min(totalPages, safePage + 2);

    return (
        <div className="rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-900">Search results</h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Results for <span className="font-medium text-neutral-900">{query}</span>
                    </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {result?.meta?.filter_count || posts.length} found
                </span>
            </div>

            <div className="mt-6 space-y-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <article
                            key={post.id}
                            className="grid gap-4 rounded-2xl border border-neutral-200 bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-4 transition-shadow duration-200 hover:shadow-md sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-5 sm:p-5"
                        >
                            <div className="overflow-hidden rounded-xl bg-neutral-100 sm:h-full">
                                <Image
                                    src={getFileUrlDirectus(post.image) || '/images/bg/bg-6.svg'}
                                    alt={post.title}
                                    width={800}
                                    height={400}
                                    className="h-40 w-full object-cover sm:h-full"
                                />
                            </div>
                            <div className="flex min-w-0 flex-col justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold leading-tight text-neutral-900 md:text-xl">
                                        {post.title}
                                    </h3>
                                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 md:text-base">
                                        {post.description || 'No description available.'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-start">
                                    <Link
                                        href={`/${post.slug || post.id}`}
                                        className="inline-flex items-center gap-2 rounded-full border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors duration-200 hover:bg-emerald-100 hover:text-emerald-900"
                                    >
                                        Read more
                                        <ChevronRightIcon className="size-4" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <p className="text-sm text-neutral-600">No posts matched this search.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <Link
                        href={buildPageHref(Math.max(1, safePage - 1))}
                        aria-disabled={safePage === 1}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${safePage === 1
                            ? 'pointer-events-none border-neutral-200 text-neutral-400'
                            : 'border-neutral-300 text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900'
                            }`}
                    >
                        Prev
                    </Link>

                    {Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => pageStart + index).map((pageNumber) => (
                        <Link
                            key={pageNumber}
                            href={buildPageHref(pageNumber)}
                            className={`min-w-10 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${pageNumber === safePage
                                ? 'border-emerald-700 bg-orange-700 text-white'
                                : 'border-neutral-300 text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900'
                                }`}
                        >
                            {pageNumber}
                        </Link>
                    ))}

                    <Link
                        href={buildPageHref(Math.min(totalPages, safePage + 1))}
                        aria-disabled={safePage === totalPages}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${safePage === totalPages
                            ? 'pointer-events-none border-neutral-200 text-neutral-400'
                            : 'border-neutral-300 text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900'
                            }`}
                    >
                        Next
                    </Link>
                </div>
            )}


            <div className="h-12 sm:h-20"></div>
        </div>
    );
}