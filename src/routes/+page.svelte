<script>
	import { onMount } from "svelte";
	import WaifuViewer from "$lib/components/WaifuViewer.svelte";

	let category = $state("sfw");
	let selectedApi = $state("waifu.pics");
	let activeBg = $state(1);
	let activeImage = $state(1);
	let isLoading = $state(false);
	let isFirstLoad = $state(true);
	let progress = $state(0);
	let currentImageUrl = $state("");
	let errorMessage = $state("");

	// Image Sources
	let bgImage1Url = $state("");
	let bgImage2Url = $state("");
	let image1Url = $state("");
	let image2Url = $state("");

	// Image Opacities
	let bgImage1Opacity = $state(0);
	let bgImage2Opacity = $state(0);
	let image1Opacity = $state(0);
	let image2Opacity = $state(0);
	let image1Dimmed = $state(false);
	let image2Dimmed = $state(false);

	// Container
	let imageContainerHeight = $state("auto");
	let imageContainer = $state(null);

	// Modal State
	let modalOpen = $state(false);
	let scale = $state(1);
	let translateX = $state(0);
	let translateY = $state(0);
	let isDragging = $state(false);
	let startDragX = 0;
	let startDragY = 0;

	let progressInterval;

	// API Support Logic
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

	function updateApiButtonStates() {
		if (!isApiSupported(selectedApi, category)) {
			// Fallback if current API doesn't support new category
			for (const api in apiSupport) {
				if (apiSupport[api][category]) {
					selectedApi = api;
					console.warn(
						`Switched to ${api} because the previously selected API does not support ${category}.`
					);
					break;
				}
			}
		}
	}

	async function fetchImageFromNekosBest(cat) {
		if (cat === "nsfw") {
			throw new Error("Nekos.best API does not support NSFW images.");
		}
		const response = await fetch("https://nekos.best/api/v2/waifu");
		if (!response.ok) throw new Error(`Nekos.best API error: ${response.status}`);
		const data = await response.json();
		if (!data.results || data.results.length === 0) throw new Error("No images found from Nekos.best");
		return data.results[0].url;
	}

	async function fetchImageFromWaifuIm(cat) {
		const isNsfw = cat === "nsfw";
		const tags = isNsfw ? "waifu" : "waifu";
		const url = `https://api.waifu.im/search?included_tags=${tags}&is_nsfw=${isNsfw}`;
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Waifu.im API error: ${response.status}`);
		const data = await response.json();
		if (!data.images || data.images.length === 0) throw new Error("No images found from Waifu.im");
		return data.images[0].url;
	}

	async function fetchImageFromDanbooruAnime(cat) {
		const endpoint =
			cat === "sfw"
				? `https://danbooru.donmai.us/posts.json?limit=1&random=true&tags=rating:safe`
				: `https://danbooru.donmai.us/posts.json?limit=1&random=true&tags=is%3Ansfw`;

		const response = await fetch(endpoint);
		if (!response.ok) throw new Error(`Danbooru Anime API error: ${response.status}`);
		const data = await response.json();
		if (!data || data.length === 0 || !data[0].file_url) {
			throw new Error("No image found from Danbooru Anime API");
		}
		return data[0].file_url;
	}

	async function fetchImageFromKonachan(cat) {
		const tags = cat === "sfw" ? "rating:s" : "rating:e";
		const url = `https://konachan.net/post.json?limit=1&tags=order:random+${tags}`;
		const proxiedUrl = wrapWithProxy(url);
		const response = await fetch(proxiedUrl);
		if (!response.ok) throw new Error(`Konachan API error: ${response.status}`);
		const data = await response.json();
		if (!data || data.length === 0 || !data[0].sample_url) {
			throw new Error("No image found from Konachan API");
		}
		return data[0].sample_url;
	}

	async function fetchWaifuImage() {
		if (isLoading) return;
		isLoading = true;
		errorMessage = "";
		progress = 0;

		// Dim old image
		if (!isFirstLoad) {
			if (activeImage === 1) image1Dimmed = true;
			else image2Dimmed = true;
		}

		// Progress Simulation
		progressInterval = setInterval(() => {
			progress += Math.random() * 5;
			if (progress >= 90) {
				progress = 90;
				clearInterval(progressInterval);
			}
		}, 100);

		try {
			const timeout = new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Request timeout")), 10000)
			);
			let imageUrl;

			if (selectedApi === "waifu.pics") {
				const response = await Promise.race([fetch(`https://api.waifu.pics/${category}/waifu`), timeout]);
				if (!response.ok) throw new Error(`Waifu.pics API error: ${response.status}`);
				const data = await response.json();
				imageUrl = data.url;
			} else if (selectedApi === "waifu.im") {
				imageUrl = await Promise.race([fetchImageFromWaifuIm(category), timeout]);
			} else if (selectedApi === "nekos.best") {
				imageUrl = await Promise.race([fetchImageFromNekosBest(category), timeout]);
			} else if (selectedApi === "danbooru.anime") {
				imageUrl = await Promise.race([fetchImageFromDanbooruAnime(category), timeout]);
			} else if (selectedApi === "konachan") {
				imageUrl = await Promise.race([fetchImageFromKonachan(category), timeout]);
			} else {
				throw new Error("Invalid API selected.");
			}

			currentImageUrl = imageUrl;

			// Preload
			const img = new Image();
			img.src = currentImageUrl;

			img.onload = () => {
				if (progressInterval) clearInterval(progressInterval);
				progress = 100;

				// Determine target image element
				const nextActiveImage = activeImage === 1 ? 2 : 1;

				if (nextActiveImage === 1) {
					image1Url = img.src;
				} else {
					image2Url = img.src;
				}

				// Wait for Svelte to update DOM and image to load in the element (though it's cached)
				// We'll use the 'onload' handler on the img tag in template to trigger finalization
			};

			img.onerror = () => {
				handleError("Failed to load image.");
			};
		} catch (error) {
			console.error("Error:", error);
			handleError(`Error: ${error.message}`);
		}
	}

	function onImageLoad(e) {
		// e.target is the img element in the DOM
		updateImageContainerHeight(e.target);

		// Undim old
		image1Dimmed = false;
		image2Dimmed = false;

		// Switch
		if (activeImage === 1) {
			image1Opacity = 0;
			image2Opacity = 1;
			activeImage = 2;
		} else {
			image2Opacity = 0;
			image1Opacity = 1;
			activeImage = 1;
		}

		if (isFirstLoad) {
			isFirstLoad = false;
		}

		updateBgAndFinalize(e.target.src);
	}

	function onImageError(e) {
		const src = e.target.getAttribute("src");
		if (!src || src === "") return;
		handleError("Failed to display image.");
	}

	function updateBgAndFinalize(newSrc) {
		if (activeBg === 1) {
			bgImage2Url = newSrc;
			// Transition happens via opacity in CSS
			// But we need to toggle opacities.
			// Logic: activeBg is 1. We want to switch to 2.
			// So we set bgImage2Url, then fade 2 in and 1 out.
			setTimeout(() => {
				// Small delay to ensure src is set
				bgImage2Opacity = 1;
				bgImage1Opacity = 0;
				activeBg = 2;
			}, 50);
		} else {
			bgImage1Url = newSrc;
			setTimeout(() => {
				bgImage1Opacity = 1;
				bgImage2Opacity = 0;
				activeBg = 1;
			}, 50);
		}

		setTimeout(() => {
			isLoading = false;
		}, 500);
	}

	function handleError(msg) {
		if (progressInterval) clearInterval(progressInterval);
		isLoading = false;
		errorMessage = msg;
		imageContainerHeight = "auto";
	}

	function updateImageContainerHeight(imgElement) {
		const containerWidth = imageContainer.clientWidth;
		// More space for the image in full-page mode
		const containerMaxHeight = window.innerHeight - 220;

		const imgNaturalWidth = imgElement.naturalWidth;
		const imgNaturalHeight = imgElement.naturalHeight;

		if (imgNaturalWidth === 0 || imgNaturalHeight === 0) {
			imageContainerHeight = `auto`;
			return;
		}

		const imgAspectRatio = imgNaturalWidth / imgNaturalHeight;
		let finalWidth = containerWidth;
		let finalHeight = containerWidth / imgAspectRatio;

		if (!isNaN(containerMaxHeight) && finalHeight > containerMaxHeight) {
			finalHeight = containerMaxHeight;
			finalWidth = containerMaxHeight * imgAspectRatio;
		}
		if (finalWidth > containerWidth) {
			finalWidth = containerWidth;
			finalHeight = containerWidth / imgAspectRatio;
		}

		imageContainerHeight = `${finalHeight}px`;
	}

	function handleCategoryChange(newCategory) {
		if (isLoading || category === newCategory) return;
		category = newCategory;
		updateApiButtonStates();
		fetchWaifuImage();
	}

	function handleApiChange(newApi) {
		if (isLoading || selectedApi === newApi) return;
		selectedApi = newApi;
		fetchWaifuImage();
	}

	// Modal Logic
	function openModal() {
		if (isLoading || !currentImageUrl) return;
		modalOpen = true;
		scale = 1;
		translateX = 0;
		translateY = 0;
	}

	function closeModal() {
		modalOpen = false;
	}

	function onModalWheel(e) {
		e.preventDefault();
		const scaleAmount = 0.1;
		if (e.deltaY < 0) {
			scale += scaleAmount;
		} else {
			scale -= scaleAmount;
		}
		scale = Math.min(Math.max(0.5, scale), 5);
	}

	function onModalMouseDown(e) {
		e.preventDefault();
		isDragging = true;
		startDragX = e.clientX - translateX;
		startDragY = e.clientY - translateY;
	}

	function onModalMouseMove(e) {
		if (!isDragging) return;
		e.preventDefault();
		translateX = e.clientX - startDragX;
		translateY = e.clientY - startDragY;
	}

	function onModalMouseUp() {
		isDragging = false;
	}

	onMount(() => {
		updateApiButtonStates();
		fetchWaifuImage();

		window.addEventListener("mouseup", onModalMouseUp);
		window.addEventListener("mousemove", onModalMouseMove);

		const handleResize = () => {
			// Trigger re-calc of height on window resize
			const activeImg =
				activeImage === 1 ? document.getElementById("image-1") : document.getElementById("image-2");
			if (activeImg && activeImg.complete) {
				updateImageContainerHeight(activeImg);
			}
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("mouseup", onModalMouseUp);
			window.removeEventListener("mousemove", onModalMouseMove);
			window.removeEventListener("resize", handleResize);
		};
	});
</script>

<svelte:head>
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

<div id="main-content">
	<div class="random-zone">
		<h1>Waifu Randomizer</h1>
		<WaifuViewer
			{bgImage1Url}
			{bgImage2Url}
			{bgImage1Opacity}
			{bgImage2Opacity}
			{imageContainerHeight}
			{isLoading}
			{progress}
			{errorMessage}
			{image1Url}
			{image2Url}
			{image1Opacity}
			{image2Opacity}
			{image1Dimmed}
			{image2Dimmed}
			{activeImage}
			{modalOpen}
			{currentImageUrl}
			{scale}
			{translateX}
			{translateY}
			{isDragging}
			onOpenModal={openModal}
			onCloseModal={closeModal}
			{onImageLoad}
			{onImageError}
			{onModalWheel}
			{onModalMouseDown}
			{onModalMouseUp}
			{onModalMouseMove}
			bind:imageContainerEl={imageContainer}
		/>

		<div id="controls">
			<div id="api-selector">
				<button
					class="control-button category-button {selectedApi === 'waifu.pics' ? 'active' : ''}"
					disabled={!isApiSupported("waifu.pics", category) || isLoading}
					onclick={() => handleApiChange("waifu.pics")}>Waifu.pics</button
				>
				<button
					class="control-button category-button {selectedApi === 'waifu.im' ? 'active' : ''}"
					disabled={!isApiSupported("waifu.im", category) || isLoading}
					onclick={() => handleApiChange("waifu.im")}>Waifu.im</button
				>
				<button
					class="control-button category-button {selectedApi === 'nekos.best' ? 'active' : ''}"
					disabled={!isApiSupported("nekos.best", category) || isLoading}
					onclick={() => handleApiChange("nekos.best")}>Nekos.best</button
				>
				<button
					class="control-button category-button {selectedApi === 'danbooru.anime' ? 'active' : ''}"
					disabled={!isApiSupported("danbooru.anime", category) || isLoading}
					onclick={() => handleApiChange("danbooru.anime")}>Danbooru Anime</button
				>
				<button
					class="control-button category-button {selectedApi === 'konachan' ? 'active' : ''}"
					disabled={!isApiSupported("konachan", category) || isLoading}
					onclick={() => handleApiChange("konachan")}>Konachan</button
				>
			</div>
			<div id="category-selector">
				<button
					class="control-button category-button {category === 'sfw' ? 'active' : ''}"
					disabled={isLoading}
					onclick={() => handleCategoryChange("sfw")}>SFW</button
				>
				<button
					class="control-button category-button {category === 'nsfw' ? 'active' : ''}"
					disabled={isLoading}
					onclick={() => handleCategoryChange("nsfw")}>NSFW</button
				>
			</div>
			<button id="randomize-button" class="control-button" disabled={isLoading} onclick={fetchWaifuImage}
				>Random</button
			>
		</div>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="scroll-hint" onclick={() => document.getElementById("about-section").scrollIntoView()}>
			Scroll down to learn more
			<br />
			↓
		</div>
	</div>

	<section id="about-section">
		<h2>About This Project</h2>
		<p>
			<strong>Waifu Randomizer</strong> is a simple yet elegant web application designed for anime enthusiasts.
			It allows users to discover and browse random high-quality anime and waifu images from various popular API
			sources.
		</p>

		<p>
			Whether you're looking for a new wallpaper or just want to see some beautiful artwork, Waifu Randomizer
			provides a seamless experience with features like:
		</p>
		<ul>
			<li>Multiple API support (Waifu.pics, Waifu.im, Nekos.best, Danbooru, Konachan).</li>
			<li>SFW and NSFW content filtering.</li>
			<li>Interactive full-screen viewer with zoom and pan capabilities.</li>
			<li>Dynamic blurred background that adapts to the current image.</li>
		</ul>

		<p>
			Built with <strong>SvelteKit</strong>, this project focuses on performance and a clean user interface.
			All images are provided by the respective APIs and are subject to their terms and conditions.
		</p>

		<p style="margin-top: 30px; text-align: center; font-size: 0.9em; opacity: 0.6;">
			Created with ❤️ by AzPepoze
		</p>
	</section>
</div>

<style>
	#main-content {
		width: 100%;
		max-width: 1000px;
		text-align: center;
		z-index: 1;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.random-zone {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20px 0;
		box-sizing: border-box;
		position: relative;
	}

	h1 {
		margin-top: 0;
		margin-bottom: 20px;
		font-size: clamp(1.5em, 5vw, 2.5em);
		letter-spacing: 2px;
		flex-shrink: 0;
	}

	#controls {
		display: flex;
		flex-direction: column;
		gap: 15px;
		flex-shrink: 0;
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
	}

	.control-button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	#api-selector {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	#category-selector {
		display: flex;
		gap: 10px;
	}

	.category-button {
		flex-grow: 1;
		background-color: transparent;
		color: var(--text-color);
		border: 2px solid var(--text-color);
		padding: 8px 15px;
		font-size: 0.9em;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.category-button.active {
		background-color: var(--button-active-bg-color);
		color: var(--button-active-text-color);
	}

	#randomize-button {
		background-color: var(--button-active-bg-color);
		color: var(--button-active-text-color);
		border: none;
		padding: 12px 30px;
		font-size: 1.1em;
		font-weight: bold;
		border-radius: 10px;
		cursor: pointer;
		transition: transform 0.1s active;
	}

	#randomize-button:active {
		transform: scale(0.98);
	}

	#about-section {
		margin: 100px auto 50px auto;
		padding: 20px;
		text-align: left;
		line-height: 1.6;
		max-width: 700px;
		width: 100%;
		box-sizing: border-box;
	}

	#about-section h2 {
		text-align: center;
		margin-top: 0;
		margin-bottom: 20px;
		font-size: 1.8em;
	}

	#about-section p {
		margin-bottom: 15px;
		color: rgba(255, 255, 255, 0.8);
	}

	#about-section ul {
		padding-left: 20px;
		color: rgba(255, 255, 255, 0.8);
	}

	#about-section li {
		margin-bottom: 8px;
	}

	.scroll-hint {
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.8em;
		color: rgba(255, 255, 255, 0.5);
		animation: bounce 2s infinite;
		cursor: pointer;
		text-align: center;
		z-index: 2;
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		40% {
			transform: translateX(-50%) translateY(-10px);
		}
		60% {
			transform: translateX(-50%) translateY(-5px);
		}
	}
</style>
