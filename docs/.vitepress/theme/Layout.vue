<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Comments from './components/Comments.vue'
import ImagePreview from './components/ImagePreview.vue'
import Contributors from './components/Contributors.vue'
import PageHistory from './components/PageHistory.vue'
import CursorHighlight from './components/CursorHighlight.vue'
import ThemeColorPicker from './components/ThemeColorPicker.vue'
import AdBanner from './components/AdBanner.vue'
import { ref, onMounted } from 'vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>

<template>
  <transition name="loading-fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="gooey-container">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="150px" height="150px">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </transition>

  <Layout>
    <template #doc-after>
      <Contributors />
      <PageHistory />
      <Comments v-if="!frontmatter.home" />
      <ImagePreview />
    </template>
    <template #nav-bar-content-after>
      <div class="nav-theme-color-picker">
        <ThemeColorPicker />
      </div>
    </template>
  </Layout>
  <CursorHighlight />
  <AdBanner />
</template>

<style>
:deep(.VPDoc) {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
}

:deep(.VPDoc .container) {
  max-width: calc(var(--vp-layout-max-width) - var(--vp-sidebar-width) - var(--vp-aside-width));
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.nav-theme-color-picker {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

@media (max-width: 960px) {
  :deep(.VPDoc .container) {
    max-width: 100%;
    padding: 0 16px;
  }
  
  .nav-theme-color-picker {
    margin-right: 8px;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--vp-c-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.gooey-container {
  width: 150px;
  height: 150px;
  position: relative;
  filter: url('#goo');
}

.dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.dot {
  position: absolute;
  width: 35px;
  height: 35px;
  background: var(--vp-c-brand);
  border-radius: 50%;
  transform: translate(50%, 50%);
  animation: move 2.5s ease-in-out infinite;
}

.dot:nth-child(1) {
  top: 15%; left: 15%;
  animation-delay: 0s;
}
.dot:nth-child(2) {
  top: 15%; left: 65%;
  animation-delay: -0.8s;
}
.dot:nth-child(3) {
  top: 65%; left: 40%;
  animation-delay: -1.6s;
}

@keyframes move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(80%, 30%) scale(0.8);
  }
  50% {
    transform: translate(40%, 90%) scale(1.1);
  }
  75% {
    transform: translate(-30%, 50%) scale(0.9);
  }
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style> 