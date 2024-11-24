import { defineConfig } from 'vitepress'
import { scanMarkdownFiles } from './utils/markdown'
import generateSidebar from './utils/sidebar'
import { resolve } from 'path'

const fileStats = scanMarkdownFiles(resolve(__dirname, '../'))

const sidebar = generateSidebar()

export default defineConfig({
  title: 'PrizOwO Blogs',
  description: '收录！收录！',
  lastUpdated: true,

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
              // 先创建 transition 对象
              const transition = document.startViewTransition(async () => {
                // 延迟执行主题切换
                await new Promise(resolve => setTimeout(resolve, 0));
                document.documentElement.classList.toggle('dark', !isCurrentlyDark);
                localStorage.setItem('vitepress-theme-appearance', isCurrentlyDark ? 'light' : 'dark');
              });

              // 等待动画开始
              await transition.ready;
              
              // 等待动画完成
              await transition.finished;
            } catch (err) {
              console.error('View Transition failed:', err);
            }
          });
        };
        
        // 确保在 DOM 和样式完全加载后执行
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
      { text: '文档', link: '/code/' },
      {
        text: '工具',
        items: [
          { text: '软件列表', link: '/software/' },
          { text: '网址导航', link: '/websites/' },
          { text: '卡片', link: '/cards/' }
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
    }
  }
}) 