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
      <div class="graph-subtitle">Weekly from {{ startDate }} to {{ endDate }}</div>
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
const startDate = ref('')
const endDate = ref('')
let chart = null

// 格式化日期
function formatDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化图表日期标签
function formatChartDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}`
}

onMounted(async () => {
  try {
    // 获取仓库的提交数据
    const response = await fetch('https://api.github.com/repos/xiaoliziawa/Blogs/commits?per_page=100')
    const commits = await response.json()
    
    // 处理提交数据
    const commitDates = commits.map(commit => new Date(commit.commit.author.date))
    const startDay = new Date(Math.min(...commitDates))
    const endDay = new Date(Math.max(...commitDates))
    
    startDate.value = formatDate(startDay)
    endDate.value = formatDate(endDay)
    
    // 统计每天的提交次数
    const commitCounts = {}
    commitDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]
      commitCounts[dateStr] = (commitCounts[dateStr] || 0) + 1
    })
    
    // 生成图表数据
    const dates = Object.keys(commitCounts).sort()
    const data = dates.map(date => [date, commitCounts[date]])
    
    // 初始化图表
    chart = echarts.init(chartContainer.value)
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          if (!params || !params[0]) return ''
          const value = params[0].value
          if (!value || value.length < 2) return ''
          const date = new Date(value[0])
          const commits = value[1]
          return `<div style="padding: 3px 6px;">
            <div style="color: #8b949e; margin-bottom: 2px;">Week of ${formatChartDate(date)}, 2024</div>
            <div style="color: #c9d1d9;"><span style="color: #58a6ff;">Commits:</span> ${commits}</div>
          </div>`
        },
        backgroundColor: 'rgba(13,17,23,0.95)',
        borderColor: '#30363d',
        borderWidth: 1,
        textStyle: {
          color: '#c9d1d9'
        },
        extraCssText: 'border-radius: 6px; padding: 0;'
      },
      grid: {
        left: '40px',
        right: '20px',
        top: '20px',
        bottom: '40px'
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: isDark.value ? '#30363d' : '#d0d7de',
            width: 2
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: function(value) {
            return formatChartDate(new Date(value))
          },
          color: isDark.value ? '#8b949e' : '#57606a',
          fontSize: 12,
          margin: 16
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? '#21262d' : '#eaeef2',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Contributions',
        nameLocation: 'end',
        nameGap: 15,
        nameTextStyle: {
          color: isDark.value ? '#8b949e' : '#57606a',
          fontSize: 12,
          align: 'left',
          verticalAlign: 'top',
          padding: [10, 0, 0, 0]
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? '#30363d' : '#d0d7de',
            width: 2
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: isDark.value ? '#8b949e' : '#57606a',
          fontSize: 12,
          margin: 16,
          formatter: function(value) {
            return value.toFixed(0)
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? '#21262d' : '#eaeef2',
            type: 'dashed'
          }
        }
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        smoothMonotone: 'x',
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#58a6ff',
            borderColor: isDark.value ? '#0d1117' : '#ffffff',
            borderWidth: 2
          }
        },
        lineStyle: {
          width: 2,
          color: '#58a6ff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: isDark.value ? 'rgba(88,166,255,0.15)' : 'rgba(88,166,255,0.15)'
          }, {
            offset: 1,
            color: isDark.value ? 'rgba(88,166,255,0.01)' : 'rgba(88,166,255,0.01)'
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
  } catch (error) {
    console.error('Failed to fetch commit data:', error)
  }
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