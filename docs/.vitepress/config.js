import { defineConfig } from 'vitepress'
import generateSidebar from './utils/sidebar'
import { resolve } from 'path'

export default defineConfig({
  title: 'PrizOwO Blogs',
  description: '收录！收录！',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
  ],
  base: '/',
  outDir: '.vitepress/dist',
  buildEnd: async () => {
    const fs = require('fs')
    const path = require('path')
    const cnamePath = path.resolve(__dirname, './dist/CNAME')
    fs.writeFileSync(cnamePath, 'prizowo.net')
  },
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '代码示例', link: '/code/' },
      { text: '软件列表', link: '/software/' },
      { text: '网址导航', link: '/websites/' }
    ],
    
    sidebar: generateSidebar(resolve(__dirname, '../')),

    outline: {
      level: [2, 3],
      label: '页面导航'
    }
  },

  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
}) 