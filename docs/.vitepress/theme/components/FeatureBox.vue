<template>
  <div class="feature-box" :class="[type]">
    <div class="box-header">
      <div class="icon" v-if="icon" v-html="icon"></div>
      <div class="title">{{ title }}</div>
    </div>
    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'tip', 'warning', 'danger', 'success', 'note'].includes(value)
  },
  title: {
    type: String,
    default: '信息'
  },
  icon: {
    type: String,
    default: null
  }
})

const defaultIcons = {
  info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"/></svg>',
  tip: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9.973 18H11v-5h2v5h1.027c.132-1.202.745-2.194 1.74-3.277.113-.122.832-.867.917-.973a6 6 0 1 0-9.37-.002c.086.107.807.853.918.974.996 1.084 1.609 2.076 1.741 3.278zM10 20v1h4v-1h-4zm-4.246-5a8 8 0 1 1 12.49.002C17.624 15.774 16 17 16 18.5V21a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C8 17 6.375 15.774 5.754 15z"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>',
  danger: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 15h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>',
  success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z"/></svg>',
  note: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm0-5h14v2H3V9z"/></svg>'
}

const defaultTitles = {
  info: '信息',
  tip: '提示',
  warning: '警告',
  danger: '危险',
  success: '成功',
  note: '笔记'
}
</script>

<style scoped>
.feature-box {
  margin: 16px 0;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-1);
  transition: box-shadow 0.3s ease;
  border-left: 4px solid var(--vp-c-brand);
}

.feature-box:hover {
  box-shadow: var(--vp-shadow-2);
}

.box-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.box-content {
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.6;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon svg {
  width: 24px;
  height: 24px;
}

/* 类型样式 */
.info {
  border-left-color: var(--vp-c-brand);
}

.info .icon svg {
  fill: var(--vp-c-brand);
}

.tip {
  border-left-color: var(--vp-c-brand-light);
}

.tip .icon svg {
  fill: var(--vp-c-brand-light);
}

.warning {
  border-left-color: var(--vp-c-warning);
}

.warning .icon svg {
  fill: var(--vp-c-warning);
}

.danger {
  border-left-color: var(--vp-c-danger);
}

.danger .icon svg {
  fill: var(--vp-c-danger);
}

.success {
  border-left-color: var(--vp-c-brand);
}

.success .icon svg {
  fill: var(--vp-c-brand);
}

.note {
  border-left-color: var(--vp-c-text-2);
}

.note .icon svg {
  fill: var(--vp-c-text-2);
}
</style> 