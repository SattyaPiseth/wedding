import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.mp3", "**/*.mp4", "**/*.webm"],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5174", // Express port
        changeOrigin: true,
      },
    },
  },
})
