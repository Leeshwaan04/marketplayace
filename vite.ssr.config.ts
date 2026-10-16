import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Server bundle used only to prerender pages at build time. No Cloudflare plugin, no Tailwind (CSS comes from the client build).
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist-server',
    emptyOutDir: true
  }
})
