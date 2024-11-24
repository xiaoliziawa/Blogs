<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartContainer = ref(null)
let chart = null

async function fetchGitHubData() {
  try {
    const username = 'xiaoliziawa'
    const repoName = 'Blogs'
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/stats/punch_card`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    
    // 按星期几统计提交次数
    const dailyCommits = new Array(7).fill(0)
    data.forEach(([day, , count]) => {
      dailyCommits[day] += count
    })

    // 计算最大提交数，用于设置 y 轴范围
    const maxCommits = Math.max(...dailyCommits)
    const yAxisMax = Math.ceil(maxCommits / 5) * 5 // 向上取整到最近的5的倍数

    createChart({
      data: dailyCommits,
      yAxisMax
    })
  } catch (error) {
    // 如果获取失败，显示空图表
    createChart({
      data: Array(7).fill(0),
      yAxisMax: 15
    })
  }
}

function createChart({ data, yAxisMax }) {
  if (!chartContainer.value) return
  
  if (chart) {
    chart.dispose()
  }

  const isDark = document.documentElement.classList.contains('dark')
  chart = echarts.init(chartContainer.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 次提交'
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      axisLine: {
        lineStyle: {
          color: isDark ? '#666' : '#ccc'
        }
      },
      axisLabel: {
        color: isDark ? '#999' : '#666'
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: yAxisMax,
      interval: 5,
      axisLine: {
        show: true,
        lineStyle: {
          color: isDark ? '#666' : '#ccc'
        }
      },
      axisLabel: {
        color: isDark ? '#999' : '#666'
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#333' : '#eee'
        }
      }
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          width: 2,
          color: '#4169e1'
        },
        itemStyle: {
          color: '#4169e1'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: isDark ? 'rgba(65, 105, 225, 0.3)' : 'rgba(65, 105, 225, 0.1)'
            },
            {
              offset: 1,
              color: isDark ? 'rgba(65, 105, 225, 0.1)' : 'rgba(65, 105, 225, 0.02)'
            }
          ])
        }
      }
    ]
  }
  
  chart.setOption(option)
}

onMounted(async () => {
  try {
    await fetchGitHubData()
    window.addEventListener('resize', () => {
      chart?.resize()
    })
    
    const observer = new MutationObserver(() => {
      if (chart) {
        fetchGitHubData()
      }
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  } catch (error) {
    // 错误处理
  }
})
</script>

<template>
  <div ref="chartContainer" class="github-chart"></div>
</template>

<style scoped>
.github-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style> 