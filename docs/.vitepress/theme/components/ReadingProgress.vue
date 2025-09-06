<template>
  <div class="reading-progress">
    <div 
      class="progress-bar" 
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  
  const windowHeight = scrollHeight - clientHeight
  const currentProgress = windowHeight > 0 ? (scrollTop / windowHeight) * 100 : 0
  
  progress.value = Math.min(Math.max(currentProgress, 0), 100)
}

const handleScroll = () => {
  updateProgress()
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--vp-c-divider-light);
  z-index: 1000;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.reading-progress:hover {
  opacity: 1;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--vp-c-brand-1) 0%,
    var(--vp-c-brand-2) 50%,
    var(--vp-c-brand-3) 100%
  );
  transition: width 0.1s ease-out;
  border-radius: 0 3px 3px 0;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 8px rgba(var(--vp-c-brand-1), 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reading-progress {
    height: 2px;
  }
  
  .progress-bar::after {
    width: 4px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .reading-progress {
    background: var(--vp-c-bg-alt);
  }
  
  .progress-bar::after {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  }
}

/* 隐藏在首页 */
.VPHome .reading-progress {
  display: none;
}
</style>