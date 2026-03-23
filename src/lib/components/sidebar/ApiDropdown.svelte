<script>
	import { fade, slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	let { selectedApi = $bindable(), isLoading = false, category = "", isApiSupported } = $props();

	let isOpen = $state(false);

	const apis = [
		{ id: "waifu.pics", name: "Waifu.pics", icon: "image" },
		{ id: "waifu.im", name: "Waifu.im", icon: "favorite" },
		{ id: "nekos.best", name: "Nekos.best", icon: "pets" },
		{ id: "danbooru.anime", name: "Danbooru", icon: "collections" },
		{ id: "konachan", name: "Konachan", icon: "photo_library" },
	];

	let selectedApiData = $derived(apis.find(a => a.id === selectedApi) || apis[0]);

	function selectApi(id) {
		selectedApi = id;
		isOpen = false;
	}

	function toggleDropdown() {
		if (!isLoading) {
			isOpen = !isOpen;
		}
	}
</script>

<div class="dropdown-container">
	<span class="label">API SOURCE</span>
	
	<div class="custom-dropdown" class:open={isOpen} class:loading={isLoading}>
		<button 
			class="dropdown-trigger" 
			onclick={toggleDropdown}
			disabled={isLoading}
		>
			<div class="selected-info">
				<span class="material-icons api-icon">{selectedApiData.icon}</span>
				<span class="api-name">{selectedApiData.name}</span>
			</div>
			<span class="material-icons chevron">expand_more</span>
		</button>

		{#if isOpen}
			<div 
				class="dropdown-menu glass" 
				transition:slide={{ duration: 300, easing: quintOut }}
			>
				{#each apis as api}
					<button 
						class="dropdown-item" 
						class:active={selectedApi === api.id}
						class:disabled={!isApiSupported(api.id, category)}
						disabled={!isApiSupported(api.id, category)}
						onclick={() => selectApi(api.id)}
					>
						<span class="material-icons item-icon">{api.icon}</span>
						<div class="item-text">
							<span class="name">{api.name}</span>
							{#if !isApiSupported(api.id, category)}
								<span class="status-badge">Unsupported for {category.toUpperCase()}</span>
							{/if}
						</div>
						{#if selectedApi === api.id}
							<span class="material-icons check">check_circle</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.dropdown-container {
		display: flex;
		flex-direction: column;
		gap: 12px;
		position: relative;
		z-index: 300;

		.label {
			font-size: 0.7rem;
			font-weight: 800;
			letter-spacing: 0.1em;
			color: var(--text-muted);
			text-transform: uppercase;
		}
	}

	.custom-dropdown {
		position: relative;
		width: 100%;
		
		&.open {
			.chevron { transform: rotate(180deg); }
			.dropdown-trigger {
				border-color: var(--accent-color);
				box-shadow: 0 0 0 4px rgba(var(--accent-color-rgb), 0.1);
			}
		}

		&.loading {
			opacity: 0.7;
			pointer-events: none;
		}
	}

	.dropdown-trigger {
		width: 100%;
		padding: 14px 20px;
		background: var(--secondary-bg);
		border: 1px solid var(--border-color);
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover:not(:disabled) {
			border-color: var(--accent-color);
			background: var(--primary-bg);
		}

		.selected-info {
			display: flex;
			align-items: center;
			gap: 12px;

			.api-icon {
				font-size: 1.25rem;
				color: var(--accent-color);
			}

			.api-name {
				font-size: 0.9rem;
				font-weight: 700;
				color: var(--text-main);
			}
		}

		.chevron {
			font-size: 1.25rem;
			color: var(--text-muted);
			transition: transform 0.3s;
		}
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		right: 0;
		background: var(--primary-bg);
		border: 1px solid var(--border-color);
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		z-index: 310;
		display: flex;
		flex-direction: column;
		padding: 8px;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 16px;
		border: none;
		background: transparent;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		min-width: 0; /* Prevent flex overflow */

		&:hover:not(:disabled) {
			background: rgba(var(--accent-color-rgb), 0.1);
			.item-icon { color: var(--accent-color); }
		}

		&.active {
			background: rgba(var(--accent-color-rgb), 0.05);
			.name { color: var(--accent-color); }
		}

		.item-icon {
			font-size: 1.2rem;
			color: var(--text-muted);
			transition: color 0.2s;
		}

		.item-text {
			flex: 1;
			display: flex;
			flex-direction: column;
			min-width: 0; /* Allow text truncate or wrap */

			.name {
				font-size: 0.875rem;
				font-weight: 600;
				color: var(--text-main);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.status-badge {
				font-size: 0.65rem;
				color: #f44336;
				font-weight: 700;
			}
		}

		.check {
			font-size: 1.1rem;
			color: var(--accent-color);
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
			background: transparent !important;
		}
	}
</style>
