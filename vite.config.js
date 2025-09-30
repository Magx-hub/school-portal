import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages configuration
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'generateSW', // Changed from 'injectManifest' to 'generateSW' for easier setup
      registerType: 'autoUpdate',

    pwaAssets: {
      disabled: false,
      config: true,
    },
    
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],

    manifest: {
      name: 'Teacher Assistant Portal',
      short_name: 'Teacher Assistant',
      description: "Teachers' Digital Platform for MagMax Educational Centre",
      theme_color: '#1e293b', // slate-800
      background_color: '#f8fafc', // slate-50
      display: 'standalone',
      orientation: 'portrait',
      scope: '/school-portal/',
      start_url: '/school-portal/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: 'apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'any'
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
      shortcuts: [
        {
          name: 'Dashboard',
          short_name: 'Dashboard',
          url: '/school-portal/',
          icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
        },
        {
          name: 'Add Question',
          short_name: 'Add',
          url: '/school-portal/#/add',
          icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
        }
      ],
      screenshots: [
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          label: 'App screenshot'
        }
      ]
    },

    workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,ico,json,webmanifest}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      navigateFallback: '/school-portal/index.html',
      navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
      manifestTransforms: [
        (manifestEntries) => {
          const manifest = manifestEntries.map((entry) => {
            if (entry.url.includes('pwa-')) {
              entry.revision = null;
            }
            return entry;
          });
          return { manifest };
        }
      ],
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
    })
  ],
    build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    historyApiFallback: {
      index: '/index.html'
    }
  },
  preview: {
    port: 4173,
    host: true,
    historyApiFallback: {
      index: '/index.html'
    }
  }
})