<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

// State management
const searchQuery = ref('')
const selectedType = ref('')
const selectedDate = ref('') 
const selectedProvince = ref('')
const isLoading = ref(true)
const error = ref (null)

const currentPage = ref(1)
const itemsPerPage = 12
const races = ref([])

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
      }
    })

    // Sort upcoming races by nearest date
    upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    
    // Just set the upcoming races
    races.value = upcoming
    
  } catch (err) {
    error.value = 'Failed to load races'
    console.error('Error fetching races:', err)
    console.error('Error details:', err.message)
  } finally {
    isLoading.value = false
  }
}

const provinces = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Kepulauan Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Banten',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat'
]

const filteredUpcomingRaces = computed(() => {
  let filtered = races.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(race => 
      race.title.toLowerCase().includes(query) ||
      race.location.toLowerCase().includes(query)
    )
  }

  if (selectedDate.value) {
    filtered = filtered.filter(race => race.date === selectedDate.value)
  }

  return filtered
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

// Methods
const handleDateChange = (event) => {
  const inputDate = event.target.value
  selectedDate.value = formatDate(inputDate)
}

const resetFilters = () => {
  selectedType.value = ''
  selectedDate.value = ''
  selectedProvince.value = ''
  document.getElementById('date-input').value = '' // Reset the input value
}

const totalPages = computed(() => Math.ceil(filteredUpcomingRaces.value.length / itemsPerPage))

const paginatedRaces = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUpcomingRaces.value.slice(start, end)
})

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
          <h1 class="title">Upcoming Races</h1>
          <div class="search-container">
            <div class="search-input-container">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search races by name or location" 
                class="search-input"
              />
            </div>
          </div>
        </header>
  
        <!-- Main Content -->
        <div class="content">
          <div class="content-row">
            <!-- Filter Section -->
            <aside class="filter-column">
              <div class="filter-container">
                <label for="type-select" class="filter-label">Type</label>
                <div class="select-container">
                  <select 
                    id="type-select" 
                    v-model="selectedType"
                    class="filter-select"
                  >
                    <option value="">Select Type</option>
                    <option value="ultra">Ultra</option>
                    <option value="marathon">Marathon</option>
                    <option value="half-marathon">Half Marathon</option>
                    <option value="10k">10K</option>
                    <option value="5k">5K</option>
                  </select>
                  <i class="fas fa-chevron-down select-arrow"></i>
                </div>
  
                <label for="province-select" class="filter-label">Province</label>
                <div class="select-container">
                  <select 
                    id="province-select" 
                    v-model="selectedProvince"
                    class="filter-select"
                  >
                    <option value="">Select Province</option>
                    <option 
                      v-for="province in provinces" 
                      :key="province" 
                      :value="province"
                    >
                      {{ province }}
                    </option>
                  </select>
                  <i class="fas fa-chevron-down select-arrow"></i>
                </div>
  
                <label for="date-input" class="filter-label">Date</label>
                <input
                  type="date"
                  id="date-input"
                  class="date-input"
                  v-model="selectedDate"
                />
  
                <button class="reset-button" @click="resetFilters">
                  Reset Filter
                </button>
              </div>
            </aside>
  
            <!-- Main Content Area -->
            <div class="main-content">
              <div v-if="isLoading" class="loading-state">
                <div class="loader"></div>
                Loading races...
              </div>
              
              <div v-else-if="error" class="error-state">
                {{ error }}
                <button @click="fetchRaces" class="retry-button">Retry</button>
              </div>
  
              <div v-else class="races-container">
                <!-- Races Grid -->
                <div class="races-grid">
                  <article 
                    v-for="race in paginatedRaces" 
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
  
                <!-- Pagination -->
                <div class="pagination">
                  <span class="pagination-info">
                    Page {{ currentPage }} of {{ totalPages || 1 }}
                  </span>
                  <div class="pagination-controls" v-if="totalPages > 1">
                    <button 
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                      class="pagination-button"
                    >
                      Previous
                    </button>
                    <button 
                      :disabled="currentPage === totalPages"
                      @click="currentPage++"
                      class="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
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
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

.filter-column {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-label {
  font-size: 16px;
  font-weight: 500;
  color: #1c1c21;
}

.select-container {
  position: relative;
}

.filter-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  appearance: none;
  color: #1c1c21;
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #3d404a;
  pointer-events: none;
}

.date-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  color: #1c1c21;
}

.date-input::-webkit-datetime-edit,
.date-input::-webkit-inner-spin-button,
.date-input::-webkit-calendar-picker-indicator {
  color: #1c1c21;
}

date-input::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

.date-input::-webkit-datetime-edit-text {
  padding: 0 4px;
}

.date-input::-webkit-datetime-edit-month-field,
.date-input::-webkit-datetime-edit-day-field,
.date-input::-webkit-datetime-edit-year-field {
  padding: 0;
}

.reset-button {
  width: 100%;
  padding: 12px;
  background: #617afa;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background: #4c62c8;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
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
}

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
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 16px 0;
}


.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 16px;
}

.pagination-button {
  padding: 8px 16px;
  background: #617afa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.pagination-button:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background: #4c62c8;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
}

@media (max-width: 480px) {

  .filter-column {
    padding: 16px;
  }
}
</style>