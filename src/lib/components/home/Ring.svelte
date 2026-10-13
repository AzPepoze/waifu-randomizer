<script lang="ts">
	import type { Point } from "#lib/types";

	let {
		refreshing = false,
		onregenerate,
	}: { refreshing?: boolean; onregenerate: (origin: Point) => void } = $props();
	let button: HTMLButtonElement | undefined = $state();

	function regenerate() {
		if (!button) return;
		const rect = button.getBoundingClientRect();
		onregenerate({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
	}
</script>

<div class="ring">
	<svg class="enso" viewBox="0 0 200 200" aria-hidden="true">
		<circle cx="100" cy="100" r="88" pathLength="1" />
		<circle class="sun-dot" cx="188" cy="100" r="7" />
	</svg>

	<button
		class="regen"
		class:is-busy={refreshing}
		bind:this={button}
		disabled={refreshing}
		onclick={regenerate}
		aria-label="Change background"
	>
		<svg class="regen-icon" viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"
			/>
		</svg>
	</button>
</div>

<style lang="scss">
	@keyframes draw {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.ring {
		position: absolute;
		top: 50%;
		right: 4%;
		z-index: -1;
		width: min(60vw, 680px);
		aspect-ratio: 1;
		transform: translateY(-50%);
	}

	.enso {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.enso circle {
		fill: none;
		stroke: var(--white);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-dasharray: 1 1;
		stroke-dashoffset: 0;
		animation: draw 2.2s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both;
	}

	.sun-dot {
		fill: var(--accent);
		animation: fade-in 0.6s ease 2.4s both;
	}

	.regen {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 72px;
		height: 72px;
		padding: 0;
		border: 1px solid var(--white);
		border-radius: 50%;
		background: var(--glass);
		color: var(--white);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		cursor: pointer;
		transform: translate(-50%, -50%);
		transition:
			background-color 0.4s ease,
			color 0.4s ease,
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

		// A dashed orbit that keeps turning around the button
		&::before {
			content: "";
			position: absolute;
			inset: -10px;
			border: 1px dashed var(--outline);
			border-radius: 50%;
			animation: spin 12s linear infinite;
			pointer-events: none;
		}

		&:hover:not(:disabled) {
			background: var(--white);
			color: var(--night);
			transform: translate(-50%, -50%) scale(1.08);
		}

		&:active:not(:disabled) {
			transform: translate(-50%, -50%) scale(0.95);
		}

		&:disabled {
			cursor: progress;
		}
	}

	.regen-icon {
		width: 28px;
		height: 28px;
		fill: currentColor;
	}

	.regen.is-busy .regen-icon {
		animation: spin 0.8s linear infinite;
	}

	@media (max-width: 768px) {
		.ring {
			top: 38%;
			right: -30vw;
			width: 120vw;
			opacity: 0.6;
		}
	}
</style>
