<script>
	import { onDestroy, untrack } from "svelte";
	import Viewer from "viewerjs";
	import "viewerjs/dist/viewer.css";
	
	import LoadingOverlay from "./viewer/LoadingOverlay.svelte";
	import ZoomLocator from "./viewer/ZoomLocator.svelte";
	import ViewerToolbar from "./viewer/ViewerToolbar.svelte";

	let {
		image = "",
		isLoading = false,
		progress = 0,
		errorMessage = "",
	} = $props();

	let viewerInstance = $state(null);
	let imageElement;
	let locatorActive = $state(false);
	let locatorRect = $state({ top: 0, left: 0, width: 100, height: 100 });

	function initViewer() {
		if (viewerInstance) viewerInstance.destroy();

		viewerInstance = new Viewer(imageElement, {
			inline: true,
			button: false,
			navbar: false,
			title: false,
			toolbar: false, // Use our custom Toolbar component instead
			tooltip: false,
			movable: true,
			zoomable: true,
			rotatable: true,
			scalable: true,
			transition: true,
			fullscreen: true,
			keyboard: true,
			zoom(e) {
				updateLocator(e.detail.ratio, viewerInstance.imageData);
			},
			move(e) {
				updateLocator(viewerInstance.imageData.ratio, viewerInstance.imageData);
			},
			viewed() {
				// Prevent zooming out smaller than 'fit'
				viewerInstance.options.minZoomRatio = viewerInstance.imageData.ratio;
				updateLocator(viewerInstance.imageData.ratio, viewerInstance.imageData);
			},
		});
	}

	function updateLocator(ratio, imageData) {
		if (!imageData) return;

		const { width, height, x, y } = imageData;
		const containerWidth = viewerInstance.containerData.width;
		const containerHeight = viewerInstance.containerData.height;

		if (width <= containerWidth && height <= containerHeight) {
			locatorActive = false;
			return;
		}

		locatorActive = true;
		const viewWidthPerc = (containerWidth / width) * 100;
		const viewHeightPerc = (containerHeight / height) * 100;
		const viewLeftPerc = (-x / width) * 100;
		const viewTopPerc = (-y / height) * 100;

		locatorRect = {
			top: Math.max(0, Math.min(100 - viewHeightPerc, viewTopPerc)),
			left: Math.max(0, Math.min(100 - viewWidthPerc, viewLeftPerc)),
			width: Math.min(100, viewWidthPerc),
			height: Math.min(100, viewHeightPerc),
		};
	}

	$effect(() => {
		if (image && imageElement) {
			untrack(() => initViewer());
		}
	});

	onDestroy(() => {
		if (viewerInstance) viewerInstance.destroy();
	});
</script>

<div class="image-viewer-container" class:is-loading={isLoading}>
	<LoadingOverlay {isLoading} {progress} />

	{#if errorMessage}
		<div class="error-overlay">
			<p>⚠️ {errorMessage}</p>
		</div>
	{/if}

	<div class="viewer-wrapper">
		<img
			bind:this={imageElement}
			src={image}
			alt="Artwork"
			class="hidden-source"
		/>
	</div>

	<ZoomLocator 
		active={locatorActive && !isLoading} 
		{image} 
		rect={locatorRect} 
	/>

	<ViewerToolbar viewer={viewerInstance} />
</div>

<style lang="scss">
	.image-viewer-container {
		position: relative;
		flex: 1;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background: transparent;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);

		&.is-loading {
			.viewer-wrapper {
				opacity: 0;
				transform: scale(0.98);
			}
		}

		@media (max-width: 1024px) {
			height: 60vh;
		}
	}

	.viewer-wrapper {
		flex: 1;
		width: 100%;
		height: 100%;
		transition: opacity 0.5s ease-in-out, transform 0.5s ease-out;
		opacity: 1;
		transform: scale(1);

		:global(.viewer-container) {
			background-color: transparent !important;
		}

		:global(.viewer-canvas img) {
			box-shadow:
				0 30px 60px rgba(0, 0, 0, 0.4),
				0 10px 20px rgba(0, 0, 0, 0.2);
			border-radius: 12px;
		}
	}

	.hidden-source {
		display: none;
	}

	.error-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		background: var(--primary-bg);
		color: var(--text-main);
		font-weight: 600;
	}
</style>
