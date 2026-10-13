<script lang="ts">
	import Segmented from "#lib/components/ui/Segmented.svelte";
	import type { Playground } from "#lib/playground/session.svelte";
	import type { ThemeState } from "#lib/playground/theme.svelte";
	import { tooltip } from "#lib/tooltip";
	import type { PlayMode } from "#lib/types";
	import ThemeToggle from "./ThemeToggle.svelte";

	let { playground, theme }: { playground: Playground; theme: ThemeState } = $props();

	const modeOptions = $derived<{ value: PlayMode; label: string }[]>([
		{ value: "random", label: "Random" },
		{ value: "favorites", label: `Saved ${playground.favorites.items.length}` },
	]);
</script>

<header class="top">
	<a class="logo" href="/" aria-label="Waifu Randomizer">
		<span class="silhouette" aria-hidden="true"></span>
	</a>

	<Segmented options={modeOptions} bind:value={playground.mode} label="Source" />

	<ThemeToggle theme={theme.value} ontoggle={theme.toggle} />

	<button
		class="round ghost"
		aria-label="Keyboard shortcuts"
		use:tooltip={"Keyboard shortcuts (?)"}
		onclick={() => (playground.helpOpen = true)}
	>
		<span class="material-icons">keyboard</span>
	</button>
</header>

<style lang="scss">
	.top {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		pointer-events: auto;
		animation: top-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	.logo {
		display: flex;
		margin-right: auto;
		color: inherit;
		text-decoration: none;
	}

	.ghost {
		width: 40px;
		height: 40px;
	}

	@keyframes top-in {
		from {
			opacity: 0;
			transform: translateY(-16px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.top {
			animation: none;
		}
	}

	.silhouette {
		flex: none;
		width: 30px;
		height: 30px;
		background: var(--text-main);
		mask: url("/loader/keqing-silhouette.png") center / contain no-repeat;
		-webkit-mask: url("/loader/keqing-silhouette.png") center / contain no-repeat;
	}
</style>
