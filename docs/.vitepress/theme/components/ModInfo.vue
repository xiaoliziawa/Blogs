<script setup>
import { ref, computed, onMounted } from 'vue'

// 组件属性定义
const props = defineProps({
  curseForgeId: {
    type: String,
    default: ''
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
  },
  // 添加XyeBBS相关属性
  xyebbsId: {
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

// XyeBBS数据
const xyebbsData = ref({
  downloadCount: 0,
  dateCreated: null,
  dateModified: null,
  gameVersions: [],
  cores: [],
  tags: [],
  author: null,
  logoUrl: null,
  description: null
})

const icon = ref(props.iconUrl)
const isLoading = ref(false)
const errorMsg = ref('')
const modrinthLoading = ref(false)
const modrinthErrorMsg = ref('')
const xyebbsLoading = ref(false)
const xyebbsErrorMsg = ref('')

// API配置
const CF_API_KEY = import.meta.env.VITE_CF_API_KEY || ''
const CF_API_URL = 'https://api.curseforge.com/v1/mods'
const MODRINTH_API_URL = 'https://api.modrinth.com/v2'
const XYEBBS_API_URL = 'https://resource-api.xyeidc.com/client/resources/identify'

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

// XyeBBS计算属性
const formattedXyebbsDownloads = computed(() => formatNumber(xyebbsData.value.downloadCount))
const xyebbsUrl = computed(() => {
  if (props.xyebbsId) {
    return `https://bbs.xyeidc.com/res-id/${props.xyebbsId}?tab=info`
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

// 获取XyeBBS数据
const fetchXyebbsData = async () => {
  // 如果没有提供id，则不进行请求
  if (!props.xyebbsId) return

  xyebbsLoading.value = true
  xyebbsErrorMsg.value = ''

  try {
    const response = await fetch(`${XYEBBS_API_URL}/${props.xyebbsId}?includes=%2A`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`XyeBBS API请求失败: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    if (result.code === 200 && result.data) {
      const data = result.data

      xyebbsData.value = {
        downloadCount: data.downloadCount || 0,
        dateCreated: data.createDate || null,
        dateModified: data.updateDate || null,
        gameVersions: data.versions ? data.versions.map(v => v.name) : [],
        cores: data.cores ? data.cores.map(c => c.name) : [],
        tags: data.tags ? data.tags.map(t => t.name) : [],
        author: data.member ? data.member.username : null,
        logoUrl: data.logoImgUuid ? `https://resource-api.xyeidc.com/client/pics/${data.logoImgUuid}` : null,
        description: data.description || null
      }

      // 保存数据到本地存储以便离线使用
      try {
        localStorage.setItem(`xyebbs_data_${props.xyebbsId}`, JSON.stringify(xyebbsData.value))
      } catch (storageErr) {
        console.warn('无法保存XyeBBS模组数据到本地存储:', storageErr)
      }

      // 如果没有从其他平台设置图标且有XyeBBS图标，则使用XyeBBS图标
      if (!props.iconUrl && !modData.value.logoUrl && !modrinthData.value.iconUrl && xyebbsData.value.logoUrl) {
        icon.value = xyebbsData.value.logoUrl
      }
    }
  } catch (error) {
    // 尝试从本地存储加载缓存数据
    try {
      const cachedData = localStorage.getItem(`xyebbs_data_${props.xyebbsId}`)
      if (cachedData) {
        xyebbsData.value = JSON.parse(cachedData)
        if (!props.iconUrl && !modData.value.logoUrl && !modrinthData.value.iconUrl && xyebbsData.value.logoUrl) {
          icon.value = xyebbsData.value.logoUrl
        }
        xyebbsErrorMsg.value = '使用缓存数据显示 (XyeBBS API请求失败)'
        console.warn('使用缓存的XyeBBS模组数据')
        return
      }
    } catch (cacheError) {
      console.error('读取XyeBBS缓存数据失败:', cacheError)
    }

    const errorMessage = error instanceof Error ? error.message : '未知错误'
    xyebbsErrorMsg.value = `获取XyeBBS模组数据失败: ${errorMessage}`
  } finally {
    xyebbsLoading.value = false
  }
}

// 生命周期钩子
onMounted(async () => {
  await fetchModData()
  await fetchModrinthData()
  await fetchXyebbsData()
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
          <a v-if="props.curseForgeId" :href="curseForgeUrl" target="_blank" rel="noopener noreferrer" class="badge-link no-external-icon">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="download-icon">
                  <path fill="currentColor" d="M12.252.004a11.78 11.768 0 0 0-8.92 3.73a11 10.999 0 0 0-2.17 3.11a11.37 11.359 0 0 0-1.16 5.169c0 1.42.17 2.5.6 3.77c.24.759.77 1.899 1.17 2.529a12.3 12.298 0 0 0 8.85 5.639c.44.05 2.54.07 2.76.02c.2-.04.22.1-.26-1.7l-.36-1.37l-1.01-.06a8.5 8.489 0 0 1-5.18-1.8a5.34 5.34 0 0 1-1.3-1.26c0-.05.34-.28.74-.5a37.572 37.545 0 0 1 2.88-1.629c.03 0 .5.45 1.06.98l1 .97l2.07-.43l2.06-.43l1.47-1.47c.8-.8 1.48-1.5 1.48-1.52c0-.09-.42-1.63-.46-1.7c-.04-.06-.2-.03-1.02.18c-.53.13-1.2.3-1.45.4l-.48.15l-.53.53l-.53.53l-.93.1l-.93.07l-.52-.5a2.7 2.7 0 0 1-.96-1.7l-.13-.6l.43-.57c.68-.9.68-.9 1.46-1.1c.4-.1.65-.2.83-.33c.13-.099.65-.579 1.14-1.069l.9-.9l-.7-.7l-.7-.7l-1.95.54c-1.07.3-1.96.53-1.97.53c-.03 0-2.23 2.48-2.63 2.97l-.29.35l.28 1.03c.16.56.3 1.16.31 1.34l.03.3l-.34.23c-.37.23-2.22 1.3-2.84 1.63c-.36.2-.37.2-.44.1c-.08-.1-.23-.6-.32-1.03c-.18-.86-.17-2.75.02-3.73a8.84 8.839 0 0 1 7.9-6.93c.43-.03.77-.08.78-.1c.06-.17.5-2.999.47-3.039c-.01-.02-.1-.02-.2-.03Zm3.68.67c-.2 0-.3.1-.37.38c-.06.23-.46 2.42-.46 2.52c0 .04.1.11.22.16a8.51 8.499 0 0 1 2.99 2a8.38 8.379 0 0 1 2.16 3.449a6.9 6.9 0 0 1 .4 2.8c0 1.07 0 1.27-.1 1.73a9.37 9.369 0 0 1-1.76 3.769c-.32.4-.98 1.06-1.37 1.38c-.38.32-1.54 1.1-1.7 1.14c-.1.03-.1.06-.07.26c.03.18.64 2.56.7 2.78l.06.06a12.07 12.058 0 0 0 7.27-9.4c.13-.77.13-2.58 0-3.4a11.96 11.948 0 0 0-5.73-8.578c-.7-.42-2.05-1.06-2.25-1.06Z"/>
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

          <!-- XyeBBS下载量 -->
          <a v-if="xyebbsUrl" :href="xyebbsUrl" target="_blank" rel="noopener noreferrer" class="badge-link no-external-icon">
            <div v-if="!xyebbsLoading && !xyebbsErrorMsg && xyebbsData.downloadCount > 0" class="download-stats xyebbs-stats">
              <div class="download-count xyebbs-download-count">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="download-icon">
                  <path fill="currentColor" d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
                <span>{{ formattedXyebbsDownloads }} 次下载</span>
              </div>
            </div>

            <div v-else-if="xyebbsLoading" class="loading-state">
              <span>加载中...</span>
            </div>

            <div v-else-if="xyebbsErrorMsg" class="error-state">
              <span>{{ xyebbsErrorMsg }}</span>
            </div>

            <div v-else-if="props.xyebbsId && !xyebbsLoading && !xyebbsErrorMsg" class="xyebbs-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="xyebbs-icon">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>查看XyeBBS页面</span>
            </div>
          </a>
        </div>
      </div>
    </div>
    
    <!-- CurseForge/Modrinth 详细信息 -->
    <div v-if="(projectId && !isLoading && !errorMsg) || (modrinthUrl && !modrinthLoading && !modrinthErrorMsg)" class="mod-details">
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

    <!-- XyeBBS 独立信息区域 -->
    <div v-if="props.xyebbsId && !xyebbsLoading && !xyebbsErrorMsg && xyebbsData.downloadCount > 0" class="xyebbs-info">
      <div class="xyebbs-header">
        <div class="xyebbs-platform-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="xyebbs-badge-icon">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>XyeBBS 信息</span>
        </div>
      </div>

      <div class="xyebbs-content">
        <!-- 描述信息 -->
        <div v-if="xyebbsData.description" class="xyebbs-section">
          <h4 class="xyebbs-section-title">模组描述</h4>
          <p class="xyebbs-description">{{ xyebbsData.description }}</p>
        </div>

        <!-- 统计信息 -->
        <div class="xyebbs-stats-grid">
          <div class="xyebbs-stat-item">
            <span class="xyebbs-stat-label">下载量</span>
            <span class="xyebbs-stat-value">{{ formattedXyebbsDownloads }}</span>
          </div>

          <div v-if="xyebbsData.author" class="xyebbs-stat-item">
            <span class="xyebbs-stat-label">作者</span>
            <span class="xyebbs-stat-value">{{ xyebbsData.author }}</span>
          </div>

          <div v-if="xyebbsData.dateCreated" class="xyebbs-stat-item">
            <span class="xyebbs-stat-label">创建日期</span>
            <span class="xyebbs-stat-value">{{ formatDate(xyebbsData.dateCreated) }}</span>
          </div>

          <div v-if="xyebbsData.dateModified" class="xyebbs-stat-item">
            <span class="xyebbs-stat-label">最后更新</span>
            <span class="xyebbs-stat-value">{{ formatDate(xyebbsData.dateModified) }}</span>
          </div>
        </div>

        <!-- 版本信息 -->
        <div v-if="xyebbsData.gameVersions.length > 0" class="xyebbs-section">
          <h4 class="xyebbs-section-title">支持版本</h4>
          <div class="xyebbs-version-tags">
            <span v-for="(version, index) in xyebbsData.gameVersions" :key="index" class="xyebbs-version-tag">
              {{ version }}
            </span>
          </div>
        </div>

        <!-- 模组加载器 -->
        <div v-if="xyebbsData.cores.length > 0" class="xyebbs-section">
          <h4 class="xyebbs-section-title">模组加载器</h4>
          <div class="xyebbs-core-tags">
            <span v-for="(core, index) in xyebbsData.cores" :key="index" class="xyebbs-core-tag">
              {{ core }}
            </span>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="xyebbsData.tags.length > 0" class="xyebbs-section">
          <h4 class="xyebbs-section-title">标签</h4>
          <div class="xyebbs-tag-list">
            <span v-for="(tag, index) in xyebbsData.tags" :key="index" class="xyebbs-tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- XyeBBS 加载和错误状态 -->
    <div v-else-if="props.xyebbsId" class="xyebbs-info">
      <div class="xyebbs-header">
        <div class="xyebbs-platform-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="xyebbs-badge-icon">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>XyeBBS 信息</span>
        </div>
      </div>

      <div class="xyebbs-content">
        <div v-if="xyebbsLoading" class="xyebbs-loading">
          <span>正在加载 XyeBBS 信息...</span>
        </div>

        <div v-else-if="xyebbsErrorMsg" class="xyebbs-error">
          <span>{{ xyebbsErrorMsg }}</span>
        </div>

        <div v-else class="xyebbs-no-data">
          <span>暂无 XyeBBS 数据</span>
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

/* XyeBBS样式 */
.xyebbs-stats {
  --xyebbs-color-rgb: 255, 107, 107;
}

.xyebbs-download-count {
  background: linear-gradient(90deg,
    rgb(var(--xyebbs-color-rgb)) 0%,
    rgba(var(--xyebbs-color-rgb), 0.8) 100%);
  box-shadow: 0 4px 12px rgba(var(--xyebbs-color-rgb), 0.25);
}

.xyebbs-download-count:hover {
  box-shadow: 0 6px 16px rgba(var(--xyebbs-color-rgb), 0.35);
}

.xyebbs-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: linear-gradient(90deg,
    rgb(var(--xyebbs-color-rgb)) 0%,
    rgba(var(--xyebbs-color-rgb), 0.8) 100%);
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--xyebbs-color-rgb), 0.25);
}

.xyebbs-link:hover {
  box-shadow: 0 6px 16px rgba(var(--xyebbs-color-rgb), 0.35);
  transform: translateY(-1px);
}

.xyebbs-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
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

/* XyeBBS 独立信息区域样式 */
.xyebbs-info {
  margin-top: 24px;
  background: linear-gradient(135deg,
    rgba(255, 107, 107, 0.05) 0%,
    rgba(238, 90, 36, 0.05) 100%);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.xyebbs-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 16px 16px 0 0;
}

.xyebbs-header {
  margin-bottom: 16px;
}

.xyebbs-platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.xyebbs-badge-icon {
  flex-shrink: 0;
}

.xyebbs-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.xyebbs-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.xyebbs-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.xyebbs-section-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 16px;
  background: linear-gradient(to bottom, #ff6b6b, #ee5a24);
  border-radius: 2px;
}

.xyebbs-description {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  padding: 12px;
  background: rgba(var(--vp-c-bg-soft-rgb), 0.5);
  border-radius: 8px;
  border-left: 3px solid #ff6b6b;
}

.xyebbs-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.xyebbs-stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: rgba(var(--vp-c-bg-soft-rgb), 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.1);
  transition: all 0.3s ease;
}

.xyebbs-stat-item:hover {
  border-color: rgba(255, 107, 107, 0.3);
  transform: translateY(-1px);
}

.xyebbs-stat-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.xyebbs-stat-value {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.xyebbs-version-tags,
.xyebbs-core-tags,
.xyebbs-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.xyebbs-version-tag,
.xyebbs-core-tag,
.xyebbs-tag {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.xyebbs-version-tag {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.2);
}

.xyebbs-core-tag {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(78, 205, 196, 0.2);
}

.xyebbs-tag {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.xyebbs-version-tag:hover,
.xyebbs-core-tag:hover,
.xyebbs-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.xyebbs-loading,
.xyebbs-error,
.xyebbs-no-data {
  text-align: center;
  padding: 20px;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.xyebbs-error {
  color: #ff6b6b;
}

@media (max-width: 768px) {
  .xyebbs-stats-grid {
    grid-template-columns: 1fr;
  }

  .xyebbs-info {
    padding: 16px;
  }

  .xyebbs-platform-badge {
    font-size: 0.85rem;
    padding: 6px 12px;
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

  .xyebbs-version-tag,
  .xyebbs-core-tag,
  .xyebbs-tag {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}
</style> 