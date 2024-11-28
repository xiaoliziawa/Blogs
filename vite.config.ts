import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      }
    }
  },
  plugins: [
    {
      name: 'html-rewrite',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, _res, next) => {
            if (req.url?.endsWith('.html')) {
              req.url = req.url.slice(0, -5)
            }
            next()
          })
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 