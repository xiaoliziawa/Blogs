---
layout: page
---

<script setup>
import { ref, onMounted } from 'vue'
import cardsData from './cards-data.json'

const categories = ref([])
const expandedCategories = ref({})

onMounted(() => {
  // 合并相同name的分类
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
  // 初始化展开状态
  mergedCategories.forEach(category => {
    expandedCategories.value[category.name] = false
  })
})

// 新增：切换类别的展开/折叠状态
const toggleCategory = (categoryName) => {
  expandedCategories.value[categoryName] = !expandedCategories.value[categoryName]
}
</script>

<div class="cards-page">
  <div v-for="category in categories" 
       :key="category.id" 
       class="category-section">
    <div class="category-header" 
         @click="toggleCategory(category.name)"
         :class="{ 'expanded': expandedCategories[category.name] }">
      <h2 class="category-title">{{ category.name }}</h2>
      <span class="toggle-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
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
            <div class="card-tags" v-if="card.tags">
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

<style>
.cards-page {
  padding: 20px;
}

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

.dark html::-webkit-scrollbar-track {
  background: rgba(30, 30, 30, 0.6);
}

.dark html::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.4);
}

.dark html::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 100, 100, 0.6);
}

.category-section {
  margin-bottom: 40px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  max-width: 25%;
  margin: 0;
}

.category-header:hover {
  background: var(--vp-c-bg-mute);
}

.category-header.expanded {
  background: var(--vp-c-brand-dimm);
}

.category-title {
  margin: 0;
  font-size: 1.2em;
  font-weight: 500;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.category-header.expanded .toggle-icon {
  transform: rotate(180deg);
}

.cards-wrapper {
  height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(-20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cards-wrapper.expanded {
  height: auto;
  opacity: 1;
  margin-top: 16px;
  overflow: visible;
  width: 100%;
  transform: translateY(0);
}

.cards-wrapper.expanded .card {
  animation: cardFadeIn 0.4s ease forwards;
  opacity: 0;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cards-wrapper.expanded .card:nth-child(1) { animation-delay: 0.1s; }
.cards-wrapper.expanded .card:nth-child(2) { animation-delay: 0.2s; }
.cards-wrapper.expanded .card:nth-child(3) { animation-delay: 0.3s; }
.cards-wrapper.expanded .card:nth-child(n+4) { animation-delay: 0.4s; }

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  height: 100%;
}

.card-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dark .card {
  background: rgba(30, 30, 30, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.card-content {
  padding: 16px;
}

.card h3 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  color: var(--vp-c-text-1);
}

.card p {
  margin: 0 0 12px 0;
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.card-tags {
  margin-bottom: 0;
}

.tag {
  display: inline-block;
  padding: 2px 6px;
  margin-right: 6px;
  margin-bottom: 6px;
  background: var(--vp-c-brand-dimm);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  font-size: 0.8em;
}

@media (max-width: 960px) {
  .category-header {
    max-width: 50%;
  }
}

@media (max-width: 640px) {
  .category-header {
    max-width: 80%;
  }
}

.dark .category-header {
  background: rgba(30, 30, 30, 0.6);
}

.dark .category-header:hover {
  background: rgba(40, 40, 40, 0.8);
}

.dark .category-header.expanded {
  background: var(--vp-c-brand-darker);
}
</style> 