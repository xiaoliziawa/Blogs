<script setup>
import { onMounted, watch, ref, nextTick, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import * as echarts from 'echarts'

const { isDark } = useData()
let chart = null
const chartContainer = ref(null)

const createChart = () => {
  if (!chartContainer.value) return
  
  if (chart) {
    chart.dispose()
  }

  const currentTheme = document.documentElement.classList.contains('dark')
  chart = echarts.init(chartContainer.value)

  const colors = {
    text: currentTheme ? '#ffffff' : '#000000',
    subText: currentTheme ? '#cccccc' : '#666666',
    axis: currentTheme ? '#ffffff' : '#000000',
    splitLine: currentTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    mainLine: currentTheme ? '#ffcc00' : '#8B4513',
    areaGradient: [
      currentTheme ? 'rgba(255, 204, 0, 0.3)' : 'rgba(139, 69, 19, 0.2)',
      'rgba(139, 69, 19, 0)'
    ]
  }

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: 'Commits over time',
      left: 'center',
      textStyle: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'var(--vp-font-family-base)'
      },
      subtext: 'Weekly from 2024年11月22日 to 2024年11月22日',
      subtextStyle: {
        color: colors.subText,
        fontSize: 14,
        fontFamily: 'var(--vp-font-family-base)'
      },
      padding: [0, 0, 30, 0]
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '8%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['11-21', '11-21', '11-21', '11-21', '11-22', '11-22', '11-22', '11-22'],
      axisLine: {
        show: true,
        lineStyle: {
          color: colors.axis,
          width: 1
        }
      },
      axisLabel: {
        color: colors.axis,
        fontSize: 12
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: colors.axis,
          width: 1
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: colors.splitLine,
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        color: colors.axis,
        fontSize: 12
      }
    },
    series: [
      {
        data: [0, 0, 0, 0, 11, 0, 0, 0],
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        lineStyle: {
          color: colors.mainLine,
          width: 2
        },
        itemStyle: {
          color: colors.mainLine,
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colors.areaGradient[0]
            },
            {
              offset: 1,
              color: colors.areaGradient[1]
            }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    createChart()
  })
  
  window.addEventListener('resize', () => chart?.resize())
})

watch(isDark, () => {
  setTimeout(() => {
    createChart()
  }, 0)
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', () => chart?.resize())
})
</script>

<template>
  <div class="github-chart-wrapper">
    <div ref="chartContainer" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<style scoped>
.github-chart-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
</style> 