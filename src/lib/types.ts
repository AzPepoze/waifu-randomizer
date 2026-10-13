export type Category = "sfw" | "nsfw";

export type Theme = "light" | "dark";

// "random" shows images from the API, "favorites" shows saved ones
export type PlayMode = "random" | "favorites";

export interface Point {
	x: number;
	y: number;
}

export interface ImageMetadata {
	artist?: string | null;
	artistUrl?: string | null;
	author?: string | null;
	dimensions?: string;
	rating?: string;
	source?: string | null;
	tags?: string[];
	type?: string;
}

// One image the playground can show, with where it came from
export interface ImageEntry {
	url: string;
	source: string;
	metadata: ImageMetadata;
}
