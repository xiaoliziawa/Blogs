<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isPreviewVisible = ref(false)
const currentImage = ref(null)
const scale = ref(1)
const rotation = ref(0)
const showCopyTip = ref(false)

// 图片操作函数
function zoomIn() {
  scale.value *= 1.2
}

function zoomOut() {
  scale.value /= 1.2
}

function rotateLeft() {
  rotation.value -= 90
}

function rotateRight() {
  rotation.value += 90
}

function resetImage() {
  scale.value = 1
  rotation.value = 0
}

function downloadImage() {
  const link = document.createElement('a')
  link.href = currentImage.value
  link.download = currentImage.value.split('/').pop()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function copyImage() {
  try {
    const response = await fetch(currentImage.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ])
    showCopyTip.value = true
    setTimeout(() => {
      showCopyTip.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy image:', err)
  }
}

function showPreview(imgSrc) {
  currentImage.value = imgSrc
  isPreviewVisible.value = true
  resetImage()
}

function hidePreview() {
  isPreviewVisible.value = false
}

onMounted(() => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        initializeImages()
      }
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  initializeImages()

  onUnmounted(() => {
    observer.disconnect()
  })
})

function initializeImages() {
  const images = document.querySelectorAll('img.preview-enabled, .vp-doc img:not(.no-preview):not(.card-image img)')
  images.forEach(img => {
    if (!img.dataset.previewInitialized) {
      img.style.cursor = 'zoom-in'
      img.addEventListener('click', () => showPreview(img.src))
      img.dataset.previewInitialized = 'true'
    }
  })
}
</script>

<template>
  <div v-if="isPreviewVisible" class="image-preview-wrapper">
    <div class="image-preview-overlay" @click.self="hidePreview">
      <div class="image-preview-toolbar">
        <div class="toolbar-left">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="toolbar-title">图片预览</div>
        <div class="toolbar-actions">
          <button class="action-btn tooltip" @click="zoomOut" title="缩小">
            <i class="icon">-</i>
            <span class="tooltip-text">缩小</span>
          </button>
          <button class="action-btn tooltip" @click="zoomIn" title="放大">
            <i class="icon">+</i>
            <span class="tooltip-text">放大</span>
          </button>
          <button class="action-btn tooltip" @click="rotateLeft" title="向左旋转">
            <i class="icon">↺</i>
            <span class="tooltip-text">向左旋转</span>
          </button>
          <button class="action-btn tooltip" @click="rotateRight" title="向右旋转">
            <i class="icon">↻</i>
            <span class="tooltip-text">向右旋转</span>
          </button>
          <button class="action-btn tooltip" @click="resetImage" title="重置">
            <i class="icon">⟲</i>
            <span class="tooltip-text">重置</span>
          </button>
          <button class="action-btn tooltip" @click="downloadImage" title="下载">
            <i class="icon">↓</i>
            <span class="tooltip-text">下载</span>
          </button>
          <button class="action-btn tooltip" @click="copyImage" title="复制">
            <i class="icon">⎘</i>
            <span class="tooltip-text">复制</span>
          </button>
          <button class="close-btn tooltip" @click.stop="hidePreview" title="关闭">
            <i class="icon">×</i>
            <span class="tooltip-text">关闭</span>
          </button>
        </div>
      </div>
      <div class="image-preview-container">
        <img 
          :src="currentImage" 
          alt="图片预览" 
          class="preview-image no-preview"
          :style="{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }"
        />
      </div>
    </div>
    <div class="copy-tip" :class="{ show: showCopyTip }">
      复制成功 ✓
    </div>
  </div>
</template>

<style>
.vp-doc img:not(.card-image img):not(.no-preview) {
  cursor: zoom-in;
  transition: transform 0.2s ease;
}

.vp-doc img:not(.card-image img):not(.no-preview):hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

<style scoped>
.image-preview-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  pointer-events: none;
  backdrop-filter: blur(10px);
}

.image-preview-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 90vh;
  background: var(--vp-c-bg);
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: modalIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

.image-preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 48px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px 12px 0 0;
  user-select: none;
  border-bottom: 1px solid var(--vp-c-divider);
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.toolbar-title {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  margin-right: 16px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 16px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn .icon {
  font-style: normal;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
}

.close-btn:hover {
  color: var(--vp-c-text-1);
}

.image-preview-container {
  position: relative;
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border-radius: 0 0 10px 10px;
}

.preview-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
  cursor: default !important;
  transform-origin: center center;
  will-change: transform;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 暗色模式优化 */
:root.dark .image-preview-overlay {
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  background: rgba(30, 30, 30, 0.95);
}

:root.dark .image-preview-toolbar {
  background: rgba(40, 40, 40, 0.95);
}

:root.dark .action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .preview-image {
  filter: brightness(1.1) contrast(1.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 复制提示优化 */
.copy-tip {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  background: var(--vp-c-brand);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000000;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.copy-tip.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* 工具提示样式 */
.tooltip {
  position: relative;
}

.tooltip-text {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tooltip:hover .tooltip-text {
  opacity: 1;
  visibility: visible;
  bottom: -35px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .image-preview-overlay {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
  
  .image-preview-toolbar {
    border-radius: 0;
  }
  
  .toolbar-title {
    display: none;
  }
  
  .action-btn {
    padding: 4px 8px;
  }
}
</style> 