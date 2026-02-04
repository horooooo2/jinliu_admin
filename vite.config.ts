import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/pay-bank': {
        target: 'http://bank.newpayonline.com',
        changeOrigin: true,
        // 不重写路径，保留 /api 前缀
      },
      '/api/pay-report': {
        target: 'http://report.newpayonline.com',
        changeOrigin: true,
        // 不重写路径，保留 /api 前缀
      },
      '/api': {
        target: 'http://user.newpayonline.com',
        changeOrigin: true,
        // 不重写路径，保留 /api 前缀
      },
    },
  },
})
