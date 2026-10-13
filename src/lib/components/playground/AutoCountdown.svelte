<script lang="ts">
	import { slide } from "svelte/transition";
	import { motionDuration } from "#lib/motion";
	import type { Playground } from "#lib/playground/session.svelte";

	let { playground }: { playground: Playground } = $props();

	const fraction = $derived(
		playground.autoInterval
			? Math.max(0, Math.min(1, playground.autoRemaining / playground.autoInterval))
			: 0,
	);
	const label = $derived(
		playground.isLoading ? "Loading…" : `Next in ${Math.ceil(playground.autoRemaining / 1000)}s`,
	);
</script>

{#if playground.autoInterval}
	<div class="countdown" transition:slide={{ duration: motionDuration(260) }}>
		<div class="bar" aria-hidden="true">
			<div class="fill" style="width: {fraction * 100}%"></div>
		</div>
		<span class="label" role="timer" aria-live="off">{label}</span>
	</div>
{/if}

<style lang="scss">
	.countdown {
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow: hidden;
	}

	.bar {
		height: 6px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--soft);
	}

	.fill {
		height: 100%;
		border-radius: 999px;
		background: var(--accent-color);
		transition: width 0.1s linear;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--text-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
		}
	}
</style>
