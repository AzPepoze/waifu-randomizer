<script>
	import { onMount, untrack } from "svelte";
	import "./playground.scss";
	import { fade, fly } from "svelte/transition";
	import ImageViewer from "$lib/components/ImageViewer.svelte";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";

	let category = $state("sfw");
	let selectedApi = $state("waifu.im");
	let theme = $state("light");
	let isLoading = $state(false);
	let progress = $state(0);
	let image = $state("");
	let source = $state("");
	let metadata = $state(null);
	let errorMessage = $state("");
	let sidebarHidden = $state(true);

	let progressInterval;

	const apiSupport = {
		"waifu.pics": { sfw: true, nsfw: true },
		"waifu.im": { sfw: true, nsfw: true },
		"nekos.best": { sfw: true, nsfw: false },
		"danbooru.anime": { sfw: true, nsfw: true },
		konachan: { sfw: true, nsfw: true },
	};

	function isApiSupported(api, cat) {
		return apiSupport[api] && apiSupport[api][cat];
	}

	function wrapWithProxy(url) {
		if (!url) return "";
		return `https://proxy.azpepoze.com/?url=${encodeURIComponent(url)}`;
	}

	async function fetchImageFromNekosBest() {
		const response = await fetch("https://nekos.best/api/v2/waifu");
		if (!response.ok)
			throw new Error(`Nekos.best API error: ${response.status}`);
		const data = await response.json();
		const result = data.results[0];
		return {
			url: result.url,
			source: result.source_url || result.url,
			metadata: {
				artist: result.artist_name,
				artistUrl: result.artist_href,
				source: result.source_url,
				type: "nekos.best",
			},
		};
	}

	async function fetchImageFromWaifuIm(cat) {
		const isNsfw = cat === "nsfw";
		const url = `https://api.waifu.im/images/?included_tags=waifu&is_nsfw=${isNsfw}`;
		const response = await fetch(url);
		if (!response.ok)
			throw new Error(`Waifu.im API error: ${response.status}`);
		const data = await response.json();
		const result = data.items[0];
		return {
			url: result.url,
			source: result.source || result.url,
			metadata: {
				artist: result.artists?.[0]?.name,
				artistUrl:
					result.artists?.[0]?.pixiv || result.artists?.[0]?.twitter,
				tags: result.tags?.map((t) => t.name),
				dimensions: `${result.width}x${result.height}`,
				source: result.source,
				type: "waifu.im",
			},
		};
	}

	async function fetchImageFromDanbooruAnime(cat) {
		const tags = cat === "sfw" ? "rating:safe" : "rating:explicit";
		const endpoint = `https://danbooru.donmai.us/posts.json?limit=1&random=true&tags=${tags}`;
		const response = await fetch(endpoint);
		if (!response.ok)
			throw new Error(`Danbooru API error: ${response.status}`);
		const data = await response.json();
		if (!data || data.length === 0 || !data[0].file_url)
			throw new Error("No image found");

		const result = data[0];
		return {
			url: result.file_url,
			source:
				result.source ||
				`https://danbooru.donmai.us/posts/${result.id}`,
			metadata: {
				tags: result.tag_string?.split(" "),
				artist: result.tag_string_artist,
				dimensions: `${result.image_width}x${result.image_height}`,
				rating: result.rating,
				source: result.source,
				type: "danbooru",
			},
		};
	}

	async function fetchImageFromKonachan(cat) {
		const tags = cat === "sfw" ? "rating:safe" : "rating:explicit";
		const url = `https://konachan.net/post.json?limit=1&tags=order:random+${tags}`;
		const response = await fetch(wrapWithProxy(url));
		if (!response.ok)
			throw new Error(`Konachan API error: ${response.status}`);
		const data = await response.json();
		const result = data[0];
		return {
			url: result.sample_url || result.file_url,
			source:
				result.source || `https://konachan.net/post/show/${result.id}`,
			metadata: {
				tags: result.tags?.split(" "),
				artist: result.author,
				dimensions: `${result.width}x${result.height}`,
				rating: result.rating,
				source: result.source,
				type: "konachan",
			},
		};
	}

	async function fetchImage() {
		if (isLoading) return;
		isLoading = true;
		errorMessage = "";
		progress = 0;

		progressInterval = setInterval(() => {
			progress += Math.random() * 10;
			if (progress >= 90) {
				progress = 90;
				clearInterval(progressInterval);
			}
		}, 100);

		try {
			let result;
			if (selectedApi === "waifu.pics") {
				const response = await fetch(
					`https://api.waifu.pics/${category}/waifu`,
				);
				const data = await response.json();
				result = { url: data.url, source: "", metadata: {} };
			} else if (selectedApi === "waifu.im") {
				result = await fetchImageFromWaifuIm(category);
			} else if (selectedApi === "nekos.best") {
				result = await fetchImageFromNekosBest();
			} else if (selectedApi === "danbooru.anime") {
				result = await fetchImageFromDanbooruAnime(category);
			} else if (selectedApi === "konachan") {
				result = await fetchImageFromKonachan(category);
			}

			const { url, source: imageSource, metadata: imgMetadata } = result;

			const img = new Image();
			img.src = url;
			img.onload = () => {
				clearInterval(progressInterval);
				progress = 100;
				image = url;
				source = imageSource;
				metadata = imgMetadata;
				setTimeout(() => (isLoading = false), 300);
			};
			img.onerror = () => {
				throw new Error("Failed to load image resource");
			};
		} catch (error) {
			console.error(error);
			errorMessage = error.message;
			isLoading = false;
			clearInterval(progressInterval);
		}
	}

	function handleKeydown(e) {
		if (e.code === "Space" && !isLoading) {
			e.preventDefault();
			fetchImage();
		}
	}

	onMount(() => {
		// PC/Desktop: Show sidebar by default
		if (window.innerWidth > 1024) {
			sidebarHidden = false;
		}

		fetchImage();
		window.addEventListener("keydown", handleKeydown);
		return () => window.removeEventListener("keydown", handleKeydown);
	});

	$effect(() => {
		if (!isApiSupported(selectedApi, category)) {
			selectedApi = "waifu.im";
		}
	});
</script>

<svelte:head>
	<title>Playground | Waifu Randomizer</title>

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Waifu Randomizer Playground",
			"url": "https://waifu-randomizer.azpepoze.com/playground",
			"description": "Interactive anime art explorer and waifu randomizer.",
			"applicationCategory": "EntertainmentApplication",
			"operatingSystem": "Any",
			"author": {
				"@type": "Person",
				"name": "AzPepoze"
			}
		}
	</script>
</svelte:head>

<div class="app-layout">
	<main class="content">
		{#if !sidebarHidden}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="mobile-sidebar-overlay"
				role="button"
				tabindex="0"
				onclick={() => (sidebarHidden = true)}
				transition:fade={{ duration: 200 }}
			></div>
		{/if}

		<ImageViewer {image} {isLoading} {progress} {errorMessage} />

		<Sidebar
			bind:selectedApi
			bind:category
			bind:theme
			{source}
			{image}
			{metadata}
			githubUrl="https://github.com/AzPepoze/waifu-randomizer"
			{sidebarHidden}
			toggleSidebar={() => (sidebarHidden = !sidebarHidden)}
			{isLoading}
			{fetchImage}
			{isApiSupported}
		/>

		{#if sidebarHidden}
			<button
				class="sidebar-toggle-btn"
				onclick={() => (sidebarHidden = false)}
				transition:fade
			>
				<span class="material-icons">menu</span>
			</button>
		{/if}
	</main>
</div>