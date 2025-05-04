<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  curseForgeId: {
    type: String,
    required: true
  },
  modName: {
    type: String,
    required: true
  },
  iconUrl: {
    type: String,
    default: ''
  },
  projectId: {
    type: String,
    default: ''
  }
})

const icon = ref(props.iconUrl)
const downloadCount = ref(0)
const isLoading = ref(false)
const errorMsg = ref('')

const gameVersions = ref([])
const dateCreated = ref(null)
const dateModified = ref(null)
const authors = ref([])

const CF_API_KEY = import.meta.env.VITE_CF_API_KEY || ''
const CF_API_URL = 'https://api.curseforge.com/v1/mods'

const formattedDownloads = computed(() => {
  if (downloadCount.value < 1000) {
    return downloadCount.value
  } else if (downloadCount.value < 1000000) {
    return (downloadCount.value / 1000).toFixed(1) + 'K'
  } else {
    return (downloadCount.value / 1000000).toFixed(1) + 'M'
  }
})

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formattedDateCreated = computed(() => {
  return formatDate(dateCreated.value)
})

const formattedDateModified = computed(() => {
  return formatDate(dateModified.value)
})

const curseForgeUrl = computed(() => {
  return `https://www.curseforge.com/minecraft/mc-mods/${props.curseForgeId}`
})

const fetchModData = async () => {
  if (!props.projectId) return
  
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const response = await fetch(`${CF_API_URL}/${props.projectId}`, {
      method: 'GET',
      headers: {
        'x-api-key': CF_API_KEY,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data && data.data) {
      downloadCount.value = data.data.downloadCount || 0
      
      if (data.data.latestFilesIndexes && data.data.latestFilesIndexes.length > 0) {
        const versions = data.data.latestFilesIndexes.map(file => file.gameVersion).filter(Boolean)
        gameVersions.value = [...new Set(versions)]
      } else {
        gameVersions.value = data.data.gameVersions || []
      }
      
      dateCreated.value = data.data.dateCreated || null
      dateModified.value = data.data.dateModified || null
      authors.value = data.data.authors || []
      
      if (!props.iconUrl && data.data.logo && data.data.logo.thumbnailUrl) {
        icon.value = data.data.logo.thumbnailUrl
      }
    }
  } catch (error) {
    errorMsg.value = `获取模组数据失败: ${error.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchModData()
})
</script>

<template>
  <div class="mod-info">
    <div class="mod-header">
      <div class="mod-icon">
        <img :src="icon" :alt="modName" class="no-preview" />
      </div>
      <div class="mod-stats">
        <h1 class="mod-title">{{ modName }}</h1>
        
        <div class="mod-badges">
          <a :href="curseForgeUrl" target="_blank" rel="noopener noreferrer" class="badge-link no-external-icon">
            <div v-if="projectId && !isLoading && !errorMsg && downloadCount > 0" class="download-stats">
              <div class="download-count">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="download-icon">
                  <path fill="currentColor" d="M12 16l-4-4h2.5V8h3v4H16l-4 4zm5-12H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H7V6h10v12z"/>
                </svg>
                <span>{{ formattedDownloads }} 次下载</span>
              </div>
            </div>
            
            <div v-else-if="isLoading" class="loading-state">
              <span>加载中...</span>
            </div>
            
            <div v-else-if="errorMsg" class="error-state">
              <span>{{ errorMsg }}</span>
            </div>
            
            <div v-if="!projectId" class="curseforge-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512" class="curseforge-icon">
                <path fill="currentColor" d="M272 64c-33 0-65.3 8.4-94 24.7l-10.2-19.3C159 56.7 145 49.2 131 50c-14 .8-26.9 9.5-34 23L15 231c-13.6 25.7-4 57.6 21.6 71.1l3.3 1.8L24.4 361c-11.3 20.1-9.5 45 4.4 63.2s35.8 27.6 58 25.4l44.9-4.5c3.2 12.2 13.4 22.5 26.8 25.5c14.2 3.2 28.8-2.5 36.8-14.1l27.9-40.2C255.8 420 320 369.8 320 304c0-66.3-53.7-120-120-120h-1c-48.1 .3-88.3 34.9-97.2 81.3c-8.5 44.3 13.7 88.4 54.7 109.2l41 20.5c13.6 6.8 21.3 21.8 19.1 37c-2.2 15.2-14.6 27.2-30 28.8l-11.7 1.2c-16.6 1.6-28.9 16.3-27.2 32.9s16.3 28.9 32.9 27.2l11.7-1.2c41.2-4.1 74.3-37.5 77.8-79.1s-21.1-78.6-61.3-96.2l-41-20.5c-20.2-10.1-31.1-33.9-26.9-56.8c4.5-23.9 25.4-41.1 50.2-41.2h.4c32.8 0 59.5 26.7 59.5 59.5c0 32-30.8 64-72 83.3c-14.7 6.9-21 24.2-14.1 38.8s24.2 21 38.8 14.1c22.3-10.4 43-24.6 60.2-41.9c27.1-27.2 43.1-62 43.1-94.3c0-66.8-54.2-121-121-121zm64 384c0 26.5 21.5 48 48 48h64c26.5 0 48-21.5 48-48s-21.5-48-48-48H384c-26.5 0-48 21.5-48 48zm144-16c8.8 0 16 7.2 16 16s-7.2 16-16 16H384c-8.8 0-16-7.2-16-16s7.2-16 16-16h96z"/>
              </svg>
              <span>查看CurseForge页面</span>
            </div>
          </a>
        </div>
      </div>
    </div>
    
    <div v-if="projectId && !isLoading && !errorMsg" class="mod-details">
      <div v-if="gameVersions.length > 0" class="detail-section">
        <h3 class="detail-title">支持的Minecraft版本</h3>
        <div class="version-tags">
          <span v-for="(version, index) in gameVersions" :key="index" class="version-tag">
            {{ version }}
          </span>
        </div>
      </div>
      
      <div v-if="authors.length > 0" class="detail-section">
        <h3 class="detail-title">模组作者</h3>
        <div class="authors-list">
          <a v-for="(author, index) in authors" :key="index" 
             :href="author.url" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="author-tag no-external-icon">
            {{ author.name }}
          </a>
        </div>
      </div>
      
      <div class="detail-section">
        <div class="dates-row">
          <div v-if="dateCreated" class="date-item">
            <span class="date-label">创建日期:</span>
            <span class="date-value">{{ formattedDateCreated }}</span>
          </div>
          
          <div v-if="dateModified" class="date-item">
            <span class="date-label">最后更新:</span>
            <span class="date-value">{{ formattedDateModified }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mod-info {
  margin-bottom: 20px;
  background-color: rgba(var(--vp-c-bg-soft-rgb, 245, 245, 245), 0.8);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.mod-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.05) 0%, 
    transparent 100%);
  z-index: 0;
  border-radius: 16px;
}

.mod-info:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  border-color: rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.25);
  transform: translateY(-2px);
}

.dark .mod-info {
  background-color: rgba(var(--vp-c-bg-soft-rgb, 36, 36, 36), 0.8);
  border-color: rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.dark .mod-info::before {
  background: linear-gradient(135deg, 
    rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.08) 0%, 
    transparent 100%);
}

.dark .mod-info:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  border-color: rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.35);
}

.mod-header {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.mod-icon {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.15);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mod-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.mod-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mod-stats {
  flex: 1;
}

.mod-title {
  margin: 0 0 12px 0;
  font-size: 1.6rem;
  line-height: 1.2;
  background: linear-gradient(90deg, 
    var(--vp-c-brand) 0%, 
    var(--vp-c-brand-light, var(--vp-c-brand)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mod-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge-link {
  text-decoration: none;
  display: inline-block;
}

.no-external-icon::after {
  display: none !important;
}

.badge-container {
  display: inline-block;
  padding: 2px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.badge-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.badge {
  height: 28px;
  border-radius: 4px;
  display: block;
}

.curseforge-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(90deg, #f16436 0%, #e04e1d 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(241, 100, 54, 0.3);
}

.curseforge-link:hover {
  background: linear-gradient(90deg, #e04e1d 0%, #f16436 100%);
  box-shadow: 0 4px 12px rgba(241, 100, 54, 0.4);
  transform: translateY(-2px);
}

.curseforge-icon {
  flex-shrink: 0;
}

.download-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-count {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(90deg, #f16436 0%, #e04e1d 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(241, 100, 54, 0.3);
}

.download-count:hover {
  background: linear-gradient(90deg, #e04e1d 0%, #f16436 100%);
  box-shadow: 0 4px 12px rgba(241, 100, 54, 0.4);
  transform: translateY(-2px);
}

.download-icon {
  flex-shrink: 0;
}

.loading-state {
  padding: 8px 16px;
  background: rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.1);
  color: var(--vp-c-brand);
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
}

.error-state {
  padding: 8px 16px;
  background: rgba(var(--vp-c-danger-rgb, 220, 38, 38), 0.1);
  color: var(--vp-c-danger, #dc2626);
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
}

.mod-details {
  margin-top: 16px;
  border-top: 1px dashed rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.2);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-title {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 600;
}

.version-tags, .authors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 100%;
}

.version-tag {
  padding: 3px 8px;
  background-color: rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.1);
  color: var(--vp-c-brand);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.version-tag:hover {
  background-color: rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.2);
  transform: translateY(-1px);
}

.author-tag {
  padding: 4px 10px;
  background-color: rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.1);
  color: var(--vp-c-brand);
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.author-tag:hover {
  background-color: rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.2);
  transform: translateY(-1px);
}

.dates-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.date-value {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .mod-badges {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .mod-icon {
    width: 64px;
    height: 64px;
  }
  
  .mod-title {
    font-size: 1.6rem;
  }
  
  .mod-info {
    padding: 18px;
  }
  
  .dates-row {
    flex-direction: column;
    gap: 16px;
  }
}
</style> 