import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // Import the PWA plugin

const commit = execSync('git rev-parse --short HEAD').toString().trim();

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(commit),
  },
  plugins: [
    react(),
    // Add the VitePWA plugin with configuration
    VitePWA({
      registerType: 'autoUpdate', // Automatically update the service worker
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], // Include static assets
      manifest: {
        name: 'RideShare PWA',
        short_name: 'RideShare',
        description: 'A simple PWA ridesharing application',
        theme_color: '#ffffff', // Or your preferred theme color
        background_color: '#ffffff', // Or your preferred background color
        start_url: '/', // Where the app starts
        display: 'standalone', // App-like display mode
        icons: [
          {
            src: '/icon-192x192.png', // Path relative to the public folder
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any' // Ensure this says 'any'
          },
          {
            src: '/icon-512x512.png', // Path relative to the public folder
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any' // Ensure this says 'any'
          }
        ]
      }
    })
  ],
})
