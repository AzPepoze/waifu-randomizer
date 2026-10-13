<script lang="ts">
	import { fly } from "svelte/transition";
	import { motionDuration } from "#lib/motion";

	let { message = "" }: { message?: string } = $props();
</script>

{#if message}
	<div class="notice" role="status" transition:fly={{ y: 12, duration: motionDuration(200) }}>
		{message}
	</div>
{/if}

<style lang="scss">
	.notice {
		position: fixed;
		bottom: 110px;
		inset-inline: 0;
		z-index: 400;
		width: max-content;
		margin-inline: auto;
		padding: 10px 18px;
		border-radius: 14px;
		border: 1px solid var(--border-color);
		background: var(--primary-bg);
		color: var(--text-main);
		font-size: 0.85rem;
		font-weight: 700;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
		pointer-events: none;
	}
</style>
