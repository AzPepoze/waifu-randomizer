import type { ImageEntry } from "#lib/types";

const STORAGE_KEY = "waifu-randomizer:favorites";

function readSaved(): ImageEntry[] {
	if (typeof window === "undefined") return [];
	try {
		return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as ImageEntry[] | null) ?? [];
	} catch {
		return [];
	}
}

function writeSaved(items: ImageEntry[]): boolean {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		return true;
	} catch {
		return false;
	}
}

export interface ToggleResult {
	added: boolean;
	stored: boolean;
}

export interface Favorites {
	readonly items: ImageEntry[];
	has: (url: string) => boolean;
	toggle: (entry: ImageEntry) => ToggleResult;
}

export function createFavorites(): Favorites {
	let items = $state<ImageEntry[]>(readSaved());

	function has(url: string): boolean {
		return items.some((item) => item.url === url);
	}

	function toggle({ url, source, metadata }: ImageEntry): ToggleResult {
		const added = !has(url);
		items = added
			? [...items, { url, source, metadata }]
			: items.filter((item) => item.url !== url);
		return { added, stored: writeSaved(items) };
	}

	return {
		get items() {
			return items;
		},
		has,
		toggle,
	};
}
