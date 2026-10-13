<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { motionDuration } from "#lib/motion";

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	const shortcuts: [string, string][] = [
		["Space", "Random image"],
		["← →", "Previous or next image"],
		["F", "Save or remove from saved"],
		["D", "Download the image"],
		["C", "Copy the image link"],
		["A", "Auto shuffle on or off"],
		["I", "Show or hide details"],
		["?", "Show this list"],
		["Esc", "Close panels"],
	];
</script>

{#if open}
	<button
		class="backdrop"
		aria-label="Close shortcuts"
		onclick={onclose}
		transition:fade={{ duration: motionDuration(180) }}
	></button>
	<div
		class="panel"
		role="dialog"
		aria-label="Keyboard shortcuts"
		transition:scale={{ start: 0.96, duration: motionDuration(220) }}
	>
		<h2>Keyboard shortcuts</h2>
		<dl>
			{#each shortcuts as [key, label] (key)}
				<div class="row">
					<dt><kbd>{key}</kbd></dt>
					<dd>{label}</dd>
				</div>
			{/each}
		</dl>
		<button class="close" onclick={onclose}>Close</button>
	</div>
{/if}

<style lang="scss">
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 500;
		border: none;
		background: rgba(5, 5, 8, 0.6);
		backdrop-filter: blur(6px);
		cursor: pointer;
	}

	.panel {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 501;
		width: min(420px, calc(100vw - 32px));
		padding: 28px;
		transform: translate(-50%, -50%);
		border-radius: 24px;
		background: var(--panel-solid);
		color: var(--text-main);
		border: 1px solid var(--glass-border);
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
		font-family: "Zen Kaku Gothic New", sans-serif;
	}

	h2 {
		margin: 0 0 16px;
		font-size: 1.25rem;
		font-weight: 700;
	}

	dl {
		display: grid;
		gap: 10px;
		margin: 0 0 20px;
	}

	.row {
		display: grid;
		grid-template-columns: 96px 1fr;
		align-items: center;
		gap: 12px;
	}

	dt {
		margin: 0;
	}

	dd {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.95rem;
	}

	kbd {
		display: inline-block;
		min-width: 40px;
		padding: 4px 10px;
		border-radius: 8px;
		border: 1px solid var(--soft-strong);
		background: var(--soft);
		font-family: inherit;
		font-size: 0.85rem;
		text-align: center;
	}

	.close {
		width: 100%;
		padding: 12px;
		border: none;
		border-radius: 14px;
		background: #ff66aa;
		color: #ffffff;
		font-weight: 700;
		cursor: pointer;
	}
</style>
