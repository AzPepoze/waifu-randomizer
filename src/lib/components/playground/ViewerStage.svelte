<script lang="ts">
	import { fade } from "svelte/transition";
	import ImageViewer from "#lib/components/ImageViewer.svelte";
	import { motionDuration } from "#lib/motion";
	import type { Playground } from "#lib/playground/session.svelte";

	let { playground }: { playground: Playground } = $props();

	const showIdle = $derived(!playground.image && !playground.isLoading && !playground.errorMessage);
</script>

<section class="backdrop-view">
	<ImageViewer
		background
		image={playground.image}
		isLoading={playground.isLoading}
		progress={playground.progress}
		errorMessage={playground.errorMessage}
		onDismiss={playground.dismissError}
	/>

	{#if showIdle}
		<p class="idle" transition:fade={{ duration: motionDuration(400) }}>Press Random to start</p>
	{/if}
</section>

<style lang="scss">
	.backdrop-view {
		position: fixed;
		inset: 0;
		z-index: 0;
	}

	.idle {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		margin: 0;
		color: var(--text-main);
		opacity: 0.55;
		pointer-events: none;
	}

	@media (max-width: 1024px) {
		.backdrop-view {
			position: relative;
			inset: auto;
			order: 1;
			flex: none;
			height: 60vh;
		}
	}
</style>
