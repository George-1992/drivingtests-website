import { FrownIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound({ text }) {
    return (
        <div className="p-6 mt-8 gap-4 m-auto max-w-2xl rounded-lg flex flex-col items-center">
            <FrownIcon className="size-16 " />
            <h1 className="text-4xl font-bold ">404</h1>
            <h2 className="text-2xl font-bold ">Not Found</h2>
            <div className="w-full"></div>
            <div className="w-96 flex text-center flex-col gap-2">
                <p className="">{text || "The page you are looking for does not exist or an unexpected error occurred. Go Back, or visit the homepage"}</p>
            </div>

            <Link href="/" className="underline text-2xl font-bold">Go Home</Link>

        </div>
    );
}