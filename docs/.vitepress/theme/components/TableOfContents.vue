<template>
  <div class="table-of-contents" v-if="headers.length > 0">
    <div class="toc-header">
      <h3>目录</h3>
      <button @click="toggleCollapse" class="toggle-btn">
        {{ isCollapsed ? '展开' : '收起' }}
      </button>
    </div>
    <nav class="toc-nav" :class="{ collapsed: isCollapsed }">
      <ul>
        <li 
          v-for="header in headers" 
          :key="header.anchor"
          :class="[`level-${header.level}`, { active: activeAnchor === header.anchor }]"
        >
          <a 
            :href="header.anchor" 
            @click.prevent="scrollToAnchor(header.anchor)"
            :title="header.title"
          >
            {{ header.title }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const headers = ref([])
const activeAnchor = ref('')
const isCollapsed = ref(false)

const extractHeaders = () => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headers.value = Array.from(headings).map(heading => {
    const level = parseInt(heading.tagName.charAt(1))
    const title = heading.textContent || heading.innerText
    const anchor = heading.id ? `#${heading.id}` : `#${title.toLowerCase().replace(/\s+/g, '-')}`
    
    if (!heading.id) {
      heading.id = anchor.slice(1)
    }
    
    return {
      level,
      title,
      anchor
    }
  })
}

const scrollToAnchor = (anchor) => {
  const element = document.querySelector(anchor)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeAnchor.value = anchor
  }
}

const updateActiveAnchor = () => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  
  let currentAnchor = ''
  
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i]
    const rect = heading.getBoundingClientRect()
    
    if (rect.top <= windowHeight * 0.3) {
      currentAnchor = `#${heading.id}`
    } else {
      break
    }
  }
  
  if (currentAnchor !== activeAnchor.value) {
    activeAnchor.value = currentAnchor
  }
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleScroll = () => {
  updateActiveAnchor()
}

onMounted(() => {
  nextTick(() => {
    extractHeaders()
    updateActiveAnchor()
    window.addEventListener('scroll', handleScroll, { passive: true })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 监听路由变化重新提取标题
watch(() => route.path, () => {
  nextTick(() => {
    extractHeaders()
    updateActiveAnchor()
  })
})
</script>

<style scoped>
.table-of-contents {
  position: fixed;
  top: 20%;
  right: 20px;
  max-width: 280px;
  max-height: 60vh;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  transition: all 0.3s ease;
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
}

.toc-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.toc-nav {
  max-height: calc(60vh - 60px);
  overflow-y: auto;
  transition: max-height 0.3s ease;
}

.toc-nav.collapsed {
  max-height: 0;
  overflow: hidden;
}

.toc-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-nav li {
  margin: 0;
}

.toc-nav li a {
  display: block;
  padding: 6px 16px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 13px;
  line-height: 1.4;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
  word-break: break-word;
}

.toc-nav li a:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.toc-nav li.active a {
  color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.level-1 a {
  font-weight: 600;
}

.level-2 a {
  padding-left: 24px;
}

.level-3 a {
  padding-left: 32px;
}

.level-4 a {
  padding-left: 40px;
}

.level-5 a {
  padding-left: 48px;
}

.level-6 a {
  padding-left: 56px;
}

/* 滚动条样式 */
.toc-nav::-webkit-scrollbar {
  width: 4px;
}

.toc-nav::-webkit-scrollbar-track {
  background: transparent;
}

.toc-nav::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 2px;
}

.toc-nav::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .table-of-contents {
    display: none;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .table-of-contents {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
}
</style>