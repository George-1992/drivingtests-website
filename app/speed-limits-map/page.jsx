import PageWrapper from "@/components/pageWrapper";

export default async function Page(props) {




    return (
        <PageWrapper
            params={{
                slug: ['contact-us'],
            }}
            pageData={{
                title: 'New Zealand Speed Limit Map',
                description: 'Explore the national speed limit register for New Zealand.',
            }}
            {...props}
        >

            <div className="max-w-4xl mx-auto text-center py-12 px-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/60 rounded-full text-amber-700 text-xs font-semibold uppercase tracking-wider mb-5">
                    <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Interactive Map
                </div>

                {/* Heading */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                    New Zealand <span className="text-amber-600">Speed Limit Map</span>
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                    Explore speed limits across Aotearoa with our interactive map powered by NZTA data.
                </p>

                {/* Map Container */}
                <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {/* Accent Bar */}
                    <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>

                    {/* Map */}
                    <div className="w-full" style={{ height: '600px' }}>
                        <iframe
                            src="https://opendata-nzta.opendata.arcgis.com/datasets/NZTA::national-speed-limit-register-nslr/explore?location=-45.849789%2C179.812303%2C6"
                            frameBorder="0"
                            className="w-full h-full"
                            title="New Zealand Speed Limit Map"
                            loading="lazy"
                            allowFullScreen
                        />
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <svg className="size-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Data from NZTA
                        </span>
                        <span className="w-px h-4 bg-gray-300"></span>
                        <span className="flex items-center gap-1.5">
                            <svg className="size-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            National Speed Limit Register
                        </span>
                    </div>
                </div>

                <div className="text-gray-500 text-sm my-14 space-y-3">
                    <p>
                        Speed limits are set based on road design, traffic volume, and safety data for each specific
                        stretch of road, and they can change with construction, weather conditions, school zones, or
                        updated traffic studies. What was accurate last year may not be accurate today, so it's worth
                        staying alert rather than relying on memory or outdated maps.
                    </p>
                    <p>
                        Posted signs are always the final authority. Digital tools, in car navigation systems, and
                        online references are helpful for planning a route, but they can lag behind real world changes
                        on the ground. Construction zones, temporary detours, and newly adjusted limits near schools or
                        residential areas are common places where the posted sign and a stored estimate may not match.
                    </p>
                    <p>
                        Driving at a safe and legal speed isn't just about avoiding a ticket. It directly affects
                        stopping distance, reaction time, and the severity of any potential collision. Higher speeds
                        reduce the driver's ability to respond to sudden hazards like pedestrians, cyclists, animals, or
                        vehicles merging unexpectedly, and they increase the distance needed to come to a full stop,
                        especially in wet or low visibility conditions.
                    </p>
                    <p>
                        Local regulations can also vary significantly between cities, states, or countries, covering not
                        only numeric limits but rules around school zones, residential streets, highways, and weather
                        related speed reductions. Drivers unfamiliar with an area should take extra care to observe
                        posted signage rather than assuming limits are the same as where they normally drive.
                    </p>
                    <p>
                        Ultimately, no app, estimate, or general guideline should replace what's posted on the road
                        itself. Always follow posted signs and local regulations when driving, and adjust your speed
                        for current conditions even when it's below the legal maximum.
                    </p>
                </div>
            </div>
        </PageWrapper >
    );
}
