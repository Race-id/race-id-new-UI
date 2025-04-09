<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

// State management
const articles = ref([
  {
    id: 1,
    title: 'How to train for a marathon: a step by step guide',
    description: 'Training for a marathon is no easy feat. Whether you\'re a seasoned runner or just starting out, it\'s important to have a plan in place to help you reach your goals. In this article, we\'ll provide a step-by-step guide to training for a marathon, including tips on building your mileage, cross-training, and nutrition.',
    image: "/images/article1.jpeg",
    tags: ['Training', 'Running']
  },
  {
    id: 2,
    title: 'Essential Running Gear for Marathon Training',
    description: 'Investing in the right gear can make a significant difference in your training comfort and performance. From choosing the perfect running shoes to moisture-wicking apparel, we\'ll cover all the essential gear you need for successful marathon training.',
    image: "/images/article2.jpeg",
    tags: ['Gear', 'Running']
  },
  {
    id: 3,
    title: 'Race Day Nutrition Strategy',
    description: 'What you eat before, during, and after the race can make or break your marathon performance. Learn about proper carb-loading, hydration timing, and the best energy gels and supplements to use during your race.',
    image: "/images/article3.jpeg",
    tags: ['Nutrition', 'Race']
  },
  {
    id: 4,
    title: 'Injury Prevention for Long-Distance Runners',
    description: 'Marathon training puts significant stress on your body. Discover the most common running injuries, how to prevent them, and the best practices for maintaining your body through intense training periods.',
    image: "/images/article4.jpeg",
    tags: ['Training', 'Running']
  },
  {
    id: 5,
    title: 'Mental Preparation for Your First Marathon',
    description: 'The mental aspect of marathon running is just as important as physical training. Learn psychological techniques, visualization methods, and mental toughness strategies used by experienced runners.',
    image: "/images/article5.jpeg",
    tags: ['Training', 'Mental health']
  }
])

const tags = ref([
  { id: 1, name: 'Running', count: 3 },
  { id: 2, name: 'Training', count: 3 },
  { id: 3, name: 'Nutrition', count: 1 },
  { id: 4, name: 'Gear', count: 1 },
  { id: 5, name: 'Race', count: 1 },
  { id: 6, name: 'Mental health', count: 1 }
])

// Tag filtering functionality
const selectedTag = ref('')

const filteredArticles = computed(() => {
  if (!selectedTag.value) return articles.value
  return articles.value.filter(article => 
    article.tags.includes(selectedTag.value)
  )
})

</script>

<template>
  <div class="app-wrapper">
    <div class="header-wrapper">
      <Header />
    </div>
    
    <main class="main-container">
      <div class="articles-wrapper">
        <!-- Left Content -->
        <div class="articles-content">
          <h1 class="page-title">All articles</h1>
          
          <!-- Filters -->
          <div class="filters-row">
            <button 
              v-for="filter in filters" 
              :key="filter.id" 
              class="filter-btn"
            >
              {{ filter.name }}
            </button>
          </div>
          
          <!-- Articles Grid -->
          <div class="articles-grid">
            <article 
              v-for="article in filteredArticles" 
              :key="article.id" 
              class="article-card"
            >
              <div class="article-content">
                <h2 class="article-title">{{ article.title }}</h2>
                <p class="article-desc">{{ article.description }}</p>
                <button class="read-more-btn">Read more</button>
              </div>
              <div 
                class="article-image" 
                :style="{ backgroundImage: `url(${article.image})` }"
              />
            </article>
          </div>
        </div>

        <!-- Right Sidebar -->
        <aside class="sidebar">
          <h2 class="sidebar-title">Related tags</h2>
          <div class="tags-grid">
            <span 
              v-for="tag in tags" 
              :key="tag.id" 
              class="tag-pill"
              :class="{ active: selectedTag === tag.name }"
              @click="selectedTag = tag.name === selectedTag ? '' : tag.name"
            >
              {{ tag.name }} ({{ tag.count }})
            </span>
          </div>
        </aside>
      </div>
    </main>

    <div class="footer-wrapper">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f9fc;
}

/* Add new wrapper styles */
.header-wrapper {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #e5e8ea;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.footer-wrapper {
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #e5e8ea;
}

.main-container {
  flex: 1;
  padding: 40px 20px;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.articles-wrapper {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  animation: slideInLeft 0.6s ease-out forwards;
}

.filters-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  animation: fadeInUp 0.6s ease-out 0.2s forwards;
  opacity: 0; 
}

.filter-btn {
  padding: 8px 16px;
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  color: #4a5568;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #e2e8f0;
}

.articles-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: all 0.3s ease;
}

.article-card {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  animation: fadeInUp 0.6s ease-out both;
  opacity: 0; /* Set initial state */
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Staggered animation for articles */
.article-card:nth-child(1) { animation-delay: 0.3s; }
.article-card:nth-child(2) { animation-delay: 0.4s; }
.article-card:nth-child(3) { animation-delay: 0.5s; }
.article-card:nth-child(4) { animation-delay: 0.6s; }
.article-card:nth-child(5) { animation-delay: 0.7s; }

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.article-desc {
  color: #4a5568;
  line-height: 1.6;
}

.article-image {
  width: 240px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}

.read-more-btn {
  width: fit-content;
  padding: 8px 16px;
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  color: #1a1a1a;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.read-more-btn:hover {
  background: #e2e8f0;
}

.sidebar {
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  height: fit-content;
  animation: slideInLeft 0.6s ease-out 0.3s forwards;
  opacity: 0; /* Set initial state */
}

.sidebar-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  padding: 6px 12px;
  background: white;
  border-radius: 6px;
  color: #4a5568;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: scaleIn 0.4s ease-out backwards;
}

/* Staggered animation for tags */
.tag-pill:nth-child(1) { animation-delay: 0.4s; }
.tag-pill:nth-child(2) { animation-delay: 0.5s; }
.tag-pill:nth-child(3) { animation-delay: 0.6s; }
.tag-pill:nth-child(4) { animation-delay: 0.7s; }
.tag-pill:nth-child(5) { animation-delay: 0.8s; }
.tag-pill:nth-child(6) { animation-delay: 0.9s; }

.tag-pill.active {
  background: #e2e8f0;
  color: #1a1a1a;
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tag-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 1024px) {
  .articles-wrapper {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  
  .article-image {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 20px;
  }
  
  .article-card {
    flex-direction: column;
  }
  
  .article-image {
    width: 100%;
    height: 200px;
  }
}
</style>