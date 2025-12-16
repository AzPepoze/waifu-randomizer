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
	};

	function isApiSupported(api, cat) {
		return apiSupport[api] && apiSupport[api][cat];
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
			} else {
				throw new Error("Invalid API selected.");
			}

			currentImageUrl = imageUrl;

			// Preload
			const img = new Image();
			img.src = imageUrl;

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
        const src = e.target.getAttribute('src');
        if (!src || src === '') return;
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
		// const containerMaxHeight = parseFloat(window.getComputedStyle(imageContainer).maxHeight); // Can't easily get computed style of binding in script, assume logic
		// Approximation or use binding to clientHeight if needed, but the original logic used computed style.
		// Let's rely on standard logic.
		const containerMaxHeight = window.innerHeight - 280;

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
			// Re-calc height if needed
			// Simplification: just auto for now or re-trigger if I kept ref to current img
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("mouseup", onModalMouseUp);
			window.removeEventListener("mousemove", onModalMouseMove);
			window.removeEventListener("resize", handleResize);
		};
	});
</script>

<div id="main-content">
	<h1>Waifu Randomizer</h1>
	<WaifuViewer
		bgImage1Url={bgImage1Url}
		bgImage2Url={bgImage2Url}
		bgImage1Opacity={bgImage1Opacity}
		bgImage2Opacity={bgImage2Opacity}
		imageContainerHeight={imageContainerHeight}
		isLoading={isLoading}
		progress={progress}
		errorMessage={errorMessage}
		image1Url={image1Url}
		image2Url={image2Url}
		image1Opacity={image1Opacity}
		image2Opacity={image2Opacity}
		image1Dimmed={image1Dimmed}
		image2Dimmed={image2Dimmed}
		activeImage={activeImage}
		modalOpen={modalOpen}
		currentImageUrl={currentImageUrl}
		scale={scale}
		translateX={translateX}
		translateY={translateY}
		isDragging={isDragging}
		onOpenModal={openModal}
		onCloseModal={closeModal}
		onImageLoad={onImageLoad}
		onImageError={onImageError}
		onModalWheel={onModalWheel}
		onModalMouseDown={onModalMouseDown}
		onModalMouseUp={onModalMouseUp}
		onModalMouseMove={onModalMouseMove}
		bind:imageContainerEl={imageContainer}
	/>

	<div id="controls">
		<div id="api-selector" style="display: flex; gap: 10px; margin-bottom: 15px">
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
</div>

<style>
	#main-content {
		width: 100%;
		max-width: 600px;
		text-align: center;
		z-index: 1;
		display: flex;
		flex-direction: column;
		max-height: 100vh;
	}

	h1 {
		margin-top: 0;
		margin-bottom: 20px;
		font-size: 2.5em;
		letter-spacing: 2px;
		flex-shrink: 0;
	}


	#controls {
		display: flex;
		flex-direction: column;
		gap: 15px;
		flex-shrink: 0;
		width: 100%;
		margin: 0 auto;
	}

	.control-button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
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
		padding: 10px;
		font-size: 1em;
		border-radius: 10px;
	}

	.category-button.active {
		background-color: var(--button-active-bg-color);
		color: var(--button-active-text-color);
	}

	#randomize-button {
		background-color: var(--button-active-bg-color);
		color: var(--button-active-text-color);
		border: none;
		padding: 15px 30px;
		font-size: 1.2em;
		font-weight: bold;
		border-radius: 10px;
	}

</style>
