<script>
	let { viewer = null } = $props();
	let hoveredTip = $state("");

	const actions = [
		{ id: "zoom-in", icon: "zoom_in", tip: "Zoom In", run: () => viewer?.zoom(0.1) },
		{ id: "zoom-out", icon: "zoom_out", tip: "Zoom Out", run: () => viewer?.zoom(-0.1) },
		{ id: "one-to-one", icon: "exposure_plus_1", tip: "Actual Size", run: () => viewer?.zoomTo(1) },
		{ id: "reset", icon: "restart_alt", tip: "Reset", run: () => viewer?.reset() },
		{ id: "rotate-left", icon: "rotate_left", tip: "Rotate Left", run: () => viewer?.rotate(-90) },
		{ id: "rotate-right", icon: "rotate_right", tip: "Rotate Right", run: () => viewer?.rotate(90) },
		{ id: "flip-horizontal", icon: "swap_horiz", tip: "Flip Horizontal", run: () => viewer?.scaleX(-viewer.imageData.scaleX || -1) },
		{ id: "flip-vertical", icon: "swap_vert", tip: "Flip Vertical", run: () => viewer?.scaleY(-viewer.imageData.scaleY || -1) },
	];
</script>

<div class="toolbar-container">
	{#if hoveredTip}
		<div class="tooltip glass">{hoveredTip}</div>
	{/if}

	<div class="toolbar glass">
		{#each actions as action}
			<button 
				class="toolbar-btn" 
				onclick={action.run}
				onmouseenter={() => hoveredTip = action.tip}
				onmouseleave={() => hoveredTip = ""}
				aria-label={action.tip}
			>
				<span class="material-icons">{action.icon}</span>
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.toolbar-container {
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		z-index: 100;
	}

	.tooltip {
		padding: 8px 16px;
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-main);
		white-space: nowrap;
		animation: fadeIn 0.2s ease;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px;
		border-radius: 20px;
		background: var(--secondary-bg);
		border: 1px solid var(--border-color);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.toolbar-btn {
		width: 42px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-main);
		border-radius: 14px;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			background: var(--accent-color);
			color: white;
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(var(--accent-color), 0.3);
		}

		&:active {
			transform: translateY(0);
		}

		.material-icons {
			font-size: 20px;
		}
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
