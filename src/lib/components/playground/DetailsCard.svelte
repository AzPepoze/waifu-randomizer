<script lang="ts">
	import { fade, scale, slide } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { motionDuration } from "#lib/motion";
	import type { Playground } from "#lib/playground/session.svelte";

	let { playground }: { playground: Playground } = $props();

	const tags = $derived(playground.metadata?.tags?.slice(0, 24) ?? []);
</script>

{#if playground.infoOpen && playground.metadata}
	<section class="block details" transition:slide={{ duration: motionDuration(320) }}>
		<h2>Details</h2>

		<dl>
			{#if playground.metadata.artist || playground.metadata.author}
				<div transition:slide={{ duration: motionDuration(260) }}>
					<dt>Artist</dt>
					<dd>{playground.metadata.artist ?? playground.metadata.author}</dd>
				</div>
			{/if}
			{#if playground.metadata.dimensions}
				<div transition:slide={{ duration: motionDuration(260) }}>
					<dt>Size</dt>
					<dd>{playground.metadata.dimensions}</dd>
				</div>
			{/if}
			{#if playground.metadata.rating}
				<div transition:slide={{ duration: motionDuration(260) }}>
					<dt>Rating</dt>
					<dd>{playground.metadata.rating.toUpperCase()}</dd>
				</div>
			{/if}
		</dl>

		{#if tags.length}
			<ul class="tags" transition:slide={{ duration: motionDuration(260) }}>
				{#each tags as tag, index (index)}
					<li
						animate:flip={{ duration: motionDuration(260) }}
						in:scale={{ start: 0.6, delay: index * 22, duration: motionDuration(220) }}
						out:fade={{ duration: motionDuration(140) }}
					>
						{tag.replace(/_/g, " ")}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/if}

<style lang="scss">
	.block {
		display: flex;
		flex: none;
		flex-direction: column;
		gap: 14px;
		overflow: hidden;

		h2 {
			margin: 0;
			font-size: 0.72rem;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			opacity: 0.6;
		}
	}

	dl {
		display: grid;
		gap: 10px;
		margin: 0;

		> div {
			display: grid;
			overflow: hidden;
		}
	}

	dt {
		font-size: 0.72rem;
		opacity: 0.6;
	}

	dd {
		margin: 2px 0 0;
		font-weight: 600;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			padding: 4px 10px;
			border-radius: 999px;
			background: var(--soft);
			font-size: 0.72rem;
		}
	}
</style>
