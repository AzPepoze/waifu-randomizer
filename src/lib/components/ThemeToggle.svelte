<script>
	let { theme = $bindable("light") } = $props();

	function toggleTheme() {
		theme = theme === "light" ? "dark" : "light";
		
		if (typeof document !== 'undefined') {
			const html = document.documentElement;
			html.classList.remove("theme-dark");
			if (theme === "dark") {
				html.classList.add("theme-dark");
			}
		}
	}
</script>

<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
	{#if theme === "light"}
		<span class="material-icons">sunny</span>
	{:else}
		<span class="material-icons">dark_mode</span>
	{/if}
</button>

<style lang="scss">
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		cursor: pointer;
		color: var(--text-main);
		transition: all 0.2s ease;
		border: 1px solid var(--border-color);
		background: var(--secondary-bg);

		&:hover {
			background: var(--accent-color);
			color: white;
			transform: translateY(-1px);
		}

		&:active {
			transform: translateY(0);
		}

		.material-icons {
			font-size: 1.25rem;
		}
	}
</style>
