import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.BASE_PATH ?? '/', // GitHub Pages: /Tariquldeen/
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Tariq al-Din – Arabisch lernen',
        short_name: 'Tariq al-Din',
        lang: 'de',
        start_url: '.',
        display: 'standalone',
        background_color: '#0e1b33',
        theme_color: '#0e1b33',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,woff2,json,webp}'] },
    }),
  ],
})
