'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

export default function SearchBox({
	placeholder = "Search posts by title or description...",
	defaultValue = "",
}) {
	const router = useRouter();
	const [query, setQuery] = useState(defaultValue);

	const handleSubmit = (event) => {
		event.preventDefault();

		const normalizedQuery = query.trim();
		if (!normalizedQuery) {
			router.push('/search');
			return;
		}

		router.push(`/search?query=${encodeURIComponent(normalizedQuery)}`);
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
				<div className="pl-2 text-neutral-500">
					<SearchIcon className="size-4" />
				</div>

				<input
					type="text"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder={placeholder}
					className="h-11 w-full border-none bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
					aria-label="Search posts"
				/>

				<button
					type="submit"
					className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
				>
					Search
				</button>
			</div>
		</form>
	);
}