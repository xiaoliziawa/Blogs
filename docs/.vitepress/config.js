import { defineConfig } from 'vitepress'
import { scanMarkdownFiles } from './utils/markdown'
import generateSidebar from './utils/sidebar'
import { resolve } from 'path'

const fileStats = scanMarkdownFiles(resolve(__dirname, '../'))

export default defineConfig({
  title: 'PrizOwO Blogs',
  description: '收录！收录！',
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/logo.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logo.png' }]
  ],

  vite: {
    define: {
      __FILE_STATS__: JSON.stringify(fileStats)
    },
    optimizeDeps: {
      include: ['echarts']
    },
    ssr: {
      noExternal: ['echarts']
    }
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

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        },
        locales: {
          zh: {
            placeholder: '搜索文档 (Ctrl + K)'
          }
        }
      }
    },

    outline: {
      level: [2, 3],
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新时间'
    }
  }
}) 