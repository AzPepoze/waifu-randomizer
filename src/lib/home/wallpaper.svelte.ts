import { preloadImage } from "#lib/image";
import { fetchRandomSafePost } from "#lib/konachan";
import type { Point } from "#lib/types";

export interface WallpaperLayer {
	id: number;
	url: string;
	source: string;
	origin: Point;
}

// Each new wallpaper is a layer that grows out of `origin` over the previous one
export function createWallpaper() {
	let layers = $state<WallpaperLayer[]>([]);
	let refreshing = $state(false);
	let nextId = 0;

	async function change(origin: Point): Promise<void> {
		if (refreshing) return;
		refreshing = true;

		try {
			const post = await fetchRandomSafePost();
			if (!post) return;

			await preloadImage(post.url);
			layers = [...layers.slice(-1), { id: nextId++, ...post, origin }];
		} catch {
			// Keep the current wallpaper when the new image fails to load
		} finally {
			refreshing = false;
		}
	}

	// Drops the layers under a finished one, so only the visible wallpaper stays in the DOM
	function settle(layer: WallpaperLayer): void {
		if (layers.at(-1)?.id === layer.id) layers = [layer];
	}

	return {
		get layers() {
			return layers;
		},
		get current() {
			return layers.at(-1);
		},
		get refreshing() {
			return refreshing;
		},
		change,
		settle,
	};
}
