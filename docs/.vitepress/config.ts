import { defineConfig } from 'vitepress'

export default defineConfig({
  // 其他配置...
  cleanUrls: true,
  rewrites: {
    // 添加URL重写规则
    ':path/:file.html': ':path/:file'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[ext]',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        }
      }
    }
  }
}) 