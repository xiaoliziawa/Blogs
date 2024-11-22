<script setup>
import { useData } from 'vitepress'
import GitHubChart from './GitHubChart.vue'

const { frontmatter: fm } = useData()
</script>

<template>
  <div class="VPHero">
    <div class="container">
      <div class="main">
        <!-- 左侧内容 -->
        <div class="content">
          <h1 class="name" v-html="fm.hero?.name" />
          <p class="text" v-html="fm.hero?.text" />
          <p class="tagline" v-html="fm.hero?.tagline" />

          <div class="actions">
            <div v-for="action in fm.hero?.actions" :key="action.link" class="action">
              <a class="VPButton" :class="action.theme" :href="action.link">
                {{ action.text }}
              </a>
            </div>
          </div>
        </div>
        
        <!-- 右侧图片 -->
        <div class="image">
          <img src="/logo.png" alt="Logo" class="hero-image">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPHero {
  padding: 64px 24px;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
}

.content {
  padding-right: 48px;
}

.name {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  background: linear-gradient(to right, var(--vp-c-brand), var(--vp-c-brand-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}

.tagline {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 32px;
  opacity: 0.8;
}

.actions {
  display: flex;
  gap: 12px;
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.2));
}

@media (max-width: 960px) {
  .main {
    grid-template-columns: 1fr;
  }

  .image {
    display: none;
  }

  .content {
    padding-right: 0;
  }

  .name {
    font-size: 48px;
  }

  .text {
    font-size: 36px;
  }

  .tagline {
    font-size: 20px;
  }
}
</style> 