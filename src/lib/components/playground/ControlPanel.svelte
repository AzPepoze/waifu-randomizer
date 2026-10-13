<script lang="ts">
	import Segmented from "#lib/components/ui/Segmented.svelte";
	import type { Playground } from "#lib/playground/session.svelte";
	import type { Category } from "#lib/types";
	import AutoCountdown from "./AutoCountdown.svelte";
	import DetailsCard from "./DetailsCard.svelte";
	import SourceList from "./SourceList.svelte";

	let { playground }: { playground: Playground } = $props();

	const ratingOptions: { value: Category; label: string }[] = [
		{ value: "sfw", label: "SFW" },
		{ value: "nsfw", label: "NSFW" },
	];

	const autoOptions = [
		{ value: 0, label: "Off" },
		{ value: 5000, label: "5s" },
		{ value: 10000, label: "10s" },
		{ value: 30000, label: "30s" },
	];
</script>

<aside class="panel glass">
	<section class="block">
		<h2>Source</h2>
		<SourceList {playground} />
	</section>

	<section class="block">
		<h2>Rating</h2>
		<Segmented options={ratingOptions} bind:value={playground.category} label="Rating" />
	</section>

	<section class="block">
		<h2>Auto shuffle</h2>
		<Segmented options={autoOptions} bind:value={playground.autoInterval} label="Auto shuffle" />
		<AutoCountdown {playground} />
	</section>

	<DetailsCard {playground} />
</aside>

<style lang="scss">
	.panel {
		display: flex;
		flex: none;
		flex-direction: column;
		gap: 22px;
		box-sizing: border-box;
		width: var(--panel-width, 340px);
		min-height: 0;
		padding: 22px;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		scrollbar-color: var(--soft-strong) transparent;
		pointer-events: auto;
		animation: panel-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;

		&::after {
			content: "";
			flex: none;
			height: 1px;
		}
	}

	.block {
		display: flex;
		flex: none;
		flex-direction: column;
		gap: 12px;

		h2 {
			margin: 0;
			font-size: 0.72rem;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			opacity: 0.6;
		}
	}

	@keyframes panel-in {
		from {
			opacity: 0;
			transform: translateX(40px);
		}
	}

	@media (max-width: 1024px) {
		.panel {
			width: auto;
			overflow: visible;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.panel {
			animation: none;
		}
	}
</style>
