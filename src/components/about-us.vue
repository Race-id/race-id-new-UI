<script setup>
import { ref, reactive } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

const infoCards = reactive([
  {
    title: 'Visi Kami',
    content: 'Menjadi platform terpercaya yang menginspirasi dan mendukung komunitas pelari Indonesia untuk mencapai potensi terbaik mereka.'
  },
  {
    title: 'Misi Kami',
    content: 'Menyediakan akses mudah ke event lari berkualitas, informasi terpercaya, dan produk terbaik untuk mendukung perjalanan lari Anda.'
  },
  {
    title: 'Layanan Kami',
    content: 'Event Management untuk komunitas pelari Indonesia.'
  },
  {
    title: 'Lokasi',
    content: `<a href="https://maps.app.goo.gl/1hQPwaaTqHspL6Qy5" target="_blank" style="text-decoration: none; color: black;">Equity Tower 17th Floor. SCBD Jakarta Selatan Jl. Jend. Sudirman Kav. 52-53 DKI Jakarta 12190</a><br><br>
      <a href="mailto:info@steelytoe.com" style="text-decoration: none; color: black;">Email: info@steelytoe.com</a><br>
      <a href="tel:+6221 5151392" style="text-decoration: none; color: black;">Tel: +62 21 5151 392</a>`
  }
])
</script>

<template>
  <Header />
  <div class="about-container">
    <section class="hero-section">
      <h1 class="hero-title">About Race.id</h1>
      <p class="hero-subtitle">
        Platform komunitas lari terdepan di Indonesia yang menghubungkan pelari dengan event-event berkualitas dan produk terbaik untuk mendukung performa Anda.
      </p>
    </section>

    <div class="content-grid">
      <div v-for="(card, index) in infoCards" 
           :key="index" 
           class="info-card"
           :style="`transition-delay: ${index * 0.2}s`">
        <h3 class="info-title">{{ card.title }}</h3>
        <p class="info-content" v-html="card.content"></p>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

.about-container {
  font-family: 'Poppins', sans-serif;
  max-width: 900px;
  margin: 60px auto;
  padding: 0 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
  animation: slideUpFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.hero-title {
  font-size: 2.5em;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.2em;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 40px;
}

.info-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  animation: slideUpFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.info-card:nth-child(1) { animation-delay: 0.6s; }
.info-card:nth-child(2) { animation-delay: 0.7s; }
.info-card:nth-child(3) { animation-delay: 0.8s; }
.info-card:nth-child(4) { animation-delay: 0.9s; }

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.info-title {
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.info-content {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .info-card {
    animation-delay: 0.3s;
  }
}
</style>