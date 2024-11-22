---
layout: page
---

<script setup>
import { ref, onMounted } from 'vue'
import cardsData from './cards-data.json'

const categories = ref([])

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
})
</script>

<div class="cards-page">
  <div v-for="category in categories" :key="category.id" class="category-section">
    <h2 class="category-title">{{ category.name }}</h2>
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

<style>
.cards-page {
  padding: 20px;
}

.category-section {
  margin-bottom: 40px;
}

.category-title {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

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

@media (max-width: 640px) {
  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .cards-page {
    padding: 16px;
  }
}
</style> 