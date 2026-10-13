<script lang="ts">
	import { onDestroy, untrack } from "svelte";
	import { fade, scale } from "svelte/transition";
	import Viewer from "viewerjs";
	import "viewerjs/dist/viewer.css";
	import { motionDuration } from "#lib/motion";
	import type { ViewerInstance } from "#lib/viewer";

	import LoadingOverlay from "./viewer/LoadingOverlay.svelte";
	import ZoomLocator from "./viewer/ZoomLocator.svelte";
	import ViewerToolbar from "./viewer/ViewerToolbar.svelte";

	const BACKGROUND_COVERAGE = 0.8;
	const INLINE_COVERAGE = 0.9;
	const ENTER_DURATION = 900;
	const GHOST_DURATION = 900;

	const enterFrames = [
		{ opacity: 0, filter: "blur(28px)", transform: "scale(1.03)" },
		{ opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
	];

	interface Props {
		image?: string;
		isLoading?: boolean;
		progress?: number;
		errorMessage?: string;
		background?: boolean;
		onDismiss?: () => void;
	}

	interface LocatorRect {
		top: number;
		left: number;
		width: number;
		height: number;
	}

	let {
		image = "",
		isLoading = false,
		progress = 0,
		errorMessage = "",
		background = false,
		onDismiss,
	}: Props = $props();

	let viewerInstance = $state<ViewerInstance | null>(null);
	let imageElement: HTMLImageElement | undefined = $state();
	let locatorActive = $state(false);
	let locatorRect = $state<LocatorRect>({ top: 0, left: 0, width: 100, height: 100 });
	let containerElement: HTMLDivElement | undefined = $state();
	let viewerWrapper: HTMLDivElement | undefined = $state();
	let ghostImage = $state("");
	let ghostBox = $state<LocatorRect>({ top: 0, left: 0, width: 0, height: 0 });
	let ghostTarget = $state<LocatorRect>({ top: 0, left: 0, width: 0, height: 0 });
	let ghostKey = $state(0);
	let shownImage = "";

	function pictureBox(): LocatorRect | null {
		const picture = viewerWrapper?.querySelector(".viewer-move");
		if (!picture || !containerElement) return null;
		const box = picture.getBoundingClientRect();
		const origin = containerElement.getBoundingClientRect();
		return {
			top: box.top - origin.top,
			left: box.left - origin.left,
			width: box.width,
			height: box.height,
		};
	}

	function prefersReducedMotion(): boolean {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}

	function initViewer(): void {
		if (!imageElement) return;
		viewerInstance?.destroy();

		viewerInstance = new Viewer(imageElement, {
			inline: true,
			button: false,
			navbar: false,
			title: false,
			toolbar: false,
			tooltip: false,
			movable: true,
			zoomable: true,
			rotatable: true,
			scalable: true,
			transition: true,
			fullscreen: true,
			keyboard: true,
			initialCoverage: background ? BACKGROUND_COVERAGE : INLINE_COVERAGE,
			zoom: syncLocator,
			move: syncLocator,
			viewed() {
				if (!viewerInstance) return;
				viewerInstance.options.minZoomRatio = viewerInstance.imageData.ratio;
				syncLocator();
			},
		}) as ViewerInstance;
	}

	function syncLocator(): void {
		const imageData = viewerInstance?.imageData;
		const containerData = viewerInstance?.containerData;
		if (!imageData || !containerData) return;

		const { width, height, x, y } = imageData;
		const containerWidth = containerData.width;
		const containerHeight = containerData.height;

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

	function playEnter(): void {
		if (!viewerWrapper || prefersReducedMotion()) return;
		viewerWrapper.animate(enterFrames, {
			duration: ENTER_DURATION,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)",
		});
	}

	function clearGhost(): void {
		ghostImage = "";
	}

	function fitBox(naturalWidth: number, naturalHeight: number): LocatorRect | null {
		if (!containerElement || !naturalWidth || !naturalHeight) return null;
		const containerWidth = containerElement.clientWidth;
		const containerHeight = containerElement.clientHeight;
		const coverage = background ? BACKGROUND_COVERAGE : INLINE_COVERAGE;
		const ratio =
			Math.min(containerWidth / naturalWidth, containerHeight / naturalHeight) * coverage;
		const width = naturalWidth * ratio;
		const height = naturalHeight * ratio;
		return {
			top: (containerHeight - height) / 2,
			left: (containerWidth - width) / 2,
			width,
			height,
		};
	}

	function boxFrame({ top, left, width, height }: LocatorRect) {
		return { top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` };
	}

	function glideOut(
		node: HTMLImageElement,
		{ from, to, onDone }: { from: LocatorRect; to: LocatorRect; onDone: () => void },
	) {
		const animation = node.animate(
			[
				{ ...boxFrame(from), opacity: 1, filter: "blur(0px)" },
				{ ...boxFrame(to), opacity: 0, filter: "blur(28px)" },
			],
			{ duration: GHOST_DURATION, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
		);
		animation.onfinish = onDone;
		return { destroy: () => animation.cancel() };
	}

	$effect(() => {
		const next = image;
		untrack(() => {
			if (shownImage && shownImage !== next && !prefersReducedMotion()) {
				const box = pictureBox();
				const natural = viewerInstance?.imageData;
				const target = natural ? fitBox(natural.naturalWidth, natural.naturalHeight) : null;
				if (box && target) {
					ghostBox = box;
					ghostTarget = target;
					ghostImage = shownImage;
					ghostKey += 1;
				}
			}
			shownImage = next;
		});
	});

	$effect(() => {
		if (image && imageElement) {
			untrack(() => {
				initViewer();
				playEnter();
			});
		}
	});

	onDestroy(() => {
		viewerInstance?.destroy();
	});
</script>

<div class="image-viewer-container" class:background bind:this={containerElement}>
	<LoadingOverlay {isLoading} {progress} overPicture={Boolean(image)} />

	{#if errorMessage}
		<div class="error-overlay" transition:fade={{ duration: motionDuration(250) }}>
			<div
				class="error-card glass"
				transition:scale={{ start: 0.94, duration: motionDuration(260) }}
			>
				<span class="error-badge material-icons" aria-hidden="true">warning</span>
				<p role="alert">{errorMessage}</p>
				{#if onDismiss}
					<button class="dismiss" onclick={onDismiss}>Got it</button>
				{/if}
			</div>
		</div>
	{/if}

	<div class="viewer-wrapper" bind:this={viewerWrapper}>
		<img bind:this={imageElement} src={image} alt="Artwork" class="hidden-source" />
	</div>

	{#key ghostKey}
		{#if ghostImage}
			<img
				class="ghost"
				src={ghostImage}
				alt=""
				style:top="{ghostBox.top}px"
				style:left="{ghostBox.left}px"
				style:width="{ghostBox.width}px"
				style:height="{ghostBox.height}px"
				use:glideOut={{ from: ghostBox, to: ghostTarget, onDone: clearGhost }}
			/>
		{/if}
	{/key}

	<ZoomLocator active={locatorActive && !isLoading} {image} rect={locatorRect} />

	<ViewerToolbar viewer={viewerInstance} />
</div>

<style lang="scss">
	.image-viewer-container {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		background: transparent;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);

		@media (max-width: 1024px) {
			height: 60vh;
		}
	}

	.viewer-wrapper {
		flex: 1;
		width: 100%;
		height: 100%;

		:global(.viewer-container) {
			background-color: transparent !important;
		}

		:global(.viewer-canvas img) {
			border-radius: 12px;
			box-shadow:
				0 30px 60px rgba(0, 0, 0, 0.4),
				0 10px 20px rgba(0, 0, 0, 0.2);
		}
	}

	.image-viewer-container.background {
		height: 100%;
		border-radius: 28px;

		.viewer-wrapper :global(.viewer-canvas img) {
			border-radius: 28px;
			box-shadow: none;
		}

		:global(.toolbar-container) {
			bottom: 112px;
		}
	}

	@media (max-width: 1024px) {
		.image-viewer-container.background :global(.toolbar-container) {
			bottom: 12px;
		}
	}

	.hidden-source {
		display: none;
	}

	.ghost {
		position: absolute;
		z-index: 2;
		object-fit: contain;
		border-radius: 12px;
		pointer-events: none;
	}

	.image-viewer-container.background .ghost {
		border-radius: 28px;
	}

	.error-overlay {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(circle at center, var(--veil-from), var(--veil-to));
	}

	.error-card {
		display: grid;
		justify-items: center;
		gap: 14px;
		width: min(340px, calc(100% - 32px));
		padding: 28px 26px;
		color: var(--text-main);
		text-align: center;

		p {
			margin: 0;
			font-weight: 600;
			line-height: 1.5;
		}
	}

	.error-badge {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: rgba(255, 102, 170, 0.16);
		color: #ff66aa;
		font-size: 30px;
	}

	.dismiss {
		margin-top: 4px;
		padding: 10px 24px;
		border: none;
		border-radius: 999px;
		background: #ff66aa;
		color: #ffffff;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		transition: transform 0.2s ease;

		&:hover {
			transform: translateY(-2px);
		}
	}
</style>
