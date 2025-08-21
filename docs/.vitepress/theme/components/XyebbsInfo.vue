<template>
  <div v-if="xyebbsId" class="xyebbs-container">
    <!-- XyeBBS 卡片 -->
    <div class="xyebbs-card" :class="{ 'expanded': isExpanded }">
      <!-- 头部 -->
      <div class="xyebbs-header" @click="toggleExpanded">
        <div class="xyebbs-badge">
          <img src="https://pic.xyeidc.com/i/6a59d895-a4fe-4b8d-8450-cdbd814c7ede.png" alt="XyeBBS" class="xyebbs-icon no-preview">
          <span class="xyebbs-title">XyeBBS</span>
          <div v-if="!isExpanded && data.downloadCount > 0" class="xyebbs-download-badge">
            {{ formatNumber(data.downloadCount) }} 下载
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
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

            <!-- 访问链接 -->
            <div class="xyebbs-link-section">
              <a :href="xyebbsUrl" target="_blank" rel="noopener noreferrer" class="xyebbs-visit-link">
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
import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

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
      linkify: true,
      highlight: function (str, lang) {
        // 代码高亮处理
        if (lang && hljs.getLanguage(lang)) {
          try {
            const highlighted = hljs.highlight(str, { language: lang }).value
            return `<pre class="hljs-code-block"><div class="hljs-header"><span class="hljs-lang">${lang.toUpperCase()}</span><button class="hljs-copy" onclick="copyCode(this)">复制</button></div><code class="hljs language-${lang}">${highlighted}</code></pre>`
          } catch (__) {}
        }

        // 自动检测语言
        try {
          const result = hljs.highlightAuto(str)
          const detectedLang = result.language || 'text'
          return `<pre class="hljs-code-block"><div class="hljs-header"><span class="hljs-lang">${detectedLang.toUpperCase()}</span><button class="hljs-copy" onclick="copyCode(this)">复制</button></div><code class="hljs language-${detectedLang}">${result.value}</code></pre>`
        } catch (__) {
          return `<pre class="hljs-code-block"><div class="hljs-header"><span class="hljs-lang">TEXT</span><button class="hljs-copy" onclick="copyCode(this)">复制</button></div><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
        }
      }
    })

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

// 全局复制代码函数
if (typeof window !== 'undefined') {
  window.copyCode = function(button) {
    const codeBlock = button.parentElement.nextElementSibling
    const code = codeBlock.textContent || codeBlock.innerText

    navigator.clipboard.writeText(code).then(() => {
      const originalText = button.textContent
      button.textContent = '已复制!'
      button.style.background = 'var(--vp-c-green)'

      setTimeout(() => {
        button.textContent = originalText
        button.style.background = ''
      }, 2000)
    }).catch(() => {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      const originalText = button.textContent
      button.textContent = '已复制!'
      setTimeout(() => {
        button.textContent = originalText
      }, 2000)
    })
  }
}
</script>

<style scoped>
.xyebbs-container {
  margin: 20px 0;
}

.xyebbs-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.xyebbs-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(var(--vp-c-brand-rgb), 0.1);
}

.xyebbs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.xyebbs-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.xyebbs-icon {
  height: 18px;
  width: auto;
  border-radius: 4px;
  object-fit: contain;
}

.xyebbs-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-brand);
}

.xyebbs-download-badge {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.xyebbs-toggle {
  transition: transform 0.3s ease;
  color: var(--vp-c-text-3);
}

.xyebbs-toggle.expanded {
  transform: rotate(180deg);
}

.xyebbs-header:hover .xyebbs-toggle {
  color: var(--vp-c-brand);
}

.xyebbs-content {
  padding: 16px;
}

.xyebbs-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--vp-c-divider);
  border-top: 2px solid var(--vp-c-brand);
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
  padding: 16px;
  color: var(--vp-c-danger);
  background: var(--vp-c-danger-soft);
  border-radius: 6px;
}

.xyebbs-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
  min-height: 48px;
  justify-content: center;
}

.info-item:hover {
  border-color: var(--vp-c-brand-light);
  background: var(--vp-c-bg-alt);
  transform: translateY(-1px);
}

.info-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 2px;
}

.info-value {
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  font-weight: 600;
  line-height: 1.3;
  word-break: break-all;
}

.xyebbs-section {
  margin: 20px 0;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-title::before {
  content: '';
  width: 2px;
  height: 12px;
  background: var(--vp-c-brand);
  border-radius: 1px;
}

.description-text {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
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
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.version-tag {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.core-tag {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green);
}

.feature-tag {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 1px 4px rgba(var(--vp-c-shadow-rgb), 0.1);
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
  color: var(--vp-c-brand);
}

.text-toggle {
  transition: transform 0.3s ease;
  color: var(--vp-c-text-3);
}

.text-toggle.expanded {
  transform: rotate(180deg);
}

.text-header:hover .text-toggle {
  color: var(--vp-c-brand);
}

.text-content {
  margin-top: 8px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
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

/* 内联代码样式 */
.text-content :deep(code:not(.hljs)) {
  background: var(--vp-c-bg-mute);
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
  color: var(--vp-c-text-code);
  font-family: var(--vp-font-family-mono);
}

/* 代码块容器 */
.text-content :deep(.hljs-code-block) {
  margin: 1em 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

/* 代码块头部 */
.text-content :deep(.hljs-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.8rem;
}

/* 语言标签 */
.text-content :deep(.hljs-lang) {
  font-weight: 600;
  color: var(--vp-c-brand);
  font-family: var(--vp-font-family-mono);
}

/* 复制按钮 */
.text-content :deep(.hljs-copy) {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--vp-font-family-base);
}

.text-content :deep(.hljs-copy:hover) {
  background: var(--vp-c-brand);
  color: white;
}

/* 代码内容 */
.text-content :deep(.hljs-code-block pre) {
  margin: 0;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  line-height: 1.5;
}

.text-content :deep(.hljs-code-block code) {
  background: none;
  padding: 0;
  border-radius: 0;
  font-family: inherit;
  font-size: inherit;
}

/* 代码高亮主题适配 */
.text-content :deep(.hljs) {
  background: var(--vp-c-bg-soft) !important;
  color: var(--vp-c-text-1) !important;
}

/* 高亮颜色适配主题 */
.text-content :deep(.hljs-keyword) {
  color: var(--vp-c-brand) !important;
  font-weight: 600;
}

.text-content :deep(.hljs-string) {
  color: var(--vp-c-green) !important;
}

.text-content :deep(.hljs-number) {
  color: var(--vp-c-yellow) !important;
}

.text-content :deep(.hljs-comment) {
  color: var(--vp-c-text-3) !important;
  font-style: italic;
}

.text-content :deep(.hljs-function) {
  color: var(--vp-c-purple) !important;
}

.text-content :deep(.hljs-variable) {
  color: var(--vp-c-text-1) !important;
}

.text-content :deep(.hljs-title) {
  color: var(--vp-c-brand) !important;
  font-weight: 600;
}

.text-content :deep(.hljs-attr) {
  color: var(--vp-c-orange) !important;
}

.text-content :deep(.hljs-built_in) {
  color: var(--vp-c-purple) !important;
}

.text-content :deep(.hljs-type) {
  color: var(--vp-c-brand) !important;
}

.text-content :deep(.hljs-literal) {
  color: var(--vp-c-yellow) !important;
}

.text-content :deep(.hljs-meta) {
  color: var(--vp-c-text-3) !important;
}

.text-content :deep(.hljs-tag) {
  color: var(--vp-c-brand) !important;
}

.text-content :deep(.hljs-name) {
  color: var(--vp-c-brand) !important;
}

.text-content :deep(.hljs-attribute) {
  color: var(--vp-c-orange) !important;
}

/* XyeBBS 访问链接 */
.xyebbs-link-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.xyebbs-visit-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-brand-light);
}

.xyebbs-visit-link:hover {
  background: var(--vp-c-brand);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--vp-c-brand-rgb), 0.3);
}

.xyebbs-visit-link .vp-external-link-icon {
  display: none;
}

.text-content :deep(ul),
.text-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.text-content :deep(blockquote) {
  border-left: 3px solid var(--vp-c-brand);
  padding-left: 12px;
  margin: 1em 0;
  color: var(--vp-c-text-2);
  font-style: italic;
  background: var(--vp-c-brand-soft);
  padding: 12px;
  border-radius: 4px;
}

.text-content :deep(a) {
  color: var(--vp-c-brand);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.text-content :deep(a:hover) {
  border-bottom-color: var(--vp-c-brand);
}

.text-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}



.xyebbs-no-data {
  text-align: center;
  padding: 32px;
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
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .info-item {
    padding: 6px 8px;
    min-height: 44px;
  }

  .info-label {
    font-size: 0.7rem;
  }

  .info-value {
    font-size: 0.8rem;
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

  /* 移动端代码块优化 */
  .text-content :deep(.hljs-header) {
    padding: 6px 10px;
    font-size: 0.75rem;
  }

  .text-content :deep(.hljs-copy) {
    padding: 3px 6px;
    font-size: 0.7rem;
  }

  .text-content :deep(.hljs-code-block pre) {
    padding: 12px;
    font-size: 0.85em;
  }
}
</style>
