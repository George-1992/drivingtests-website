'use client';

import dynamic from 'next/dynamic';

// FIX: Declare the dynamic loader outside the component function.
// This ensures it is initialized exactly once when the bundle loads.
const SafeClientCalculator = dynamic(
    () => import('./client'),
    {
        ssr: false, // Disables server-side rendering safely
        loading: () => (
            <div className="p-4 text-center text-gray-500">
                Loading Eligibility Calculator...
            </div>
        ),
    }
);

export default function DynamicComponentWrapper() {
    // Render the cached, dynamically-imported component safely here
    // return <SafeClientCalculator />;
    return null;
}