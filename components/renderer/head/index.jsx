import dynamic from "next/dynamic";
import SeoHeader from "@/components/renderer/seo";
import Script from "next/script";

const Scripts = dynamic(() => import("@/components/renderer/scripts"), {
    ssr: false,
});

export default function HeadEl({ params, pageData }) {



    return (
        <head>
            <Scripts params={params} pageData={pageData} />
            <SeoHeader pageData={pageData} />
 
            {/* <link rel="stylesheet" href="/assets/other/mig-cnv-css.css" /> */}
            {/* <Script src="/assets/other/mig-cnv-script.js"></Script>  */}
            <meta name="robots" content="noindex, nofollow" />

            {/* style */}
            {/* {scriptsMap.map((_src, index) => {
                const src = _src.json || _src;
                const type = src.tag || src.type || src.attributes?.type || (src.attributes?.rel === "stylesheet" ? "link" : "script");
                const inlineContent = src.content || null;


                return (
                    type === "script" ? (
                        inlineContent ?
                            // (<Script
                            //     key={index}
                            //     {...src.attributes}
                            // >
                            //     {inlineContent}
                            // </Script>
                            // )
                            null : null
                        // (
                        //     <Script
                        //         key={index}
                        //         {...src.attributes}
                        //     />

                        // )
                    ) : (
                        <link
                            key={index}
                            {...src.attributes}
                        />
                    )
                )
            })} */}
        </head>
    );
}