<script lang="ts" generics="T extends string | number">
	interface Option {
		value: T;
		label: string;
	}

	let {
		options = [],
		value = $bindable(),
		disabled = false,
		label = "",
	}: { options?: Option[]; value: T; disabled?: boolean; label?: string } = $props();

	const activeIndex = $derived(
		Math.max(
			0,
			options.findIndex((option) => option.value === value),
		),
	);
</script>

<div
	class="segmented"
	role="group"
	aria-label={label}
	style="--count: {options.length}; --active: {activeIndex}"
>
	<span class="pill" aria-hidden="true"></span>
	{#each options as option (option.value)}
		<button
			class:active={value === option.value}
			{disabled}
			aria-pressed={value === option.value}
			onclick={() => (value = option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style lang="scss">
	.segmented {
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--count), 1fr);
		padding: 4px;
		border: 1px solid var(--border-color);
		border-radius: 999px;
		background: var(--secondary-bg);
	}

	.pill {
		position: absolute;
		top: 4px;
		bottom: 4px;
		left: 4px;
		width: calc((100% - 8px) / var(--count));
		border-radius: 999px;
		background: var(--accent-color);
		box-shadow: 0 4px 12px rgba(255, 102, 170, 0.25);
		transform: translateX(calc(var(--active) * 100%));
		transition: transform 450ms cubic-bezier(0.34, 1.4, 0.5, 1);
	}

	button {
		position: relative;
		z-index: 1;
		padding: 10px 6px;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: var(--text-muted);
		font-weight: 700;
		font-size: 0.8rem;
		cursor: pointer;
		transition: color 0.25s ease;

		&:hover:not(:disabled) {
			color: var(--text-main);
		}

		&.active {
			color: #ffffff;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:focus-visible {
			outline: 2px solid var(--accent-color);
			outline-offset: 2px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pill,
		button {
			transition: none;
		}
	}
</style>
