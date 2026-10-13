import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, type ProxyOptions } from "vite";

// Local backend for Konachan: the browser calls /konachan on this server,
// which forwards to konachan.net (the production site uses the proxy instead).
const konachanProxy: Record<string, ProxyOptions> = {
	"/konachan": {
		target: "https://konachan.net",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/konachan/, ""),
	},
};

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter({
				pages: "build",
				assets: "build",
				fallback: undefined,
				precompress: false,
				strict: true,
			}),
		}),
	],
	server: { proxy: konachanProxy },
	preview: { proxy: konachanProxy },
});
