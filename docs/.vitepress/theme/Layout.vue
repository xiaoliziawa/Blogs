<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Comments from './components/Comments.vue'
import ImagePreview from './components/ImagePreview.vue'
import Contributors from './components/Contributors.vue'
import PageHistory from './components/PageHistory.vue'
import CursorHighlight from './components/CursorHighlight.vue'
import ThemeColorPicker from './components/ThemeColorPicker.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #doc-after>
      <Contributors />
      <PageHistory />
      <Comments v-if="!frontmatter.home" />
      <ImagePreview />
    </template>
    <template #nav-bar-content-after>
      <div class="nav-theme-color-picker">
        <ThemeColorPicker />
      </div>
    </template>
  </Layout>
  <CursorHighlight />
</template>

<style>
:deep(.VPDoc) {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
}

:deep(.VPDoc .container) {
  max-width: calc(var(--vp-layout-max-width) - var(--vp-sidebar-width) - var(--vp-aside-width));
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.nav-theme-color-picker {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

@media (max-width: 960px) {
  :deep(.VPDoc .container) {
    max-width: 100%;
    padding: 0 16px;
  }
  
  .nav-theme-color-picker {
    margin-right: 8px;
  }
}
</style> 