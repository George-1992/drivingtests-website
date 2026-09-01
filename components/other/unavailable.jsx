 import NotFound from "./notFound";

export default function Unavailable({ text }) {
    return (
        <html lang="en">
            <head>
                <title>Page Unavailable</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body className="antialiased w-full min-h-screen overflow-x-hidden flex items-center justify-center">
                <NotFound text={text || "The page you are looking for is currently unavailable. This could be due to maintenance, server issues, or other unexpected problems. Please try again later or visit the homepage."} />
            </body>
        </html>
    );
}