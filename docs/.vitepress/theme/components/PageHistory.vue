<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const commits = ref([])
const loading = ref(true)
const error = ref(null)
const isExpanded = ref(false)

// GitHub API 配置
const owner = 'xiaoliziawa'
const repo = 'Blogs'

const contentHeight = ref(0)
const contentRef = ref(null)

const isCollapsed = ref(false)

const INITIAL_DISPLAY_COUNT = 5
const displayedCommits = ref([])

watch(commits, (newCommits) => {
  displayedCommits.value = newCommits
}, { immediate: true })

onMounted(async () => {
  try {
    const filePath = page.value.filePath
    if (!filePath) {
      loading.value = false
      return
    }

    const apiPath = filePath.replace(/^docs\//, '')
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=docs/${apiPath}`
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'VitePress-Site'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.status}`)
    }

    const data = await response.json()
    commits.value = data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      date: new Date(commit.commit.author.date),
      author: commit.author?.login || commit.commit.author.name,
      avatar_url: commit.author?.avatar_url,
      html_url: commit.html_url
    }))
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
})

function formatDate(date) {
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days} 天前`
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const commitCount = computed(() => commits.value.length)
</script>

<template>
  <div class="page-history">
    <div class="history-header" @click="isCollapsed = !isCollapsed">
      <div class="header-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="history-icon">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0a9 9 0 0 1 18 0z"/>
        </svg>
        <span>更新历史</span>
        <span v-if="commitCount > 0" class="commit-count">({{ commitCount }}次更新)</span>
      </div>
      <div class="collapse-icon" :class="{ 'is-collapsed': !isCollapsed }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>

    <div class="history-content" :class="{ 'is-collapsed': !isCollapsed }">
      <div v-if="loading" class="history-loading">
        <div class="loading-spinner"></div>
        正在加载更新历史...
      </div>
      
      <div v-else-if="error" class="history-error">
        {{ error.message }}
      </div>
      
      <div v-else-if="commits.length === 0" class="history-empty">
        暂无更新记录
      </div>
      
      <div v-else class="timeline-items custom-scrollbar">
        <div v-for="(commit, index) in displayedCommits" 
             :key="commit.sha" 
             class="timeline-item"
             :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="timeline-point"></div>
          <div class="timeline-content">
            <a :href="commit.html_url" target="_blank" rel="noopener" class="commit-link">
              <div class="commit-header">
                <img 
                  v-if="commit.avatar_url" 
                  :src="commit.avatar_url" 
                  :alt="commit.author"
                  class="author-avatar"
                />
                <span class="author-name">{{ commit.author }}</span>
                <span class="commit-date">{{ formatDate(commit.date) }}</span>
              </div>
              <div class="commit-message">{{ commit.message }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-history {
  margin: 2rem 0;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.history-header {
  padding: 0.8rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: background-color 0.3s ease;
}

.history-header:hover {
  background-color: var(--vp-c-bg-mute);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.history-icon {
  width: 16px;
  height: 16px;
}

.history-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
  padding: 1rem;
  transform-origin: top;
  transform: scaleY(1);
}

.history-content.is-collapsed {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin: 0;
  transform: scaleY(0);
}

/* 添加展开/折叠过渡动画 */
@keyframes expandContent {
  from {
    max-height: 0;
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    max-height: 1000px;
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes collapseContent {
  from {
    max-height: 1000px;
    opacity: 1;
    transform: scaleY(1);
  }
  to {
    max-height: 0;
    opacity: 0;
    transform: scaleY(0);
  }
}

.history-content:not(.is-collapsed) {
  animation: expandContent 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.history-content.is-collapsed {
  animation: collapseContent 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.timeline-items {
  position: relative;
  padding-left: 2rem;
  padding-right: 1rem;
  max-height: 400px;
  overflow-y: auto;
  transition: all 0.3s ease;
  padding-bottom: 1rem;
}

.timeline-items::before,
.timeline-items::after {
  display: none;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: calc(-2rem + 6px);
  top: 1rem;
  width: 2px;
  height: calc(100% + 1.5rem);
  background-color: var(--vp-c-divider-light);
  z-index: 0;
}

.timeline-item:last-child::before {
  height: 0;
}

.timeline-point {
  position: absolute;
  left: -1.5rem;
  top: 0.75rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--vp-c-brand);
  border: 2px solid var(--vp-c-bg-soft);
  transform: translateX(-50%);
  z-index: 2;
}

.timeline-content {
  margin-left: 0.5rem;
  position: relative;
  z-index: 1;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 6px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.timeline-content:hover {
  transform: translateX(4px);
  border-color: var(--vp-c-brand-light);
}

.commit-link {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.commit-link:hover .commit-message {
  color: var(--vp-c-brand);
}

.commit-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.timeline-content:hover .author-avatar {
  transform: scale(1.1) rotate(5deg);
}

.author-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.commit-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.commit-message {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.history-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-divider-light);
  border-top-color: var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.history-error,
.history-empty {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
  animation: shakeX 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shakeX {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.history-empty {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.commit-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-left: 0.5rem;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand);
  border-radius: 3px;
  opacity: 0.5;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand-dark);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-brand) var(--vp-c-bg-soft);
}

.timeline-item {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeline-point {
  animation: scaleIn 0.3s ease-out forwards;
  transform: scale(0) translateX(-50%);
}

@keyframes scaleIn {
  from {
    transform: scale(0) translateX(-50%);
  }
  to {
    transform: scale(1) translateX(-50%);
  }
}

.timeline-content {
  position: relative;
  overflow: hidden;
}

.timeline-content::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    var(--vp-c-brand-dimm) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-content:hover::after {
  opacity: 0.1;
}

.commit-link {
  transition: all 0.3s ease;
}

.commit-link:hover .commit-message {
  color: var(--vp-c-brand);
}

.author-avatar {
  transition: transform 0.3s ease;
}

.timeline-content:hover .author-avatar {
  transform: scale(1.1) rotate(5deg);
}

.loading-spinner {
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.history-error {
  animation: shakeX 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shakeX {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.history-empty {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 640px) {
  .timeline-items {
    max-height: 300px;
  }
  
  .commit-header {
    flex-wrap: wrap;
  }
  
  .commit-date {
    width: 100%;
    margin-top: 0.25rem;
    margin-left: 0;
  }
}

.collapse-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapse-icon.is-collapsed {
  transform: rotate(-180deg);
}

.history-content {
  border-top: 1px solid var(--vp-c-divider-light);
  transition: all 0.3s ease-in-out;
}

.history-content.is-collapsed {
  border-top: none;
}
</style> 