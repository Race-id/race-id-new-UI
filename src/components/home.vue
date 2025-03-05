<script setup>
import HeaderComponent from './header.vue'
import FooterComponent from './footer.vue'
import { ref, onMounted } from 'vue'
const currentSlide = ref(0)
const currentTestimonialIndex = ref(0)
const email = ref('')


const slides = [
  { 
    image: '/images/Astra Run 2024.jpg',
    alt: 'Astra Run 2024',
    title: 'Astra Run 2024',
    subtitle: 'Run with happiness!'
  },
  {
    image: '/images/PLN run 2024.jpeg',
    alt: 'PLN Electric Run',
    title: 'PLN Electric Run 2024',
    subtitle: 'Power up togetherness!'
  },
  {
    image: '/images/Borobudur Marathon 2024.jpg',
    alt: 'Borobudur Marathon',
    title: 'Borobudur Marathon 2024',
    subtitle: 'Run on, mark it'
  }
]

const stats = ref([
  { label: 'Upcoming Events', target: 4, current: 0 },
  { label: 'Active Runners', target: 47625, current: 0 },
  { label: 'Partner Cities', target: 37, current: 0 },
  { label: 'Events Completed This Year', target: 0, current: 0 }
])


const categories = [
  {
    name: 'Road Running',
    description: 'City marathons and road races',
    icon: 'fas fa-running category-icon'
  },
  {
    name: 'Trail Running',
    description: 'Off-road adventures and challenges',
    icon: 'fas fa-mountain category-icon'
  },
  {
    name: 'Virtual Runs',
    description: 'Run anywhere, anytime',
    icon: 'fas fa-globe category-icon'
  },
  {
    name: 'Charity Runs',
    description: 'Run for a cause',
    icon: 'fas fa-heart category-icon'
  }
]

const testimonials = [
  {
    quote: 'Pengalaman luar biasa di Borobudur Marathon! Organisasi event sangat profesional.',
    name: 'Sarah Wijaya',
    event: 'Finisher Borobudur Marathon 2023'
  },
  {
    quote: 'Salonpas Run 2024 memberikan pengalaman yang tak terlupakan. Route dan medal nya keren!',
    name: 'Budi Santoso',
    event: '10K Runner - Salonpas Run 2024'
  },
  {
    quote: 'Race.id membantu saya menemukan event lari terbaik. Informasinya lengkap dan akurat.',
    name: 'Linda Kusuma',
    event: 'Half Marathon Enthusiast - Borobudur Marathon 2024 #1'
  } 
]

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
  updateSliderPosition()
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
  updateSliderPosition()
}

function goToSlide(index) {
  currentSlide.value = index
  updateSliderPosition()
}

function updateSliderPosition() {
  const slider = document.querySelector('.banner-slider')
  if (slider) {
    slider.style.transform = `translateX(-${currentSlide.value * 100}%)`
  }
}

function nextTestimonial() {
  currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % testimonials.length
  updateTestimonialsPosition()
}

function prevTestimonial() {
  currentTestimonialIndex.value = (currentTestimonialIndex.value - 1 + testimonials.length) % testimonials.length
  updateTestimonialsPosition()
}

function updateTestimonialsPosition() {
  const wrapper = document.querySelector('.testimonials-wrapper')
  if (wrapper) {
    const slideWidth = wrapper.children[0].offsetWidth + 20
    wrapper.style.transform = `translateX(-${currentTestimonialIndex.value * slideWidth}px)`
  }
}

function animateStats() {
  stats.value.forEach(stat => {
    const duration = 2000
    const increment = stat.target / (duration / 16)
    let current = 0

    const updateCounter = () => {
      if (current < stat.target) {
        current += increment
        stat.current = Math.ceil(current)
        requestAnimationFrame(updateCounter)
      } else {
        stat.current = stat.target
      }
    }

    updateCounter()
  })
}

function subscribe() {
  alert(`Thank you! We'll notify ${email.value} when we launch.`)
  email.value = ''
}

function checkScroll() {

  const scrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const isBottomPage = scrollPosition + windowHeight >= documentHeight - 100 // buffer 100px

  if (!isBottomPage) {
    const sections = document.querySelectorAll('.animate-on-scroll')
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top
      const sectionBottom = section.getBoundingClientRect().bottom
      const triggerPoint = window.innerHeight * 0.8

      if (sectionTop < triggerPoint && sectionBottom > 0) {
        section.classList.add('animate-in')
      } else {
        section.classList.remove('animate-in')
      }
    })
  }
}

onMounted(() => {
  animateStats()
  setInterval(nextSlide, 5000)
  window.addEventListener('scroll', checkScroll)
  checkScroll()

  const pageContent = document.querySelector('.page-content')
  if (pageContent) {
    pageContent.classList.add('fade-in')
  }
})
</script>


<template>
  <div>
    <header-component />
    <div class="page-content fade-in">
      <!-- Hero Banner -->
      <section class="hero-banner animate-on-scroll">
        <div class="banner-slider" ref="slider">
          <div v-for="(slide, index) in slides" :key="index" class="banner-slide" :class="{ active: currentSlide === index }">
            <img :src="slide.image" :alt="slide.alt">
            <div class="banner-content">
              <h1>{{ slide.title }}</h1>
              <p>{{ slide.subtitle }}</p>
            </div>
          </div>
        </div>
        <div class="banner-nav">
          <button class="nav-btn prev" @click="prevSlide">&#10094;</button>
          <button class="nav-btn next" @click="nextSlide">&#10095;</button>
        </div>
        <div class="banner-dots">
          <span v-for="(slide, index) in slides" :key="index" class="dot" :class="{ active: currentSlide === index }" @click="goToSlide(index)"></span>
        </div>
      </section>

      <!-- Stats Counter
      <section class="stats-section animate-on-scroll">
        <div class="stats-container">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-number" :data-target="stat.target">{{ stat.current }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section> -->

      <!-- Featured Categories -->
      <section class="categories-section animate-on-scroll">
        <h2 class="section-title">Event Categories</h2>
        <div class="categories-grid">
          <div v-for="category in categories" :key="category.name" class="category-card">
            <i :class="category.icon"></i>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </section>
<!-- 
      <section class="testimonials-carousel animate-on-scroll">
  <h2 class="section-title">Runner Stories</h2>
  <div class="testimonials-wrapper" ref="testimonialsWrapper">
    <div v-for="testimonial in testimonials" :key="testimonial.name" class="testimonial-card">
      <div class="testimonial-content">
        <div class="quote-icon">❝</div>
        <div class="quote-text">{{ testimonial.quote }}</div>
        <div class="runner-details">
          <div class="runner-name">{{ testimonial.name }}</div>
          <div class="runner-event">{{ testimonial.event }}</div>
        </div>
      </div>
    </div>
  </div>
</section> -->
        </div>
      </div>
      <!-- Newsletter -->
      <section class="newsletter-section animate-on-scroll">
        <div class="newsletter-container">
          <h2 class="newsletter-title">Stay Updated with Race.id</h2>
          <p class="newsletter-subtitle">Subscribe to receive exclusive updates and offers</p>
          
          <form class="newsletter-form" @submit.prevent="subscribe">
            <input 
              type="email" 
              class="newsletter-input" 
              placeholder="Enter your email address" 
              v-model="email"
              required
            >
            <button type="submit" class="newsletter-button">
              Subscribe Now
            </button>
          </form>

          <div class="newsletter-benefits">
            <h3>What You'll Get:</h3>
            <ul>
              <li>🏃 Weekly Race Updates</li>
              <li>💪 Training Tips from Pros</li>
              <li>🎯 Exclusive Early Bird Offers</li>
              <li>🎁 Special Member Discounts</li>
            </ul>
          </div>
        </div>
      </section>
    <footer-component />
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

body, .page-content {
  font-family: 'Poppins', sans-serif;
}
.page-content {
  margin: 0;
  padding: 0;
}

.page-content {
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.page-content.fade-in {
  opacity: 1;
}

.fade-in {
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


body, html {
  margin:  0;
  padding: 0;
  overflow-x: hidden;
}

.hero-banner {
  width: 100%;
  position: relative;
  overflow: hidden;
  height: 500px;
}

.banner-slider {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.banner-slide {
  min-width: 100%;
  position: relative;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 60px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
}

.banner-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 100px);
  margin: 0 50px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.nav-btn {
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: white;
  transform: scale(1.1);
}

.banner-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

.stats-section {
  background: linear-gradient(to right, #283f95, #04a3e6);
  padding: 40px 0;
  color: white;
  text-align: center;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 10px;
}

.categories-section {
  padding: 60px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2em;
  color: #333;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.category-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.category-card:hover {
  transform: translateY(-10px);
}

.category-icon {
  font-size: 2.5em;
  color: #04a3e6;
  margin-bottom: 20px;
}

.testimonials-carousel {
  padding: 60px 20px;
  background: #f8f9fa;
}


.testimonials-wrapper {
  display: flex;
  gap: 30px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px 0;
  margin: 0 auto;
  max-width: 1200px;
  overflow: hidden;
}

.testimonial-card {
  min-width: 350px;
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(4, 163, 230, 0.1);
}

.testimonial-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(4, 163, 230, 0.1);
}

.quote-icon {
  font-size: 60px;
  color: #04a3e6;
  position: absolute;
  top: -20px;
  left: 25px;
  opacity: 0.15;
  font-family: 'Georgia', serif;
}

.quote-text {
  font-size: 1.1em;
  line-height: 1.7;
  color: #2c3e50;
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
  font-weight: 400;
}

  .testimonial-slide {
    min-width: 350px;
    max-width: 350px;
    height: 350px;
    flex-shrink: 0;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .testimonial-content {
  height: 100%; 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
}

  .testimonial-content p {
    font-size: 0.9em;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    line-clamp: 4;
    overflow: hidden;
  }

  .runner-details {
  border-top: 2px solid rgba(4, 163, 230, 0.1);
  padding-top: 20px;
  margin-top: 20px;
}

.runner-name {
  font-weight: 700;
  color: #283f95;
  font-size: 1.2em;
  margin-bottom: 8px;
}

.runner-event {
  color: #666;
  font-size: 0.95em;
  font-weight: 500;
}


.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 2;
}

.carousel-btn.prev {
  left: 0;
}

.carousel-btn.next {
  right: 0;
}

.newsletter-section {
  background: linear-gradient(135deg, #333, #666);
  padding: 60px 20px;
  color: white;
  text-align: center;
}

.newsletter-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.newsletter-title {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.newsletter-subtitle {
  font-size: 1.2em;
  margin-bottom: 30px;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.newsletter-input {
  padding: 15px;
  border-radius: 30px;
  border: none;
  width: 100%;
  max-width: 400px;
  font-size: 1em;
}

.newsletter-button {
  padding: 15px 30px;
  background: #04a3e6;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background 0.3s ease;
}

.newsletter-button:hover {
  background: #0993d9;
}

.newsletter-benefits {
  text-align: left;
  margin-top: 20px;
}

.newsletter-benefits h3 {
  margin-bottom: 10px;
  font-size: 1.5em;
}

.newsletter-benefits ul {
  list-style: none;
  padding: 0;
}

.newsletter-benefits li {
  margin: 10px 0;
  font-size: 1.1em;
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stats-section {
  transition-delay: 0.2s;
}

.categories-section {
  transition-delay: 0.3s;
}

.testimonials-carousel {
  position: relative;
  overflow: hidden; /* Menambah ini */
  padding: 80px 20px;
}

.newsletter-section {
  transition-delay: 0.5s;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .newsletter-container {
    padding: 20px;
  }

  .newsletter-title {
    font-size: 2em;
  }

  .newsletter-subtitle {
    font-size: 1em;
  }

  .banner-content h1 {
    font-size: 2em;
  }

  .testimonial-slide {
    min-width: calc(100% - 10px);
  }

}
</style>
