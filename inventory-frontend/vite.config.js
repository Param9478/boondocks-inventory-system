export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Isnu enable karo taaki laptop te vi check kar sako
      devOptions: {
        enabled: true 
      },
      manifest: {
        short_name: 'Boondocks',
        name: 'Boondocks Inventory Management',
        description: 'Smart inventory management system for Boondocks Restaurant',
        icons: [
          {
            // Path hamesha '/' ton shuru karo, './public' nahi likhna
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
      },
    }),
  ],
});