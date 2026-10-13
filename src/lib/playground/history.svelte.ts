import type { ImageEntry } from "#lib/types";

const STORAGE_KEY = "waifu-randomizer:history";
const LIMIT = 50;

function readHistory(): ImageEntry[] {
	if (typeof window === "undefined") return [];
	try {
		const stored =
			(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as ImageEntry[] | null) ?? [];
		return stored.slice(-LIMIT);
	} catch {
		return [];
	}
}

function writeHistory(entries: ImageEntry[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	} catch {
		return;
	}
}

export interface ImageHistory {
	readonly items: ImageEntry[];
	readonly index: number;
	readonly current: ImageEntry | null;
	readonly canGoBack: boolean;
	readonly canGoForward: boolean;
	push: (entry: ImageEntry) => void;
	back: () => void;
	forward: () => void;
	goTo: (target: number) => void;
}

export function createHistory(): ImageHistory {
	const saved = readHistory();
	let entries = $state<ImageEntry[]>(saved);
	let index = $state(saved.length - 1);

	function push(entry: ImageEntry): void {
		const kept = entries.slice(0, index + 1);
		entries = [...kept, entry].slice(-LIMIT);
		index = entries.length - 1;
		writeHistory(entries);
	}

	function back(): void {
		if (index > 0) index -= 1;
	}

	function forward(): void {
		if (index < entries.length - 1) index += 1;
	}

	function goTo(target: number): void {
		if (target >= 0 && target < entries.length) index = target;
	}

	return {
		get items() {
			return entries;
		},
		get index() {
			return index;
		},
		get current() {
			return entries[index] ?? null;
		},
		get canGoBack() {
			return index > 0;
		},
		get canGoForward() {
			return index < entries.length - 1;
		},
		push,
		back,
		forward,
		goTo,
	};
}
