// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://linux.juststeveking.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [svelte()]
});
