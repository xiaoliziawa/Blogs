<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { computed } from 'vue'
import Comments from './components/Comments.vue'

const { Layout } = DefaultTheme
const { page, frontmatter } = useData()

// 是否显示文档信息（排除首页）
const showMeta = computed(() => {
  return !frontmatter.value.home
})

// 格式化日期
const lastUpdated = computed(() => {
  if (!page.value.lastUpdated) return ''
  const date = new Date(page.value.lastUpdated)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
})
</script>

<template>
  <Layout>
    <template #doc-top>
      <div class="doc-meta" v-if="showMeta">
        <div class="meta-item">
          <span class="meta-label">最后更新: </span>
          <span class="meta-value">{{ lastUpdated }}</span>
        </div>
      </div>
    </template>
    <template #doc-after>
      <Comments v-if="!frontmatter.home" />
    </template>
  </Layout>
</template>

<style>
.doc-meta {
  padding: 8px 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-label {
  opacity: 0.8;
}
</style> 