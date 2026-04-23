import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      "shared": path.resolve(__dirname, '../../packages/shared/src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor"
            if (id.includes("lodash")) return "lodash"
            if (id.includes("xlsx")) return "xlsx"
            return "vendor"
          }
        },
      },
    },
  },  
})
