<script lang="ts">
	import { fade } from "svelte/transition";
	import { motionDuration } from "#lib/motion";

	let {
		isLoading = false,
		progress = 0,
		overPicture = false,
	}: { isLoading?: boolean; progress?: number; overPicture?: boolean } = $props();

	const percent = $derived(Math.round(Math.min(100, Math.max(0, progress))));
</script>

{#if isLoading}
	<div
		class="loading-overlay"
		class:over-picture={overPicture}
		transition:fade={{ duration: motionDuration(300) }}
	>
		<div class="loader-content" role="status" aria-live="polite">
			<div class="art" style="--cut: {100 - percent}%" aria-hidden="true">
				<div class="ghost"></div>
				<div class="fill"></div>
			</div>

			<div class="bar-row">
				<div class="bar" aria-hidden="true">
					<div class="bar-fill" style="width: {percent}%"></div>
				</div>
				<span class="percent">{percent}%</span>
			</div>

			<p>
				Loading art<span class="dots"><i>.</i><i>.</i><i>.</i></span>
			</p>
		</div>
	</div>
{/if}

<style lang="scss">
	.loading-overlay {
		position: absolute;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-bg);
	}

	.loading-overlay.over-picture {
		background: radial-gradient(circle at center, var(--veil-from), var(--veil-to));
		backdrop-filter: blur(18px) saturate(1.1);
		-webkit-backdrop-filter: blur(18px) saturate(1.1);
	}

	.loader-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;

		p {
			margin: 0;
			font-weight: 600;
			color: var(--text-muted);
		}
	}

	.art {
		position: relative;
		width: 170px;
		height: 180px;
		animation: breathe 2.6s ease-in-out infinite;
	}

	.ghost,
	.fill {
		position: absolute;
		inset: 0;
		mask: url("/loader/keqing-silhouette.png") center / contain no-repeat;
		-webkit-mask: url("/loader/keqing-silhouette.png") center / contain no-repeat;
		background: var(--accent-color);
	}

	.ghost {
		opacity: 0.18;
	}

	.fill {
		clip-path: inset(var(--cut) 0 0 0);
		transition: clip-path 0.4s ease-out;
		filter: drop-shadow(0 8px 14px rgba(255, 102, 170, 0.3));
	}

	.bar-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.bar {
		width: min(220px, 40vw);
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--border-color);
	}

	.bar-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			var(--accent-color) 0%,
			#ffc2dd 50%,
			var(--accent-color) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.4s linear infinite;
		transition: width 0.4s ease-out;
	}

	.percent {
		min-width: 3.2em;
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		color: var(--text-main);
	}

	.dots i {
		font-style: normal;
		opacity: 0.2;
		animation: dot 1.2s infinite;

		&:nth-child(2) {
			animation-delay: 0.2s;
		}

		&:nth-child(3) {
			animation-delay: 0.4s;
		}
	}

	@keyframes breathe {
		0%,
		100% {
			transform: translateY(0) scale(1, 1);
		}
		50% {
			transform: translateY(-5px) scale(1.01, 0.99);
		}
	}

	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: 0 0;
		}
	}

	@keyframes dot {
		0%,
		60%,
		100% {
			opacity: 0.2;
		}
		30% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.art,
		.bar-fill,
		.dots i {
			animation: none;
		}

		.fill {
			transition: none;
		}
	}
</style>
