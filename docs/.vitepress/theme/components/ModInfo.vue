<script setup>
import { ref, computed, onMounted } from 'vue'

// 组件属性定义
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
  },
  // 添加Modrinth相关属性
  modrinthId: {
    type: String,
    default: ''
  },
  modrinthSlug: {
    type: String,
    default: ''
  }
})

// 响应式状态
const modData = ref({
  downloadCount: 0,
  dateCreated: null,
  dateModified: null,
  gameVersions: [],
  authors: [],
  logoUrl: null
})

// Modrinth数据
const modrinthData = ref({
  downloadCount: 0,
  dateCreated: null,
  dateModified: null,
  gameVersions: [],
  team: [],
  iconUrl: null
})

const icon = ref(props.iconUrl)
const isLoading = ref(false)
const errorMsg = ref('')
const modrinthLoading = ref(false)
const modrinthErrorMsg = ref('')

// API配置
const CF_API_KEY = import.meta.env.VITE_CF_API_KEY || ''
const CF_API_URL = 'https://api.curseforge.com/v1/mods'
const MODRINTH_API_URL = 'https://api.modrinth.com/v2'

// 格式化工具函数
const formatNumber = (num) => {
  if (num < 1000) return String(num)
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K'
  return (num / 1000000).toFixed(1) + 'M'
}


const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// 计算属性
const formattedDownloads = computed(() => formatNumber(modData.value.downloadCount))
const formattedDateCreated = computed(() => formatDate(modData.value.dateCreated))
const formattedDateModified = computed(() => formatDate(modData.value.dateModified))
const curseForgeUrl = computed(() => `https://www.curseforge.com/minecraft/mc-mods/${props.curseForgeId}`)

// Modrinth计算属性
const formattedModrinthDownloads = computed(() => formatNumber(modrinthData.value.downloadCount))
const modrinthUrl = computed(() => {
  if (props.modrinthSlug) {
    return `https://modrinth.com/mod/${props.modrinthSlug}`
  } else if (props.modrinthId) {
    return `https://modrinth.com/mod/${props.modrinthId}`
  }
  return null
})

// 版本排序
const compareVersions = (a, b) => {
  const aParts = a.split('.').map(Number)
  const bParts = b.split('.').map(Number)
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = i < aParts.length ? aParts[i] : 0
    const bVal = i < bParts.length ? bParts[i] : 0
    
    if (aVal !== bVal) return bVal - aVal
  }
  
  return 0
}

const sortedVersions = computed(() => {
  if (!modData.value.gameVersions.length) return []
  return [...modData.value.gameVersions].sort(compareVersions)
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
    
    const { data } = await response.json()
    
    if (data) {
      let gameVersions = []
      if (data.latestFilesIndexes?.length > 0) {
        const versions = data.latestFilesIndexes
          .map((file) => file.gameVersion)
          .filter(Boolean)
        gameVersions = [...new Set(versions)]
      } else if (data.gameVersions) {
        gameVersions = data.gameVersions
      }
      
      modData.value = {
        downloadCount: data.downloadCount || 0,
        dateCreated: data.dateCreated || null,
        dateModified: data.dateModified || null,
        gameVersions,
        authors: data.authors || [],
        logoUrl: data.logo?.thumbnailUrl || null
      }
      
      // 保存数据到本地存储以便离线使用
      try {
        localStorage.setItem(`mod_data_${props.projectId}`, JSON.stringify(modData.value))
      } catch (storageErr) {
        console.warn('无法保存模组数据到本地存储:', storageErr)
      }
      
      if (!props.iconUrl && modData.value.logoUrl) {
        icon.value = modData.value.logoUrl
      }
    }
  } catch (error) {
    // 尝试从本地存储加载缓存数据
    try {
      const cachedData = localStorage.getItem(`mod_data_${props.projectId}`)
      if (cachedData) {
        modData.value = JSON.parse(cachedData)
        if (!props.iconUrl && modData.value.logoUrl) {
          icon.value = modData.value.logoUrl
        }
        errorMsg.value = '使用缓存数据显示 (API请求失败)'
        console.warn('使用缓存的模组数据')
        return
      }
    } catch (cacheError) {
      console.error('读取缓存数据失败:', cacheError)
    }
    
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    errorMsg.value = `获取模组数据失败: ${errorMessage}`
  } finally {
    isLoading.value = false
  }
}

// 获取Modrinth数据
const fetchModrinthData = async () => {
  // 如果没有提供id或slug，则不进行请求
  if (!props.modrinthId && !props.modrinthSlug) return
  
  modrinthLoading.value = true
  modrinthErrorMsg.value = ''
  
  try {
    // 确定要使用的标识符（id或slug）
    const identifier = props.modrinthId || props.modrinthSlug
    const response = await fetch(`${MODRINTH_API_URL}/project/${identifier}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Documentation-Website/1.0',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Modrinth API请求失败: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data) {
      modrinthData.value = {
        downloadCount: data.downloads || 0,
        dateCreated: data.published || null,
        dateModified: data.updated || null,
        gameVersions: data.game_versions || [],
        team: data.team || '',
        iconUrl: data.icon_url || null
      }
      
      // 保存数据到本地存储以便离线使用
      try {
        localStorage.setItem(`modrinth_data_${identifier}`, JSON.stringify(modrinthData.value))
      } catch (storageErr) {
        console.warn('无法保存Modrinth模组数据到本地存储:', storageErr)
      }
      
      // 如果没有从CurseForge设置图标且有Modrinth图标，则使用Modrinth图标
      if (!props.iconUrl && !modData.value.logoUrl && modrinthData.value.iconUrl) {
        icon.value = modrinthData.value.iconUrl
      }
    }
  } catch (error) {
    // 尝试从本地存储加载缓存数据
    try {
      const identifier = props.modrinthId || props.modrinthSlug
      const cachedData = localStorage.getItem(`modrinth_data_${identifier}`)
      if (cachedData) {
        modrinthData.value = JSON.parse(cachedData)
        if (!props.iconUrl && !modData.value.logoUrl && modrinthData.value.iconUrl) {
          icon.value = modrinthData.value.iconUrl
        }
        modrinthErrorMsg.value = '使用缓存数据显示 (Modrinth API请求失败)'
        console.warn('使用缓存的Modrinth模组数据')
        return
      }
    } catch (cacheError) {
      console.error('读取Modrinth缓存数据失败:', cacheError)
    }
    
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    modrinthErrorMsg.value = `获取Modrinth模组数据失败: ${errorMessage}`
  } finally {
    modrinthLoading.value = false
  }
}

// 生命周期钩子
onMounted(async () => {
  await fetchModData()
  await fetchModrinthData()
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
          <!-- CurseForge下载量 -->
          <a :href="curseForgeUrl" target="_blank" rel="noopener noreferrer" class="badge-link no-external-icon">
            <div v-if="projectId && !isLoading && !errorMsg && modData.downloadCount > 0" class="download-stats">
              <div class="download-count">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="download-icon">
                  <path fill="currentColor" d="m6.307 5.581.391 1.675H0s.112.502.167.558c.168.279.335.614.559.837 1.06 1.228 2.902 1.73 4.409 2.009 1.06.224 2.121.28 3.181.335l1.228 3.293h.67l.391 1.061h-.558l-.949 3.07h9.321l-.949-3.07h-.558l.39-1.061h.67s.558-3.404 2.288-4.967C21.935 7.758 24 7.535 24 7.535V5.581H6.307zm9.377 8.428c-.447.279-.949.279-1.284.503-.223.111-.335.446-.335.446-.223-.502-.502-.67-.837-.781-.335-.112-.949-.056-1.786-.782-.558-.502-.614-1.172-.558-1.507v-.167c0-.056 0-.112.056-.168.111-.334.39-.669.948-.893 0 0-.39.559 0 1.117.224.335.67.502 1.061.279.167-.112.279-.335.335-.503.111-.39.111-.781-.224-1.06-.502-.446-.613-1.06-.279-1.451 0 0 .112.502.614.446.335 0 .335-.111.224-.223-.056-.167-.782-1.228.279-2.009 0 0 .669-.447 1.451-.391-.447.056-.949.335-1.116.782v.055c-.168.447-.056.949.279 1.396.223.335.502.614.614 1.06-.168-.056-.279 0-.391.112a.533.533 0 0 0-.112.502c.056.112.168.223.279.223h.168c.167-.055.279-.279.223-.446.112.111.167.391.112.558 0 .167-.112.335-.168.446-.056.112-.167.224-.223.335-.056.112-.112.224-.112.335 0 .112 0 .279.056.391.223.335.67 0 .782-.279.167-.335.111-.726-.112-1.061 0 0 .391.224.67 1.005.223.67-.168 1.451-.614 1.73z"/>
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
          
          <!-- Modrinth下载量 -->
          <a v-if="modrinthUrl" :href="modrinthUrl" target="_blank" rel="noopener noreferrer" class="badge-link no-external-icon">
            <div v-if="!modrinthLoading && !modrinthErrorMsg && modrinthData.downloadCount > 0" class="download-stats modrinth-stats">
              <div class="download-count modrinth-download-count">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 514" class="download-icon">
                  <path fill="currentColor" d="M379.87 249.08a161.67 161.67 0 0 1-19.06 75.72c-9.6 17.56-22.13 33.48-36.2 47.45-12.25 12.24-18.86 11.75-31.89-.38l-98.22-98.78c-5.77-5.9-9.68-11.87-10.72-20.14-1.53-12.06 8.82-24.87 20.6-25.1 6.35-.12 11.76 2.52 16.16 6.91l52.4 52.23c3.43 3.43 6.82 6.9 10.06 10.5 2.85 3.2 5.36 2.68 7.47-.95 2.52-4.33 4.01-9.1 5.52-13.89 7.24-22.9 8.2-46.22 4.26-69.66-4.74-28.2-17.18-52.21-37.57-71.43-14.11-13.3-30.74-22.45-49.28-27.56-19.57-5.4-39.48-5.98-59.5-2.5-40.4 7-71.6 29.26-91.04 66.56-8.84 16.94-13.25 35.1-14.28 54.26-.94 17.64 1.58 34.68 8.28 51.08 7.38 17.92 18.31 33.12 32.8 45.67 10.76 9.32 22.68 16.6 35.63 22.2 13.86 5.97 28.24 9.87 43.28 11.34 10.82 1.06 21.56.91 32.32-.62 19.7-2.8 38.02-9.44 54.67-20.45 13.6-9.02 24.95-20.34 34.78-33.31 3.87-5.1 7.32-10.49 10.55-16.03 1.05-1.8 1.56-4.05 4.85-2.42.5.25 1.72-.86 2.58-1.36 7.34-4.28 14.14-1.44 19.82 3.8 6.65 6.13 8.54 16.45 2.98 24.12-2.47 3.43-5.26 6.65-8.08 9.81-13.45 15.15-29.22 27.13-47.28 35.78-38.34 18.4-77.66 19.57-117.03 4.62a164.11 164.11 0 0 1-41.6-22.11c-30.31-22.5-50.62-51.59-59.93-88.59-5.91-23.43-6.77-47.1-2.6-70.88 6.13-35.07 22.22-64.52 47.81-88.75 20.38-19.32 44.37-32.22 71.71-38.54 20.44-4.71 41-5.18 61.64-1.37a196.12 196.12 0 0 1 29.73 7.79c19.95 6.86 37.85 17.3 53.56 31.67 19.81 18.08 34.36 39.85 43.19 65.6 6.27 18.24 9.14 36.97 8.77 56.2-.27 13.16-1.79 26.13-5.75 38.82-.56 1.8-1.25 3.56-1.92 5.43l.62.08Z"/>
                </svg>
                <span>{{ formattedModrinthDownloads }} 次下载</span>
              </div>
            </div>
            
            <div v-else-if="modrinthLoading" class="loading-state">
              <span>加载中...</span>
            </div>
            
            <div v-else-if="modrinthErrorMsg" class="error-state">
              <span>{{ modrinthErrorMsg }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
    
    <div v-if="projectId && !isLoading && !errorMsg" class="mod-details">
      <div v-if="modData.gameVersions.length > 0" class="detail-section">
        <h3 class="detail-title">支持的Minecraft版本</h3>
        <div class="version-tags">
          <span v-for="(version, index) in sortedVersions" :key="index" class="version-tag">
            {{ version }}
          </span>
        </div>
      </div>
      
      <div v-if="modData.authors.length > 0" class="detail-section">
        <h3 class="detail-title">模组作者</h3>
        <div class="authors-list">
          <a v-for="(author, index) in modData.authors" :key="index" 
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
          <div v-if="modData.dateCreated" class="date-item">
            <span class="date-label">创建日期:</span>
            <span class="date-value">{{ formattedDateCreated }}</span>
          </div>
          
          <div v-if="modData.dateModified" class="date-item">
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
  margin-bottom: 24px;
  background-color: rgba(var(--vp-c-bg-soft-rgb, 245, 245, 245), 0.8);
  border-radius: 16px;
  padding: 22px;
  border: 1px solid rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
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
    rgba(var(--vp-c-brand-rgb), 0.05) 0%, 
    transparent 100%);
  z-index: 0;
  border-radius: 16px;
  transition: all 0.4s ease;
}

.mod-info:hover {
  box-shadow: 0 14px 32px rgba(var(--vp-c-brand-rgb), 0.08);
  border-color: rgba(var(--vp-c-brand-rgb), 0.25);
  transform: translateY(-4px);
}

.mod-info:hover::before {
  opacity: 0.8;
  background: linear-gradient(135deg, 
    rgba(var(--vp-c-brand-rgb), 0.08) 0%, 
    transparent 100%);
}

.dark .mod-info {
  background-color: rgba(var(--vp-c-bg-soft-rgb, 36, 36, 36), 0.85);
  border-color: rgba(var(--vp-c-brand-rgb), 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.dark .mod-info::before {
  background: linear-gradient(135deg, 
    rgba(var(--vp-c-brand-rgb), 0.08) 0%, 
    transparent 100%);
}

.dark .mod-info:hover {
  box-shadow: 0 16px 36px rgba(var(--vp-c-brand-rgb), 0.12);
  border-color: rgba(var(--vp-c-brand-rgb), 0.35);
}

.mod-header {
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  z-index: 1;
}

.mod-icon {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(var(--vp-c-brand-rgb), 0.15);
  box-shadow: 0 6px 12px rgba(var(--vp-c-brand-rgb), 0.08);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.mod-icon:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 16px rgba(var(--vp-c-brand-rgb), 0.18);
}

.mod-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.4s ease;
}

.dark .mod-icon img {
  filter: brightness(1.05);
}

.mod-stats {
  flex: 1;
}

.mod-title {
  margin: 0 0 16px 0;
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 700;
  background: linear-gradient(90deg, 
    var(--vp-c-brand) 0%, 
    var(--vp-c-brand-light, var(--vp-c-brand)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(var(--vp-c-brand-rgb), 0.2);
  transition: all 0.4s ease;
}

.mod-info:hover .mod-title {
  background-position: right center;
}

.mod-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge-link {
  text-decoration: none;
  display: inline-block;
  transition: transform 0.3s ease;
}

.badge-link:hover {
  transform: translateY(-2px);
}

.no-external-icon::after {
  display: none !important;
}

.download-stats,
.curseforge-link,
.loading-state,
.error-state {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.download-count {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: linear-gradient(90deg, 
    var(--vp-c-brand) 0%, 
    var(--vp-c-brand-light, var(--vp-c-brand)) 100%);
  color: white;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-rgb), 0.25);
}

.download-count:hover {
  background-position: right center;
  box-shadow: 0 6px 16px rgba(var(--vp-c-brand-rgb), 0.35);
  transform: translateY(-2px) scale(1.02);
}

/* Modrinth样式 */
.modrinth-stats {
  --modrinth-color-rgb: 30, 215, 96;
}

.modrinth-download-count {
  background: linear-gradient(90deg, 
    rgb(var(--modrinth-color-rgb)) 0%, 
    rgba(var(--modrinth-color-rgb), 0.8) 100%);
  box-shadow: 0 4px 12px rgba(var(--modrinth-color-rgb), 0.25);
}

.modrinth-download-count:hover {
  box-shadow: 0 6px 16px rgba(var(--modrinth-color-rgb), 0.35);
}

.download-icon,
.curseforge-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.download-count:hover .download-icon,
.curseforge-link:hover .curseforge-icon {
  transform: scale(1.1);
}

.curseforge-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: linear-gradient(90deg, 
    var(--vp-c-brand) 0%, 
    var(--vp-c-brand-light, var(--vp-c-brand)) 100%);
  color: white;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-rgb), 0.25);
}

.curseforge-link:hover {
  background-position: right center;
  box-shadow: 0 6px 16px rgba(var(--vp-c-brand-rgb), 0.35);
  transform: translateY(-2px) scale(1.02);
}

.loading-state {
  padding: 10px 18px;
  background: rgba(var(--vp-c-brand-rgb), 0.1);
  color: var(--vp-c-brand);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(var(--vp-c-brand-rgb), 0.08);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

.error-state {
  padding: 10px 18px;
  background: rgba(var(--vp-c-danger-rgb, 220, 38, 38), 0.1);
  color: var(--vp-c-danger, #dc2626);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(var(--vp-c-danger-rgb, 220, 38, 38), 0.08);
}

.mod-details {
  margin-top: 20px;
  border-top: 1px dashed rgba(var(--vp-c-brand-rgb), 0.2);
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-title {
  font-size: 0.94rem;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, 
    var(--vp-c-brand), 
    var(--vp-c-brand-light));
  border-radius: 2px;
}

.version-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
}

.version-tag {
  padding: 5px 10px;
  background-color: rgba(var(--vp-c-brand-rgb), 0.08);
  color: var(--vp-c-brand);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(var(--vp-c-brand-rgb), 0.05);
  border: 1px solid rgba(var(--vp-c-brand-rgb), 0.05);
  backdrop-filter: blur(4px);
}

.version-tag:hover {
  background-color: rgba(var(--vp-c-brand-rgb), 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(var(--vp-c-brand-rgb), 0.1);
}

.authors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
}

.author-tag {
  padding: 6px 12px;
  background-color: rgba(var(--vp-c-brand-rgb), 0.08);
  color: var(--vp-c-brand);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(var(--vp-c-brand-rgb), 0.05);
  border: 1px solid rgba(var(--vp-c-brand-rgb), 0.05);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-tag:hover {
  background-color: rgba(var(--vp-c-brand-rgb), 0.15);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(var(--vp-c-brand-rgb), 0.1);
}

.author-tag::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-brand);
}

.dates-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background-color: rgba(var(--vp-c-brand-rgb), 0.04);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(var(--vp-c-brand-rgb), 0.03);
  transition: all 0.3s ease;
}

.date-item:hover {
  background-color: rgba(var(--vp-c-brand-rgb), 0.08);
  transform: translateY(-1px);
}

.date-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.date-value {
  font-size: 0.9rem;
  color: var(--vp-c-brand);
  font-weight: 500;
}

@media (max-width: 768px) {
  .mod-badges {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .mod-icon {
    width: 60px;
    height: 60px;
  }
  
  .mod-title {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }
  
  .mod-info {
    padding: 18px;
  }
  
  .dates-row {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .mod-header {
    gap: 12px;
  }
  
  .mod-icon {
    width: 50px;
    height: 50px;
  }
  
  .mod-title {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  
  .download-count, .curseforge-link, .loading-state, .error-state {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
  
  .version-tag, .author-tag {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}
</style> 