<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isAnimating = ref(false)
const isPreviewVisible = ref(false)
const currentImage = ref(null)
const scale = ref(1)
const rotation = ref(0)
const showCopyTip = ref(false)

function animateTransform(startScale, endScale, startRotation, endRotation, duration = 400) {
  if (isAnimating.value) return
  isAnimating.value = true
  
  const startTime = performance.now()

  function animate(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const easeProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    scale.value = startScale + (endScale - startScale) * easeProgress
    rotation.value = startRotation + (endRotation - startRotation) * easeProgress

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      scale.value = endScale
      rotation.value = endRotation
      isAnimating.value = false
    }
  }

  requestAnimationFrame(animate)
}

function zoomIn() {
  if (scale.value >= 5) return
  animateTransform(scale.value, scale.value * 1.2, rotation.value, rotation.value)
}

function zoomOut() {
  if (scale.value <= 0.2) return
  animateTransform(scale.value, scale.value / 1.2, rotation.value, rotation.value)
}

function rotateLeft() {
  const targetRotation = rotation.value - 90
  animateTransform(scale.value, scale.value, rotation.value, targetRotation, 600)
}

function rotateRight() {
  const targetRotation = rotation.value + 90
  animateTransform(scale.value, scale.value, rotation.value, targetRotation, 600)
}

function resetImage() {
  animateTransform(scale.value, 1, rotation.value, 0, 600)
}

function downloadImage() {
  const uuid = crypto.randomUUID()
  
  const extension = currentImage.value.split('.').pop()
  
  const link = document.createElement('a')
  link.href = currentImage.value
  link.download = `${uuid}.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function copyImage() {
  try {
    const response = await fetch(currentImage.value)
    const blob = await response.blob()
    
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
    } catch (e) {
      const img = new Image()
      img.src = currentImage.value
      await new Promise((resolve) => {
        img.onload = resolve
      })
      
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob
            })
          ])
          showCopyTip.value = true
        } catch (err) {
          console.error('Both copy methods failed:', err)
          alert('复制失败，请重试')
        }
      })
    }
    
    showCopyTip.value = true
    setTimeout(() => {
      showCopyTip.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy image:', err)
    alert('复制失败，请重试')
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
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
            <span class="tooltip-text">缩小</span>
          </button>
          <button class="action-btn tooltip" @click="zoomIn" title="放大">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span class="tooltip-text">放大</span>
          </button>
          <button class="action-btn tooltip" @click="rotateLeft" title="向左旋转">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13h2.02c.17 1.39.72 2.73 1.62 3.89l-1.41-1.42c-.52-.75-.87-1.59-1.23-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>
            </svg>
            <span class="tooltip-text">向左旋转</span>
          </button>
          <button class="action-btn tooltip" @click="rotateRight" title="向右旋转">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.89 15.5l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.91h-2.02c-.14.87-.48 1.72-1.02 2.5zM13 4.07V1l4.55 4.55L13 10V6.09c-2.84.48-5 2.94-5 5.91s2.16 5.43 5 5.91v2.02c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93zm5.34 3.93c-.48-1.16-1.17-2.13-2.09-2.91l-1.42 1.42c.52.75.87 1.6 1.02 2.47l2.49.02z"/>
            </svg>
            <span class="tooltip-text">向右旋转</span>
          </button>
          <button class="action-btn tooltip" @click="resetImage" title="重置">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
            </svg>
            <span class="tooltip-text">重置</span>
          </button>
          <button class="action-btn tooltip" @click="downloadImage" title="下载">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            <span class="tooltip-text">下载</span>
          </button>
          <button class="action-btn tooltip" @click="copyImage" title="复制">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            <span class="tooltip-text">复制</span>
          </button>
          <button class="close-btn tooltip" @click.stop="hidePreview" title="关闭">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
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
      
      <button class="mobile-close-btn" @click.stop="hidePreview">
        <span>关闭</span>
      </button>
    </div>
    <div class="copy-tip" :class="{ show: showCopyTip }">
      复制成功 ✓
    </div>
  </div>
</template>

<style>
.vp-doc img:not(.card-image img):not(.no-preview) {
  cursor: zoom-in;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
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
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
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
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 0 8px;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.close-btn .icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
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
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 1000000;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.copy-tip.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

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
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tooltip:hover .tooltip-text {
  opacity: 1;
  visibility: visible;
  bottom: -35px;
}

/* 响应式 */
@media (max-width: 768px) {
  .image-preview-overlay {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
  
  .image-preview-toolbar {
    border-radius: 0;
    height: 56px;
    padding: 0 10px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: var(--vp-c-bg-soft);
  }
  
  .toolbar-title {
    display: none;
  }
  
  .toolbar-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-right: 8px;
  }
  
  .action-btn {
    padding: 4px 6px;
    margin: 2px;
  }
  
  .action-btn .icon {
    width: 14px;
    height: 14px;
  }
  
  .close-btn {
    position: fixed;
    top: 8px;
    right: 8px;
    background-color: var(--vp-c-bg);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1001;
  }
  
  .close-btn:hover {
    background-color: var(--vp-c-bg-soft);
  }
  
  .image-preview-container {
    padding-top: 56px;
  }
  
  .tooltip-text {
    display: none;
  }
  
  /* 移动端底部关闭按钮 */
  .mobile-close-btn {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1001;
    background-color: var(--vp-c-brand);
    color: white;
    border: none;
    border-radius: 24px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .mobile-close-btn:hover, .mobile-close-btn:active {
    transform: translateX(-50%) scale(1.05);
    background-color: var(--vp-c-brand-dark);
  }
}

/* 极小屏幕适配（比如iPhone SE） */
@media (max-width: 375px) {
  .action-btn {
    padding: 4px;
    margin: 1px;
  }
  
  .toolbar-left {
    display: none;
  }
  
  .toolbar-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>