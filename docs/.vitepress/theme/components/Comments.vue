<script setup>
import { useData } from 'vitepress'
import { onMounted, watch, ref } from 'vue'

const { frontmatter, page, isDark } = useData()
const isLoaded = ref(false)

// 加载 Giscus
function loadGiscus() {
  console.log('Loading Giscus for:', page.value.relativePath)
  
  const giscus = document.createElement('script')
  giscus.src = 'https://giscus.app/client.js'
  giscus.setAttribute('data-repo', 'xiaoliziawa/Blogs')
  giscus.setAttribute('data-repo-id', 'R_kgDONTHVNA')
  giscus.setAttribute('data-category', 'Announcements')
  giscus.setAttribute('data-category-id', 'DIC_kwDONTHVNM4CkhHT')
  giscus.setAttribute('data-mapping', 'pathname')
  giscus.setAttribute('data-strict', '0')
  giscus.setAttribute('data-reactions-enabled', '1')
  giscus.setAttribute('data-emit-metadata', '0')
  giscus.setAttribute('data-input-position', 'bottom')
  giscus.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  giscus.setAttribute('data-lang', 'zh-CN')
  giscus.setAttribute('crossorigin', 'anonymous')
  giscus.async = true

  const container = document.getElementById('giscus-container')
  if (container) {
    container.innerHTML = ''
    container.appendChild(giscus)
    isLoaded.value = true
    console.log('Giscus script added successfully')
  } else {
    console.warn('Giscus container not found!')
  }
}

// 更新 Giscus 主题
function updateGiscusTheme(theme) {
  const iframe = document.querySelector('.giscus-frame')
  if (iframe) {
    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: theme ? 'dark' : 'light'
          }
        }
      },
      'https://giscus.app'
    )
  }
}

// 监听主题变化
watch(isDark, (newIsDark) => {
  console.log('Theme changed:', newIsDark ? 'dark' : 'light')
  if (isLoaded.value) {
    updateGiscusTheme(newIsDark)
  }
}, { immediate: true })

onMounted(() => {
  console.log('Comments component mounted')
  // 增加延迟确保 DOM 完全加载
  setTimeout(() => {
    loadGiscus()
  }, 1000)
})
</script>

<template>
  <div class="giscus-container">
    <div id="giscus-container"></div>
    <div v-if="!isLoaded" class="giscus-placeholder">评论区加载中...</div>
  </div>
</template>

<style>
.giscus-container {
  margin: 2rem auto;
  padding: 1rem;
  max-width: 1152px;
  position: relative;
  border-top: 1px solid var(--vp-c-divider);
}

.giscus-placeholder {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

#giscus-container {
  min-height: 200px;
}

.giscus-frame {
  margin: 0 auto;
  width: 100% !important;
  background-color: var(--vp-c-bg);
}

/* 深色模式下的样式 */
:root.dark .giscus-frame {
  background-color: var(--vp-c-bg);
}

@media (max-width: 768px) {
  .giscus-container {
    padding: 1rem 0.5rem;
  }
}
</style> 