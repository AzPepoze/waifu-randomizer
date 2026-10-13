<script lang="ts">
	import { onMount } from "svelte";
	import "./home.scss";
	import Backdrop from "#lib/components/home/Backdrop.svelte";
	import Cursor from "#lib/components/home/Cursor.svelte";
	import Hero from "#lib/components/home/Hero.svelte";
	import SourceLink from "#lib/components/home/SourceLink.svelte";
	import Wallpaper from "#lib/components/home/Wallpaper.svelte";
	import Works from "#lib/components/home/Works.svelte";
	import { createWallpaper } from "#lib/home/wallpaper.svelte.js";

	const wallpaper = createWallpaper();

	onMount(() => {
		const root = document.documentElement;
		root.classList.add("js-ready");
		wallpaper.change({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

		return () => root.classList.remove("js-ready");
	});
</script>

<svelte:head>
	<title>Waifu Randomizer | Discover Random Anime Art & Waifus</title>
	<meta
		name="description"
		content="Discover, explore, and enjoy random high-quality anime artwork from multiple API sources. The most beautiful waifu generator on the web with SFW and NSFW modes."
	/>
	<meta
		name="keywords"
		content="waifu randomizer, random anime art, anime character generator, waifu pics, anime discovery tool, nekos best, waifu im"
	/>
	<link rel="canonical" href="https://waifu-randomizer.azpepoze.com/" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://waifu-randomizer.azpepoze.com/" />
	<meta property="og:title" content="Waifu Randomizer | Discover Random Anime Art" />
	<meta
		property="og:description"
		content="The ultimate anime art explorer. Browse thousands of random waifus and anime illustrations from multiple APIs."
	/>
	<meta
		property="og:image"
		content="https://waifu-randomizer.azpepoze.com/web-app-manifest-512x512.png"
	/>

	<!-- Twitter -->
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content="https://waifu-randomizer.azpepoze.com/" />
	<meta property="twitter:title" content="Waifu Randomizer | Discover Random Anime Art" />
	<meta
		property="twitter:description"
		content="The ultimate anime art explorer. Browse thousands of random waifus and anime illustrations from multiple APIs."
	/>
	<meta
		property="twitter:image"
		content="https://waifu-randomizer.azpepoze.com/web-app-manifest-512x512.png"
	/>

	<!-- Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": "Waifu Randomizer",
			"url": "https://waifu-randomizer.azpepoze.com/",
			"potentialAction": {
				"@type": "SearchAction",
				"target": "https://waifu-randomizer.azpepoze.com/playground?q={search_term_string}",
				"query-input": "required name=search_term_string"
			}
		}
	</script>

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="home" class:is-refreshing={wallpaper.refreshing}>
	<Wallpaper layers={wallpaper.layers} onsettle={wallpaper.settle} />
	<Backdrop />

	<Hero refreshing={wallpaper.refreshing} onregenerate={wallpaper.change} />

	<h2 class="sr-only">Key Features of our Anime & Waifu Randomizer</h2>
	<Works />

	{#if wallpaper.current}
		<SourceLink href={wallpaper.current.source} />
	{/if}

	<Cursor />
</main>
