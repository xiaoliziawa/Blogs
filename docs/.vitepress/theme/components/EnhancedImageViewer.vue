<template>
  <div class="enhanced-image-viewer">
    <div 
      class="image-container" 
      :class="{ 'is-resizing': isResizing }"
      :style="imageContainerStyle"
      @mousedown="startDrag"
    >
      <div 
        class="resize-handle" 
        @mousedown.stop="startResize"
      ></div>
      <img 
        ref="imageEl" 
        :src="src" 
        :alt="alt" 
        :title="title"
        class="viewer-image"
        @load="onImageLoad"
      />
      <div class="image-controls">
        <button @click="zoomIn" class="control-btn" title="放大">
          <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
        <button @click="zoomOut" class="control-btn" title="缩小">
          <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 13H5v-2h14v2z"/></svg>
        </button>
        <button @click="resetImage" class="control-btn" title="重置">
          <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        </button>
      </div>
    </div>
    <div v-if="caption" class="image-caption">{{ caption }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  initialWidth: {
    type: [Number, String],
    default: '100%'
  }
})

const imageEl = ref(null)
const width = ref(typeof props.initialWidth === 'number' ? props.initialWidth : null)
const height = ref(null)
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const naturalDimensions = ref({ width: 0, height: 0 })

const isDragging = ref(false)
const isResizing = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const startPosition = ref({ x: 0, y: 0 })
const startDimensions = ref({ width: 0, height: 0 })

const imageContainerStyle = computed(() => {
  const styles = {
    transform: `translate(${position.value.x}px, ${position.value.y}px)`,
    cursor: isDragging.value ? 'grabbing' : 'grab'
  }

  if (width.value) {
    styles.width = typeof width.value === 'number' ? `${width.value}px` : width.value
  }

  if (height.value) {
    styles.height = `${height.value}px`
  }

  return styles
})

function onImageLoad() {
  if (imageEl.value) {
    naturalDimensions.value = {
      width: imageEl.value.naturalWidth,
      height: imageEl.value.naturalHeight
    }
    
    if (typeof props.initialWidth === 'number') {
      const ratio = naturalDimensions.value.height / naturalDimensions.value.width
      height.value = width.value * ratio
    }
  }
}

function startDrag(event) {
  if (isResizing.value) return
  
  isDragging.value = true
  dragStart.value = { x: event.clientX, y: event.clientY }
  startPosition.value = { ...position.value }
  
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

function handleDrag(event) {
  if (!isDragging.value) return
  
  const dx = event.clientX - dragStart.value.x
  const dy = event.clientY - dragStart.value.y
  
  position.value = {
    x: startPosition.value.x + dx,
    y: startPosition.value.y + dy
  }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function startResize(event) {
  isResizing.value = true
  dragStart.value = { x: event.clientX, y: event.clientY }
  startDimensions.value = { width: width.value, height: height.value }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  
  event.preventDefault()
}

function handleResize(event) {
  if (!isResizing.value) return
  
  const dx = event.clientX - dragStart.value.x
  const aspectRatio = naturalDimensions.value.height / naturalDimensions.value.width
  
  const newWidth = Math.max(100, startDimensions.value.width + dx)
  const newHeight = newWidth * aspectRatio
  
  width.value = newWidth
  height.value = newHeight
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

function zoomIn() {
  scale.value *= 1.2
  updateDimensions()
}

function zoomOut() {
  scale.value /= 1.2
  updateDimensions()
}

function resetImage() {
  scale.value = 1
  position.value = { x: 0, y: 0 }
  
  // 重置尺寸
  if (typeof props.initialWidth === 'number') {
    width.value = props.initialWidth
    if (naturalDimensions.value.width) {
      const ratio = naturalDimensions.value.height / naturalDimensions.value.width
      height.value = width.value * ratio
    }
  } else {
    width.value = null
    height.value = null
  }
}

function updateDimensions() {
  if (typeof width.value === 'number') {
    const aspectRatio = naturalDimensions.value.height / naturalDimensions.value.width
    width.value = startDimensions.value.width * scale.value
    height.value = width.value * aspectRatio
  }
}

onMounted(() => {
  if (imageEl.value && imageEl.value.complete) {
    onImageLoad()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.enhanced-image-viewer {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--vp-shadow-2);
  transition: box-shadow 0.3s ease;
  max-width: 100%;
}

.image-container:hover {
  box-shadow: var(--vp-shadow-3);
}

.image-container.is-resizing {
  cursor: nwse-resize !important;
}

.viewer-image {
  display: block;
  max-width: 100%;
  height: auto;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
  z-index: 10;
}

.resize-handle::before {
  content: '';
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  border-right: 2px solid var(--vp-c-text-2);
  border-bottom: 2px solid var(--vp-c-text-2);
  opacity: 0.4;
}

.image-caption {
  margin-top: 10px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
  max-width: 90%;
}

.image-controls {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 4px;
}

.image-container:hover .image-controls {
  opacity: 1;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style> 