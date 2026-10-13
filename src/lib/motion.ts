import type { TransitionConfig } from "svelte/transition";

export function motionDuration(ms: number): number {
	if (typeof window === "undefined") return ms;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
}

export function turn(
	_node: Element,
	{ duration = 300, angle = 120 }: { duration?: number; angle?: number } = {},
): TransitionConfig {
	return {
		duration: motionDuration(duration),
		css: (t: number) => `transform: rotate(${(1 - t) * -angle}deg) scale(${t}); opacity: ${t};`,
	};
}
