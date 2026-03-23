<script>
	let { category = $bindable(), isLoading = false } = $props();
</script>

<div class="section">
	<label for="filter-select">FILTER</label>
	<div class="capsule-bar">
		<button 
			class={category === 'sfw' ? 'active' : ''} 
			disabled={isLoading}
			onclick={() => category = 'sfw'}
		>
			SFW
		</button>
		<button 
			class={category === 'nsfw' ? 'active' : ''} 
			disabled={isLoading}
			onclick={() => category = 'nsfw'}
		>
			NSFW
		</button>
	</div>
</div>

<style lang="scss">
	.section {
		display: flex;
		flex-direction: column;
		gap: 12px;

		label {
			font-size: 0.7rem;
			font-weight: 800;
			letter-spacing: 0.1em;
			color: var(--text-muted);
			text-transform: uppercase;
		}
	}

	.capsule-bar {
		display: grid;
		grid-template-columns: 1fr 1fr;
		background: var(--secondary-bg);
		padding: 4px;
		border-radius: 16px;
		border: 1px solid var(--border-color);

		button {
			padding: 10px;
			border: none;
			background: transparent;
			color: var(--text-muted);
			font-weight: 700;
			font-size: 0.8rem;
			border-radius: 12px;
			cursor: pointer;
			transition: all 0.2s;

			&:hover:not(:disabled) {
				color: var(--text-main);
			}

			&.active {
				background: var(--accent-color);
				color: white;
				box-shadow: 0 4px 12px rgba(var(--accent-color), 0.2);
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}
	}
</style>
