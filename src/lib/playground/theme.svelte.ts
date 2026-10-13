import type { Theme } from "#lib/types";

const STORAGE_KEY = "waifu-randomizer:theme";

function readSaved(): Theme | null {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value === "light" || value === "dark" ? value : null;
	} catch {
		return null;
	}
}

function writeSaved(value: Theme): void {
	try {
		localStorage.setItem(STORAGE_KEY, value);
	} catch {
		return;
	}
}

function systemTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export interface ThemeState {
	readonly value: Theme;
	init: () => void;
	toggle: () => void;
}

export function createTheme(): ThemeState {
	let value = $state<Theme>("dark");

	function init(): void {
		value = readSaved() ?? systemTheme();
	}

	function toggle(): void {
		value = value === "dark" ? "light" : "dark";
		writeSaved(value);
	}

	return {
		get value() {
			return value;
		},
		init,
		toggle,
	};
}
