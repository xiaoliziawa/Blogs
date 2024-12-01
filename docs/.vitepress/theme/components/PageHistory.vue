<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
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

watch([isExpanded, commits], ([newExpanded, newCommits]) => {
  if (newExpanded) {
    nextTick(() => {
      if (contentRef.value) {
        contentHeight.value = `${contentRef.value.scrollHeight}px`
      }
    })
  } else {
    contentHeight.value = '0px'
  }
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
</script>

<template>
  <div class="page-history">
    <div 
      class="history-header" 
      @click="isExpanded = !isExpanded"
      :class="{ 'expanded': isExpanded }"
    >
      <div class="header-left">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="history-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0a9 9 0 0 1 18 0z"/>
          </svg>
        </span>
        <h3>页面历史</h3>
      </div>
      <div class="expand-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="arrow-icon">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9l6 6l6-6"/>
        </svg>
      </div>
    </div>

    <div 
      ref="contentRef"
      class="history-content" 
      :class="{ expanded: isExpanded }"
      :style="{
        height: contentHeight,
        visibility: contentHeight === '0px' ? 'hidden' : 'visible'
      }"
    >
      <div v-if="loading" class="history-loading">
        加载历史记录中...
      </div>
      
      <div v-else-if="error" class="history-error">
        加载失败: {{ error.message }}
      </div>
      
      <div v-else-if="commits.length === 0" class="history-empty">
        暂无历史记录
      </div>
      
      <div v-else class="commits-list">
        <a
          v-for="commit in commits"
          :key="commit.sha"
          :href="commit.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="commit-item"
        >
          <div class="commit-avatar">
            <img 
              v-if="commit.avatar_url" 
              :src="commit.avatar_url" 
              :alt="commit.author"
            />
            <div v-else class="avatar-placeholder">
              {{ commit.author[0]?.toUpperCase() }}
            </div>
          </div>
          
          <div class="commit-info">
            <div class="commit-message">{{ commit.message }}</div>
            <div class="commit-meta">
              <span class="commit-author">{{ commit.author }}</span>
              <span class="commit-date">{{ formatDate(commit.date) }}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-history {
  margin-top: 3rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.history-header:hover {
  background: var(--vp-c-bg-mute);
}

.history-header.expanded {
  border-bottom-color: var(--vp-c-divider);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-left h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.history-icon {
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-2);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-2);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.history-header.expanded .arrow-icon {
  transform: rotate(-180deg);
}

.history-content {
  height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: height, opacity;
}

.history-content.expanded {
  opacity: 1;
}

.commits-list {
  padding: 1rem;
}

.history-content.expanded .commits-list {
  animation: slideDown 0.4s cubic-bezier(0.33, 1, 0.68, 1) forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.commit-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateX(-10px);
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.commit-item:nth-child(1) { animation-delay: 0.1s; }
.commit-item:nth-child(2) { animation-delay: 0.15s; }
.commit-item:nth-child(3) { animation-delay: 0.2s; }
.commit-item:nth-child(4) { animation-delay: 0.25s; }
.commit-item:nth-child(5) { animation-delay: 0.3s; }

.commit-item:last-child {
  margin-bottom: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.commit-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.commit-item:hover {
  transform: translateX(4px) scale(1.01);
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.commit-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--vp-c-brand-dimm) 0%, transparent 60%);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.6s ease-out, opacity 0.4s ease-out;
}

.commit-item:hover::after {
  opacity: 0.1;
  transform: translate(-50%, -50%) scale(2);
}

.commit-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.commit-item:hover .commit-avatar {
  transform: scale(1.1) rotate(5deg);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--vp-c-brand);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.commit-info {
  flex: 1;
  min-width: 0;
}

.commit-message {
  font-weight: 500;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.commit-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.history-loading,
.history-error,
.history-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

/* 深色模式优化 */
:root.dark .page-history {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 响应式优化 */
@media (max-width: 640px) {
  .commit-avatar {
    width: 32px;
    height: 32px;
  }
  
  .commit-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.history-loading {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style> 