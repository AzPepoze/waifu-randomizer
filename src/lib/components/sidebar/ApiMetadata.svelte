<script>
	import { slide, fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	let { metadata = null, selectedApi = "" } = $props();

	function formatTag(tag) {
		if (!tag) return "";
		return tag.replace(/_/g, ' ');
	}
</script>

{#if metadata && Object.keys(metadata).length > 0}
	<div 
		class="metadata-section"
		transition:slide={{ duration: 400, easing: quintOut }}
	>
		<span class="section-title">IMAGE DETAILS</span>
		
		<div class="metadata-grid">
			{#if metadata.artist || metadata.author}
				<div class="metadata-item">
					<span class="material-icons">person</span>
					<div class="details">
						<span class="label">Artist</span>
						<span class="value">
							{#if metadata.artistUrl}
								<a href={metadata.artistUrl} target="_blank" rel="noopener noreferrer">{metadata.artist || metadata.author}</a>
							{:else}
								{metadata.artist || metadata.author}
							{/if}
						</span>
					</div>
				</div>
			{/if}

			{#if metadata.source}
				<div class="metadata-item">
					<span class="material-icons">link</span>
					<div class="details">
						<span class="label">Original Source</span>
						<span class="value">
							<a href={metadata.source} target="_blank" rel="noopener noreferrer">View Original Art</a>
						</span>
					</div>
				</div>
			{/if}

			{#if metadata.dimensions}
				<div class="metadata-item">
					<span class="material-icons">aspect_ratio</span>
					<div class="details">
						<span class="label">Resolution</span>
						<span class="value">{metadata.dimensions}</span>
					</div>
				</div>
			{/if}

			{#if metadata.rating}
				<div class="metadata-item">
					<span class="material-icons">info</span>
					<div class="details">
						<span class="label">Rating</span>
						<span class="value rating-{metadata.rating}">{metadata.rating.toUpperCase()}</span>
					</div>
				</div>
			{/if}
		</div>

		{#if metadata.tags && metadata.tags.length > 0}
			<div class="tags-container">
				<span class="label">Tags</span>
				<div class="tags-list custom-scrollbar">
					{#each metadata.tags.slice(0, 15) as tag}
						<span class="tag">{formatTag(tag)}</span>
					{/each}
					{#if metadata.tags.length > 15}
						<span class="tag more">+{metadata.tags.length - 15} more</span>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.metadata-section {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 20px;
		background: rgba(var(--accent-color-rgb), 0.05);
		border: 1px solid var(--border-color);
		border-radius: 20px;

		.section-title {
			font-size: 0.7rem;
			font-weight: 800;
			letter-spacing: 0.1em;
			color: var(--text-muted);
			text-transform: uppercase;
		}
	}

	.metadata-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	.metadata-item {
		display: flex;
		align-items: center;
		gap: 12px;

		.material-icons {
			font-size: 1.2rem;
			color: var(--accent-color);
			opacity: 0.8;
		}

		.details {
			display: flex;
			flex-direction: column;

			.label {
				font-size: 0.65rem;
				color: var(--text-muted);
				font-weight: 600;
			}

			.value {
				font-size: 0.85rem;
				font-weight: 700;
				color: var(--text-main);

				a {
					color: var(--accent-color);
					text-decoration: none;
					&:hover { text-decoration: underline; }
				}

				&.rating-s { color: #4caf50; }
				&.rating-q { color: #ff9800; }
				&.rating-e { color: #f44336; }
			}
		}
	}

	.tags-container {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.label {
			font-size: 0.65rem;
			color: var(--text-muted);
			font-weight: 600;
		}
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		max-height: 100px;
		overflow-y: auto;
		padding-right: 4px;

		&::-webkit-scrollbar {
			width: 2px;
		}
	}

	.tag {
		padding: 4px 10px;
		background: var(--secondary-bg);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		white-space: nowrap;

		&.more {
			background: transparent;
			border: none;
			color: var(--accent-color);
		}
	}
</style>
