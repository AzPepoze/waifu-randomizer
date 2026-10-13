import { wrapWithProxy } from "#lib/proxy";

const SAFE_RANDOM_POST_URL = "https://konachan.net/post.json?limit=1&tags=order:random+rating:safe";

export interface Wallpaper {
	url: string;
	source: string;
}

interface KonachanPost {
	id: number;
	sample_url?: string;
	file_url?: string;
	source?: string;
}

// Returns the image and its source for a random safe-rated post, or null when none is available
export async function fetchRandomSafePost(): Promise<Wallpaper | null> {
	try {
		const response = await fetch(wrapWithProxy(SAFE_RANDOM_POST_URL));
		if (!response.ok) return null;

		const [post] = (await response.json()) as KonachanPost[];
		const url = post?.sample_url || post?.file_url;
		if (!post || !url) return null;

		return {
			url,
			source: post.source || `https://konachan.net/post/show/${post.id}`,
		};
	} catch {
		return null;
	}
}
