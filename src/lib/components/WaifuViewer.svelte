<script>
	// Background
	export let bgImage1Url = "";
	export let bgImage2Url = "";
	export let bgImage1Opacity = 0;
	export let bgImage2Opacity = 0;

	// Main image stack
	export let imageContainerHeight = "auto";
	export let isLoading = false;
	export let progress = 0;
	export let errorMessage = "";

	export let image1Url = "";
	export let image2Url = "";
	export let image1Opacity = 0;
	export let image2Opacity = 0;
	export let image1Dimmed = false;
	export let image2Dimmed = false;

	// Needed to decide which <img> should call onImageLoad
	export let activeImage = 1;

	// Modal
	export let modalOpen = false;
	export let currentImageUrl = "";
	export let scale = 1;
	export let translateX = 0;
	export let translateY = 0;
	export let isDragging = false;

	// Callbacks (passed from parent)
	export let onOpenModal = () => {};
	export let onCloseModal = () => {};
	export let onImageLoad = (_e) => {};
	export let onImageError = (_e) => {};
	export let onModalWheel = (_e) => {};
	export let onModalMouseDown = (_e) => {};
	export let onModalMouseUp = () => {};
	export let onModalMouseMove = (_e) => {};

	// Let parent measure width
	export let imageContainerEl = null;
</script>

<div id="bg-image-1" class="bg-image" style="background-image: url({bgImage1Url}); opacity: {bgImage1Opacity};"></div>
<div id="bg-image-2" class="bg-image" style="background-image: url({bgImage2Url}); opacity: {bgImage2Opacity};"></div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	id="image-container"
	bind:this={imageContainerEl}
	style="height: {imageContainerHeight}"
	onclick={onOpenModal}
>
	{#if isLoading}
		<div id="loading-wrapper" style="display: flex; opacity: 1;">
			<div id="loader"></div>
			<div id="progress-container">
				<div id="progress-bar" style="width: {progress}%"></div>
			</div>
		</div>
	{/if}

	<img
		id="image-1"
		src={image1Url}
		class="waifu-image {image1Dimmed ? 'dimmed' : ''}"
		alt="Waifu 1"
		style="opacity: {image1Opacity}"
		onload={activeImage === 2 && isLoading ? onImageLoad : null}
		onerror={onImageError}
	/>
	<img
		id="image-2"
		src={image2Url}
		class="waifu-image {image2Dimmed ? 'dimmed' : ''}"
		alt="Waifu 2"
		style="opacity: {image2Opacity}"
		onload={activeImage === 1 && isLoading ? onImageLoad : null}
		onerror={onImageError}
	/>

	<div id="error-message" style="display: {errorMessage ? 'block' : 'none'}">{errorMessage}</div>
</div>

<!-- Modal -->
{#if modalOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		id="modal-view"
		class="active"
		onmouseup={onModalMouseUp}
		onmousemove={onModalMouseMove}
		onclick={(e) => {
			if (e.target.id === "modal-view") onCloseModal();
		}}
	>
		<span id="modal-close" onclick={onCloseModal}>&times;</span>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<img
			id="modal-image"
			src={currentImageUrl}
			alt="Fullscreen"
			style="transform: translate({translateX}px, {translateY}px) scale({scale}); cursor: {isDragging
				? 'grabbing'
				: 'grab'}"
			onwheel={onModalWheel}
			onmousedown={onModalMouseDown}
		/>
	</div>
{/if}

<style>
	.bg-image {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background-size: cover;
		background-position: center;
		filter: blur(100px);
		transform: scale(1.1);
		transition: opacity 0.8s ease-in-out;
	}

	.bg-image::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 0;
	}

	#image-container {
		margin: 0 auto 20px auto;
		width: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: height 0.6s ease-in-out;
		min-height: 150px;
		max-height: calc(100vh - 280px);
		cursor: pointer;
	}

	.waifu-image {
		position: absolute;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 15px;
		opacity: 0;
		transition:
			opacity 0.8s ease-in-out,
			filter 0.3s ease-in-out;
	}

	.waifu-image.dimmed {
		filter: brightness(40%);
	}

	#loading-wrapper {
		position: absolute;
		display: none;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		transition: opacity 0.3s;
		z-index: 2;
		pointer-events: none;
	}

	#loader {
		width: 60px;
		height: 60px;
		border: 6px solid var(--loader-ring-color);
		border-top-color: var(--text-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	#progress-container {
		width: 150px;
		height: 6px;
		background-color: var(--progress-bar-bg-color);
		border-radius: 3px;
		overflow: hidden;
	}

	#progress-bar {
		width: 0%;
		height: 100%;
		background-color: var(--text-color);
		border-radius: 3px;
		transition: width 0.1s linear;
	}

	#error-message {
		position: absolute;
		display: none;
		font-size: 1.2em;
		padding: 0 20px;
		z-index: 3;
	}

	/* Modal */
	#modal-view {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.85);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease-in-out;
	}

	#modal-view.active {
		opacity: 1;
		pointer-events: auto;
	}

	#modal-image {
		max-width: 90%;
		max-height: 90%;
		transition: transform 0.2s ease-out;
		cursor: grab;
	}

	#modal-image:active {
		cursor: grabbing;
	}

	#modal-close {
		position: absolute;
		top: 15px;
		right: 35px;
		color: #fff;
		font-size: 40px;
		font-weight: bold;
		cursor: pointer;
		transition: color 0.2s;
	}

	#modal-close:hover {
		color: #bbb;
	}
</style>
