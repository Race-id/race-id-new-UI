<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import { eventService } from '@/components/services/eventService'

const route = useRoute()

const event = ref({
  evnhStartDate: null,
  evnhPlace: '',
  evnhDescription: '',
  registrationUrl: '',
  evnhName: '',
  evnhThumbnail: '',
})

const formatDate = (date) => {
  if (!date) return 'To Be Announced'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  })
}

const fetchEventDetail = async (eventId) => {
  try {
    console.log('Fetching event ID:', eventId)
    const response = await eventService.getEventDetail(eventId)
    console.log('Event data:', response)
    
    event.value = {
      ...response.data,
      evnhPlace: response.data.evnhPlace || 'To Be Announced',
      evnhDescription: response.data.evnhDescription || 'To Be Announced',
      evnhName: response.data.evnhName || 'Event Name'
    }
  } catch (error) {
    console.error('Failed to fetch event details:', error)
  }
}

const handleImageError = (e) => {
  e.target.src = '/src/assets/images/images-empty.png'
}

onMounted(() => {
  const eventId = route.params.id
  fetchEventDetail(eventId)
})
</script>

<template>
  <div>
    <Header />
    <div class="race-detail-container">

      <!-- section nama event dan thumbnail -->
      <div class="race-header">
        <h1 class="race-title">{{event.evnhName}}</h1>
        <div class="thumbnail-container">
          <img 
          :src="event?.evnhThumbnail || '/src/assets/images/images-empty.png'"
          :alt="event?.evnhName"
          class="race-thumbnail"
          @error="handleImageError"
          >

        </div>
      </div>

      <div class="race-info">
        <div class="info-item">
          <i class="fas fa-calendar"></i>
          <span>{{ formatDate(event.evnhStartDate) }}</span>
        </div>
      
        <div class="info-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ event?.evnhPlace || 'To Be Announced' }}</span>
        </div>
      </div>

      <div class="description-box">
        <h2 class="description-title">Deskripsi Event</h2>
        <div class="description-content">
          <p>{{ event?.evnhDescription || 'To Be Announced' }}</p>
        </div>
      </div>

      <div class="registration-section">
        <a 
          href="#"
          class="registration-button"
          target="_blank">
          Daftar Sekarang
        </a>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

body, race-detail-container {
  font-family: 'Poppins', sans-serif;
}
body {
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
}

.race-detail-container {
  padding: 40px 20px;
  max-width: 800px;
  margin: 40px auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.race-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px; 
  margin-bottom: 10px;
  font-size: 1.1em;
}

.info-text {
  margin-left: 4px; 
}

.description-box {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.description-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.description-content {
  line-height: 1.6;
  color: #555;
}

.registration-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
}
  .registration-button {
    display: inline-block;
    padding: 12px 30px;
    background-color:#0993d9;
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: bold;
    font-size: 1em;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .registration-button:hover {
    background-color: #2252a4;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.2);
    color: white; 
    text-decoration: none; 
  }
.race-header {
  margin-bottom: 30px;
}

.race-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.thumbnail-container {
  width: 100%;
  max-width: 300px;
  max-height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
  margin: 0 auto 20px;
  display: flex;
  justify-self: center;
  align-items: center;
}

.race-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
