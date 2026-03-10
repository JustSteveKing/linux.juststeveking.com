// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://linux.juststevemcd.workers.dev',
  output: 'static',
  adapter: cloudflare({
    imageService: 'compile'
  }),
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()]
  }
});
