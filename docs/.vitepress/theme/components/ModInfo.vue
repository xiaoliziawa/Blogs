<script setup>
import { ref, computed } from 'vue'

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

const icon = ref(props.iconUrl || '/modimg/cye.jpg')

// 计算徽章URL
const downloadBadgeUrl = computed(() => {
  if (props.projectId) {
    return `https://img.shields.io/curseforge/dt/${props.projectId}?style=for-the-badge&logo=curseforge&color=orange&label=Download`
  }
  return null
})

// 构建CurseForge链接
const curseForgeUrl = computed(() => {
  return `https://www.curseforge.com/minecraft/mc-mods/${props.curseForgeId}`
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
            <div v-if="downloadBadgeUrl" class="badge-container">
              <img :src="downloadBadgeUrl" alt="CurseForge下载量" class="badge no-preview" />
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
  </div>
</template>

<style scoped>
.mod-info {
  margin-bottom: 24px;
  background-color: rgba(var(--vp-c-bg-soft-rgb, 245, 245, 245), 0.8);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
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
  gap: 20px;
  position: relative;
  z-index: 1;
}

.mod-icon {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(var(--vp-c-brand-rgb, 0, 150, 136), 0.15);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
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
  margin: 0 0 16px 0;
  font-size: 1.8rem;
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

/* 禁用外部链接图标 */
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
}
</style> 