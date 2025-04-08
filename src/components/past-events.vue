<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import { useRoute } from 'vue-router'

// State management
const router = useRoute()
const searchQuery = ref('')
const selectedType = ref('')
const selectedDate = ref('') 
const selectedProvince = ref('')
const startDate = ref('')
const endDate = ref('')
const isLoading = ref(true)
const error = ref (null)
const showFirstEllipsis = computed(() => currentPage.value > 3)
const showLastEllipsis = computed(() => currentPage.value < totalPages.value - 2)
const showFirstInput = ref(false)
const showLastInput = ref(false)
const firstJumpInput = ref(null)
const lastJumpInput = ref(null)

const currentPage = ref(1)
const itemsPerPage = 12
const races = ref([])

// State for input jump page
const jumpToPage = ref('')

// State for navigation

const goToRaceDetails = (raceId) => {
  router.push(`/upcoming-events/${raceId}`)
}

// Handler for jump page
const handleJump = () => {
  const page = parseInt(jumpToPage.value)
  if (page && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    jumpToPage.value = ''
    showFirstInput.value = false
    showLastInput.value = false
  }
}

// Fetch races from API
const fetchRaces = async () => {
  try {
    isLoading.value = true
    const response = await fetch('https://steelytoe.com/dev.titudev.com/api/v1/resources/event_public_header?pageSize=9999&sort=evnhStartDate&pageNumber=1')
    
    if (!response.ok) {
      throw new Error('Failed to fetch races')
    }

    const data = await response.json()
    console.log('Raw API response:', data)
    
    const racesList = Array.isArray(data) ? data : data.data || []
    console.log('Processed racesList:', racesList.length)
    
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    // Filter past events
    const pastEvents = racesList.filter(race => {
      const raceDate = new Date(race.evnhStartDate)
      raceDate.setHours(0, 0, 0, 0)
      return raceDate < currentDate
    }).sort((a, b) => new Date(b.evnhStartDate) - new Date(a.evnhStartDate)) // Sort descending

    console.log('Filtered past events:', pastEvents.length)
    
    races.value = pastEvents.map(race => ({
      id: race.evnhId,
      title: race.evnhName,
      date: new Date(race.evnhStartDate).toLocaleDateString('en-GB'),
      location: race.evnhPlace,
      image: race.evnhThumbnail || '/images/placeholder.jpg',
      startDate: race.evnhStartDate
    }))

    console.log('Final processed races:', races.value.length)
    
  } catch (err) {
    error.value = 'Gagal memuat data lomba'
    console.error('Error fetching races:', err)
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

const filteredPastRaces = computed(() => {
  let filtered = races.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(race => 
      race.title.toLowerCase().includes(query) ||
      race.location.toLowerCase().includes(query)
    )
  }

  // Update filter tanggal dengan normalisasi
  if (startDate.value || endDate.value) {
    filtered = filtered.filter(race => {
      const raceDate = new Date(race.startDate)
      raceDate.setHours(0, 0, 0, 0)  // Normalize race date

      if (startDate.value && endDate.value) {
        const start = new Date(startDate.value)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate.value)
        end.setHours(23, 59, 59, 999)  // Set to end of day
        return raceDate >= start && raceDate <= end
      } else if (startDate.value) {
        const start = new Date(startDate.value)
        start.setHours(0, 0, 0, 0)
        return raceDate >= start
      } else if (endDate.value) {
        const end = new Date(endDate.value)
        end.setHours(23, 59, 59, 999)
        return raceDate <= end
      }
      return true
    })
  }

  if (selectedProvince.value) {
    filtered = filtered.filter(race =>
      race.location.includes(selectedProvince.value)
    )
  }

  return filtered
})

const handleDateChange = () => {
  console.log('Date change - Start:', startDate.value, 'End:', endDate.value)
  
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)

    if (end < start) {
      console.warn('End date cannot be earlier than start date')
      endDate.value = startDate.value
    }
  }
  
  currentPage.value = 1 // Reset ke halaman 1
  console.log('Filtered races count:', filteredPastRaces.value.length)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  startDate.value = ''
  endDate.value = ''
  selectedProvince.value = ''
  currentPage.value = 1
}

const totalPages = computed(() => Math.ceil(filteredPastRaces.value.length / itemsPerPage))

const paginatedRaces = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPastRaces.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    // Jika total halaman 7 atau kurang, tampilkan semua
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Selalu tampilkan 5 halaman, tapi skip halaman 1 karena sudah ditampilkan terpisah
    if (current <= 4) {
      // Awal: skip 1, mulai dari 2
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
    } else if (current >= total - 3) {
      // Akhir
      for (let i = total - 4; i < total; i++) {
        pages.push(i)
      }
    } else {
      // Tengah
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
    }
  }

  return pages
})

const toggleFirstInput = () => {
  showFirstInput.value = !showFirstInput.value
  showLastInput.value = false
  if (showFirstInput.value) {
    nextTick(() => {
      firstJumpInput.value?.focus()
    })
  }
}

const toggleLastInput = () => {
  showLastInput.value = !showLastInput.value
  showFirstInput.value = false
  if (showLastInput.value) {
    nextTick(() => {
      lastJumpInput.value?.focus()
    })
  }
}

const hideInputs = () => {
  setTimeout(() => {
    showFirstInput.value = false
    showLastInput.value = false
    jumpToPage.value = ''
  }, 200)
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
          <h1 class="title">Past Races</h1>
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
  
                <!-- Update bagian filter tanggal -->
                <label class="filter-label">Date Range</label>
                <div class="date-range">
                  <div class="date-field">
                    <label for="start-date" class="date-label">From</label>
                    <input
                      type="date"
                      id="start-date"
                      class="date-input"
                      v-model="startDate"
                      @change="handleDateChange"
                    />
                  </div>
                  <div class="date-field">
                    <label for="end-date" class="date-label">To</label>
                    <input
                      type="date"
                      id="end-date"
                      class="date-input"
                      v-model="endDate"
                      @change="handleDateChange"
                      :min="startDate"
                    />
                  </div>
                </div>
  
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
  
                <!-- Pagination -->
                <div class="pagination">
                  <span class="pagination-info">
                    Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - 
                    {{ Math.min(currentPage * itemsPerPage, filteredPastRaces.length) }} 
                    of {{ filteredPastRaces.length }} races
                  </span>
                  <div class="pagination-controls" v-if="totalPages > 1">
                    
                    <!-- Previous button -->
                    <button 
                      class="pagination-button"
                      :disabled="currentPage === 1"
                      @click="prevPage"
                    >
                      &lt;
                    </button>

                    <!-- First page -->
                    <button 
                      class="pagination-number"
                      :class="{ active: currentPage === 1 }"
                      @click="goToPage(1)"
                    >
                      1
                    </button>

                    <!-- First ellipsis with input -->
                    <div class="pagination-jump" v-if="showFirstEllipsis">
                      <span 
                        class="pagination-ellipsis"
                        @click="toggleFirstInput"
                      >...</span>
                      <input 
                        v-if="showFirstInput"
                        v-model="jumpToPage"
                        type="number"
                        class="jump-input"
                        :min="2"
                        :max="visiblePageNumbers[0] - 1"
                        @keyup.enter="handleJump"
                        @blur="hideInputs"
                        ref="firstJumpInput"
                      />
                    </div>

                    <!-- Middle pages -->
                    <button 
                      v-for="pageNumber in visiblePageNumbers"
                      :key="pageNumber"
                      class="pagination-number"
                      :class="{ active: currentPage === pageNumber }"
                      @click="goToPage(pageNumber)"
                    >
                      {{ pageNumber }}
                    </button>

                    <!-- Last ellipsis with input -->
                    <div class="pagination-jump" v-if="showLastEllipsis">
                      <span 
                        class="pagination-ellipsis"
                        @click="toggleLastInput"
                      >...</span>
                      <input 
                        v-if="showLastInput"
                        v-model="jumpToPage"
                        type="number"
                        class="jump-input"
                        :min="visiblePageNumbers[visiblePageNumbers.length - 1] + 1"
                        :max="totalPages - 1"
                        @keyup.enter="handleJump"
                        @blur="hideInputs"
                        ref="lastJumpInput"
                      />
                    </div>

                    <!-- Last page -->
                    <button 
                      v-if="totalPages > 1"
                      class="pagination-number"
                      :class="{ active: currentPage === totalPages }"
                      @click="goToPage(totalPages)"
                    >
                      {{ totalPages }}
                    </button>

                    <!-- Next button -->
                    <button 
                      class="pagination-button"
                      :disabled="currentPage === totalPages"
                      @click="nextPage"
                    >
                      &gt;
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
  animation: pageEnter 0.6s ease-out;
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
  animation: headerSlideDown 0.5s ease-out;
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
  animation: filterSlideIn 0.5s ease-out;
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

.date-range {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-label {
  font-size: 14px;
  color: #6b7280;
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
  transition: all 0.2s ease-in-out;
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  animation: carsSlideUp 0.6s ease-out;
  animation-fill-mode: both;
}

.race-card:nth-child(1) { animation-delay: 0.1s; }
.race-card:nth-child(2) { animation-delay: 0.2s; }
.race-card:nth-child(3) { animation-delay: 0.3s; }
.race-card:nth-child(4) { animation-delay: 0.4s; }

.race-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.race-card.featured {
  grid-column: 1 / -1;
}

.race-card:focus {
  outline: none;
  box-shadow: 0 0 0 2px #617afa;
}

.race-card:active {
  transform: translateY(-1px);
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
  flex-direction: column; 
  gap: 16px; 
  margin-top: 32px;
  padding: 16px 0;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
  text-align: left;
  margin-left: 8px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.pagination-button,
.pagination-number {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number.active {
  background: #617afa;
  color: white;
  border-color: #617afa;
}

.pagination-button:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover,
.pagination-number:hover:not(.active) {
  background: #f3f4f6;
}

.pagination-ellipsis {
  color: #6b7280;
  padding: 0 8px;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.pagination-ellipsis:hover {
  color: #617afa;
}

.jump-input {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.pagination-jump {
  position: relative;
  display: inline-flex;
  align-items: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pageEnter {
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

@keyframes headerSlideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes filterSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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
}

@media (max-width: 480px) {

  .filter-column {
    padding: 16px;
  }
}
</style>