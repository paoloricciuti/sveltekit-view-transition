import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvex_config from './mdsvex.config.js';
import { mdsvex } from 'mdsvex';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit({
			// Consult https://kit.svelte.dev/docs/integrations#preprocessors
			// for more information about preprocessors
			preprocess: [vitePreprocess(), mdsvex(mdsvex_config)],
			extensions: ['.svelte', ...(mdsvex_config.extensions ?? [])],
			// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
			// If your environment is not supported or you settled on a specific environment, switch out the adapter.
			// See https://kit.svelte.dev/docs/adapters for more information about adapters.
			adapter: adapter(),
			alias: { $components: './src/components', $stores: './src/stores' },
		}),
	],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] },
	server: { fs: { allow: ['./README.md'] } },
});
