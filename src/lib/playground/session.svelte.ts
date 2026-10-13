import { preloadImage } from "#lib/image";
import type { Category, ImageEntry, PlayMode } from "#lib/types";
import { copyLink, downloadImage } from "./download";
import { createFavorites } from "./favorites.svelte";
import { createHistory } from "./history.svelte";
import { fetchRandomImage, isApiSupported } from "./sources";

const AUTO_SHUFFLE_DEFAULT = 10000;
const NOTICE_DURATION = 1800;
const LOADING_FINISH_DELAY = 300;
const COUNTDOWN_TICK = 100;

export interface Playground {
	category: Category;
	api: string;
	mode: PlayMode;
	autoInterval: number;
	infoOpen: boolean;
	helpOpen: boolean;
	readonly isLoading: boolean;
	readonly progress: number;
	readonly errorMessage: string;
	readonly notice: string;
	readonly image: string;
	readonly source: string;
	readonly metadata: ImageEntry["metadata"] | null;
	readonly isFavorite: boolean;
	readonly history: ReturnType<typeof createHistory>;
	readonly favorites: ReturnType<typeof createFavorites>;
	readonly autoRemaining: number;
	next: () => Promise<void>;
	toggleFavorite: () => void;
	copy: () => Promise<void>;
	download: () => void;
	toggleAutoShuffle: () => void;
	attach: () => () => void;
	dismissError: () => void;
}

export function createPlayground(): Playground {
	let category = $state<Category>("sfw");
	let api = $state("waifu.im");
	let mode = $state<PlayMode>("random");
	let autoInterval = $state(0);
	let infoOpen = $state(false);
	let helpOpen = $state(false);
	let isLoading = $state(false);
	let progress = $state(0);
	let errorMessage = $state("");
	let notice = $state("");
	let autoRemaining = $state(0);

	const history = createHistory();
	const favorites = createFavorites();
	const current = $derived(history.current);

	let progressTimer: ReturnType<typeof setInterval> | undefined;
	let finishTimer: ReturnType<typeof setTimeout> | undefined;
	let noticeTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		if (!isApiSupported(api, category)) api = "waifu.im";
	});

	$effect(() => {
		void current?.url;
		if (!autoInterval || isLoading || errorMessage || !current) {
			autoRemaining = 0;
			return;
		}

		const deadline = performance.now() + autoInterval;
		autoRemaining = autoInterval;
		const timer = setInterval(() => {
			const left = Math.max(0, deadline - performance.now());
			autoRemaining = left;
			if (left === 0) {
				clearInterval(timer);
				void next();
			}
		}, COUNTDOWN_TICK);
		return () => clearInterval(timer);
	});

	function startProgress(): void {
		clearTimeout(finishTimer);
		isLoading = true;
		errorMessage = "";
		progress = 0;
		progressTimer = setInterval(() => {
			progress = Math.min(progress + (90 - progress) * 0.06 + Math.random() * 0.8, 90);
		}, 100);
	}

	function finishProgress(): void {
		clearInterval(progressTimer);
		progress = 100;
		finishTimer = setTimeout(() => (isLoading = false), LOADING_FINISH_DELAY);
	}

	function failProgress(error: unknown): void {
		console.error(error);
		clearInterval(progressTimer);
		errorMessage = error instanceof Error ? error.message : String(error);
		isLoading = false;
	}

	function notify(message: string): void {
		notice = message;
		clearTimeout(noticeTimer);
		noticeTimer = setTimeout(() => (notice = ""), NOTICE_DURATION);
	}

	function pickFavorite(): ImageEntry {
		const others = favorites.items.filter((item) => item.url !== current?.url);
		const pool = others.length > 0 ? others : favorites.items;
		const picked = pool[Math.floor(Math.random() * pool.length)];
		if (!picked) throw new Error("Nothing saved yet. Press the heart to save an image.");
		return picked;
	}

	async function next(): Promise<void> {
		if (isLoading) return;
		startProgress();

		try {
			const entry = mode === "favorites" ? pickFavorite() : await fetchRandomImage(api, category);
			await preloadImage(entry.url);
			history.push(entry);
			finishProgress();
		} catch (error) {
			failProgress(error);
		}
	}

	function toggleFavorite(): void {
		if (!current) return;
		const { added, stored } = favorites.toggle(current);
		if (!stored) {
			notify("Browser storage is full. Remove some saved images to save more.");
			return;
		}
		notify(added ? "Saved to favorites" : "Removed from favorites");
	}

	async function copy(): Promise<void> {
		if (!current) return;
		const copied = await copyLink(current.url);
		notify(copied ? "Image link copied" : "Could not copy the link");
	}

	function download(): void {
		if (current && !isLoading) void downloadImage(current.url);
	}

	function toggleAutoShuffle(): void {
		autoInterval = autoInterval ? 0 : AUTO_SHUFFLE_DEFAULT;
	}

	const shortcuts: Record<string, () => void> = {
		Space: () => void next(),
		ArrowLeft: () => history.back(),
		ArrowRight: () => history.forward(),
		KeyF: toggleFavorite,
		KeyD: download,
		KeyC: () => void copy(),
		KeyA: toggleAutoShuffle,
		KeyI: () => (infoOpen = !infoOpen),
	};

	function handleKeydown(event: KeyboardEvent): void {
		if (event.ctrlKey || event.metaKey || event.altKey) return;
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
			return;
		}
		if (event.key === "Escape") {
			helpOpen = false;
			infoOpen = false;
			return;
		}
		if (event.key === "?") {
			helpOpen = !helpOpen;
			return;
		}
		if (event.repeat) return;

		const shortcut = shortcuts[event.code];
		if (!shortcut) return;

		event.preventDefault();
		shortcut();
	}

	function dismissError(): void {
		errorMessage = "";
	}

	function attach(): () => void {
		window.addEventListener("keydown", handleKeydown);
		void next();

		return () => {
			window.removeEventListener("keydown", handleKeydown);
			clearInterval(progressTimer);
			clearTimeout(finishTimer);
			clearTimeout(noticeTimer);
		};
	}

	return {
		get category() {
			return category;
		},
		set category(value: Category) {
			category = value;
		},
		get api() {
			return api;
		},
		set api(value: string) {
			api = value;
		},
		get mode() {
			return mode;
		},
		set mode(value: PlayMode) {
			mode = value;
		},
		get autoInterval() {
			return autoInterval;
		},
		set autoInterval(value: number) {
			autoInterval = value;
		},
		get infoOpen() {
			return infoOpen;
		},
		set infoOpen(value: boolean) {
			infoOpen = value;
		},
		get helpOpen() {
			return helpOpen;
		},
		set helpOpen(value: boolean) {
			helpOpen = value;
		},
		get isLoading() {
			return isLoading;
		},
		get progress() {
			return progress;
		},
		get errorMessage() {
			return errorMessage;
		},
		get notice() {
			return notice;
		},
		get image() {
			return current?.url ?? "";
		},
		get source() {
			return current?.source ?? "";
		},
		get metadata() {
			return current?.metadata ?? null;
		},
		get isFavorite() {
			return current ? favorites.has(current.url) : false;
		},
		history,
		favorites,
		next,
		toggleFavorite,
		copy,
		download,
		toggleAutoShuffle,
		attach,
		dismissError,
		get autoRemaining() {
			return autoRemaining;
		},
	};
}
