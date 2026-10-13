<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { motionDuration } from "#lib/motion";
	import Notice from "#lib/components/Notice.svelte";
	import ShortcutsHelp from "#lib/components/playground/ShortcutsHelp.svelte";
	import ActionDock from "#lib/components/playground/ActionDock.svelte";
	import AmbientBackdrop from "#lib/components/playground/AmbientBackdrop.svelte";
	import ControlPanel from "#lib/components/playground/ControlPanel.svelte";
	import PlaygroundHeader from "#lib/components/playground/PlaygroundHeader.svelte";
	import SavedStrip from "#lib/components/playground/SavedStrip.svelte";
	import ViewerStage from "#lib/components/playground/ViewerStage.svelte";
	import { createPlayground } from "#lib/playground/session.svelte";
	import { createTheme } from "#lib/playground/theme.svelte";
	import { tooltip } from "#lib/tooltip";
	import "#lib/styles/glass.scss";

	const playground = createPlayground();
	const theme = createTheme();
	let sheetOpen = $state(false);

	onMount(() => {
		theme.init();
		playground.infoOpen = true;
		return playground.attach();
	});
</script>

<svelte:head>
	<title>Playground | Waifu Randomizer - Interactive Anime Art Explorer</title>
	<meta
		name="description"
		content="Explore random high-quality anime artwork and waifus from Waifu.im, Waifu.pics, Nekos.best, and more. Zoom, download, and customize your anime art discovery."
	/>
	<link rel="canonical" href="https://waifu-randomizer.azpepoze.com/playground" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://waifu-randomizer.azpepoze.com/playground" />
	<meta
		property="og:title"
		content="Playground | Waifu Randomizer - Interactive Anime Art Explorer"
	/>
	<meta
		property="og:description"
		content="Explore random high-quality anime artwork and waifus from Waifu.im, Waifu.pics, Nekos.best, and more. Zoom, download, and customize your anime art discovery."
	/>
	<meta
		property="og:image"
		content="https://waifu-randomizer.azpepoze.com/web-app-manifest-512x512.png"
	/>

	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content="https://waifu-randomizer.azpepoze.com/playground" />
	<meta
		property="twitter:title"
		content="Playground | Waifu Randomizer - Interactive Anime Art Explorer"
	/>
	<meta
		property="twitter:description"
		content="Explore random high-quality anime artwork and waifus from Waifu.im, Waifu.pics, Nekos.best, and more. Zoom, download, and customize your anime art discovery."
	/>
	<meta
		property="twitter:image"
		content="https://waifu-randomizer.azpepoze.com/web-app-manifest-512x512.png"
	/>

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Waifu Randomizer Playground",
			"url": "https://waifu-randomizer.azpepoze.com/playground",
			"description": "Interactive anime art explorer and waifu randomizer.",
			"applicationCategory": "EntertainmentApplication",
			"operatingSystem": "Any",
			"author": {
				"@type": "Person",
				"name": "AzPepoze"
			}
		}
	</script>
</svelte:head>

<main class="glass-page" data-theme={theme.value}>
	<AmbientBackdrop image={playground.image} />
	<ViewerStage {playground} />

	{#if sheetOpen}
		<button
			class="scrim"
			aria-label="Close controls"
			transition:fade={{ duration: motionDuration(250) }}
			onclick={() => (sheetOpen = false)}
		></button>
	{/if}

	<div class="shell">
		<PlaygroundHeader {playground} {theme} />

		<div class="body" class:sheet-open={sheetOpen}>
			<SavedStrip {playground} />
			<ControlPanel {playground} />
		</div>

		<footer class="bottom">
			<ActionDock {playground} />
			<button
				class="sheet-toggle"
				aria-expanded={sheetOpen}
				aria-label={sheetOpen ? "Hide controls" : "Show controls"}
				use:tooltip={sheetOpen ? "Hide controls" : "Show controls"}
				onclick={() => (sheetOpen = !sheetOpen)}
			>
				<span class="material-icons">{sheetOpen ? "expand_more" : "tune"}</span>
			</button>
		</footer>
	</div>

	<Notice message={playground.notice} />
	<ShortcutsHelp open={playground.helpOpen} onclose={() => (playground.helpOpen = false)} />
</main>

<style lang="scss">
	.glass-page {
		--panel-width: 340px;
		--locator-right: calc(var(--panel-width) + 20px + 16px);

		position: fixed;
		inset: 0;
		overflow: hidden;
		font-family: "Zen Kaku Gothic New", sans-serif;
	}

	.shell {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: 16px;
		height: 100%;
		box-sizing: border-box;
		padding: 16px 20px 20px;
		pointer-events: none;
	}

	.body {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		min-height: 0;
	}

	.bottom {
		display: grid;
	}

	.sheet-toggle {
		display: none;
	}

	@media (max-width: 1024px) {
		.glass-page {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			align-content: start;
			gap: 12px;
			overflow-y: auto;
			overscroll-behavior: contain;
			padding-bottom: 20px;
		}

		.shell {
			display: contents;
		}

		.shell > :global(header),
		.bottom {
			position: relative;
			z-index: 2;
		}

		.body {
			position: relative;
		}

		.shell > :global(header) {
			grid-row: 1;
			grid-column: 1;
			padding: 16px 16px 0;
		}

		.glass-page > :global(.ambient),
		.glass-page > :global(.veil) {
			position: fixed;
		}

		.glass-page > :global(.backdrop-view) {
			grid-row: 2;
			grid-column: 1;
			margin: 0 16px;
		}

		.bottom {
			grid-row: 3;
			grid-column: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			gap: 8px;
			padding: 0 16px;
			pointer-events: none;
		}

		.sheet-toggle {
			display: grid;
			place-items: center;
			width: 48px;
			height: 48px;
			border: none;
			border-radius: 50%;
			background: var(--soft-strong);
			color: var(--text-main);
			cursor: pointer;
			pointer-events: auto;
		}

		.body {
			grid-row: 4;
			grid-column: 1;
			flex-direction: column;
			margin: 0 16px;
		}

		.body :global(.panel) {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 40;
			width: min(360px, 88vw);
			overflow-y: auto;
			background: var(--panel-solid);
			border-radius: 28px 0 0 28px;
			animation: none;
			transform: translateX(100%);
			transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
		}

		.body.sheet-open :global(.panel) {
			transform: translateX(0);
		}

		.scrim {
			position: fixed;
			inset: 0;
			z-index: 39;
			border: none;
			background: transparent;
			cursor: pointer;
		}

		@media (prefers-reduced-motion: reduce) {
			.body :global(.panel) {
				transition: none;
			}
		}
	}
</style>
