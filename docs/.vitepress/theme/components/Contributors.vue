<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const contributors = ref([])
const loading = ref(true)
const error = ref(null)

// GitHub API 配置
const owner = 'xiaoliziawa' // GitHub 用户名
const repo = 'Blogs'        // 仓库名称

onMounted(async () => {
  try {
    const filePath = page.value.filePath
    
    
    if (!filePath) {
      console.warn('No file path found')
      loading.value = false
      return
    }

    const apiPath = filePath.replace(/^docs\//, '')
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=docs/${apiPath}`
    

    const response = await fetch(
      apiUrl,
      { 
        headers: { 
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'VitePress-Site'
        } 
      }
    )

    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`Failed to fetch contributors: ${response.status}`)
    }

    const commits = await response.json()
    console.log('Commits:', commits)
    
    const uniqueContributors = new Map()
    commits.forEach(commit => {
      const author = commit.author || commit.commit.author
      if (author && author.login && !uniqueContributors.has(author.login)) {
        uniqueContributors.set(author.login, {
          login: author.login,
          avatar_url: author.avatar_url,
          html_url: author.html_url
        })
      }
    })

    contributors.value = Array.from(uniqueContributors.values())
  } catch (e) {
    error.value = e
    console.error('Failed to fetch contributors:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="contributors-section">
    <div class="contributors-header">
      <h3>贡献者</h3>
      <div class="contributors-divider"></div>
    </div>
    
    <div v-if="loading" class="contributors-loading">
      加载中...
    </div>
    
    <div v-else-if="error" class="contributors-error">
      加载失败: {{ error.message }}
    </div>
    
    <div v-else-if="contributors.length === 0" class="contributors-empty">
      暂无贡献者信息
    </div>
    
    <div v-else class="contributors-list">
      <a
        v-for="contributor in contributors"
        :key="contributor.login"
        :href="contributor.html_url"
        target="_blank"
        rel="noopener noreferrer"
        class="contributor"
      >
        <img
          :src="contributor.avatar_url"
          :alt="contributor.login"
          class="contributor-avatar"
        />
        <span class="contributor-name">{{ contributor.login }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.contributors-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.contributors-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.contributors-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
  position: relative;
  padding-left: 1.5rem;
}

/* 添加图标 */
.contributors-header h3::before {
  content: "👥";
  position: absolute;
  left: 0;
  font-size: 1.1em;
}

.contributors-divider {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, 
    var(--vp-c-divider) 0%, 
    var(--vp-c-divider) 50%, 
    transparent 100%
  );
}

.contributors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.contributor {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 2rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

/* 鼠标悬停效果 */
.contributor:hover {
  transform: translateY(-2px);
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 添加波纹效果 */
.contributor::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: radial-gradient(circle, var(--vp-c-brand-dimm) 0%, transparent 60%);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.6s ease-out, opacity 0.4s ease-out;
}

.contributor:hover::after {
  opacity: 0.1;
  transform: translate(-50%, -50%) scale(1);
}

.contributor-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 2px solid transparent;
  transform-origin: center center;
  backface-visibility: hidden;
  will-change: transform;
}

.contributor:hover .contributor-avatar {
  transform: scale(1.15) rotate(8deg);
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.contributor-name {
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.contributor:hover .contributor-name {
  color: var(--vp-c-brand);
}

/* 加载和错误状态样式 */
.contributors-loading,
.contributors-error,
.contributors-empty {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  padding: 1rem;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
}

.contributors-loading {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .contributors-list {
    gap: 0.75rem;
  }
  
  .contributor {
    padding: 0.4rem 0.8rem;
  }
  
  .contributor-avatar {
    width: 20px;
    height: 20px;
  }
  
  .contributor-name {
    font-size: 0.8rem;
  }
}

/* 深色模式优化 */
:root.dark .contributor {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:root.dark .contributor:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 添加头像的进入动画 */
@keyframes avatarEnter {
  from {
    opacity: 0;
    transform: scale(0.8) rotate(-15deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

.contributor-avatar {
  animation: avatarEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style> 