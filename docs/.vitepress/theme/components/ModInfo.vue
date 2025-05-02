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
            <img v-if="downloadBadgeUrl" :src="downloadBadgeUrl" alt="CurseForge下载量" class="badge no-preview" />
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
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
}

.mod-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mod-icon {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--vp-c-divider);
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
}

.mod-badges {
  display: flex;
  gap: 8px;
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

.badge {
  height: 28px;
  margin-right: 8px;
}

.curseforge-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #f16436;
  color: white;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.curseforge-link:hover {
  background-color: #e04e1d;
}

.curseforge-icon {
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .mod-badges {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style> 