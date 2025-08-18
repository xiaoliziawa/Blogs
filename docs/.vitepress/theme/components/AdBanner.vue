<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const adTitle = ref('LirxOwO Blogs')
const adContent = ref('该网站仍然在建设中，专注于代码记录，分享。欢迎访问：https://www.lirxowo.com')

const isVisible = ref(false)

const closeAd = () => {
  isVisible.value = false
}

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 1500)
})
</script>

<template>
  <Transition name="fade-slide">
    <div v-if="isVisible" class="ad-popup">
      <div class="ad-popup-content">
        <button class="ad-close-btn" @click="closeAd" aria-label="关闭广告">×</button>
        <h3 class="ad-title">{{ adTitle }}</h3>
        <p class="ad-text">{{ adContent }}</p>
        <a href="https://www.lirxowo.com/questions/faq" target="_blank" class="ad-link" @click="closeAd">
          了解更多 →
        </a>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.ad-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  z-index: 100;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.ad-popup-content {
  padding: 16px;
  position: relative;
}

.ad-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-brand);
}

.ad-text {
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.ad-link {
  display: inline-block;
  color: var(--vp-c-brand);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.ad-link:hover {
  border-bottom-color: var(--vp-c-brand);
}

.ad-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: transparent;
  border: none;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}

.ad-close-btn:hover {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* 动画过渡效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 适配暗色模式 */
:root.dark .ad-popup {
  background-color: var(--vp-c-bg-soft);
}

/* 移动设备适配 */
@media (max-width: 640px) {
  .ad-popup {
    bottom: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }
}
</style> 