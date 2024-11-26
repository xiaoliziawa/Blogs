<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartContainer = ref(null)
let chart = null
let debounceTimer = null

async function fetchGitHubData() {
  try {
    const username = 'xiaoliziawa'
    const repoName = 'Blogs'
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/stats/punch_card`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    
    const dailyCommits = new Array(7).fill(0)
    data.forEach(([day, , count]) => {
      dailyCommits[day] += count
    })

    const maxCommits = Math.max(...dailyCommits)
    const yAxisMax = Math.ceil(maxCommits / 5) * 5

    createChart({
      data: dailyCommits,
      yAxisMax
    })
  } catch (error) {
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
  
  chart = echarts.init(chartContainer.value, null, {
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio,
    useDirtyRect: true
  })
  
  const option = {
    animation: false,
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: '{b}: {c} 次提交',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? '#666' : '#ddd',
      textStyle: {
        color: isDark ? '#eee' : '#333',
        fontSize: 13
      },
      extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); pointer-events: none;',
      position: 'top',
      enterable: false,
      confine: true,
      appendToBody: false,
      showDelay: 0,
      hideDelay: 0,
      transitionDuration: 0,
      axisPointer: {
        type: 'line',
        animation: false,
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
        }
      }
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
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      axisLabel: {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
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
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      axisLabel: {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
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
          color: isDark ? '#9575cd' : '#7e57c2'
        },
        itemStyle: {
          color: isDark ? '#9575cd' : '#7e57c2'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: isDark ? 'rgba(149, 117, 205, 0.3)' : 'rgba(126, 87, 194, 0.2)'
            },
            {
              offset: 1,
              color: isDark ? 'rgba(149, 117, 205, 0.05)' : 'rgba(126, 87, 194, 0.05)'
            }
          ])
        }
      }
    ]
  }
  
  const debounce = (fn, delay) => {
    return (...args) => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => fn(...args), delay)
    }
  }

  const handleMouseMove = debounce((params) => {
    chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: params.dataIndex
    })
  }, 16)

  chart.on('mousemove', 'series', handleMouseMove)
  
  chart.on('globalout', () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  })
  
  chart.setOption(option)
}

onMounted(async () => {
  try {
    await fetchGitHubData()
    
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        if (chart) {
          chart.resize({ animation: { duration: 0 } })
        }
      }, 100)
    )
    
    if (chartContainer.value) {
      resizeObserver.observe(chartContainer.value)
    }
    
    const observer = new MutationObserver(() => {
      if (chart) {
        fetchGitHubData()
      }
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    onUnmounted(() => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      resizeObserver.disconnect()
      observer.disconnect()
      chart?.dispose()
    })
  } catch (error) {
    console.error('Failed to initialize chart:', error)
  }
})

function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}
</script>

<template>
  <div ref="chartContainer" class="github-chart"></div>
</template>

<style scoped>
.github-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
  will-change: transform;
  transform: translateZ(0);
  contain: content;
  isolation: isolate;
}
</style> 