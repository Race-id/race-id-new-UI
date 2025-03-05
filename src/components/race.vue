<script setup>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import api from "@/components/services/api";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

const router = useRouter();

const pageSize = ref(12);
const searchQuery = ref("");

const paginationQueryParams = computed(() => ({
  pageUpcoming: router.currentRoute.value.query.pageUpcoming,
  pagePast: router.currentRoute.value.query.pagePast,
}));
const pageUpcoming = computed(() =>
  parseInt(paginationQueryParams.value.pageUpcoming ?? "1")
);
const pagePast = computed(() =>
  parseInt(paginationQueryParams.value.pagePast ?? "1")
);

const localQueryParams = ref({
  category: null,
  startDate: null,
  endDate: null,
});

function formatDate(date) {
  return dayjs(date).format("DD MMM YYYY");
}

function onStartDateInput(event) {
  localQueryParams.value = {
    ...localQueryParams.value,
    startDate: event.target.value ? new Date(event.target.value) : null,
  };
  
  router.push({
    query: {
      ...router.currentRoute.value.query,
      pageUpcoming: 1,
      pagePast: 1,
    },
    path: router.currentRoute.value.path,
  });
}

function onEndDateInput(event) {
  localQueryParams.value = {
    ...localQueryParams.value,
    endDate: event.target.value ? new Date(event.target.value) : null,
  };
  
  router.push({
    query: {
      ...router.currentRoute.value.query,
      pageUpcoming: 1,
      pagePast: 1,
    },
    path: router.currentRoute.value.path,
  });
}

function onResetFilters() {
  localQueryParams.value = {
    category: null,
    startDate: null,
    endDate: null,
  };
  searchQuery.value = "";
  
  router.push({
    query: {
      pageUpcoming: 1,
      pagePast: 1,
    },
    path: router.currentRoute.value.path,
  });
}

function filtersToApiQueryParams({
  category = null,
  startDate = null,
  endDate = null,
  isPastEvents = false,
  search = null,
}) {
  const dateToApiFormat = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day} 00:00:00`;
  };

  const baseParams = {
    "filter[evnhCategory]": category,
    "filter[evnhName][like]": search ? `%${search}%` : null,
  };

  if (isPastEvents) {
    const today = new Date();
    return {
      ...baseParams,
      "filter[evnhStartDate][<]": dateToApiFormat(today),
      "filter[evnhStartDate][>=]": startDate ? dateToApiFormat(startDate) : null,
      "filter[evnhEndDate][<=]": endDate ? dateToApiFormat(endDate) : null,
    };
  } else {
    return {
      ...baseParams,
      "filter[evnhStartDate][>=]": startDate ? dateToApiFormat(startDate) : dateToApiFormat(new Date()),
      "filter[evnhEndDate][<=]": endDate ? dateToApiFormat(endDate) : null,
    };
  }
}

const fetchLiveEventsQuery = useQuery({
  queryKey: [localQueryParams, pageUpcoming, pageSize],
  queryFn: () =>
    api.get("/resources/event_public_header", {
      params: {
        pageNumber: pageUpcoming.value,
        pageSize: pageSize.value,
        sort: "evnhStartDate",
        ...filtersToApiQueryParams({
          ...localQueryParams.value,
          startDate: new Date(),
          isPastEvents: false,
        }),
      },
      validateStatus: (_status) => true,
    }),
});

const fetchPastEventsQuery = useQuery({
  queryKey: ["pastEvents", pagePast, pageSize, localQueryParams],
  queryFn: () =>
    api.get("/resources/event_public_header", {
      params: {
        pageNumber: pagePast.value,
        pageSize: pageSize.value,
        sort: "-evnhStartDate",
        ...filtersToApiQueryParams({
          ...localQueryParams.value,
          isPastEvents: true,
        }),
      },
      validateStatus: (_status) => true,
    }),
});

const liveEvents = computed(() => {
  return fetchLiveEventsQuery.data.value?.data?.data ?? [];
});

const liveEventsTotalRecords = computed(
  () => fetchLiveEventsQuery.data.value?.data?.status?.totalRecords ?? 0
);

const liveEventsTotalPages = computed(() =>
  Math.ceil(liveEventsTotalRecords.value / pageSize.value)
);

const pastEvents = computed(() => {
  return fetchPastEventsQuery.data.value?.data?.data ?? [];
});

const pastEventsTotalRecords = computed(
  () => fetchPastEventsQuery.data.value?.data?.status?.totalRecords ?? 0
);

const pastEventsTotalPages = computed(() =>
  Math.ceil(pastEventsTotalRecords.value / pageSize.value)
);

function onSearch() {
  if (!searchQuery.value) {
    localQueryParams.value = {
      ...localQueryParams.value,
      search: null,
    };
  } else {
    localQueryParams.value = {
      ...localQueryParams.value,
      search: searchQuery.value,
    };
  }

  router.push({
    query: {
      ...router.currentRoute.value.query,
      pageUpcoming: 1,
      pagePast: 1,
    },
    path: router.currentRoute.value.path,
  });
}

function onCategoryInput(event) {
  localQueryParams.value = {
    ...localQueryParams.value, 
    category: event.target.value || null,
  };

  router.push({
    query: {
      ...router.currentRoute.value.query,
      pageUpcoming: 1,
      pagePast: 1,
    },
    path: router.currentRoute.value.path,
  });
}

function onChangeLiveEventsPage(page) {
  if (page > 0 && page <= liveEventsTotalPages.value) {
    const query = {...router.currentRoute.value.query}
    
    if (page === 1) {
      delete query.pageUpcoming  
    } else {
      query.pageUpcoming = page
    }

    router.push({
      query,
      path: router.currentRoute.value.path,
    });
  }
}

function onChangePastEventsPage(page) {
  if (page > 0 && page <= pastEventsTotalPages.value) {
    const query = {...router.currentRoute.value.query}
    
    if (page === 1) {
      delete query.pagePast
    } else {
      query.pagePast = page
    }

    router.push({
      query,
      path: router.currentRoute.value.path,
    });
  }
}
</script>



<template>
  <div class="race-page">
    <Header />

    <div class="fade-in">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content container">
          <h1>Find Your Next Race</h1>
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search races by name or location..."
              @keyup.enter="onSearch"
              @input="onSearch"
            />
            <button type="button" @click="onSearch">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="container">
        <div v-if="fetchLiveEventsQuery.isLoading.value" class="loading-state">
          Loading events...
        </div>
        <div
          v-else-if="
            fetchLiveEventsQuery.isError.value &&
            fetchLiveEventsQuery.data.value.status === 500
          "
          class="error-state"
        >
          {{ fetchLiveEventsQuery.error.value.message }}
        </div>
        <div class="race-layout">
          <!-- Advanced Filter -->
          <div class="advanced-filter">
            <div class="filter-group">
              <select @input="onCategoryInput">
                <option value="" :selected="localQueryParams.category === null">
                  Tipe
                </option>
                <option
                  value="Road Run"
                  :selected="localQueryParams.category === 'Road Run'"
                >
                  Road Run
                </option>
                <option
                  value="Trail Run"
                  :selected="localQueryParams.category === 'Trail Run'"
                >
                  Trail Run
                </option>
                <option
                  value="Virtual Run"
                  :selected="localQueryParams.category === 'Virtual Run'"
                >
                  Virtual Run
                </option>
                <option
                  value="Other"
                  :selected="localQueryParams.category === 'other'"
                >
                  Other
                </option>
              </select>
              <input
                id="filtersStartDateInput"
                @input="onStartDateInput"
                :value="localQueryParams.startDate?.toISOString().slice(0, 10)"
                type="date"
                placeholder="Tanggal"
              />
              <p>to</p>
              <input
                id="filtersEndDateInput"
                @input="onEndDateInput"
                :value="localQueryParams.endDate?.toISOString().slice(0, 10)"
                type="date"
                placeholder="Tanggal"
              />
              <button
                :disabled="
                  localQueryParams.category === null &&
                  localQueryParams.startDate === null &&
                  localQueryParams.endDate === null
                "
                @click="onResetFilters"
                class="search-btn"
              >
                Reset Filter
              </button>
            </div>
          </div>

          <!-- Live Events Section -->
          <section class="race-list">
            <div class="race-list-header">
              <h2>{{ liveEvents?.length || 0 }} Upcoming Races</h2>
            </div>
            <div
              v-if="fetchLiveEventsQuery.isLoading.value"
              class="loading-state"
            >
              Loading live events...
            </div>
            <div
              v-else-if="fetchLiveEventsQuery.isError.value"
              class="error-state"
            >
              {{ fetchLiveEventsQuery.error.value.message }}
            </div>
            <div v-else class="race-grid">
              <article
                v-for="event in liveEvents"
                :key="event.evnhId"
                class="race-card"
              >
                <div class="race-content">
                  <div class="race-info">
                    <h3>{{ event.evnhName }}</h3>
                    <span class="category-tag">{{
                      event.evnhCategory || "Uncategorized"
                    }}</span>
                    <p class="race-date">
                      <i class="fas fa-calendar"></i>
                      {{ formatDate(event.evnhStartDate) }}
                    </p>
                    <p class="race-location">
                      <i class="fas fa-map-marker-alt"></i>
                      {{ event.evnhPlace || "To Be Announced" }}
                    </p>
                  </div>
                  <div class="race-footer">
                    <router-link
                      :to="{
                        name: 'race-detail',
                        params: { id: event.evnhId },
                      }"
                      class="btn-register"
                    >
                      Detail
                    </router-link>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <!-- Live Events Pagination -->
          <div class="pagination">
            <button
              @click="onChangeLiveEventsPage(pageUpcoming - 1)"
              :disabled="pageUpcoming === 1"
            >
              Previous
            </button>
            <span>Page {{ pageUpcoming }} of {{ liveEventsTotalPages }}</span>
            <button
              @click="onChangeLiveEventsPage(pageUpcoming + 1)"
              :disabled="pageUpcoming === liveEventsTotalPages"
            >
              Next
            </button>
          </div>

          <!-- Past Events Section -->
          <section class="race-list past-events-section">
            <div class="race-list-header">
              <h2>{{ pastEvents?.length || 0 }} Past Races</h2>
            </div>
            <div
              v-if="fetchPastEventsQuery.isLoading.value"
              class="loading-state"
            >
              Loading past events...
            </div>
            <div
              v-else-if="fetchPastEventsQuery.isError.value"
              class="error-state"
            >
              {{ fetchPastEventsQuery.error.value.message }}
            </div>
            <div v-else class="race-grid">
              <article
                v-for="event in pastEvents"
                :key="event.evnhId"
                class="race-card"
              >
                <div class="race-content">
                  <div class="race-info">
                    <h3>{{ event.evnhName }}</h3>
                    <span class="category-tag">{{
                      event.evnhCategory || "Uncategorized"
                    }}</span>
                    <p class="race-date">
                      <i class="fas fa-calendar"></i>
                      {{ formatDate(event.evnhStartDate) }}
                    </p>
                    <p class="race-location">
                      <i class="fas fa-map-marker-alt"></i>
                      {{ event.evnhPlace || "To Be Announced" }}
                    </p>
                  </div>
                  <div class="race-footer">
                    <button class="btn-register btn-closed">Closed</button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <!-- Past Events Pagination -->
          <div class="pagination">
            <button
              @click="onChangePastEventsPage(pagePast - 1)"
              :disabled="pagePast === 1"
            >
              Previous
            </button>
            <span>Page {{ pagePast }} of {{ pastEventsTotalPages }}</span>
            <button
              @click="onChangePastEventsPage(pagePast + 1)"
              :disabled="pagePast === pastEventsTotalPages"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>

  <Footer />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

body, .race-page {
  font-family: Poppins, sans-serif;
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

.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
  background-size: cover;
  background-position: center;
  padding: 80px 0;
  color: white;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.search-box input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
}

.search-box button {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  background: #1c61b0;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-box button:hover {
  background: #2252a4;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.race-layout {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.quick-filters {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: -70px;
}

.quick-filters input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  max-width: 300px;
  height: 12px;
  background: #ddd;
  border-radius: 6px;
  outline: none;
  transition: background 0.3s ease;
}

.quick-filters input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #007bff;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

.quick-filters input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #007bff;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

.tag {
  padding: 8px 20px;
  border: 1px solid black;
  border-radius: 20px;
  background: var(--secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: var(--primary);
  margin: 8px;
}

.tag:hover {
  background: #2252a4;
  color: white;
}

.tag.active {
  background: #2252a4;
  color: white;
  border-color: black;
}

.advanced-filter {
  padding: 20px;
  background: var(--secondary);
  margin: 20px auto;
  margin-top: -30px;
  margin-bottom: 60px;
  max-width: 1200px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  gap: 15px;
}

.filter-group select,
.filter-group input {
  padding: 10px;
  border: 1px solid black;
  border-radius: 8px;
  flex: 1;
}

.search-btn {
  padding: 10px 16px;
  background: #04a3e6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.search-btn:hover {
  background: #0383b8;
  transform: translateY(-2px);
}

.reset-button {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #04a3e6;
  color: #04a3e6;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.race-list-header {
  margin-bottom: 20px;
}

.race-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.past-events-section {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 2px solid #eee;
}

.race-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.race-content {
  display: flex;
  flex-direction: column;
}

.race-info {
  margin-bottom: 20px;
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 15px;
  font-size: 0.8em;
  margin: 5px 0;
}

.race-date,
.race-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.race-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.race-price {
  font-size: 1.2em;
  color: #333;
}

.btn-register {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-register:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}

.tab-navigation {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #1c61b0;
  color: white;
}

.btn-closed {
  background-color: #ccc;
  cursor: default;
}

.btn-closed:hover {
  background-color: #ccc;
  transform: none;
}
</style>
