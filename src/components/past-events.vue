<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import { useQuery } from "@tanstack/vue-query"
import api from '@/components/services/api'
import dayjs from 'dayjs'

// State management
const searchQuery = ref('')
const selectedType = ref('')
const selectedDate = ref('') 
const selectedProvince = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const isSessionExpired = ref(false)
const token = ref(localStorage.getItem('token'))

const refreshSession = async () => {
  try {
    window.location.reload()
  } catch (error) {
    console.error('Failed to refresh session:', error)
  }
}

const isQueryLoading = computed(() => pastEventsQuery.isLoading.value) 

const paginatedRaces = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRaces.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRaces.value.length / itemsPerPage.value))

const resetFilters = () => {
  selectedType.value = ''
  selectedDate.value = ''
  selectedProvince.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

// Helper function untuk format tanggal
function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY')
}

// Function untuk convert filter ke API params
function filtersToApiQueryParams({
  category = null,
  startDate = null,
  province = null,
  search = null,
}) {
  const dateToApiFormat = (date) => {
    return dayjs(date).format('YYYY-MM-DD 00:00:00')
  };

  const today = new Date()
  
  return {
    "filter[evnhCategory]": category,
    "filter[evnhProvince]": province,
    "filter[evnhName][like]": search ? `%${search}%` : null,
    "filter[evnhStartDate][<]": dateToApiFormat(today),
    "filter[evnhStartDate][>=]": startDate ? dateToApiFormat(startDate) : null,
  }
}

// Fetch data from API
const pastEventsQuery = useQuery({
  queryKey: ['pastEvents', selectedType, selectedDate, selectedProvince, searchQuery],
  queryFn: async () => {
    try {
      if (!token.value) {
        isSessionExpired.value = true
        throw new Error('No session token found')
      }

      const countResponse = await api.get("/resources/event_public_header", {
        params: {
          pageNumber: 1,
          pageSize: 1,
          sort: "-evnhStartDate",
          ...filtersToApiQueryParams({
            category: selectedType.value,
            startDate: selectedDate.value,
            province: selectedProvince.value,
            search: searchQuery.value
          })
        },
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      // Handle 409 specifically
      if (countResponse.status === 409) {
        isSessionExpired.value = true
        throw new Error('Session expired')
      }

      // ... rest of the fetching logic ...

    } catch (error) {
      console.error('API Error:', error)
      if (error.response?.status === 409) {
        isSessionExpired.value = true
        throw new Error('Session expired')
      }
      throw error
    }
  },
  retry: false,
  refetchOnWindowFocus: false,
  enabled: !!token.value // Only run query if token exists
})

// Computed properties
const races = computed(() => {
  if (!pastEventsQuery.data.value?.data) {
    return []
  }
  
  const racesList = pastEventsQuery.data.value.data ?? []
  return racesList.map(race => ({
    id: race.evnhId,
    title: race.evnhName,
    date: formatDate(race.evnhStartDate),
    location: race.evnhLocation,
    image: race.evnhImage || '/images/placeholder.jpg',
    category: race.evnhCategory,
    province: race.evnhProvince
  }))
})

// Update error computed property
const queryError = computed(() => {
  if (pastEventsQuery.error.value) {
    return pastEventsQuery.error.value?.message || 'An error occurred while fetching data'
  }
  return null
})

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

const filteredRaces = computed(() => {
  let filtered = races.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(race => 
      race.title.toLowerCase().includes(query) ||
      race.location.toLowerCase().includes(query)
    );
  }

  // Type/Category filter
  if (selectedType.value) {
    filtered = filtered.filter(race => 
      race.category.toLowerCase() === selectedType.value.toLowerCase()
    );
  }

  // Province filter
  if (selectedProvince.value) {
    filtered = filtered.filter(race => 
      race.province === selectedProvince.value
    );
  }

  // Date filter
  if (selectedDate.value) {
    filtered = filtered.filter(race => 
      dayjs(race.date, 'DD/MM/YYYY').isSame(dayjs(selectedDate.value), 'day')
    );
  }

  return filtered;
});

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
              <div v-if="isQueryLoading" class="loading-state">
                <div class="loader"></div>
                Loading races...
              </div>
              
              <div v-else-if="queryError || isSessionExpired" class="error-state">
                <div v-if="isSessionExpired" class="session-expired">
                  <p>Your session has expired. Please refresh to continue.</p>
                  <button 
                    @click="refreshSession"
                    class="refresh-button"
                  >
                    Refresh Page
                  </button>
                </div>
                <div v-else>
                  <p>{{ queryError }}</p>
                  <button 
                    @click="pastEventsQuery.refetch"
                    class="retry-button"
                  >
                    Retry
                  </button>
                </div>
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

.session-expired {
  text-align: center;
  padding: 24px;
  background: #fee2e2;
  border-radius: 8px;
  margin: 16px 0;
}

.refresh-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.refresh-button:hover {
  background: #b91c1c;
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

.load-more-container {
  text-align: center;
  margin: 32px 0;
}

.load-more-button {
  padding: 12px 24px;
  background: #617afa;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.load-more-button:hover {
  background: #4c62c8;
}

.load-more-button:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
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