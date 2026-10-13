<script lang="ts">
	import { onMount } from "svelte";
	import { followPointer, watchClicks } from "#lib/home/pointer";

	interface Burst {
		id: number;
		x: number;
		y: number;
	}

	const ARROW_PATH = "M2 2 L2 27 L8.5 21 L13 31 L17.5 29 L13 19.5 L22 19.5 Z";

	let cursor: HTMLDivElement | undefined = $state();
	let pressed = $state(false);
	let bursts = $state<Burst[]>([]);
	let nextBurstId = 0;

	function addBurst(x: number, y: number) {
		pressed = true;
		bursts = [...bursts, { id: nextBurstId++, x, y }];
	}

	function removeBurst(id: number) {
		bursts = bursts.filter((burst) => burst.id !== id);
	}

	onMount(() => {
		const canUseCursor =
			matchMedia("(pointer: fine)").matches &&
			!matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!canUseCursor || !cursor) return;

		const root = document.documentElement;
		root.classList.add("has-cursor");
		const stopFollowing = followPointer(cursor);
		const stopClicks = watchClicks({
			onPress: addBurst,
			onRelease: () => (pressed = false),
		});

		return () => {
			stopFollowing();
			stopClicks();
			root.classList.remove("has-cursor");
		};
	});
</script>

{#each bursts as burst (burst.id)}
	<span
		class="click-burst"
		style="--x: {burst.x}px; --y: {burst.y}px"
		onanimationend={() => removeBurst(burst.id)}
	></span>
{/each}

<div class="cursor" class:is-pressed={pressed} bind:this={cursor} aria-hidden="true">
	<svg class="cursor-arrow" viewBox="0 0 24 34">
		<defs>
			<pattern
				id="cursor-stripes"
				width="8"
				height="8"
				patternUnits="userSpaceOnUse"
				patternTransform="rotate(45)"
			>
				<rect width="8" height="8" fill="#ffc2dd" />
				<g>
					<animateTransform
						attributeName="transform"
						type="translate"
						from="0 0"
						to="8 0"
						dur="0.5s"
						repeatCount="indefinite"
					/>
					<rect width="4" height="8" fill="#ff66aa" />
					<rect x="4" width="4" height="8" fill="#ffc2dd" />
				</g>
			</pattern>
		</defs>
		<path class="cursor-shadow" d={ARROW_PATH} transform="translate(3 3)" />
		<path class="cursor-fill" d={ARROW_PATH} />
	</svg>
</div>

<style lang="scss">
	@keyframes burst {
		from {
			transform: scale(0.4);
			opacity: 1;
		}
		to {
			transform: scale(2.4);
			opacity: 0;
		}
	}

	// Pink ring that spreads from each click
	.click-burst {
		position: fixed;
		z-index: 99;
		left: var(--x);
		top: var(--y);
		width: 20px;
		height: 20px;
		margin: -10px 0 0 -10px;
		border: 2px solid var(--accent);
		border-radius: 50%;
		pointer-events: none;
		animation: burst 0.5s ease-out both;
	}

	// Striped pink arrow with a solid shadow; its tip sits on the pointer.
	// --grow, --tilt and --press are registered in home.scss, so they tween both ways.
	.cursor {
		--grow: 1;
		--press: 1;
		--tilt: 0deg;

		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 24px;
		height: 34px;
		transform: translate3d(-100px, -100px, 0);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			--grow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
			--tilt 0.45s cubic-bezier(0.22, 1, 0.36, 1),
			--press 0.15s ease-out;

		&.is-pressed {
			--press: 0.8;
		}
	}

	.cursor-arrow {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		transform-origin: 0 0;
		transform: scale(calc(var(--grow) * var(--press))) rotate(var(--tilt));
	}

	.cursor-fill {
		fill: url(#cursor-stripes);
		stroke: var(--white);
		stroke-width: 1.8;
		stroke-linejoin: round;
	}

	.cursor-shadow {
		fill: var(--night);
		stroke: var(--night);
		stroke-width: 1.8;
		stroke-linejoin: round;
	}

	:global(.has-cursor) .cursor {
		opacity: 1;
	}

	:global(.has-cursor:has(a:hover, button:hover)) .cursor {
		--grow: 1.25;
		--tilt: -10deg;
	}
</style>
