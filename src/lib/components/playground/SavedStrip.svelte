<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { motionDuration } from "#lib/motion";
	import type { Playground } from "#lib/playground/session.svelte";
	import type { ImageEntry } from "#lib/types";

	let { playground }: { playground: Playground } = $props();

	const entries = $derived<ImageEntry[]>(
		playground.mode === "favorites" ? playground.favorites.items : playground.history.items,
	);

	const emptyIcon = $derived(playground.mode === "favorites" ? "favorite_border" : "image");
	const emptyHint = $derived(
		playground.mode === "favorites"
			? "Nothing saved yet. Press the heart to keep an image here."
			: "Your recent images appear here.",
	);

	function pick(entry: ImageEntry, index: number): void {
		if (playground.mode === "favorites") {
			playground.history.push(entry);
		} else {
			playground.history.goTo(index);
		}
	}

	function isShown(entry: ImageEntry, index: number): boolean {
		return playground.mode === "favorites"
			? entry.url === playground.image
			: index === playground.history.index;
	}
</script>

<aside
	class="strip glass"
	aria-label={playground.mode === "favorites" ? "Saved images" : "Recent images"}
>
	{#if entries.length === 0}
		<div
			class="empty"
			title={emptyHint}
			aria-label={emptyHint}
			role="img"
			transition:fade={{ duration: motionDuration(220) }}
		>
			<span class="material-icons" in:scale={{ start: 0.6, duration: motionDuration(300) }}>
				{emptyIcon}
			</span>
		</div>
	{:else}
		<ol transition:fade={{ duration: motionDuration(220) }}>
			{#each entries as entry, index (entry.url + index)}
				<li
					animate:flip={{ duration: motionDuration(320) }}
					in:scale={{ start: 0.6, duration: motionDuration(260) }}
					out:scale={{ start: 0.6, duration: motionDuration(180) }}
				>
					<button
						class="thumb"
						class:shown={isShown(entry, index)}
						aria-label="Show image {index + 1}"
						aria-current={isShown(entry, index) ? "true" : undefined}
						onclick={() => pick(entry, index)}
					>
						<img src={entry.url} alt="" loading="lazy" />
					</button>
				</li>
			{/each}
		</ol>
	{/if}
</aside>

<style lang="scss">
	.strip {
		position: relative;
		display: flex;
		flex: none;
		flex-direction: column;
		box-sizing: border-box;
		width: 112px;
		min-height: 0;
		overflow: hidden;
		pointer-events: auto;
		animation: strip-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
	}

	.empty,
	ol {
		position: absolute;
		top: 14px;
		right: 12px;
		bottom: 14px;
		left: 12px;
	}

	ol {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		margin: 0;
		padding: 4px 2px;
		list-style: none;
		overflow-y: auto;
	}

	li {
		flex: none;
	}

	.empty {
		display: grid;
		place-items: center;
		opacity: 0.35;

		.material-icons {
			font-size: 36px;
		}
	}

	.thumb {
		display: block;
		width: 84px;
		height: 84px;
		padding: 0;
		border: 2px solid transparent;
		border-radius: 20px;
		overflow: hidden;
		background: var(--soft);
		cursor: pointer;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease;

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		&:hover {
			transform: translateX(3px);
		}

		&.shown {
			border-color: #ff66aa;
		}
	}

	@keyframes strip-in {
		from {
			opacity: 0;
			transform: translateX(-40px);
		}
	}

	@media (max-width: 1024px) {
		.strip {
			order: -1;
			width: auto;
			height: 112px;
		}

		ol {
			flex-direction: row;
			overflow-x: auto;
			overflow-y: hidden;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.strip {
			animation: none;
		}
	}
</style>
