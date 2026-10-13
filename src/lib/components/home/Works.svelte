<script lang="ts">
	import { features } from "#lib/home/features";
	import { reveal } from "#lib/home/reveal";
</script>

<section class="works">
	{#each features as feature (feature.title)}
		<article class="work" use:reveal>
			<h3 class="work-title">{feature.title}</h3>
			<p>{feature.body}</p>
		</article>
	{/each}
</section>

<style lang="scss">
	.works {
		position: relative;
		z-index: 1;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		gap: 4rem 3rem;
		padding: 2rem clamp(1.5rem, 6vw, 6rem) 8rem;
		box-sizing: border-box;
	}

	.work {
		position: relative;
		width: min(300px, 80vw);
		aspect-ratio: 1;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2.5rem;
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		background: var(--glass);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		text-align: center;
		transition:
			opacity 0.9s ease,
			transform 1s cubic-bezier(0.16, 1, 0.3, 1),
			background-color 0.5s ease,
			color 0.5s ease;

		// A dashed orbit around each circle
		&::before {
			content: "";
			position: absolute;
			inset: -14px;
			border: 1px dashed var(--outline);
			border-radius: 50%;
			animation: spin 40s linear infinite;
			pointer-events: none;
		}

		&:nth-child(2) {
			margin-top: 6rem;
		}

		&:nth-child(3) {
			margin-top: 2rem;
		}

		&:hover {
			background: var(--accent);
			color: var(--night);
			border-color: var(--accent);
		}
	}

	.work-title {
		margin: 0 0 1rem;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.work p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.7;
	}

	// Hidden until JavaScript runs, so the content still shows without it
	:global(.js-ready) .work {
		opacity: 0;
		transform: translateY(40px) scale(0.96);
	}

	:global(.js-ready) .work:global(.is-visible) {
		opacity: 1;
		transform: none;
	}

	@media (max-width: 768px) {
		.works {
			gap: 3rem;
		}

		.work:nth-child(2),
		.work:nth-child(3) {
			margin-top: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.js-ready) .work {
			opacity: 1;
			transform: none;
		}
	}
</style>
