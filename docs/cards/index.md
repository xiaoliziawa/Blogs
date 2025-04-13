---
layout: page
---

<script setup>
import { ref, onMounted, computed } from 'vue'
import cardsData from './cards-data.json'

const categories = ref([])
const expandedCategories = ref({})
const searchQuery = ref('')
const showAllCategories = ref(false)

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  
  return categories.value.map(category => {
    const filteredCards = category.cards.filter(card => 
      card.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (card.tags && card.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())))
    )
    
    return {
      ...category,
      cards: filteredCards
    }
  }).filter(category => category.cards.length > 0)
})

onMounted(() => {
  const mergedCategories = cardsData.categories.reduce((acc, curr) => {
    const existingCategory = acc.find(cat => cat.name === curr.name)
    if (existingCategory) {
      existingCategory.cards = [...existingCategory.cards, ...curr.cards]
    } else {
      acc.push({...curr})
    }
    return acc
  }, [])
  
  categories.value = mergedCategories
  mergedCategories.forEach(category => {
    expandedCategories.value[category.name] = false
  })
  
  if (mergedCategories.length > 0) {
    expandedCategories.value[mergedCategories[0].name] = true
  }
})

const toggleCategory = (categoryName) => {
  if (showAllCategories.value) return
  expandedCategories.value[categoryName] = !expandedCategories.value[categoryName]
}

const toggleAllCategories = () => {
  showAllCategories.value = !showAllCategories.value
  
  categories.value.forEach(category => {
    expandedCategories.value[category.name] = showAllCategories.value
  })
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<div class="cards-page">
  <div class="cards-header">
    <div class="search-box">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜索卡片..." 
        class="search-input"
      />
      <button 
        v-if="searchQuery" 
        @click="clearSearch" 
        class="clear-search-btn" 
        aria-label="清除搜索"
      >×</button>
      <div class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
    <button 
      @click="toggleAllCategories" 
      class="toggle-all-btn"
      :class="{ 'active': showAllCategories }"
    >
      {{ showAllCategories ? '折叠分类' : '展开全部' }}
    </button>
  </div>
  
  <div v-if="filteredCategories.length === 0" class="no-results">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <p>未找到匹配的卡片</p>
    <button @click="clearSearch" class="reset-search-btn">清除搜索</button>
  </div>
  
  <div v-else class="categories-container">
    <div v-for="category in filteredCategories" 
        :key="category.id" 
        class="category-section">
      <div class="category-header" 
          @click="toggleCategory(category.name)"
          :class="{ 'expanded': expandedCategories[category.name] }">
        <h2 class="category-title">{{ category.name }}</h2>
        <div class="category-info">
          <span class="card-count">{{ category.cards.length }} 张卡片</span>
          <span v-if="!showAllCategories" class="toggle-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
      </div>
      <div class="cards-wrapper"
          :class="{ 'expanded': expandedCategories[category.name] }">
        <div class="cards-container">
          <a v-for="card in category.cards" 
            :key="card.id" 
            :href="card.link"
            class="card">
            <div class="card-image" v-if="card.image">
              <img :src="card.image" :alt="card.title">
            </div>
            <div class="card-content">
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
              <div class="card-tags" v-if="card.tags && card.tags.length">
                <span v-for="tag in card.tags" 
                      :key="tag" 
                      class="tag">{{ tag }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
/* 滚动条样式 */
html {
  overflow-y: scroll;
  margin-right: 0;
  scrollbar-gutter: stable;
}

html::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

html::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

html::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand-dimm);
  border-radius: 4px;
  transition: all 0.3s ease;
}

html::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand);
}

/* 暗色模式下的滚动条样式 */
.dark html::-webkit-scrollbar-track {
  background: rgba(30, 30, 30, 0.6);
}

.dark html::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.4);
}

.dark html::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 100, 100, 0.6);
}

/* 整体页面样式 */
.cards-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;
}

/* 页面标题和搜索区域 */
.cards-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 32px;
  gap: 16px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 44px;
  border-radius: 50px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-dimm);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: var(--vp-c-text-2);
}

.clear-search-btn {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.toggle-all-btn {
  padding: 10px 20px;
  border-radius: 50px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-all-btn:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-dimm);
}

.toggle-all-btn.active {
  background: var(--vp-c-brand-dimm);
  border-color: var(--vp-c-brand-light);
  color: var(--vp-c-brand-dark);
}

/* 无结果提示 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--vp-c-text-2);
  text-align: center;
}

.no-results svg {
  margin-bottom: 16px;
  opacity: 0.7;
}

.no-results p {
  font-size: 18px;
  margin-bottom: 20px;
}

.reset-search-btn {
  padding: 8px 16px;
  border-radius: 4px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s ease;
}

.reset-search-btn:hover {
  background: var(--vp-c-brand-dark);
}

/* 分类容器 */
.categories-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 分类标题样式 */
.category-section {
  animation: sectionFadeIn 0.5s ease forwards;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 18px 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  margin: 0;
  position: relative;
  overflow: hidden;
}

.category-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--vp-c-brand);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-header.expanded::before {
  opacity: 1;
}

.category-title {
  margin: 0;
  font-size: 1.3em;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-count {
  font-size: 14px;
  color: var(--vp-c-text-2);
  opacity: 0.8;
}

/* 箭头图标 */
.toggle-icon {
  transition: transform 0.3s ease;
}

.category-header.expanded .toggle-icon {
  transform: rotate(180deg);
}

/* 悬浮和展开状态 */
.category-header:hover {
  background: var(--vp-c-bg-mute);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.category-header.expanded {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-dimm);
}

.category-header.expanded .category-title {
  color: var(--vp-c-brand);
}

/* 卡片包装器 */
.cards-wrapper {
  height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(-20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.cards-wrapper.expanded {
  height: auto;
  opacity: 1;
  margin-top: 24px;
  overflow: visible;
  transform: translateY(0);
}

/* 卡片容器 */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 8px 0;
}

/* 卡片样式 */
.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  top: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-dimm);
  z-index: 1;
}

.card-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: var(--vp-c-bg-alt, var(--vp-c-bg-mute));
  position: relative;
}

.card-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 80%, rgba(0, 0, 0, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .card-image::after {
  opacity: 1;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 16px;
  transition: transform 0.5s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card h3 {
  margin: 0 0 12px 0;
  font-size: 1.2em;
  color: var(--vp-c-text-1);
  font-weight: 600;
  transition: color 0.3s ease;
}

.card:hover h3 {
  color: var(--vp-c-brand);
}

.card p {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2);
  font-size: 0.95em;
  flex: 1;
  line-height: 1.6;
}

/* 标签样式 */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.tag {
  padding: 4px 10px;
  background: var(--vp-c-brand-dimm);
  color: var(--vp-c-text-1);
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  background: var(--vp-c-brand-light);
}

/* 展开动画 */
@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes sectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cards-wrapper.expanded .card {
  animation: cardFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

/* 添加错落的动画延迟 */
.cards-wrapper.expanded .card:nth-child(1) { animation-delay: 0.05s; }
.cards-wrapper.expanded .card:nth-child(2) { animation-delay: 0.1s; }
.cards-wrapper.expanded .card:nth-child(3) { animation-delay: 0.15s; }
.cards-wrapper.expanded .card:nth-child(4) { animation-delay: 0.2s; }
.cards-wrapper.expanded .card:nth-child(5) { animation-delay: 0.25s; }
.cards-wrapper.expanded .card:nth-child(n+6) { animation-delay: 0.3s; }

/* 暗色模式 */
.dark .card {
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .category-header {
  background: var(--vp-c-bg-soft);
}

.dark .card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

/* 响应式布局 */
@media (max-width: 960px) {
  .cards-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  
  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .cards-page {
    padding: 16px;
  }
  
  .cards-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .card-image {
    height: 140px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .toggle-all-btn {
    width: 100%;
  }
}
</style>
