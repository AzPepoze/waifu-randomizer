<script>
	let { active = false, image = "", rect = { top: 0, left: 0, width: 100, height: 100 } } = $props();
</script>

{#if active && image}
	<div class="zoom-locator glass">
		<img src={image} alt="Mini-map" />
		<div 
			class="viewport-box" 
			style="
				top: {rect.top}%; 
				left: {rect.left}%; 
				width: {rect.width}%; 
				height: {rect.height}%;
			"
		></div>
	</div>
{/if}

<style lang="scss">
	.zoom-locator {
		position: absolute;
		bottom: 110px;
		right: 380px; /* Shifted left to clear the floating sidebar */
		width: 140px;
		aspect-ratio: auto;
		border-radius: 16px;
		overflow: hidden;
		z-index: 40;
		pointer-events: none;
		background: var(--secondary-bg);
		border: 2px solid var(--border-color);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
		animation: slideIn 0.3s ease;

		@media (max-width: 1024px) {
			right: auto;
			left: 20px;
			bottom: 120px; /* Slightly higher to clear mobile toolbar */
			width: 120px; /* Bit smaller on mobile */
		}

		img {
			width: 100%;
			height: auto;
			display: block;
			opacity: 0.7;
		}

		.viewport-box {
			position: absolute;
			border: 2px solid var(--accent-color);
			background: rgba(var(--accent-color), 0.1);
			box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);
		}
	}

	@keyframes slideIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
