<script>
	const { 
		variant = "primary", 
		href = "", 
		onclick, 
		disabled = false, 
		isLoading = false,
		children,
		class: className = "",
		accentGlow = false,
		id = ""
	} = $props();

	function handleMouseMove(e) {
		const target = e.currentTarget;
		const rect = target.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		target.style.setProperty("--x", `${x}px`);
		target.style.setProperty("--y", `${y}px`);
	}
</script>

{#if href}
	<a 
		{id}
		{href} 
		target="_blank" 
		rel="noopener noreferrer"
		class="btn {variant} {className}"
		class:accent-glow={accentGlow}
		onmousemove={handleMouseMove}
	>
		{@render children()}
	</a>
{:else}
	<button 
		{id}
		{disabled} 
		{onclick}
		class="btn {variant} {className}"
		class:accent-glow={accentGlow}
		class:loading={isLoading}
		onmousemove={handleMouseMove}
	>
		{@render children()}
	</button>
{/if}

<style lang="scss">
	.btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 14px;
		border-radius: 16px;
		font-size: 0.9rem;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		border: 1px solid transparent;
		position: relative;
		overflow: hidden;

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: radial-gradient(
				circle 80px at var(--x, 50%) var(--y, 50%),
				rgba(var(--accent-color-rgb), 0.2),
				transparent 100%
			);
			opacity: 0;
			transition: opacity 0.3s;
			pointer-events: none;
		}

		&:hover:not(:disabled)::before {
			opacity: 1;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:active:not(:disabled) {
			transform: translateY(0);
		}
	}

	.primary {
		background: var(--accent-color);
		color: white;
		border: none;
		font-weight: 800;
		box-shadow: 0 10px 15px -3px rgba(var(--accent-color-rgb), 0.3);

		&::before {
			background: radial-gradient(
				circle 100px at var(--x, 50%) var(--y, 50%),
				rgba(255, 255, 255, 0.4),
				transparent 100%
			);
		}

		&:hover:not(:disabled) {
			transform: translateY(-2px);
			box-shadow: 0 12px 20px -3px rgba(var(--accent-color-rgb), 0.4);
			filter: brightness(1.1);
		}
	}

	.secondary {
		background: var(--secondary-bg);
		color: var(--text-main);
		border: 1px solid var(--border-color);

		&:hover:not(:disabled) {
			background: var(--primary-bg);
			border-color: var(--text-muted);
			transform: translateY(-1px);
		}
	}

	.outline {
		background: transparent;
		border: 1px solid var(--border-color);
		color: var(--text-muted);

		&:hover:not(:disabled) {
			border-color: var(--accent-color);
			color: var(--accent-color);
		}
	}

	.accent-glow {
		&:hover:not(:disabled) {
			background: rgba(var(--accent-color-rgb), 0.1) !important;
			border-color: var(--accent-color) !important;
			color: var(--accent-color) !important;
			box-shadow: 0 8px 30px rgba(var(--accent-color-rgb), 0.2) !important;
		}

		&::before {
			background: radial-gradient(
				circle 100px at var(--x, 50%) var(--y, 50%),
				rgba(var(--accent-color-rgb), 0.4),
				transparent 100%
			) !important;
		}
	}
</style>
