import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { applySiteMeta } from './src/config/site.js'

// Fills the brand placeholders in index.html from src/config/site.js.
function siteMeta() {
  return {
    name: 'site-meta',
    transformIndexHtml: {
      order: 'pre',
      handler: applySiteMeta
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), siteMeta()],
})
