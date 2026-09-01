import Script from "next/script";

export default function Scripts({ params, pageData }) {
    return (
        <>
            {/* Sienna Accessibility Widget */}
            {/* <Script
                src="https://cdn.jsdelivr.net/npm/sienna-accessibility/dist/sienna-accessibility.umd.js"
                strategy="lazyOnload"
            /> */}
{/* 
             <Script
                src="public/assets/js/index-CRWUuUuk.js"
            /> */}

            {/* GDPR */}
            {/* 1. Load vanilla-cookieconsent CSS from CDN */}
            {/* <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v3.0.1/dist/cookieconsent.css"
            />
            <Script
                src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v3.0.1/dist/cookieconsent.umd.js"
                strategy="lazyOnload"
                onLoad={() => {
                    // 3. Initialize the banner when loaded
                    window.CookieConsent.run({
                        guiOptions: {
                            consentModal: { layout: "box", position: "bottom right" }
                        },
                        categories: {
                            necessary: { enabled: true, readOnly: true },
                            analytics: {}
                        },
                        language: {
                            default: "en",
                            translations: {
                                en: {
                                    consentModal: {
                                        title: "We use cookies",
                                        description: "Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it.",
                                        acceptAllBtn: "Accept all",
                                        acceptNecessaryBtn: "Reject all",
                                        showPreferencesBtn: "Manage preferences"
                                    }
                                }
                            }
                        }
                    });
                }}
            /> */}
        </>
    );
}