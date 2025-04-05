<template>
  <div class="collapsible-code-block">
    <div
      class="code-header"
      @click="toggleCollapse"
      :class="{ 'is-collapsed': isCollapsed }"
    >
      <div class="code-title">{{ title }}</div>
      <div class="code-toggle">
        {{ isCollapsed ? '展开' : '折叠' }}
        <svg
          class="code-toggle-icon"
          :class="{ 'is-collapsed': isCollapsed }"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path
            fill="currentColor"
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          ></path>
        </svg>
      </div>
    </div>
    <div
      class="code-content"
      :class="{ 'is-collapsed': isCollapsed }"
      v-show="!isCollapsed"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '代码示例'
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const isCollapsed = ref(props.collapsed)

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.collapsible-code-block {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--vp-shadow-2);
  background-color: var(--vp-code-block-bg);
  transition: all 0.3s ease;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--vp-c-brand-dimm);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  transition: background-color 0.2s ease;
}

.code-header:hover {
  background-color: var(--vp-c-brand-soft);
}

.code-title {
  font-weight: 500;
}

.code-toggle {
  display: flex;
  align-items: center;
  font-size: 12px;
  opacity: 0.7;
}

.code-toggle-icon {
  margin-left: 6px;
  transition: transform 0.3s ease;
}

.code-toggle-icon.is-collapsed {
  transform: rotate(180deg);
}

.code-content {
  transition: max-height 0.3s ease;
  overflow: hidden;
}

.code-content.is-collapsed {
  max-height: 0;
}
</style> 