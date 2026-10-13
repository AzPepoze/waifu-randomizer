<script lang="ts">
	import { onNavigate } from "$app/navigation";
	import "../app.scss";
	import "./transitions.scss";

	let { children } = $props();

	// Cross-fades between pages when the browser supports the View Transitions API
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{@render children()}
