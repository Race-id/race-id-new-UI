<script setup>
import { ref } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

// State management
const searchQuery = ref('')
const selectedType = ref('')
const selectedDate = ref('')
const currentPage = ref(1)
const selectedProvince = ref('')

const clearSearch = () => {
  searchQuery.value = ''
}

// Race data
const races = ref([
  {
    id: 1,
    title: 'Makassar Half Marathon 2025',
    date: '31 May 2025',
    location: 'Anjungan Pantai Losari',
    image: '/images/makassar-marathon.jpg',
    featured: true
  },
  {
    id: 2,
    title: 'Jakarta Marathon 2025',
    date: '15 June 2025',
    location: 'Monas Jakarta',
    image: '/images/jakarta-marathon.jpg'
  },
  {
    id: 3,
    title: 'Bali Run 2025',
    date: '20 June 2025',
    location: 'Kuta Beach',
    image: '/images/bali-run.jpg'
  },
  {
    id: 4,
    title: 'Bandung Night Run 2025',
    date: '25 June 2025',
    location: 'Dago Bandung',
    image: '/images/bandung-run.jpg'
  }
])

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

const pastRaces = ref([
  {
    id: 1,
    title: 'Surabaya Marathon 2024',
    date: '10 Dec 2024',
    location: 'Surabaya City',
    image: '/images/surabaya-marathon.jpg'
  },
  {
    id: 2,
    title: 'Yogyakarta Heritage Run 2024',
    date: '15 Dec 2024',
    location: 'Malioboro Street',
    image: '/images/yogya-run.jpg'
  },
  {
    id: 3,
    title: 'Medan City Run 2024',
    date: '20 Dec 2024',
    location: 'Merdeka Walk',
    image: '/images/medan-run.jpg'
  }
])

const filteredUpcomingRaces = computed (() => {
  if (!searchQuery.value) return races.value

  const query = searchQuery.value.toLowerCase()
  return races.value.filter(race => {
    return race.title.toLowerCase().includes(query) ||
      race.location.toLowerCase().includes(query)
  })
})

const filteredPastRaces = computed (() => {
  if (!searchQuery.value) return pastRaces.value

  const query = searchQuery.value.toLowerCase()
  return pastRaces.value.filter(race => {
    return race.title.toLowerCase().includes(query) ||
      race.location.toLowerCase().includes(query)
  })
})

// Methods
const handleSearch = () => {
  console.log('Searching for:', searchQuery.value)
}

const resetFilters = () => {
  selectedType.value = ''
  selectedDate.value = ''
  selectedProvince.value = ''
}

const changePage = (page) => {
  currentPage.value = page
}
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
            @click="clearSearch"
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

               <!-- Add Province Filter -->
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
                v-model="selectedDate"
                class="date-input"
              />

              <button class="reset-button" @click="resetFilters">
                Reset Filter
              </button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <div class="main-content">
            <!-- Upcoming Races Section -->
            <section class="races-section">
              <div class="section-header">
                <h2 class="section-title">Upcoming Races</h2>
                <button class="view-more">View more</button>
              </div>

              <!-- Featured Race -->
              <div class="featured-race" v-if="filteredUpcomingRaces.length > 0">
                <article class="race-card featured">
                  <img
                    :src="filteredUpcomingRaces[0].image"
                    :alt="filteredUpcomingRaces[0].title"
                    class="race-image featured-image"
                  />
                  <div class="race-content">
                    <h3 class="race-title">{{ races[0].title }}</h3>
                    <p class="race-date">{{ races[0].date }} | {{ races[0].location }}</p>
                  </div>
                </article>
              </div>

              <!-- Regular Races Grid -->
              <div class="races-grid">
                <article 
                  v-for="race in races.slice(1, 4)" 
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
                <button class="view-more">View more</button>
              </div>

              <div class="races-grid">
                <article 
                  v-for="race in pastRaces" 
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

            <!-- Pagination -->
            <nav class="pagination">
              <div class="pagination-item" 
                   :class="{ active: currentPage === 1 }"
                   @click="changePage(1)">
                <i class="fas fa-chevron-left pagination-arrow"></i>
                <span class="pagination-number">1</span>
              </div>
              <div class="pagination-item"
                   :class="{ active: currentPage === 2 }"
                   @click="changePage(2)">
                <span class="pagination-number">2</span>
                <i class="fas fa-chevron-right pagination-arrow"></i>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</template>

<style scoped>
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

.races-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e5e7eb;
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
}

.view-more {
  color: #617afa;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.view-more:hover {
  color: #4c62c8;
}

.featured-race {
  margin-bottom: 24px;
}

.races-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.race-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
  border: 1px solid #e5e7eb;
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

.featured-image {
  height: 300px;
}

.race-content {
  padding: 16px;
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

  .filter-column {
    padding: 16px;
  }

  .races-section {
    padding: 16px;
  }

  .pagination-item {
    padding: 6px 12px;
  }
}
</style>