import PageWrapper from "@/components/pageWrapper";

export default PageWrapper;

export async function generateStaticParams() {
    // no page is generated on build time
    // this will force page generation on runtime
    // if dynamicParams is true
    let result = [];
    return result;
}

export const dynamic = 'force-static';
// export const revalidate = false; // false | 0 | number
// export const dynamicParams = true;