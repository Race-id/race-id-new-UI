<script setup>
import { ref } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

// State management
const articles = ref([
  {
    id: 1,
    title: 'How to train for a marathon: a step by step guide',
    description: 'Training for a marathon is no easy feat. Whether you\'re a seasoned runner or just starting out, it\'s important to have a plan in place to help you reach your goals. In this article, we\'ll provide a step-by-step guide to training for a marathon, including tips on building your mileage, cross-training, and nutrition.',
    image: './depth-6-frame-1.png'
  },
  {
    id: 2,
    title: '5 key workouts for marathon training',
    description: 'When it comes to marathon training, consistency is key. But that doesn\'t mean you should be running the same distance at the same pace every day. To prepare your body for the demands of 26.2 miles, it\'s important to incorporate a variety of workouts into your training plan. In this article, we\'ll outline five key workouts to help you build endurance, speed, and strength for race day.',
    image: './image.png'
  },
  {
    id: 3,
    title: 'The ultimate marathon training diet',
    description: 'As the saying goes, you are what you eat – and that\'s especially true when it comes to marathon training. The foods you consume can have a major impact on your performance, energy levels, and recovery. In this article, we\'ll break down the ultimate marathon training diet, from the best sources of carbs and protein to the top foods for hydration and fueling on the run.',
    image: './depth-6-frame-1-2.png'
  }
])

const tags = ref([
  { id: 1, name: 'Running' },
  { id: 2, name: 'Training' },
  { id: 3, name: 'Nutrition' },
  { id: 4, name: 'Injury' },
  { id: 5, name: 'Recovery' },
  { id: 6, name: 'Mental health' },
  { id: 7, name: 'Gear' },
  { id: 8, name: 'Race' }
])

const filters = ref([
  { id: 1, name: 'Newest' },
  { id: 2, name: 'Popular' },
  { id: 3, name: '7 days' },
  { id: 4, name: '30 days' },
  { id: 5, name: 'Marathon' }
])
</script>

<template>
  <Header />
  <div class="article-page">
    <div class="depth-frame">
      <div class="depth-frame-wrapper">
        <div class="content-container">
          <!-- Main Content Section -->
          <div class="main-content">
            <!-- Header -->
            <div class="section-header">
              <h1 class="title">All articles</h1>
            </div>

            <!-- Filters -->
            <div class="filters-container">
              <div v-for="filter in filters" 
                   :key="filter.id" 
                   class="filter-item">
                <div class="filter-content">
                  <span class="filter-text">{{ filter.name }}</span>
                  <div class="icon-wrapper">
                    <img class="icon" alt="Filter icon" :src="'./vector-0.svg'" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Articles -->
            <div class="articles-container">
              <article v-for="article in articles" 
                      :key="article.id" 
                      class="article-card">
                <div class="article-content">
                  <h2 class="article-title">{{ article.title }}</h2>
                  <p class="article-description">{{ article.description }}</p>
                  <button class="read-more">Read more</button>
                </div>
                <div class="article-image" 
                     :style="{ backgroundImage: `url(${article.image})` }" />
              </article>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="sidebar">
            <div class="section-header">
              <h2 class="title">Related tags</h2>
            </div>
            <div class="tags-container">
              <div v-for="tag in tags" 
                   :key="tag.id" 
                   class="tag">
                {{ tag.name }}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.article-page {
  background-color: #ffffff;
}

.depth-frame {
  background-color: #f7f9fc;
  min-height: 800px;
  padding: 20px;
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  padding: 20px 16px 12px;
}

.title {
  color: #0c141c;
  font-size: 22px;
  font-weight: 700;
  line-height: 28px;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
}

.filter-item {
  background-color: #e8edf2;
  border-radius: 12px;
  padding: 0 16px;
  height: 32px;
  display: flex;
  align-items: center;
}

.articles-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-title {
  font-size: 16px;
  font-weight: 700;
  color: #0c141c;
}

.article-description {
  font-size: 14px;
  color: #4f7296;
  line-height: 1.5;
}

.article-image {
  width: 280px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
}

.read-more {
  background-color: #e8edf2;
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #0c141c;
  cursor: pointer;
  width: fit-content;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
}

.tag {
  background-color: #e8edf2;
  border-radius: 12px;
  padding: 4px 16px;
  font-size: 14px;
  color: #0c141c;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.article-card {
  animation: fadeIn 0.3s ease-out forwards;
}

.article-card:nth-child(2) { animation-delay: 0.1s; }
.article-card:nth-child(3) { animation-delay: 0.2s; }
</style>