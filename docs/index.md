---
layout: home
hero:
  name: PrizOwO Blogs
  text: Welcome !
  tagline: 收录各种网站、Code！
  actions:
    - theme: brand
      text: Start !
      link: /code/
    - theme: alt
      text: Questions
      link: /code/faq
    - theme: alt
      text: Github
      link: https://github.com/xiaoliziawa
features:
  - icon: 💻
    title: 代码示例
    details: 提供一些关于KubeJS以及Modding的代码示例。
    link: /code/
  - icon: 💾
    title: 软件列表
    details: 罗列一些常用软件。
    link: /software/
  - icon: 🌐
    title: 网址导航
    details: 导航常用网站。
    link: /websites/
---

<div class="github-activity">
  <div class="activity-stats">
    <div class="contribution-graph" :class="{ 'dark-theme': isDark }">
      <h2 class="graph-title">Commits over time</h2>
      <div ref="chartContainer" class="commit-graph"></div>
    </div>
  </div>
</div>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import * as echarts from 'echarts'

const { isDark } = useData()
const chartContainer = ref(null)
let chart = null

onMounted(() => {
  chart = echarts.init(chartContainer.value)
  
  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Nov 11'],
      axisLine: {
        lineStyle: {
          color: isDark.value ? '#666' : '#ccc'
        }
      },
      axisLabel: {
        color: isDark.value ? '#999' : '#666'
      }
    },
    yAxis: {
      type: 'value',
      name: 'Contributions',
      min: 0,
      max: 8,
      interval: 2,
      axisLine: {
        show: true,
        lineStyle: {
          color: isDark.value ? '#666' : '#ccc'
        }
      },
      axisLabel: {
        color: isDark.value ? '#999' : '#666'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          type: 'dashed'
        }
      }
    },
    series: [{
      data: [[0, 0], [1, 8]],  // 根据实际提交数据调整
      type: 'line',
      smooth: false,  // 直线而不是曲线
      showSymbol: false,
      lineStyle: {
        width: 2,
        color: '#4169e1'
      },
      areaStyle: {
        opacity: 0.3,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#4169e1'
        }, {
          offset: 1,
          color: 'rgba(65,105,225,0.1)'
        }])
      }
    }]
  }
  
  chart.setOption(option)
  
  // 监听主题变化
  watch(isDark, (newValue) => {
    chart.setOption({
      xAxis: {
        axisLine: {
          lineStyle: {
            color: newValue ? '#666' : '#ccc'
          }
        },
        axisLabel: {
          color: newValue ? '#999' : '#666'
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: newValue ? '#666' : '#ccc'
          }
        },
        axisLabel: {
          color: newValue ? '#999' : '#666'
        },
        splitLine: {
          lineStyle: {
            color: newValue ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }
        }
      }
    })
  })
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<style>
.github-activity {
  padding: 2rem;
  margin: 2rem auto;
  max-width: 900px;
}

.contribution-graph {
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 1.5rem;
  transition: background-color 0.3s;
}

.graph-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.commit-graph {
  width: 100%;
  height: 400px;
  border-radius: 6px;
}
</style> 