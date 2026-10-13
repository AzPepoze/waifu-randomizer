<script lang="ts">
	import { fly } from "svelte/transition";
	import { motionDuration } from "#lib/motion";

	interface Rect {
		top: number;
		left: number;
		width: number;
		height: number;
	}

	let {
		active = false,
		image = "",
		rect = { top: 0, left: 0, width: 100, height: 100 },
	}: { active?: boolean; image?: string; rect?: Rect } = $props();
</script>

{#if active && image}
	<div class="zoom-locator glass" transition:fly={{ x: 24, duration: motionDuration(300) }}>
		<img src={image} alt="Mini-map" />
		<div
			class="viewport-box"
			style="
				top: {rect.top}%;
				left: {rect.left}%;
				width: {rect.width}%;
				height: {rect.height}%;
			"
		></div>
	</div>
{/if}

<style lang="scss">
	.zoom-locator {
		position: absolute;
		bottom: 110px;
		right: var(--locator-right, 380px);
		z-index: 40;
		width: 140px;
		overflow: hidden;
		border-radius: 16px;
		pointer-events: none;
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);

		@media (max-width: 1024px) {
			right: auto;
			left: 20px;
			bottom: 120px;
			width: 120px;
		}

		img {
			display: block;
			width: 100%;
			height: auto;
			opacity: 0.7;
		}

		.viewport-box {
			position: absolute;
			border: 2px solid var(--accent-color);
			background: rgba(255, 102, 170, 0.1);
			box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);
		}
	}
</style>
