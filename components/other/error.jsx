export default function ErrorPage({ text }) {
    return (
        <div className="p-6 mt-5 m-auto max-w-2xl bg-red-100 rounded-lg shadow-sm overflow-hidden">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <div className="overflow-auto">
                <p className="mt-4 text-red-500">{text || "An unexpected error occurred."}</p>
            </div>
        </div>
    );
}