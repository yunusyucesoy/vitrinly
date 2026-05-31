import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const CUSTOMER_SLUG = process.env.CUSTOMER_SLUG ?? 'atelier-anatolia';

export default defineConfig({
  site: 'https://yunusyucesoy.github.io',
  base: '/vitrinly',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  vite: {
    define: {
      'import.meta.env.CUSTOMER_SLUG': JSON.stringify(CUSTOMER_SLUG),
    },
    server: {
      // ngrok / cloudflared tünel host'larına izin ver (mobil/AR testleri için)
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.trycloudflare.com'],
    },
  },
});
