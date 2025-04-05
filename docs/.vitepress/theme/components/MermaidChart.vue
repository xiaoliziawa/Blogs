<template>
  <div class="mermaid-chart-container">
    <div ref="mermaidContainer" class="mermaid-container" :class="{ 'loading': isLoading }"></div>
    <div v-if="isLoading" class="loading-indicator">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载图表中...</div>
    </div>
    <div v-if="caption" class="mermaid-caption">{{ caption }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    default: 'default'
  }
})

const mermaidContainer = ref(null)
const isLoading = ref(true)
const uniqueId = `mermaid-${Date.now()}-${Math.floor(Math.random() * 10000)}`

async function loadMermaid() {
  if (typeof window === 'undefined') return
  
  if (!window.mermaid) {
    const module = await import('mermaid')
    window.mermaid = module.default
    
    // 配置 Mermaid
    window.mermaid.initialize({
      startOnLoad: false,
      theme: props.theme === 'dark' ? 'dark' : 'default',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35
      }
    })
  }
}

async function renderChart() {
  if (!mermaidContainer.value || !props.code) return
  
  isLoading.value = true
  
  try {
    await loadMermaid()
    
    mermaidContainer.value.id = uniqueId
    mermaidContainer.value.classList.add('mermaid')
    mermaidContainer.value.textContent = props.code
    
    await window.mermaid.run({
      querySelector: `#${uniqueId}`
    })
    
    isLoading.value = false
  } catch (error) {
    console.error('Mermaid 渲染错误:', error)
    mermaidContainer.value.innerHTML = `<div class="error-message">图表渲染失败: ${error.message}</div>`
    isLoading.value = false
  }
}

watch(() => props.code, renderChart)

watch(() => props.theme, async () => {
  if (window.mermaid) {
    window.mermaid.initialize({
      theme: props.theme === 'dark' ? 'dark' : 'default'
    })
    await renderChart()
  }
})

onMounted(async () => {
  await renderChart()
})
</script>

<style scoped>
.mermaid-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  position: relative;
  width: 100%;
}

.mermaid-container {
  width: 100%;
  min-height: 50px;
  padding: 10px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  transition: opacity 0.3s ease, box-shadow 0.3s ease;
  box-shadow: var(--vp-shadow-1);
  overflow: auto;
}

.mermaid-container:hover {
  box-shadow: var(--vp-shadow-2);
}

.mermaid-container.loading {
  opacity: 0.5;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 10px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.mermaid-caption {
  margin-top: 10px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.error-message {
  color: var(--vp-c-danger);
  padding: 20px;
  font-family: monospace;
  text-align: center;
}

/* 自定义 Mermaid 样式 */
:deep(.mermaid svg) {
  max-width: 100%;
  height: auto !important;
}
</style> 