<script>
	import { fade } from "svelte/transition";
	let { isLoading = false, progress = 0 } = $props();
</script>

{#if isLoading}
	<div class="loading-overlay" transition:fade={{ duration: 300 }}>
		<div class="loader-content">
			<div class="spinner"></div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress}%"></div>
			</div>
			<p>Loading Art...</p>
		</div>
	</div>
{/if}

<style lang="scss">
	.loading-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		background: var(--primary-bg);
		animation: fadeIn 0.3s ease;
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

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--border-color);
		border-top-color: var(--accent-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.progress-bar {
		width: 200px;
		height: 6px;
		background: var(--border-color);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--accent-color);
		transition: width 0.1s linear;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
