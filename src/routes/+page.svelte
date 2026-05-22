<script>
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import "./home.scss";

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
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
	<meta
		property="og:title"
		content="Waifu Randomizer | Discover Random Anime Art"
	/>
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
	<meta
		property="twitter:url"
		content="https://waifu-randomizer.azpepoze.com/"
	/>
	<meta
		property="twitter:title"
		content="Waifu Randomizer | Discover Random Anime Art"
	/>
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
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="home-container">
	{#if mounted}
		<header class="hero">
			<h1 class="hero-title" in:fly={{ y: 20, duration: 800 }}>
			Social Life is Over. <br />
			Waifus are Eternal.
			</h1>
			<p class="hero-subtitle" in:fly={{ y: 20, duration: 800, delay: 200 }}>
				The #1 tool for people who haven't seen the sun in 48 hours.
				Discover your 2D soulmate today. 0% Bankruptcy, 100% Waifu.
			</p>

			<div class="cta-actions" in:fly={{ y: 20, duration: 800, delay: 400 }}>
				<a
					href="/playground"
					class="cta-button primary"
					aria-label="Start browsing random waifus in the playground"
				>
					Reject 3D, Embrace 2D
					<span class="material-icons">rocket_launch</span>
				</a>
				<a
					href="https://github.com/AzPepoze/waifu-randomizer"
					target="_blank"
					class="cta-button secondary"
					aria-label="View source code on GitHub"
				>
					Gimme Source Code
				</a>
			</div>
		</header>

		<h2 class="sr-only">Key Features of our Anime & Waifu Randomizer</h2>

		<section class="features-grid" in:fade={{ duration: 1000, delay: 600 }}>
			<div class="feature-card">
				<div class="icon-box" style="background: var(--p1-green)">
					<span class="material-icons">no_meeting_room</span>
				</div>
				<h2>Anti-Grass Protocol</h2>
				<p>
					Scientifically proven to keep you inside and hydrated with gamer
					tears. Stay indoors, stay safe.
				</p>
			</div>

			<div class="feature-card">
				<div class="icon-box" style="background: var(--p3-blue)">
					<span class="material-icons">volunteer_activism</span>
				</div>
				<h2>Emotional Support JPGs</h2>
				<p>
					Who needs real friends when you have a randomized grid of anime
					girls? They never judge you.
				</p>
			</div>

			<div class="feature-card">
				<div class="icon-box" style="background: var(--p5-pink)">
					<span class="material-icons">paid</span>
				</div>
				<h2>0% Gacha Rates</h2>
				<p>
					Experience the thrill of clicking 'Random' until your fingers
					bleed. No gems required, No bankruptcy.
				</p>
			</div>
		</section>
	{/if}
</div>

<style lang="scss">
	.cta-actions {
		display: flex;
		gap: 16px;
		align-items: center;
		justify-content: center;

		@media (max-width: 640px) {
			flex-direction: column;
			width: 100%;
		}
	}

	.cta-button {
		display: flex;
		align-items: center;
		gap: 8px;

		&.primary {
			background: #1e293b;
			color: white;
			&:hover {
				background: #0f172a;
			}
		}

		&.secondary {
			background: rgba(255, 255, 255, 0.5);
			color: #1e293b;
			&:hover {
				background: rgba(255, 255, 255, 0.8);
			}
		}

		.material-icons {
			font-size: 1.2rem;
		}
	}

	.icon-box {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;

		.material-icons {
			font-size: 24px;
			color: rgba(0, 0, 0, 0.6);
		}
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
