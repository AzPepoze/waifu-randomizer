<script lang="ts">
	import type { Point } from "#lib/types";

	let { origin }: { origin: Point } = $props();
	let visible = $state(true);
</script>

{#if visible}
	<span
		class="ripple"
		aria-hidden="true"
		style="--x: {origin.x}px; --y: {origin.y}px"
		onanimationend={() => (visible = false)}
	></span>
{/if}

<style lang="scss">
	@keyframes ripple {
		from {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0.9;
		}
		to {
			transform: translate(-50%, -50%) scale(40);
			opacity: 0;
		}
	}

	// The ring that spreads out from the button when the wallpaper changes
	.ripple {
		position: fixed;
		z-index: 2;
		left: var(--x);
		top: var(--y);
		width: 40px;
		height: 40px;
		border: 1px solid var(--white);
		border-radius: 50%;
		pointer-events: none;
		animation: ripple 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@media (prefers-reduced-motion: reduce) {
		.ripple {
			display: none;
		}
	}
</style>
