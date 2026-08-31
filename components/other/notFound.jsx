import { FrownIcon } from "lucide-react";

export default function NotFound({ text }) {
    return (
        <div className="p-6 mt-8 gap-4 m-auto max-w-2xl text-gray-600 rounded-lg flex flex-col items-center">
            <FrownIcon className="size-20 " />
            <h1 className="text-6xl font-bold ">404</h1>
            <h2 className="text-4xl font-bold ">Not Found</h2>
            <div className="w-full"></div>
            <div className="w-96 flex text-center flex-col gap-2">
                <p className="">{"The page you are looking for does not exist or an unexpected error occurred. Go Back, or visit the homepage"}</p>
                <p className="text-xs opacity-35">{text || "The page you are looking for does not exist."}</p>
            </div>
        </div>
    );
}