import { wrapWithProxy } from "#lib/proxy";
import type { Category, ImageEntry } from "#lib/types";

export type ApiId = "waifu.pics" | "waifu.im" | "nekos.best" | "danbooru.anime" | "konachan";

type Fetcher = (category: Category) => Promise<ImageEntry>;

interface WaifuPicsResponse {
	url: string;
}

interface WaifuImImage {
	url: string;
	source: string | null;
	width: number;
	height: number;
	artists?: { name: string; pixiv?: string | null; twitter?: string | null }[];
	tags?: { name: string }[];
}

interface WaifuImResponse {
	items: WaifuImImage[];
}

interface NekosBestResponse {
	results: {
		url: string;
		source_url?: string | null;
		artist_name?: string | null;
		artist_href?: string | null;
	}[];
}

interface DanbooruPost {
	id: number;
	file_url?: string;
	source?: string | null;
	tag_string?: string;
	tag_string_artist?: string;
	image_width: number;
	image_height: number;
	rating: string;
}

interface KonachanPost {
	id: number;
	sample_url?: string;
	file_url?: string;
	source?: string | null;
	tags?: string;
	author?: string;
	width: number;
	height: number;
	rating: string;
}

const apiSupport: Record<ApiId, Record<Category, boolean>> = {
	"waifu.pics": { sfw: true, nsfw: true },
	"waifu.im": { sfw: true, nsfw: true },
	"nekos.best": { sfw: true, nsfw: false },
	"danbooru.anime": { sfw: true, nsfw: true },
	konachan: { sfw: true, nsfw: true },
};

function isApiId(api: string): api is ApiId {
	return Object.hasOwn(apiSupport, api);
}

export function isApiSupported(api: string, category: Category): boolean {
	return isApiId(api) && apiSupport[api][category];
}

export const apiOptions: { id: ApiId; name: string; description: string; icon: string }[] = [
	{ id: "waifu.im", name: "Waifu.im", description: "Curated waifu art", icon: "favorite" },
	{ id: "waifu.pics", name: "Waifu.pics", description: "Quick SFW and NSFW picks", icon: "image" },
	{
		id: "nekos.best",
		name: "Nekos.best",
		description: "SFW only, with artist credit",
		icon: "pets",
	},
	{
		id: "danbooru.anime",
		name: "Danbooru",
		description: "Large tagged archive",
		icon: "collections",
	},
	{ id: "konachan", name: "Konachan", description: "Wallpaper-style art", icon: "photo_library" },
];

async function getJson<T>(url: string, name: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${name} API error: ${response.status}`);
	return (await response.json()) as T;
}

function ratingTags(category: Category): string {
	return category === "sfw" ? "rating:safe" : "rating:explicit";
}

const fetchWaifuPics: Fetcher = async (category) => {
	const data = await getJson<WaifuPicsResponse>(
		`https://api.waifu.pics/${category}/waifu`,
		"Waifu.pics",
	);
	return { url: data.url, source: "", metadata: {} };
};

const fetchWaifuIm: Fetcher = async (category) => {
	const isNsfw = category === "nsfw";
	const data = await getJson<WaifuImResponse>(
		`https://api.waifu.im/images/?included_tags=waifu&is_nsfw=${isNsfw}`,
		"Waifu.im",
	);
	const result = data.items[0];
	if (!result) throw new Error("No image found");

	const artist = result.artists?.[0];
	return {
		url: result.url,
		source: result.source || result.url,
		metadata: {
			artist: artist?.name,
			artistUrl: artist?.pixiv || artist?.twitter,
			tags: result.tags?.map((tag) => tag.name),
			dimensions: `${result.width}x${result.height}`,
			source: result.source,
			type: "waifu.im",
		},
	};
};

const fetchNekosBest: Fetcher = async () => {
	const data = await getJson<NekosBestResponse>("https://nekos.best/api/v2/waifu", "Nekos.best");
	const result = data.results[0];
	if (!result) throw new Error("No image found");

	return {
		url: result.url,
		source: result.source_url || result.url,
		metadata: {
			artist: result.artist_name,
			artistUrl: result.artist_href,
			source: result.source_url,
			type: "nekos.best",
		},
	};
};

const fetchDanbooru: Fetcher = async (category) => {
	const endpoint = `https://danbooru.donmai.us/posts.json?limit=1&random=true&tags=${ratingTags(category)}`;
	const [result] = await getJson<DanbooruPost[]>(endpoint, "Danbooru");
	if (!result?.file_url) throw new Error("No image found");

	return {
		url: result.file_url,
		source: result.source || `https://danbooru.donmai.us/posts/${result.id}`,
		metadata: {
			tags: result.tag_string?.split(" "),
			artist: result.tag_string_artist,
			dimensions: `${result.image_width}x${result.image_height}`,
			rating: result.rating,
			source: result.source,
			type: "danbooru",
		},
	};
};

const fetchKonachan: Fetcher = async (category) => {
	const url = `https://konachan.net/post.json?limit=1&tags=order:random+${ratingTags(category)}`;
	const [result] = await getJson<KonachanPost[]>(wrapWithProxy(url), "Konachan");
	if (!result) throw new Error("No image found");

	return {
		url: result.sample_url || result.file_url || "",
		source: result.source || `https://konachan.net/post/show/${result.id}`,
		metadata: {
			tags: result.tags?.split(" "),
			artist: result.author,
			dimensions: `${result.width}x${result.height}`,
			rating: result.rating,
			source: result.source,
			type: "konachan",
		},
	};
};

const fetchers: Record<ApiId, Fetcher> = {
	"waifu.pics": fetchWaifuPics,
	"waifu.im": fetchWaifuIm,
	"nekos.best": fetchNekosBest,
	"danbooru.anime": fetchDanbooru,
	konachan: fetchKonachan,
};

export async function fetchRandomImage(api: string, category: Category): Promise<ImageEntry> {
	if (!isApiId(api)) throw new Error(`Unknown API: ${api}`);
	return fetchers[api](category);
}
