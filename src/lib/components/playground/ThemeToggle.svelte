<script lang="ts">
	import { turn } from "#lib/motion";
	import { tooltip } from "#lib/tooltip";
	import type { Theme } from "#lib/types";

	let { theme, ontoggle }: { theme: Theme; ontoggle: () => void } = $props();

	const label = $derived(theme === "dark" ? "Switch to light mode" : "Switch to dark mode");

	function switchTheme(event: MouseEvent): void {
		const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!document.startViewTransition || reduceMotion) {
			ontoggle();
			return;
		}

		const button = event.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		const root = document.documentElement;
		root.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
		root.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
		root.classList.add("theme-switching");

		const transition = document.startViewTransition(() => ontoggle());
		transition.finished.finally(() => root.classList.remove("theme-switching"));
	}
</script>

<button class="round ghost" aria-label={label} use:tooltip={label} onclick={switchTheme}>
	<span class="swap">
		{#key theme}
			<span class="material-icons" in:turn out:turn>
				{theme === "dark" ? "light_mode" : "dark_mode"}
			</span>
		{/key}
	</span>
</button>

<style lang="scss">
	.ghost {
		width: 40px;
		height: 40px;
	}

	.swap {
		display: inline-grid;
		place-items: center;

		> * {
			grid-area: 1 / 1;
		}
	}

	.material-icons {
		display: inline-block;
	}
</style>
