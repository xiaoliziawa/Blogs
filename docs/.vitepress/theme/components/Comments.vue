<script setup>
import { useData } from 'vitepress'
import { onMounted, watch, ref, nextTick } from 'vue'

const { frontmatter, page, isDark } = useData()
const isLoaded = ref(false)

function loadGiscus() {
  console.log('Loading Giscus for:', page.value.relativePath)
  
  const existingGiscus = document.querySelector('.giscus-frame')
  if (existingGiscus) {
    existingGiscus.remove()
  }
  
  nextTick(() => {
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
    giscus.setAttribute('data-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light')
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
  })
}

function updateGiscusTheme(newIsDark) {
  const iframe = document.querySelector('.giscus-frame')
  if (!iframe) {
    loadGiscus()
    return
  }

  try {
    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: newIsDark ? 'dark' : 'light'
          }
        }
      },
      'https://giscus.app'
    )
  } catch (e) {
    console.error('Failed to update Giscus theme:', e)
    loadGiscus()
  }
}

watch(isDark, (newIsDark) => {
  console.log('Theme changed:', newIsDark ? 'dark' : 'light')
  if (isLoaded.value) {
    updateGiscusTheme(newIsDark)
  }
}, { immediate: false })

onMounted(() => {
  console.log('Comments component mounted')
  setTimeout(() => {
    loadGiscus()
  }, 100)
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && mutation.target === document.documentElement) {
        const isDarkMode = document.documentElement.classList.contains('dark')
        updateGiscusTheme(isDarkMode)
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
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
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.giscus-placeholder {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

#giscus-container {
  min-height: 200px;
  width: 100%;
  overflow: hidden;
}

.giscus-frame {
  margin: 0 auto;
  width: 100% !important;
  background-color: transparent !important;
  max-width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .giscus-container {
    padding: 1rem 0.5rem;
    margin: 2rem 0;
  }
}
</style> 