import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'Boondocks',
        name: 'Boondocks Inventory Management',
        description:
          'Smart inventory management system for Boondocks Restaurant',
        icons: [
          {
            src: './public/favicon/web-app-manifest-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any maskable',
          },
          {
            src: './public/favicon/web-app-manifest-512x512.png',
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
        scope: '/',
        categories: ['business', 'productivity'],
        prefer_related_applications: false,
      },
    }),
  ],
});
