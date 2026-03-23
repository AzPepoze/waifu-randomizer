<script>
	import { onMount, untrack } from "svelte";
	import { fade, fly } from "svelte/transition";
	import ImageViewer from "$lib/components/ImageViewer.svelte";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";

	let category = $state("sfw");
	let selectedApi = $state("waifu.pics");
	let theme = $state("light");
	let isLoading = $state(false);
	let progress = $state(0);
	let image = $state("");
	let source = $state("");
	let metadata = $state(null);
	let errorMessage = $state("");
	let showAbout = $state(false);
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
				type: "nekos.best"
			}
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
				artistUrl: result.artists?.[0]?.pixiv || result.artists?.[0]?.twitter,
				tags: result.tags?.map(t => t.name),
				dimensions: `${result.width}x${result.height}`,
				source: result.source,
				type: "waifu.im"
			}
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
			source: result.source || `https://danbooru.donmai.us/posts/${result.id}`,
			metadata: {
				tags: result.tag_string?.split(' '),
				artist: result.tag_string_artist,
				dimensions: `${result.image_width}x${result.image_height}`,
				rating: result.rating,
				source: result.source,
				type: "danbooru"
			}
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
			source: result.source || `https://konachan.net/post/show/${result.id}`,
			metadata: {
				tags: result.tags?.split(' '),
				artist: result.author,
				dimensions: `${result.width}x${result.height}`,
				rating: result.rating,
				source: result.source,
				type: "konachan"
			}
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
			selectedApi = "waifu.pics";
		}
	});
</script>

<svelte:head>
	<title>Waifu Randomizer</title>

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Waifu Randomizer",
			"url": "https://waifu-randomizer.azpepoze.com/",
			"description": "A web application to browse random anime and waifu images from multiple sources.",
			"applicationCategory": "EntertainmentApplication",
			"operatingSystem": "Any",
			"author": {
				"@type": "Person",
				"name": "AzPepoze"
			},
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
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
			openAbout={() => (showAbout = true)}
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

	{#if showAbout}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="modal-overlay"
			onclick={() => (showAbout = false)}
			transition:fade={{ duration: 200 }}
		>
			<div
				class="about-modal glass"
				onclick={(e) => e.stopPropagation()}
				transition:fly={{ y: 40, duration: 400, opacity: 0 }}
			>
				<span class="material-icons modal-header-icon">info</span>
				<h2>About Waifu Randomizer</h2>
				<p>
					Discover high-quality anime artwork from multiple API
					sources.
				</p>
				<button class="close-btn" onclick={() => (showAbout = false)}
					>Got it!</button
				>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.app-layout {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		background-color: var(--primary-bg);
		overflow: hidden;
	}

	.content {
		flex: 1;
		display: flex;
		position: relative; /* Essential for absolute children */
		overflow: hidden;

		@media (max-width: 1024px) {
			flex-direction: column;
		}
	}

	.mobile-sidebar-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 180; /* Between ImageViewer and Sidebar */
		cursor: pointer;

		@media (min-width: 1025px) {
			display: none;
		}
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}

	.about-modal {
		max-width: 440px;
		width: 100%;
		padding: 40px;
		border-radius: 32px;
		text-align: center;
		position: relative;

		.modal-header-icon {
			font-size: 3rem;
			color: var(--accent-color);
			margin-bottom: 16px;
		}

		h2 {
			margin-top: 0;
			font-size: 1.75rem;
			color: var(--text-main);
		}
		p {
			line-height: 1.6;
			color: var(--text-muted);
			margin: 20px 0;
		}

		.close-btn {
			width: 100%;
			padding: 14px;
			background: var(--accent-color);
			color: white;
			border: none;
			border-radius: 12px;
			font-weight: 700;
			cursor: pointer;
			transition: transform 0.2s;
			&:hover {
				transform: scale(1.02);
			}
		}
	}

	.sidebar-toggle-btn {
		position: absolute;
		top: 20px;
		left: 20px;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--accent-color);
		color: white;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 150;
		transition: all 0.2s;

		@media (min-width: 1025px) {
			display: none;
		}

		&:hover {
			transform: scale(1.05);
			background: var(--text-main);
		}

		.material-icons {
			font-size: 1.75rem;
		}
	}
</style>
