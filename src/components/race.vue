<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import { useRouter } from 'vue-router'

// State management (simplified)
const searchQuery = ref('')
const isLoading = ref(true)
const error = ref(null)
const router = useRouter()

// Navigation functions
const goToUpcomingEvents = () => {
  router.push('/upcoming-events')
}

const goToPastEvents = () => {
  router.push('/past-events')
}

const races = ref([])
const pastRaces = ref([])

// Fetch races from API
const fetchRaces = async () => {
  try {
    isLoading.value = true
    const response = await fetch('https://steelytoe.com/dev.titudev.com/api/v1/resources/event_public_header')
    
    if (!response.ok) {
      throw new Error('Failed to fetch races')
    }

    const data = await response.json()
    console.log('API Response:', data) // Debug log

    // Check if data is array, if not, try to access the correct property
    const racesList = Array.isArray(data) ? data : data.data || []
    
    // Memisahkan races berdasarkan evnhStartDate
    const currentDate = new Date()
    const upcoming = []
    const past = []

    racesList.forEach(race => {
      const raceDate = new Date(race.evnhStartDate)
      if (raceDate >= currentDate) {
        upcoming.push({
          id: race.evnhId,
          title: race.evnhName,
          date: new Date(race.evnhStartDate).toLocaleDateString('en-GB'),
          location: race.evnhLocation,
          image: race.evnhImage || '/images/placeholder.jpg',
          startDate: race.evnhStartDate
        })
      } else {
        past.push({
          id: race.evnhId,
          title: race.evnhName,
          date: new Date(race.evnhStartDate).toLocaleDateString('en-GB'),
          location: race.evnhLocation,
          image: race.evnhImage || '/images/placeholder.jpg',
          startDate: race.evnhStartDate
        })
      }
    })

    // Sort upcoming races by nearest date
    upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    
    // Sort past races by most recent
    past.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    races.value = upcoming
    pastRaces.value = past
  } catch (err) {
    error.value = 'Failed to load races'
    console.error('Error fetching races:', err)
    console.error('Error details:', err.message) // Additional error details
  } finally {
    isLoading.value = false
  }
}

// Simplified computed properties
const filteredUpcomingRaces = computed(() => {
  if (!searchQuery.value) return races.value

  const query = searchQuery.value.toLowerCase()
  return races.value.filter(race => 
    race.title.toLowerCase().includes(query) ||
    race.location.toLowerCase().includes(query)
  )
})

const filteredPastRaces = computed(() => {
  if (!searchQuery.value) return pastRaces.value

  const query = searchQuery.value.toLowerCase()
  return pastRaces.value.filter(race => 
    race.title.toLowerCase().includes(query) ||
    race.location.toLowerCase().includes(query)
  )
})

// Methods
const handleSearch = () => {
  console.log('Searching for:', searchQuery.value)
}

onMounted(() => {
  fetchRaces()
})

</script>

<template>
  <Header />
  <main class="race-finder">
    <section class="race-finder-container">
      <!-- Search Header -->
      <header class="header">
        <h1 class="title">Find Your Next Race</h1>
        <div class="search-container">
          <div class="search-input-container">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search races by name or location" 
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button 
              v-show="searchQuery" 
              class="clear-button" 
              @click="searchQuery = ''"
              type="button"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="content">
        <div class="content-row">
          <!-- Main Content Area (now full width) -->
          <div class="main-content">
            <!-- Upcoming Races Section -->
            <section class="races-section">
              <div class="section-header">
                <h2 class="section-title">Upcoming Races</h2>
                <button class="view-more" @click="goToUpcomingEvents">View more</button>
              </div>

              <div class="races-grid">
                <article 
                  v-for="race in filteredUpcomingRaces.slice(0, 4)" 
                  :key="race.id"
                  class="race-card"
                >
                  <img
                    :src="race.image"
                    :alt="race.title"
                    class="race-image"
                  />
                  <div class="race-content">
                    <h3 class="race-title">{{ race.title }}</h3>
                    <p class="race-date">{{ race.date }} | {{ race.location }}</p>
                  </div>
                </article>
              </div>
              </section>

            <!-- Past Races Section -->
            <section class="races-section">
              <div class="section-header">
                <h2 class="section-title">Past Races</h2>
                <button class="view-more" @click="goToPastEvents">View more</button>
              </div>

              <div class="races-grid">
                <article 
                  v-for="race in pastRaces.slice(0, 4)" 
                  :key="race.id"
                  class="race-card"
                >
                  <img
                    :src="race.image"
                    :alt="race.title"
                    class="race-image"
                  />
                  <div class="race-content">
                    <h3 class="race-title">{{ race.title }}</h3>
                    <p class="race-date">{{ race.date }} | {{ race.location }}</p>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</template>

<style scoped>

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #6b7280;
}

.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #617afa;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #617afa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background: #4c62c8;
}

.race-finder {
  min-height: 100vh;
  background-color: #fafafa;
}

.race-finder-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px;
}

.header {
  margin-bottom: 40px;
  max-width: 898px;
  margin: 0 auto 40px;
}

.title {
  font-size: 36px;
  font-weight: 800;
  color: #1c1c21;
  margin-bottom: 24px;
  line-height: 1.2;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.search-input-container {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  position: relative;
}

.clear-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #6b7280;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.clear-button:hover {
  color: #1c1c21;
}

.clear-button i {
  font-size: 14px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: #1c1c21;
  padding-right: 40px;
}

.content {
  max-width: 1280px;
  margin: 0 auto;
}

.content-row {
  display: block;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 100%;
}

.races-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  animation: sectionFadeIn 0.5s ease-in-out;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1c1c21;
  position: relative;
  animation: titleSlideIn 0.5s ease-out;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #617afa;
  animation: underlineGrow 0.6s ease-out 0.3s forwards;
}

.view-more {
  color: #617afa;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  animation: fadeIn 0.5s ease-out 0.4s both;
}

.view-more:hover {
  color: #4c62c8;
}

.featured-race {
  margin-bottom: 24px;
}

.races-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.race-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: cardSlideUp 0.6s ease-out;
  animation-fill-mode: both;
}

.race-card:nth-child(1) { animation-delay: 0.1s; }
.race-card:nth-child(2) { animation-delay: 0.2s; }
.race-card:nth-child(3) { animation-delay: 0.3s; }
.race-card:nth-child(4) { animation-delay: 0.4s; }

.race-card:hover {
  transform: translateY(-4px);
}

.race-card.featured {
  grid-column: 1 / -1;
}

.race-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.featured-image {
  height: 300px;
}

.race-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.race-title {
  font-size: 16px;
  font-weight: 600;
  color: #1c1c21;
  margin-bottom: 8px;
}

.race-date {
  font-size: 14px;
  color: #6b7280;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
}

.pagination-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.pagination-item:hover {
  background: #f9fafb;
}

.pagination-item.active {
  background: #617afa;
  color: white;
  border-color: #617afa;
}

.pagination-item.active .pagination-arrow {
  color: white;
}

.pagination-number {
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes underlineGrow {
  to {
    width: 40px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-row {
    grid-template-columns: 1fr;
  }

  .races-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .race-finder-container {
    padding: 24px 16px;
  }

  .header {
    margin-bottom: 24px;
  }

  .title {
    font-size: 28px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .featured-image {
    height: 200px;
  }

  .races-section {
    padding: 16px;
  }
}
</style>