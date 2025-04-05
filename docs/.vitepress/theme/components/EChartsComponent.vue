<template>
  <div class="echarts-container" :id="chartId" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useElementSize } from '@vueuse/core'

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  },
  theme: {
    type: String,
    default: ''
  },
  autoResize: {
    type: Boolean,
    default: true
  }
})

const chartId = `echarts-${Date.now()}-${Math.floor(Math.random() * 1000)}`
const chartInstance = ref(null)

const handleWindowResize = () => {
  if (chartInstance.value && props.autoResize) {
    chartInstance.value.resize()
  }
}

async function initializeChart() {
  if (typeof window === 'undefined') return
  
  if (!window.echarts) {
    try {
      const echarts = await import('echarts/core')
      const { CanvasRenderer } = await import('echarts/renderers')
      const { BarChart, LineChart, PieChart, ScatterChart, RadarChart } = await import('echarts/charts')
      const {
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LegendComponent,
        ToolboxComponent
      } = await import('echarts/components')

      echarts.use([
        CanvasRenderer,
        BarChart,
        LineChart,
        PieChart,
        ScatterChart,
        RadarChart,
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LegendComponent,
        ToolboxComponent
      ])

      window.echarts = echarts
    } catch (error) {
      console.error('Failed to load ECharts:', error)
      return
    }
  }

  const chartDom = document.getElementById(chartId)
  if (!chartDom) return

  chartInstance.value = window.echarts.init(chartDom, props.theme)
  chartInstance.value.setOption(props.options)
}

watch(() => props.options, (newOptions) => {
  if (chartInstance.value) {
    chartInstance.value.setOption(newOptions, { notMerge: true })
  }
}, { deep: true })

watch(() => props.theme, (newTheme) => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = window.echarts.init(document.getElementById(chartId), newTheme)
    chartInstance.value.setOption(props.options)
  }
})

onMounted(async () => {
  await initializeChart()
  
  if (props.autoResize) {
    window.addEventListener('resize', handleWindowResize)
  }
})

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  
  if (props.autoResize) {
    window.removeEventListener('resize', handleWindowResize)
  }
})
</script>

<style scoped>
.echarts-container {
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-1);
  transition: box-shadow 0.3s ease;
  overflow: hidden;
  margin: 20px 0;
}

.echarts-container:hover {
  box-shadow: var(--vp-shadow-2);
}
</style> 