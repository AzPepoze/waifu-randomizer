<script>
	import SidebarHeader from "./sidebar/SidebarHeader.svelte";
	import ApiDropdown from "./sidebar/ApiDropdown.svelte";
	import CategoryFilter from "./sidebar/CategoryFilter.svelte";
	import ApiMetadata from "./sidebar/ApiMetadata.svelte";
	import Button from "./ui/Button.svelte";

	let { 
		selectedApi = $bindable(), 
		category = $bindable(), 
		theme = $bindable(),
		source = "",
		image = "",
		metadata = null,
		githubUrl = "",
		sidebarHidden = false,
		toggleSidebar,
		isLoading = false,
		fetchImage,
		isApiSupported
	} = $props();

	async function downloadImage() {
		if (!image || isLoading) return;
		try {
			const response = await fetch(image);
			if (!response.ok) throw new Error("Fetch failed");
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `waifu-${Date.now()}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Direct download failed, falling back to new tab:", error);
			window.open(image, "_blank");
		}
	}
</script>

<div class="sidebar" class:hidden={sidebarHidden}>
	<button id="btn-sidebar-collapse" class="collapse-handle" onclick={toggleSidebar} aria-label="Toggle Sidebar">
		<span class="material-icons">{sidebarHidden ? 'chevron_left' : 'chevron_right'}</span>
	</button>

	<div class="sidebar-inner custom-scrollbar">
		<SidebarHeader 
			bind:theme 
			{githubUrl} 
		/>

		<CategoryFilter 
			bind:category 
			{isLoading} 
		/>

		<ApiDropdown 
			bind:selectedApi 
			{isLoading} 
			{category} 
			{isApiSupported} 
		/>

		<ApiMetadata 
			{metadata} 
			{selectedApi} 
		/>

		<div class="footer">
			{#if source}
				<Button 
					id="btn-view-source"
					variant="secondary" 
					href={source} 
					class="source-btn"
				>
					<span class="material-icons">link</span>
					View Source Image
				</Button>
			{/if}
			
			<Button 
				id="btn-download"
				variant="secondary" 
				disabled={isLoading || !image} 
				onclick={downloadImage}
				class="download-btn"
				accentGlow={true}
			>
				<span class="material-icons">download</span>
				Download
			</Button>

			<Button 
				id="btn-randomize"
				variant="primary" 
				disabled={isLoading} 
				onclick={fetchImage}
				isLoading={isLoading}
				class="randomize-button"
			>
				{#if isLoading}
					<span class="spinner"></span>
				{:else}
					<span class="material-icons">shuffle</span>
				{/if}
				Random
			</Button>
		</div>
	</div>
</div>

<style lang="scss">
	.sidebar {
		position: absolute;
		top: 20px;
		right: 20px;
		bottom: 20px;
		width: 340px;
		z-index: 200;
		overflow: visible;
		
		background: var(--secondary-bg);
		border: 2px solid var(--border-color);
		border-radius: 32px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
		box-sizing: border-box;
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

		&.hidden {
			transform: translateX(calc(100% + 20px));
		}

		@media (max-width: 1024px) {
			position: fixed;
			width: 280px;
			left: 0;
			right: auto;
			top: 0;
			bottom: 0;
			height: 100vh;
			border-radius: 0 32px 32px 0;
			border-right: 2px solid var(--border-color);
			border-left: none;
			border-top: none;
			
			&.hidden {
				transform: translateX(-100%);
			}
		}
	}

	.sidebar-inner {
		width: 100%;
		height: 100%;
		padding: 40px 32px;
		display: flex;
		flex-direction: column;
		gap: 32px;
		overflow-y: auto;
		box-sizing: border-box;
	}

	.collapse-handle {
		position: absolute;
		top: 60px;
		right: 100%;
		width: 44px;
		height: 80px;
		background: var(--accent-color);
		color: white;
		border: 2px solid var(--white-pure);
		border-right: none;
		border-radius: 20px 0 0 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: -10px 0 20px rgba(0, 0, 0, 0.15);
		z-index: 210;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			width: 54px;
			background: var(--text-main);
		}

		.material-icons {
			font-size: 2rem;
		}

		@media (max-width: 1024px) {
			display: none;
		}
	}

	.footer {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 20px;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
