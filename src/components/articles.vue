<template>
  <div>
    <Header />
    <main>
      <h1>Latest Articles</h1>
      <div class="articles-grid">
        <div v-for="article in articles" :key="article.id" class="article-card">
          <img :src="article.image" :alt="article.title" class="article-image" />
          <div class="article-content">
            <div class="article-category">{{ article.category }}</div>
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div class="article-meta">
              <span>{{ article.readTime }} min read</span>
              <router-link :to="article.link" class="read-more">Read More →</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

export default {
  name: 'Articles',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      articles: [
        {
          id: 1,
          image: '/src/assets/images/Article 1.jpg',
          category: 'Training',
          title: '10 Essential Tips for Marathon Training',
          excerpt: 'Master your marathon preparation with these proven training strategies that will help you cross the finish line strong.',
          readTime: 5,
          link: '/article-details'
        },
        {
          id: 2,
          image: '/src/assets/images/Article 2.jpg',
          category: 'Nutrition',
          title: 'Best Pre-Race Nutrition Guide',
          excerpt: 'Learn what to eat before your big race to maximize your performance and avoid hitting the wall.',
          readTime: 4,
          link: '#'
        },
        {
          id: 3,
          image: '/src/assets/images/Article 3.jpg',
          category: 'Gear',
          title: 'Choosing the Right Running Shoes',
          excerpt: 'Find the perfect running shoes for your foot type and running style with our comprehensive guide.',
          readTime: 6,
          link: '#'
        },
        {
          id: 4,
          image: '/src/assets/images/Article 4.jpg',
          category: 'Recovery',
          title: 'Post-Run Recovery Techniques',
          excerpt: 'Discover effective recovery methods to help your body bounce back faster after intense training sessions.',
          readTime: 7,
          link: '#'
        },
        {
          id: 5,
          image: '/src/assets/images/Article 5.jpg',
          category: 'Motivation',
          title: 'Stay Motivated During Training',
          excerpt: 'Learn powerful mental strategies to keep your motivation high throughout your training journey.',
          readTime: 5,
          link: '#'
        },
        {
          id: 6,
          image: '/src/assets/images/Article 6.jpg',
          category: 'Training',
          title: 'Speed Training for Runners',
          excerpt: 'Master the art of speed with these proven interval training workouts for all levels, enhancing your pace and endurance.',
          readTime: 8,
          link: '#'
        },
        {
          id: 7,
          image: '/src/assets/images/Article 7.jpg',
          category: 'Lifestyle',
          title: 'Balancing Work and Training',
          excerpt: 'Tips and strategies for maintaining a successful training schedule while managing a busy career.',
          readTime: 6,
          link: '#'
        }
      ]
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

body {
  font-family: 'Montserrat', sans-serif;
}
main {
  animation: fadeSlideIn 0.5s ease-out;
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 20px;
}

.article-category {
  color: #ff4d4d;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.article-title {
  font-size: 1.4em;
  margin: 0 0 10px 0;
  color: #333;
}

.article-excerpt {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 0.9em;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.read-more {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: #ff4d4d;
}
</style>
