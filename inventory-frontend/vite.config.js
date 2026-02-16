import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        short_name: 'Boondocks',
        name: 'Boondocks Inventory Management',
        description:
          'Smart inventory management system for Boondocks Restaurant',
        icons: [
          {
            src: '/favicon/web-app-manifest-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any maskable',
          },
          {
            src: '/favicon/web-app-manifest-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any maskable',
          },
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        orientation: 'portrait',

        manifest: {
          screenshots: [
            {
              src: '/favicon/web-app-manifest-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Boondocks Inventory Dashboard',
            },
            {
              src: '/favicon/web-app-manifest-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              label: 'Inventory Management',
            },
          ],
        },
      },
    }),
  ],
});
