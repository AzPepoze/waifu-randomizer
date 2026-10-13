<script lang="ts">
	import type { WallpaperLayer } from "#lib/home/wallpaper.svelte";
	import Ripple from "./Ripple.svelte";

	let {
		layers = [],
		onsettle,
	}: { layers?: WallpaperLayer[]; onsettle: (layer: WallpaperLayer) => void } = $props();
</script>

{#each layers as layer (layer.id)}
	<img
		class="wallpaper"
		src={layer.url}
		alt=""
		aria-hidden="true"
		style="--x: {layer.origin.x}px; --y: {layer.origin.y}px"
		onanimationend={() => onsettle(layer)}
	/>
	<Ripple origin={layer.origin} />
{/each}

<div class="scrim" aria-hidden="true"></div>

<style lang="scss">
	@keyframes reveal {
		from {
			clip-path: circle(0px at var(--x) var(--y));
		}
		to {
			clip-path: circle(150vmax at var(--x) var(--y));
		}
	}

	@keyframes drift {
		to {
			transform: scale(1.08);
		}
	}

	.wallpaper {
		position: fixed;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			filter 0.8s ease,
			scale 0.8s ease;
		animation:
			reveal 1.1s cubic-bezier(0.7, 0, 0.2, 1) both,
			drift 30s ease-in-out infinite alternate;
	}

	// Blur the wallpaper while the next one loads; it clears as the new one is revealed
	:global(.home.is-refreshing) .wallpaper {
		filter: blur(24px);
		scale: 1.06;
	}

	.scrim {
		position: fixed;
		inset: 0;
		z-index: 0;
		background: linear-gradient(
			120deg,
			rgba(11, 11, 16, 0.92) 0%,
			rgba(11, 11, 16, 0.55) 55%,
			rgba(11, 11, 16, 0.85) 100%
		);
		pointer-events: none;
	}
</style>
