<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import { useRouter } from 'vue-router'
import Calendar from '@/components/calendar.vue'

// State management (simplified)
const searchQuery = ref('')
const isLoading = ref(true)
const error = ref(null)
const router = useRouter()

// Navigation functions
const goToUpcomingEvents = () => {
  router.push('/upcoming-events')
}

const goToRaceDetails = (raceId) => {
  router.push(`/race-detail/${raceId}`)
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
    console.error('Error details:', err.message) 
  } finally {
    isLoading.value = false
  }
}

// Simplified computed properties
const filteredUpcomingRaces = computed(() => {
  if (!searchQuery.value) return races.value

  const query = searchQuery.value.toLowerCase()
  return races.value.filter(race => 
    race.title?.toLowerCase().includes(query)
  )
})

const filteredPastRaces = computed(() => {
  if (!searchQuery.value) return pastRaces.value

  const query = searchQuery.value.toLowerCase()
  return pastRaces.value.filter(race => 
    race.title?.toLowerCase().includes(query)
  )
})

// Methods
const resetSearch = () => {
  searchQuery.value = ''
}

const handleSearch = (e) => {
  e.preventDefault() // Prevent form submission
}

onMounted(() => {
  fetchRaces()
})

// Move date-related logic to computed properties
const calendarDate = computed(() => {
  const date = new Date()
  return {
    month: date.toLocaleString('default', { month: 'long' }),
    day: date.getDate(),
    year: date.getFullYear(),
    weekday: date.toLocaleString('default', { weekday: 'long' })
  }
})

// Add method to handle date selection
const handleDateSelect = (selectedDate) => {
  // Jangan langsung tutup popup
  if (selectedDate) {
    // Filter races berdasarkan tanggal yang dipilih
    const selected = new Date(selectedDate)
    // Implementasi filter logic disini
    console.log('Selected date:', selected)
  }
}

// Add method to close calendar
const closeCalendar = () => {
  showCalendar.value = false;
  document.body.classList.remove('popup-open');
}

// Add toggle state
const showCalendar = ref(false)

// Add toggle function
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
  // Toggle class on body
  if (showCalendar.value) {
    document.body.classList.add('popup-open');
  } else {
    document.body.classList.remove('popup-open');
  }
}

// Add onUnmounted hook
onUnmounted(() => {
  document.body.classList.remove('popup-open');
})

</script>

<template>
  <Header />
  <main class="race-finder">
    <section class="race-finder-container">
      <!-- Search Header with animated classes -->
      <header class="header">
        <div class="title-wrapper">
          <h1 class="title animate-title">
            <span class="title-word">Find</span>
            <span class="title-word">Your</span>
            <span class="title-word">Next</span>
            <span class="title-word">Race</span>
          </h1>
        </div>
        <div class="search-container animate-search">
          <div class="search-input-container">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search races by name" 
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button 
              v-show="searchQuery" 
              class="clear-button" 
              @click="resetSearch"
              type="button"
              aria-label="Clear search"
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
                  @click= "goToRaceDetails(race.id)"
                  role="button"
                  tabindex="0"
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
                  @click="goToRaceDetails(race.id)"
                    role="button"
                    tabindex="0"
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
          
          <!-- Calendar Widget -->
          <aside class="calendar-widget">
            <!-- Clickable widget area -->
            <div class="widget-trigger" @click="toggleCalendar">
              <div class="month-label">
                {{ calendarDate.month }} {{ calendarDate.year }}
              </div>
              <div class="date-display">
                <div class="date-content">
                  <span class="current-day">{{ calendarDate.day }}</span>
                  <span class="weekday">{{ calendarDate.weekday }}</span>
                </div>
              </div>
            </div>

            <!-- Calendar Popup -->
            <Transition name="slide-fade">
              <div v-show="showCalendar" class="calendar-popup">
                <div class="popup-overlay" @click.self="closeCalendar">
                  <div class="popup-content">
                    <div class="popup-header">
                      <h3 class="popup-title">Pilih Tanggal</h3>
                      <button 
                        class="close-button"
                        @click="closeCalendar"
                        aria-label="Close calendar"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <div class="calendar-container">
                      <Calendar 
                        :events="races"
                        @select-date="handleDateSelect"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </aside>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</template>

<style>
/* Add this at the top of your style section and remove 'scoped' */
body.popup-open {
  overflow: hidden;
  padding-right: 17px; /* Compensate for scrollbar width to prevent layout shift */
}

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

.title-wrapper {
  overflow: hidden;
}

.title {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 48px;
  font-weight: 800;
  color: #1c1c21;
  margin-bottom: 24px;
}

.title-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(40px);
  animation: wordSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-word:nth-child(1) { animation-delay: 0.1s; }
.title-word:nth-child(2) { animation-delay: 0.2s; }
.title-word:nth-child(3) { animation-delay: 0.3s; }
.title-word:nth-child(4) { animation-delay: 0.4s; }

.search-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(20px);
  animation: searchBarSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.6s;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.search-input-container:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(97, 122, 250, 0.15);
  border-color: #617afa;
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
  transition: all 0.3s ease;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  opacity: 1;
  color: #1c1c21;
  transform: translateY(-50%) scale(1.1);
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
  width: 100%;
}

.content {
  max-width: 1280px;
  margin: 0 auto;
}

.content-row {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  align-items: start;
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
  transition: all 0.2s ease-in-out;
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: cardSlideUp 0.6s ease-out;
  animation-fill-mode: both;
  cursor: pointer;
  outline: none;
}

.race-card:nth-child(1) { animation-delay: 0.1s; }
.race-card:nth-child(2) { animation-delay: 0.2s; }
.race-card:nth-child(3) { animation-delay: 0.3s; }
.race-card:nth-child(4) { animation-delay: 0.4s; }

.race-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.race-card.featured {
  grid-column: 1 / -1;
}

.race-card:focus {
  box-shadow: 0 0 0 2px #617afa;
  transform: translateY(-2px);
}

.race-card:active {
  transform: translateY(-1px);
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

.calendar-widget {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: visible; /* Ubah dari hidden ke visible */
  position: sticky;
  top: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  animation: calendarSlideIn 0.6s ease-out;
}

.widget-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #617afa;
  cursor: pointer;
}

.close-calendar-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  padding: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.close-calendar-button:hover {
  opacity: 1;
}

.close-calendar-button i {
  font-size: 16px;
}

.month-label {
  background: #617afa;
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  transition: background-color 0.3s ease;
}

.calendar-widget:hover .month-label {
  background: #4c62c8;
}

.date-display {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.calendar-widget:hover .date-display {
  background: #f1f5f9;
}

.current-day {
  font-size: 48px;
  font-weight: 700;
  color: #1c1c21;
  line-height: 1;
  transition: transform 0.3s ease, color 0.3s ease;
}

.calendar-widget:hover .current-day {
  transform: scale(1.1);
  color: #617afa;
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

@keyframes wordSlide {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes searchBarSlide {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add new keyframe animation */
@keyframes calendarSlideIn {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.weekday {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

/* Update calendar popup styles */
.calendar-popup {
  position: absolute;
  top: calc(100% + 60px); /* Ubah dari 100% menjadi calc(100% + 60px) */
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  z-index: 100;
  margin-top: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

/* Tambahkan styling untuk popup overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Ubah dari center ke flex-start */
  padding-top: 80px; /* Kurangi padding top */
  z-index: 9999;
  overflow-y: auto; /* Allow scrolling in overlay */
  -webkit-overflow-scrolling: touch;
}

@keyframes popupSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.calendar-widget:hover .date-content {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-row {
    grid-template-columns: 1fr;
  }

  .races-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .calendar-widget {
    display: none;
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
    font-size: 36px;
    gap: 8px;
  }

  .title-word {
    font-size: 24px;
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

  .title {
    font-size: 28px;
  }
}

.widget-header, .date-display {
  cursor: pointer;
}

.popup-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #1c1c21;
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f3f4f6;
  color: #1c1c21;
  border-color: #d1d5db;
}

.close-button i {
  font-size: 16px;
}

/* Transition animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* New styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Tingkatkan z-index */
  overflow-y: auto; /* Allow scrolling in overlay */
  -webkit-overflow-scrolling: touch;
}

.popup-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh; /* Limit height */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10000; /* Tambahkan z-index */
  overflow: hidden; /* Tetap hidden untuk mencegah overflow */
  margin: 0 auto; /* Center horizontally */
  display: flex;
  flex-direction: column;
}

.calendar-container {
  padding: 16px;
  width: 100%; /* Set fixed width */
  flex: 1;
  overflow-y: auto; /* Enable vertical scroll */
  max-height: calc(80vh - 60px); /* Adjust based on header height */
  -webkit-overflow-scrolling: touch; /* Smooth scroll on iOS */
}

/* Pastikan calendar tidak melewati container */
:deep(.calendar-wrapper) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box; /* Pastikan padding termasuk dalam width */
}

/* Pastikan semua elemen kalender mengikuti container */
:deep(.calendar-wrapper *) {
  max-width: 100%;
  box-sizing: border-box;
}

/* Update transition animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Update responsive styles */
@media (max-width: 480px) {
  .popup-content {
    margin: 8px;
    width: calc(100% - 16px); /* Kurangi margin dari total width */
  }
  
  .calendar-container {
    padding: 8px;
  }
  
}
</style>