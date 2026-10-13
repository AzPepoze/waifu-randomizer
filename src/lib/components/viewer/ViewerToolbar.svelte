<script lang="ts">
	import { tooltip } from "#lib/tooltip";
	import type { ViewerInstance } from "#lib/viewer";

	interface ToolbarAction {
		id: string;
		icon: string;
		tip: string;
		run: () => void;
	}

	let { viewer = null }: { viewer: ViewerInstance | null } = $props();

	const actions: ToolbarAction[] = [
		{ id: "zoom-in", icon: "zoom_in", tip: "Zoom in", run: () => viewer?.zoom(0.1) },
		{ id: "zoom-out", icon: "zoom_out", tip: "Zoom out", run: () => viewer?.zoom(-0.1) },
		{ id: "one-to-one", icon: "exposure_plus_1", tip: "Actual size", run: () => viewer?.zoomTo(1) },
		{ id: "reset", icon: "restart_alt", tip: "Reset", run: () => viewer?.reset() },
		{ id: "rotate-left", icon: "rotate_left", tip: "Rotate left", run: () => viewer?.rotate(-90) },
		{
			id: "rotate-right",
			icon: "rotate_right",
			tip: "Rotate right",
			run: () => viewer?.rotate(90),
		},
		{
			id: "flip-horizontal",
			icon: "swap_horiz",
			tip: "Flip horizontal",
			run: () => viewer?.scaleX(-viewer.imageData.scaleX || -1),
		},
		{
			id: "flip-vertical",
			icon: "swap_vert",
			tip: "Flip vertical",
			run: () => viewer?.scaleY(-viewer.imageData.scaleY || -1),
		},
	];
</script>

<div class="toolbar-container">
	<div class="toolbar glass">
		{#each actions as action (action.id)}
			<button
				class="toolbar-btn"
				aria-label={action.tip}
				use:tooltip={action.tip}
				onclick={action.run}
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
		z-index: 100;
		transform: translateX(-50%);
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px;
		border-radius: 20px;
	}

	.toolbar-btn {
		display: flex;
		width: 42px;
		height: 42px;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 14px;
		background: var(--soft);
		color: var(--text-main);
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			background: var(--accent-color);
			color: #ffffff;
			transform: translateY(-2px);
		}

		&:active {
			transform: translateY(0);
		}

		.material-icons {
			font-size: 20px;
		}
	}

	@media (max-width: 600px) {
		.toolbar-container {
			width: max-content;
			max-width: calc(100% - 16px);
		}

		.toolbar {
			flex-wrap: wrap;
			justify-content: center;
			gap: 4px;
			padding: 6px;
		}

		.toolbar-btn {
			width: 34px;
			height: 34px;
		}
	}
</style>
