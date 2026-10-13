<script lang="ts">
	let { href }: { href: string } = $props();
</script>

<a class="source-link" {href} target="_blank" rel="noopener">View source</a>

<style lang="scss">
	.source-link {
		position: fixed;
		right: clamp(1.25rem, 3vw, 2.5rem);
		bottom: clamp(1.25rem, 3vw, 2.5rem);
		z-index: 3;
		padding: 0.7rem 1.2rem;
		border: 1px solid var(--white);
		border-radius: 999px;
		background: var(--glass);
		color: var(--white);
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		transition:
			background-color 0.4s ease,
			color 0.4s ease;

		&:hover {
			background: var(--white);
			color: var(--night);
		}
	}
</style>
