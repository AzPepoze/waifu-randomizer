<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { motionDuration } from "#lib/motion";
	import type { Playground } from "#lib/playground/session.svelte";
	import { apiOptions, isApiSupported } from "#lib/playground/sources";

	let { playground }: { playground: Playground } = $props();
</script>

<ul class="sources" role="listbox" aria-label="Image source">
	{#each apiOptions as option, index (option.id)}
		{@const available = isApiSupported(option.id, playground.category)}
		{@const active = playground.api === option.id}
		<li
			role="option"
			aria-selected={active}
			in:fade={{ delay: index * 40, duration: motionDuration(220) }}
		>
			<button
				class="item"
				class:active
				class:off={!available}
				disabled={!available}
				onclick={() => (playground.api = option.id)}
			>
				<span class="material-icons icon">{option.icon}</span>
				<span class="text">
					<span class="name">{option.name}</span>
					<span class="desc">{option.description}</span>
				</span>
				{#if active}
					<span
						class="material-icons check"
						in:scale={{ start: 0.4, duration: motionDuration(220) }}
						out:scale={{ start: 0.4, duration: motionDuration(160) }}
					>
						check_circle
					</span>
				{/if}
				{#if !available}
					<span class="badge" transition:fade={{ duration: motionDuration(160) }}>
						Unsupported for {playground.category.toUpperCase()}
					</span>
				{/if}
			</button>
		</li>
	{/each}
</ul>

<style lang="scss">
	.sources {
		display: grid;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.item {
		position: relative;
		display: flex;
		width: 100%;
		align-items: center;
		gap: 12px;
		padding: 10px 18px 10px 12px;
		border: 1px solid var(--soft-line);
		border-radius: 999px;
		background: var(--soft);
		color: var(--text-main);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;

		&:hover:not(:disabled) {
			background: var(--soft-strong);
		}

		&.active {
			border-color: #ff66aa;
			background: rgba(255, 102, 170, 0.14);
		}

		&.off {
			opacity: 0.4;
			cursor: default;
		}

		.icon {
			display: grid;
			place-items: center;
			width: 34px;
			height: 34px;
			border-radius: 50%;
			background: var(--soft-strong);
			color: var(--text-muted);
			font-size: 18px;
			transition: color 0.2s ease;
		}

		&.active .icon,
		&:hover:not(:disabled) .icon {
			color: #ff66aa;
		}

		.text {
			display: flex;
			flex: 1;
			flex-direction: column;
			min-width: 0;
		}

		.name {
			font-weight: 700;
			font-size: 0.9rem;
		}

		.desc {
			font-size: 0.72rem;
			opacity: 0.6;
		}

		.check {
			color: #ff66aa;
		}

		.badge {
			position: absolute;
			right: 16px;
			bottom: 4px;
			font-size: 0.6rem;
			font-weight: 700;
			color: #ff6b6b;
		}
	}
</style>
