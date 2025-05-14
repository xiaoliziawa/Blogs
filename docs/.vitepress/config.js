import { defineConfig } from 'vitepress'
import { scanMarkdownFiles } from './utils/markdown'
import generateSidebar from './utils/sidebar'
import { resolve } from 'path'
import attrs from 'markdown-it-attrs'
import { SitemapStream, streamToPromise } from 'sitemap'
import { createWriteStream } from 'fs'

const fileStats = scanMarkdownFiles(resolve(__dirname, '../'))

const sidebar = generateSidebar()

export default defineConfig({
  title: 'PrizOwO Blogs-致所有沉默的清醒时刻「冬札」',
  description: '致所有沉默的清醒时刻\n清晨的霜爬上玻璃，像世界结痂的伤口。\n路灯在五点醒来，替未落的雪撑开一片暖黄。\n煮咖啡时，热气在窗上画出岛屿的形状，\n恍惚觉得这座城正漂向更冷的纬度。',

  lastUpdated: true,
  metaChunk: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/logo.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logo.png' }],
    ['script', {}, `
      (() => {
        const addViewTransition = () => {
          const toggle = document.querySelector('.VPSwitch.VPSwitchAppearance');
          if (!toggle) {
            setTimeout(addViewTransition, 100);
            return;
          }
          
          toggle.replaceWith(toggle.cloneNode(true));
          const newToggle = document.querySelector('.VPSwitch.VPSwitchAppearance');
          
          newToggle.addEventListener('click', async (e) => {
            if (!document.startViewTransition) return;
            
            e.preventDefault();
            
            const isCurrentlyDark = document.documentElement.classList.contains('dark');
            
            try {
              const transition = document.startViewTransition(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
                document.documentElement.classList.toggle('dark', !isCurrentlyDark);
                localStorage.setItem('vitepress-theme-appearance', isCurrentlyDark ? 'light' : 'dark');
              });

              await transition.ready;
              
              await transition.finished;
            } catch (err) {
              console.error('View Transition failed:', err);
            }
          });
        };
        
        const init = () => {
          if (document.readyState === 'complete') {
            addViewTransition();
          } else {
            window.addEventListener('load', addViewTransition);
          }
        };

        init();
      })();
    `]
  ],

  vite: {
    define: {
      __FILE_STATS__: JSON.stringify(fileStats)
    },
    optimizeDeps: {
      include: ['echarts', 'mermaid']
    },
    ssr: {
      noExternal: ['echarts', 'mermaid']
    }
  },

  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/code/' },
      {
        text: '工具',
        items: [
          { text: '软件列表', link: '/software/' },
          { text: '网址导航', link: '/websites/' },
          { text: '模组推荐', link: '/modrec/' },
          { text: '卡片', link: '/cards/' },
          { text: '插件展示', link: '/code/Vite/plugins-showcase' }
        ]
      },
      {
        text: '更多',
        items: [
          { text: 'Github', link: 'https://github.com/xiaoliziawa' },
          { text: '关于', link: '/about/' }
        ]
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiaoliziawa' }
    ],

    externalLinkIcon: true,

    sidebar: {
      '/cards/': [
        {
          text: '网站导航',
          link: '/cards/'
        }
      ],
      ...sidebar 
    },

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
    },
    giscus: {
      repo: 'xiaoliziawa/Blogs',
      repoId: 'R_kgDONTHVNA',
      category: 'Announcements',
      categoryId: 'DIC_kwDONTHVNM4CkhHT',
      mapping: 'pathname',
      inputPosition: 'bottom',
      lang: 'zh-CN'
    },
    
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观'
  },

  cleanUrls: true,

  ignoreDeadLinks: true,

  markdown: {
    container: true,
    linkify: true,
    html: true,
    anchor: true,
    attrs: true,
    toc: { level: [1, 2, 3] },
    theme: {
      light: 'github-light',
      dark: 'dark-plus'
    },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    config: (md) => {
      md.use(attrs, {
        allowedAttributes: [
          'size', 'width', 'height',
          'class', 'id', 'style',
          'align', 'margin', 'padding',
          'border-radius', 'opacity', 'filter',
          'transform', 'box-shadow', 'animation',
          'transition',
          'font-size',
          'font-weight',
          'font-style',
          'font-family',
          'color',
          'text-align',
          'text-decoration',
          'line-height',
          'letter-spacing'
        ]
      })

      const defaultImageRender = md.renderer.rules.image || md.renderer.rules.default
      
      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const attrs = token.attrs || []

        const sizeAttr = attrs.find(([key]) => key === 'size')
        const widthAttr = attrs.find(([key]) => key === 'width')
        const heightAttr = attrs.find(([key]) => key === 'height')

        if (sizeAttr || widthAttr || heightAttr) {
          const styles = []
          
          if (sizeAttr) {
            styles.push(`width: ${sizeAttr[1]}`)
            styles.push(`height: ${sizeAttr[1]}`)
          }
          if (widthAttr) {
            styles.push(`width: ${widthAttr[1]}`)
          }
          if (heightAttr) {
            styles.push(`height: ${heightAttr[1]}`)
          }

          attrs.push(['style', styles.join('; ')])
        }

        return defaultImageRender(tokens, idx, options, env, self)
      }
    }
  },

  async buildEnd(siteConfig) {
    const sitemap = new SitemapStream({ hostname: 'https://www.prizowo.com' }) // 请替换为你的实际网站域名
    const writeStream = createWriteStream(resolve(siteConfig.outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    
    sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 })
    sitemap.write({ url: '/code/', changefreq: 'weekly', priority: 0.8 })
    sitemap.write({ url: '/software/', changefreq: 'monthly', priority: 0.7 })
    sitemap.write({ url: '/websites/', changefreq: 'monthly', priority: 0.7 })
    sitemap.write({ url: '/modrec/', changefreq: 'monthly', priority: 0.7 })
    sitemap.write({ url: '/cards/', changefreq: 'monthly', priority: 0.7 })
    
    sitemap.end()
    
  }
}) 