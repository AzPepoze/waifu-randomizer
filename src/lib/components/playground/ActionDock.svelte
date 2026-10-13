<script lang="ts">
	import { fade, fly, scale } from "svelte/transition";
	import { motionDuration } from "#lib/motion";
	import type { Playground } from "#lib/playground/session.svelte";
	import { tooltip } from "#lib/tooltip";
	import ShuffleIcon from "./ShuffleIcon.svelte";

	let { playground }: { playground: Playground } = $props();

	const shuffleLabel = $derived(playground.mode === "favorites" ? "Random saved" : "Random");
	let labelWidth = $state(0);

	function openOriginal(): void {
		if (playground.source) window.open(playground.source, "_blank", "noopener");
	}
</script>

<nav class="dock glass" aria-label="Image actions">
	<button
		class="round"
		aria-label="Previous image"
		use:tooltip={"Previous (←)"}
		disabled={!playground.history.canGoBack}
		onclick={playground.history.back}
	>
		<span class="material-icons">arrow_back</span>
	</button>

	<button
		class="round"
		class:saved={playground.isFavorite}
		aria-label={playground.isFavorite ? "Remove from saved" : "Save image"}
		use:tooltip={playground.isFavorite ? "Remove from saved (F)" : "Save (F)"}
		disabled={!playground.image}
		onclick={playground.toggleFavorite}
	>
		<span class="swap">
			{#key playground.isFavorite}
				<span
					class="material-icons"
					in:scale={{ start: 0.4, duration: motionDuration(260) }}
					out:fade={{ duration: motionDuration(120) }}
				>
					{playground.isFavorite ? "favorite" : "favorite_border"}
				</span>
			{/key}
		</span>
	</button>

	<button
		class="shuffle"
		use:tooltip={"Random image (Space)"}
		disabled={playground.isLoading}
		onclick={playground.next}
	>
		<ShuffleIcon spinning={playground.isLoading} />
		<span class="label-box" style:width="{labelWidth}px">
			{#key shuffleLabel}
				<span
					class="label-text"
					bind:offsetWidth={labelWidth}
					in:fly={{ y: 14, duration: motionDuration(320) }}
					out:fly={{ y: -14, duration: motionDuration(200) }}
				>
					{shuffleLabel}
				</span>
			{/key}
		</span>
	</button>

	<button
		class="round"
		aria-label="Copy image link"
		use:tooltip={"Copy link (C)"}
		disabled={!playground.image}
		onclick={playground.copy}
	>
		<span class="material-icons">content_copy</span>
	</button>

	<button
		class="round"
		aria-label="Download image"
		use:tooltip={"Download (D)"}
		disabled={!playground.image || playground.isLoading}
		onclick={playground.download}
	>
		<span class="material-icons">download</span>
	</button>

	<button
		class="round"
		aria-label="Open original"
		use:tooltip={"Open original"}
		disabled={!playground.source}
		onclick={openOriginal}
	>
		<span class="material-icons">open_in_new</span>
	</button>

	<button
		class="round"
		aria-label="Next image"
		use:tooltip={"Next (→)"}
		disabled={!playground.history.canGoForward}
		onclick={playground.history.forward}
	>
		<span class="material-icons">arrow_forward</span>
	</button>
</nav>

<style lang="scss">
	.dock {
		justify-self: center;
		display: flex;
		align-items: center;
		gap: 10px;
		max-width: 100%;
		padding: 10px;
		border-radius: 999px;
		pointer-events: auto;
		animation: dock-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
	}

	.swap {
		display: inline-grid;
		place-items: center;

		> * {
			grid-area: 1 / 1;
		}
	}

	.shuffle {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		height: 56px;
		padding: 0 28px;
		border: none;
		border-radius: 999px;
		background: #ff66aa;
		color: #ffffff;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		transition: transform 0.2s ease;

		&:hover:not(:disabled) {
			transform: translateY(-2px) scale(1.03);
		}

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}
	}

	.label-box {
		position: relative;
		height: 1.4em;
		overflow: hidden;
		white-space: nowrap;
		transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.label-text {
		position: absolute;
		top: 0;
		left: 0;
		line-height: 1.4em;
	}

	@media (prefers-reduced-motion: reduce) {
		.label-box {
			transition: none;
		}
	}

	@keyframes dock-in {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
	}

	@media (max-width: 1024px) {
		.dock {
			flex-wrap: wrap;
			justify-content: center;
			border-radius: 28px;
		}
	}

	@media (max-width: 600px) {
		.dock {
			flex-wrap: nowrap;
			gap: 6px;
			padding: 8px;
		}

		.round {
			width: 40px;
			height: 40px;
		}

		.shuffle {
			justify-content: center;
			width: 40px;
			height: 40px;
			padding: 0;
		}

		.label-box {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dock {
			animation: none;
		}
	}
</style>
