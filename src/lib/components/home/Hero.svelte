<script lang="ts">
	import type { Point } from "#lib/types";
	import Ring from "./Ring.svelte";

	let {
		refreshing = false,
		onregenerate,
	}: { refreshing?: boolean; onregenerate: (origin: Point) => void } = $props();

	const heroLines = ["Social Life is Over.", "Waifus are Eternal."];
</script>

<header class="hero">
	<h1 class="hero-title" aria-label="Social Life is Over. Waifus are Eternal.">
		{#each heroLines as line, lineIndex (line)}
			<span class="line" aria-hidden="true">
				{#each line.split(" ") as word, wordIndex (wordIndex)}
					<span class="word">
						{#each [...word] as char, charIndex (charIndex)}
							<span
								class="char"
								style="--line: {lineIndex}; --word: {wordIndex}; --char: {charIndex}">{char}</span
							>
						{/each}
					</span>
					<!-- eslint-disable-next-line svelte/no-useless-mustaches -- keeps the space between words -->
					{" "}
				{/each}
			</span>
		{/each}
	</h1>

	<p class="hero-subtitle">
		The #1 tool for people who haven't seen the sun in 48 hours. Discover your 2D soulmate today. 0%
		Bankruptcy, 100% Waifu.
	</p>

	<div class="cta-actions">
		<a
			href="/playground"
			class="cta primary"
			aria-label="Start browsing random waifus in the playground"
		>
			Reject 3D, Embrace 2D
		</a>
		<a
			href="https://github.com/AzPepoze/waifu-randomizer"
			target="_blank"
			rel="noopener"
			class="cta secondary"
			aria-label="View source code on GitHub"
		>
			Gimme Source Code
		</a>
	</div>

	<Ring {refreshing} {onregenerate} />
</header>

<style lang="scss">
	@keyframes rise {
		from {
			transform: translateY(105%);
		}
		to {
			transform: translateY(0);
		}
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.hero {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: clamp(2rem, 8vw, 6rem);
	}

	.hero-title {
		position: relative;
		margin: 0 0 2rem;
		font-size: clamp(2.75rem, 6.2vw, 6rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.02em;
		text-shadow: 0 4px 30px rgba(0, 0, 0, 0.35);
	}

	.line {
		display: block;
		overflow: hidden;
		padding: 0.04em 0 0.1em;
	}

	.word {
		display: inline-block;
		white-space: nowrap;
	}

	.char {
		display: inline-block;
		animation: rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: calc(var(--line) * 0.35s + var(--word) * 0.15s + var(--char) * 0.04s + 0.3s);
	}

	.hero-subtitle {
		max-width: 34ch;
		margin: 0 0 3rem;
		font-size: 1.125rem;
		animation: fade-up 1s ease 1.6s both;
	}

	.cta-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.5rem 2.5rem;
		animation: fade-up 1s ease 2s both;
	}

	.cta {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		padding: 1.1rem 2.4rem;
		border: 1px solid var(--white);
		border-radius: 999px;
		color: var(--white);
		font-weight: 700;
		text-decoration: none;
		transition: color 0.5s ease;

		// A circle that grows from the centre on hover
		&::before {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			z-index: -1;
			width: 150%;
			aspect-ratio: 1;
			border-radius: 50%;
			background: var(--white);
			transform: translate(-50%, -50%) scale(0);
			transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		}

		&:hover {
			color: var(--night);

			&::before {
				transform: translate(-50%, -50%) scale(1);
			}
		}

		&.primary {
			border-color: var(--accent);
			background: var(--accent);
			color: var(--night);

			&::before {
				background: var(--white);
			}
		}
	}

	@media (max-width: 768px) {
		.cta-actions {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
