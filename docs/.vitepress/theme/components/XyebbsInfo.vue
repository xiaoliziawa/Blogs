<template>
  <div v-if="xyebbsId" class="xyebbs-container">
    <!-- XyeBBS 卡片 -->
    <div class="xyebbs-card" :class="{ 'expanded': isExpanded }">
      <!-- 头部 -->
      <div class="xyebbs-header" @click="toggleExpanded">
        <div class="xyebbs-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="xyebbs-icon">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span class="xyebbs-title">XyeBBS</span>
          <div v-if="!isExpanded && data.downloadCount > 0" class="xyebbs-download-badge">
            {{ formatNumber(data.downloadCount) }} 下载
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
             class="xyebbs-toggle" :class="{ 'expanded': isExpanded }">
          <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>

      <!-- 展开内容 -->
      <Transition name="xyebbs-slide">
        <div v-show="isExpanded" class="xyebbs-content">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="xyebbs-loading">
            <div class="loading-spinner"></div>
            <span>正在加载 XyeBBS 信息...</span>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="errorMsg" class="xyebbs-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{{ errorMsg }}</span>
          </div>
          
          <!-- 数据内容 -->
          <div v-else-if="data.downloadCount > 0" class="xyebbs-data">
            <!-- 基本信息 -->
            <div class="xyebbs-info-grid">
              <div class="info-item">
                <span class="info-label">下载量</span>
                <span class="info-value">{{ formatNumber(data.downloadCount) }}</span>
              </div>
              <div v-if="data.author" class="info-item">
                <span class="info-label">作者</span>
                <span class="info-value">{{ data.author }}</span>
              </div>
              <div v-if="data.dateCreated" class="info-item">
                <span class="info-label">创建日期</span>
                <span class="info-value">{{ formatDate(data.dateCreated) }}</span>
              </div>
              <div v-if="data.dateModified" class="info-item">
                <span class="info-label">更新日期</span>
                <span class="info-value">{{ formatDate(data.dateModified) }}</span>
              </div>
            </div>

            <!-- 描述 -->
            <div v-if="data.description" class="xyebbs-section">
              <h4 class="section-title">模组描述</h4>
              <p class="description-text">{{ data.description }}</p>
            </div>

            <!-- 版本和加载器 -->
            <div class="xyebbs-tags-section">
              <div v-if="data.gameVersions.length > 0" class="tag-group">
                <span class="tag-label">支持版本</span>
                <div class="tag-list">
                  <span v-for="version in data.gameVersions" :key="version" class="tag version-tag">
                    {{ version }}
                  </span>
                </div>
              </div>
              
              <div v-if="data.cores.length > 0" class="tag-group">
                <span class="tag-label">模组加载器</span>
                <div class="tag-list">
                  <span v-for="core in data.cores" :key="core" class="tag core-tag">
                    {{ core }}
                  </span>
                </div>
              </div>
              
              <div v-if="data.tags.length > 0" class="tag-group">
                <span class="tag-label">标签</span>
                <div class="tag-list">
                  <span v-for="tag in data.tags" :key="tag" class="tag feature-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 详细文档 -->
            <div v-if="data.text" class="xyebbs-section">
              <div class="text-header" @click="toggleTextExpanded">
                <h4 class="section-title">详细文档</h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                     class="text-toggle" :class="{ 'expanded': isTextExpanded }">
                  <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </div>
              <Transition name="text-slide">
                <div v-show="isTextExpanded" class="text-content" v-html="processedText"></div>
              </Transition>
            </div>

            <!-- 链接 -->
            <div class="xyebbs-link">
              <a :href="xyebbsUrl" target="_blank" rel="noopener noreferrer" class="visit-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                </svg>
                访问 XyeBBS 页面
              </a>
            </div>
          </div>
          
          <!-- 无数据状态 -->
          <div v-else class="xyebbs-no-data">
            <span>暂无 XyeBBS 数据</span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

// Props
const props = defineProps({
  xyebbsId: {
    type: String,
    required: true
  }
})

// 状态
const isExpanded = ref(false)
const isTextExpanded = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const data = ref({
  downloadCount: 0,
  dateCreated: null,
  dateModified: null,
  gameVersions: [],
  cores: [],
  tags: [],
  author: null,
  logoUrl: null,
  description: null,
  text: null
})

// API 配置
const XYEBBS_API_URL = 'https://resource-api.xyeidc.com/client/resources/identify'

// 计算属性
const xyebbsUrl = computed(() => {
  return `https://bbs.xyeidc.com/res-id/${props.xyebbsId}?tab=info`
})

const processedText = computed(() => {
  if (!data.value.text) return null

  try {
    // 创建 markdown-it 实例
    const md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true
    })

    // 处理图片链接
    let processedMarkdown = data.value.text.replace(
      /!\[([^\]]*)\]\(https:\/\/resource-api\.xyeidc\.com\/client\/pics\/([^)]+)\)/g,
      '![图片](https://resource-api.xyeidc.com/client/pics/$2)'
    )

    // 转换 Markdown 为 HTML
    return md.render(processedMarkdown)
  } catch (error) {
    console.error('Markdown 处理错误:', error)
    return `<pre>${data.value.text}</pre>`
  }
})

// 方法
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const toggleExpanded = async () => {
  isExpanded.value = !isExpanded.value
  
  // 首次展开时获取数据
  if (isExpanded.value && data.value.downloadCount === 0 && !isLoading.value) {
    await fetchData()
  }
}

const toggleTextExpanded = () => {
  isTextExpanded.value = !isTextExpanded.value
}

const fetchData = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const response = await fetch(`${XYEBBS_API_URL}/${props.xyebbsId}?includes=%2A`)
    
    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      const apiData = result.data
      
      data.value = {
        downloadCount: apiData.downloadCount || 0,
        dateCreated: apiData.createDate || null,
        dateModified: apiData.updateDate || null,
        gameVersions: apiData.versions ? apiData.versions.map(v => v.name) : [],
        cores: apiData.cores ? apiData.cores.map(c => c.name) : [],
        tags: apiData.tags ? apiData.tags.map(t => t.name) : [],
        author: apiData.member ? apiData.member.username : null,
        logoUrl: apiData.logoImgUuid ? `https://resource-api.xyeidc.com/client/pics/${apiData.logoImgUuid}` : null,
        description: apiData.description || null,
        text: apiData.text || null
      }
    } else {
      throw new Error('数据格式错误')
    }
  } catch (error) {
    errorMsg.value = `获取数据失败: ${error.message}`
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.xyebbs-container {
  margin: 20px 0;
}

.xyebbs-card {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(238, 90, 36, 0.05) 100%);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.xyebbs-card:hover {
  border-color: rgba(255, 107, 107, 0.4);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.1);
}

.xyebbs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
  background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.xyebbs-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.xyebbs-icon {
  flex-shrink: 0;
}

.xyebbs-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.xyebbs-download-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.xyebbs-toggle {
  transition: transform 0.3s ease;
}

.xyebbs-toggle.expanded {
  transform: rotate(180deg);
}

.xyebbs-content {
  padding: 20px;
}

.xyebbs-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 107, 107, 0.2);
  border-top: 2px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.xyebbs-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
}

.xyebbs-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: rgba(var(--vp-c-bg-soft-rgb), 0.5);
  border-radius: 8px;
  border-left: 3px solid #ff6b6b;
}

.info-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.xyebbs-section {
  margin: 20px 0;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 3px;
  height: 16px;
  background: linear-gradient(to bottom, #ff6b6b, #ee5a24);
  border-radius: 2px;
}

.description-text {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  padding: 12px;
  background: rgba(var(--vp-c-bg-soft-rgb), 0.3);
  border-radius: 8px;
}

.xyebbs-tags-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 20px 0;
}

.tag-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.version-tag {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.core-tag {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.feature-tag {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.text-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}

.text-header:hover .section-title {
  color: #ff6b6b;
}

.text-toggle {
  transition: transform 0.3s ease;
  color: #ff6b6b;
}

.text-toggle.expanded {
  transform: rotate(180deg);
}

.text-content {
  margin-top: 12px;
  padding: 16px;
  background: rgba(var(--vp-c-bg-soft-rgb), 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.1);
  max-height: 400px;
  overflow-y: auto;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.text-content :deep(h1),
.text-content :deep(h2),
.text-content :deep(h3),
.text-content :deep(h4),
.text-content :deep(h5),
.text-content :deep(h6) {
  color: var(--vp-c-text-1);
  margin: 1.5em 0 0.5em 0;
}

.text-content :deep(p) {
  margin: 0.8em 0;
}

.text-content :deep(code) {
  background: rgba(255, 107, 107, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #ff6b6b;
}

.text-content :deep(pre) {
  background: rgba(var(--vp-c-bg-soft-rgb), 0.8);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
  border-left: 3px solid #ff6b6b;
}

.text-content :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--vp-c-text-1);
}

.text-content :deep(ul),
.text-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.text-content :deep(blockquote) {
  border-left: 3px solid #ff6b6b;
  padding-left: 12px;
  margin: 1em 0;
  color: var(--vp-c-text-2);
  font-style: italic;
  background: rgba(255, 107, 107, 0.05);
  padding: 12px;
  border-radius: 4px;
}

.text-content :deep(a) {
  color: #ff6b6b;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.text-content :deep(a:hover) {
  border-bottom-color: #ff6b6b;
}

.text-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.xyebbs-link {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 107, 107, 0.2);
}

.visit-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.visit-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.xyebbs-no-data {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* 动画 */
.xyebbs-slide-enter-active,
.xyebbs-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.xyebbs-slide-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.xyebbs-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.text-slide-enter-active,
.text-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.text-slide-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}

.text-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}

/* 响应式 */
@media (max-width: 768px) {
  .xyebbs-info-grid {
    grid-template-columns: 1fr;
  }
  
  .xyebbs-header {
    padding: 12px 16px;
  }
  
  .xyebbs-content {
    padding: 16px;
  }
  
  .xyebbs-download-badge {
    font-size: 0.8rem;
    padding: 3px 8px;
  }
}
</style>
