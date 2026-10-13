<script lang="ts">
	import { onDestroy } from "svelte";

	let { spinning = false }: { spinning?: boolean } = $props();

	const ROUTES = "M3 7 H8 L16 17 H21 M3 17 H8 L16 7 H21";
	const HEADS = "M18 4 L21 7 L18 10 M18 14 L21 17 L18 20";
	const DASH_CYCLE = 8;

	let solid: SVGPathElement | undefined = $state();
	let flow: SVGPathElement | undefined = $state();
	let heads: SVGPathElement | undefined = $state();

	let intensity = 0;
	let phase = 0;
	let frame = 0;
	let last = 0;

	const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

	function paint(): void {
		if (!solid || !flow || !heads) return;
		solid.style.opacity = String(1 - intensity * 0.75);
		flow.style.opacity = String(intensity);
		flow.setAttribute("stroke-dashoffset", String(-phase));
		heads.style.transform = `scale(${1 + intensity * 0.15})`;
	}

	function step(now: number): void {
		const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
		last = now;

		const target = spinning ? 1 : 0;
		intensity += (target - intensity) * (1 - Math.exp(-dt * 7));
		phase = reduceMotion() ? 0 : (phase + dt * 22 * intensity) % DASH_CYCLE;
		paint();

		if (!spinning && intensity < 0.002) {
			intensity = 0;
			paint();
			frame = 0;
			last = 0;
			return;
		}
		frame = requestAnimationFrame(step);
	}

	$effect(() => {
		void spinning;
		if (!frame) frame = requestAnimationFrame(step);
	});

	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame);
	});
</script>

<svg class="shuffle-icon" viewBox="0 0 24 24" aria-hidden="true">
	<path bind:this={solid} class="route" d={ROUTES} />
	<path bind:this={flow} class="route flow" d={ROUTES} />
	<path bind:this={heads} class="head" d={HEADS} />
</svg>

<style lang="scss">
	.shuffle-icon {
		display: block;
		width: 24px;
		height: 24px;
		overflow: visible;
	}

	.route,
	.head {
		fill: none;
		stroke: currentColor;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.flow {
		stroke-dasharray: 5 3;
		opacity: 0;
	}

	.head {
		transform-box: view-box;
		transform-origin: 18.5px 12px;
	}
</style>
