<template>
  <div 
    class="sidebar-resizer" 
    @mousedown="startResize"
    @touchstart="startResize"
  >
    <div class="resize-handle"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)
const minWidth = 200
const maxWidth = 500

let sidebarElement = null

const initSidebar = () => {
  sidebarElement = document.querySelector('.VPSidebar')
  if (sidebarElement) {
    const savedWidth = localStorage.getItem('sidebar-width')
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth))
    }
  }
}

const setSidebarWidth = (width) => {
  if (!sidebarElement) return
  
  const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width))
  
  // 直接设置侧边栏宽度
  sidebarElement.style.width = `${clampedWidth}px`
  
  // 更新 CSS 变量
  const root = document.documentElement
  root.style.setProperty('--vp-sidebar-width-small', `${clampedWidth}px`)
  
  // 直接调整所有可能的内容元素
  const selectors = [
    '.VPContent',
    '.VPDoc', 
    '.VPNav .content',
    '.container',
    '.Layout'
  ]
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(element => {
      if (element && !element.classList.contains('VPSidebar')) {
        element.style.marginLeft = `${clampedWidth}px`
        element.style.width = `calc(100% - ${clampedWidth}px)`
        element.style.transition = 'margin-left 0.1s ease, width 0.1s ease'
      }
    })
  })
  
  // 更新调整器位置
  const resizerElement = document.querySelector('.sidebar-resizer')
  if (resizerElement) {
    resizerElement.style.left = `${clampedWidth - 2}px`
  }
  
  // 保存到本地存储
  localStorage.setItem('sidebar-width', clampedWidth.toString())
}

const startResize = (e) => {
  if (!sidebarElement) return
  
  isResizing.value = true
  startX.value = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
  startWidth.value = sidebarElement.offsetWidth
  
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  
  const handleMove = (e) => {
    if (!isResizing.value) return
    
    const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
    const deltaX = currentX - startX.value
    const newWidth = startWidth.value + deltaX
    
    setSidebarWidth(newWidth)
  }
  
  const handleEnd = () => {
    isResizing.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }
  
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove)
  document.addEventListener('touchend', handleEnd)
  
  e.preventDefault()
}

onMounted(() => {
  // 等待DOM完全加载
  setTimeout(() => {
    initSidebar()
  }, 100)
})
</script>

<style scoped>
.sidebar-resizer {
  position: fixed;
  top: 0;
  left: calc(var(--vp-sidebar-width-small, 272px) - 2px);
  width: 4px;
  height: 100vh;
  z-index: 1000;
  cursor: col-resize;
  user-select: none;
  opacity: 0;
  transition: opacity 0.2s ease, left 0.1s ease;
  background: transparent;
}

.sidebar-resizer:hover {
  opacity: 1;
}

.sidebar-resizer:hover .resize-handle {
  background: var(--vp-c-brand-1);
}

.resize-handle {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: var(--vp-c-divider);
  transition: background 0.2s ease;
}

.sidebar-resizer:active,
.sidebar-resizer.resizing {
  opacity: 1;
}

.sidebar-resizer:active .resize-handle,
.sidebar-resizer.resizing .resize-handle {
  background: var(--vp-c-brand-1);
  width: 3px;
}

/* 确保在移动端隐藏 */
@media (max-width: 960px) {
  .sidebar-resizer {
    display: none;
  }
}

/* 为侧边栏添加最小宽度限制 */
:deep(.VPSidebar) {
  min-width: 200px !important;
  max-width: 500px !important;
  transition: width 0.1s ease !important;
  position: fixed !important;
  z-index: 100 !important;
}

/* 调整内容区域以适应侧边栏宽度变化 */
:deep(.VPDoc) {
  transition: padding-left 0.1s ease !important;
  margin-left: 0 !important;
}

/* 调整导航栏 */
:deep(.VPNav) {
  transition: padding-left 0.1s ease !important;
}

/* 调整主容器 */
:deep(.VPContent) {
  transition: padding-left 0.1s ease !important;
}

/* 确保布局容器正确响应 */
:deep(.Layout) {
  display: flex !important;
}

:deep(.VPContent.has-sidebar) {
  padding-left: var(--vp-sidebar-width-small, 272px) !important;
}

/* 当正在调整大小时显示视觉反馈 */
body.resizing * {
  cursor: col-resize !important;
  user-select: none !important;
}

/* 在调整过程中添加视觉指示器 */
.sidebar-resizer::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 60px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--vp-c-brand-1),
    transparent
  );
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.sidebar-resizer:hover::before,
.sidebar-resizer:active::before {
  opacity: 0.3;
}
</style>