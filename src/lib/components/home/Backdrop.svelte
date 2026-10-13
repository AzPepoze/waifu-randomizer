<script lang="ts">
	interface Dot {
		top: string;
		left: string;
		duration: string;
		accent?: boolean;
	}

	const dots: Dot[] = [
		{ top: "22%", left: "46%", duration: "9s" },
		{ top: "64%", left: "38%", duration: "12s", accent: true },
		{ top: "78%", left: "72%", duration: "8s" },
	];
</script>

<div class="backdrop" aria-hidden="true">
	<span class="orb orb-large"></span>
	<span class="orb orb-small"></span>
	{#each dots as dot (dot.top + dot.left)}
		<span
			class="dot"
			class:is-accent={dot.accent}
			style="top: {dot.top}; left: {dot.left}; --t: {dot.duration}"
		></span>
	{/each}
</div>

<style lang="scss">
	@keyframes float {
		50% {
			transform: translate3d(0, -24px, 0);
		}
	}

	.backdrop {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.orb {
		position: absolute;
		border: 1px solid var(--outline);
		border-radius: 50%;
	}

	.orb-large {
		top: -30vmin;
		right: -35vmin;
		width: 100vmin;
		height: 100vmin;
		animation: spin 90s linear infinite;
	}

	.orb-small {
		bottom: 10%;
		left: 6%;
		width: 18vmin;
		height: 18vmin;
		border-style: dashed;
		animation: spin 40s linear infinite reverse;
	}

	.dot {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--white);
		animation: float var(--t, 10s) ease-in-out infinite;

		&.is-accent {
			background: var(--accent);
		}
	}
</style>
