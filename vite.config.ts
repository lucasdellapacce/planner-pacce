import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import pkg from './package.json';

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({ compiler: 'svelte' }),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,webmanifest,json,woff,woff2}'],
				globIgnores: ['server/**', 'server/sw.js', 'server/workbox-*.js'],
			},
			manifest: {
				name: 'Remarkably Organized',
				short_name: 'Remarkably',
				description: 'Gerador de planners em PDF e organização pessoal.',
				theme_color: '#000000',
				background_color: '#000000',
				display: 'standalone',
				icons: [
					{
						src: '/web-app-manifest-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable',
					},
					{
						src: '/web-app-manifest-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
	],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				additionalData: `@use 'variables' as *;`,
				loadPaths: ['./src/lib/styles'],
			},
		},
	},
	server: {
		fs: {
			allow: ['./src', './static'],
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
