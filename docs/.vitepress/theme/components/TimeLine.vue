<template>
  <div class="timeline-container">
    <div class="timeline">
      <div v-for="(item, index) in items" :key="index" class="timeline-item">
        <div class="timeline-item-content">
          <div class="timeline-date">
            <span>{{ item.date }}</span>
          </div>
          <div class="timeline-marker" :style="{ backgroundColor: item.color || defaultColor }"></div>
          <div class="timeline-content">
            <h3 class="timeline-title">{{ item.title }}</h3>
            <div class="timeline-body">
              <slot :name="`content-${index}`">
                {{ item.content }}
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => 
        typeof item === 'object' && 
        'title' in item && 
        'date' in item
      )
    }
  },
  defaultColor: {
    type: String,
    default: 'var(--vp-c-brand)'
  }
})
</script>

<style scoped>
.timeline-container {
  position: relative;
  width: 100%;
  margin: 30px 0;
}

.timeline {
  position: relative;
  width: 100%;
}

.timeline::before {
  content: '';
  position: absolute;
  width: 2px;
  background-color: var(--vp-c-divider);
  top: 0;
  bottom: 0;
  left: 120px;
  margin-left: -1px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item-content {
  display: flex;
  position: relative;
}

.timeline-date {
  width: 120px;
  padding-right: 15px;
  text-align: right;
  font-weight: 500;
  font-size: 14px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  padding-top: 3px;
}

.timeline-marker {
  position: relative;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  z-index: 1;
  margin-top: 4px;
  background-color: var(--vp-c-brand);
  box-shadow: 0 0 0 4px var(--vp-c-bg);
}

.timeline-content {
  padding-left: 20px;
  flex: 1;
}

.timeline-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.timeline-body {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .timeline::before {
    left: 60px;
  }
  
  .timeline-date {
    width: 60px;
    font-size: 12px;
  }
  
  .timeline-title {
    font-size: 16px;
  }
  
  .timeline-body {
    font-size: 14px;
  }
}
</style> 