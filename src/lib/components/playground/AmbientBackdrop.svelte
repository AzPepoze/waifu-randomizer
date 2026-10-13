<script lang="ts">
	import { fade } from "svelte/transition";
	import { motionDuration } from "#lib/motion";

	let { image }: { image: string } = $props();
</script>

{#if image}
	{#key image}
		<img
			class="ambient"
			src={image}
			alt=""
			aria-hidden="true"
			transition:fade={{ duration: motionDuration(600) }}
		/>
	{/key}
{/if}
<div class="veil" aria-hidden="true"></div>

<style lang="scss">
	.ambient {
		position: absolute;
		inset: -60px;
		width: calc(100% + 120px);
		height: calc(100% + 120px);
		object-fit: cover;
		filter: blur(56px) saturate(1.2);
		opacity: 0.55;
	}

	.veil {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 30% 20%, var(--veil-from), var(--veil-to));
	}
</style>
