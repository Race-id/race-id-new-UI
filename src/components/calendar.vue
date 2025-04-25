<script setup>
import { ref, computed, onMounted } from 'vue';
import events from '../components/data/events.json'; 

const emit = defineEmits(['select-date']) 

const currentDate = ref(new Date())
const selectedDate = ref(null)
const apiEvents = ref([])

// Fungsi untuk mengambil data dari API
const fetchApiEvents = async () => {
  try {
    const response = await fetch('https://steelytoe.com/dev.titudev.com/api/v1/resources/event_public_header')
    
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }

    const data = await response.json()
    
    // Transform API data
    const eventsList = Array.isArray(data) ? data : data.data || []
    
    // Konversi format API ke format events yang dibutuhkan kalender
    apiEvents.value = eventsList.map(event => {
      try {
        // Validasi tanggal
        const startDate = new Date(event.evnhStartDate)
        if (isNaN(startDate.getTime())) {
          console.warn(`Invalid date for event ${event.evnhName}:`, event.evnhStartDate)
          return null // Skip event jika tanggal tidak valid
        }
        
        return {
          id: event.evnhId,
          title: event.evnhName,
          date: startDate,
          location: event.evnhLocation || 'Location TBD',
          url: `/race-detail/${event.evnhId}`,
          image: event.evnhImage || '/images/placeholder.jpg'
        }
      } catch (e) {
        console.error('Error processing event:', e)
        return null
      }
    }).filter(Boolean) // Hilangkan null items
  } catch (err) {
    console.error('Error fetching API events:', err)
  }
}

// Panggil fetchApiEvents saat komponen di-mount
onMounted(() => {
  fetchApiEvents()
})

// Gabungkan events dari JSON lokal dan API
const combinedEvents = computed(() => {
  return [...raceEvents.value, ...apiEvents.value]
})

// Update raceEvents computed property with better date validation
const raceEvents = computed(() => {
  if (!events || !Array.isArray(events)) return [];
  
  return events
    .filter(event => event.date)
    .map(event => {
      try {
        // First try parsing with Date constructor
        let eventDate = new Date(event.date);
        
        // Check if date is valid
        if (isNaN(eventDate.getTime())) {
          // If invalid, try parsing from year property
          if (event.year) {
            // Assume January 1st of the year if only year is available
            eventDate = new Date(parseInt(event.year), 0, 1);
          } else {
            return null;
          }
        }

        return {
          ...event,
          date: eventDate
        };
      } catch (e) {
        console.error(`Invalid date for event "${event.title}":`, event.date);
        return null;
      }
    })
    .filter(Boolean); // Remove null entries
});

// Group events by date for easier lookup
const eventsByDate = computed(() => {
  const grouped = {};
  combinedEvents.value.forEach(event => {
    try {
      // Pastikan event.date adalah date yang valid
      if (!event.date || isNaN(event.date.getTime())) {
        return; // Skip event jika tanggal tidak valid
      }
      
      const dateStr = event.date.toISOString().split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(event);
    } catch (e) {
      console.error('Error processing event:', event);
    }
  });
  return grouped;
});

// Check if date has events
const hasEvents = (date) => {
  if (!date) return false;
  try {
    const dateStr = date.toISOString().split('T')[0];
    return !!eventsByDate.value[dateStr];
  } catch (e) {
    return false;
  }
};

// Get events for specific date
const getEventsForDate = (date) => {
  if (!date) return [];
  try {
    const dateStr = date.toISOString().split('T')[0];
    return eventsByDate.value[dateStr] || [];
  } catch (e) {
    return [];
  }
};

// Nama-nama hari dan bulan
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December']

const currentMonth = computed(() => MONTHS[currentDate.value.getMonth()])
const currentYear = computed(() => currentDate.value.getFullYear())

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month, 1).getDay()
})

// Generate calendar grid
const calendarDays = computed(() => {
  const days = []
  const totalDays = daysInMonth.value
  const firstDay = firstDayOfMonth.value

  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: '', isEmpty: true })
  }

  // Add actual days
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear.value, currentDate.value.getMonth(), i)

    days.push({
      day: i,
      isEmpty: false,
      isToday: isToday(date),
      hasEvent: hasEvents(date),
      date
    })
  }

  return days
})

// Helper functions
const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const previousMonth = () => {
  const newDate = new Date(currentYear.value, currentDate.value.getMonth() - 1);
  currentDate.value = newDate;
  selectedMonthIndex.value = newDate.getMonth();
  selectedYear.value = newDate.getFullYear();
}

const nextMonth = () => {
  const newDate = new Date(currentYear.value, currentDate.value.getMonth() + 1);
  currentDate.value = newDate;
  selectedMonthIndex.value = newDate.getMonth();
  selectedYear.value = newDate.getFullYear();
}

const selectDate = (day) => {
  if (!day.isEmpty) {
    selectedDate.value = day.date
    const dayEvents = getEventsForDate(day.date)
    emit('select-date', { date: day.date, events: dayEvents })
  }
}

// Hapus method handleClose karena tidak digunakan

// Refs for dropdown selectors
const selectedMonthIndex = ref(currentDate.value.getMonth())
const selectedYear = ref(currentDate.value.getFullYear())

// Generate year options (5 years before and after current year)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
});

// Navigation functions
const updateMonth = () => {
  currentDate.value = new Date(selectedYear.value, selectedMonthIndex.value);
}

const updateYear = () => {
  currentDate.value = new Date(selectedYear.value, selectedMonthIndex.value);
}

// Hapus method goToToday karena tidak digunakan dalam template
</script>

<template>
  <div class="calendar-wrapper">
    <!-- Calendar Container -->
    <div class="calendar-container">
      <!-- Month Navigation - Positioned at top -->
      <div class="month-navigation">
        <div class="nav-controls">
          <button @click="previousMonth" class="nav-button" title="Previous Month">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <div class="month-selector">
            <h2>{{ currentMonth }} {{ currentYear }}</h2>
            <div class="dropdown-controls">
              <select v-model="selectedMonthIndex" @change="updateMonth" class="month-dropdown">
                <option v-for="(month, index) in MONTHS" :key="month" :value="index">
                  {{ month }}
                </option>
              </select>
              
              <select v-model="selectedYear" @change="updateYear" class="year-dropdown">
                <option v-for="year in yearOptions" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
          
          <button @click="nextMonth" class="nav-button" title="Next Month">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div class="calendar-grid">
        <!-- Day headers -->
        <div 
          v-for="day in DAYS" 
          :key="day" 
          class="calendar-cell header"
        >
          {{ day }}
        </div>

        <!-- Calendar days -->
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="{
            'empty': day.isEmpty,
            'today': day.isToday,
            'has-event': !day.isEmpty && day.hasEvent,
            'selected': selectedDate && !day.isEmpty && day.date.toDateString() === selectedDate.toDateString()
          }"
          @click="selectDate(day)"
        >
          {{ day.day }}
          
          <!-- Simplified Event indicator - only blue dot -->
          <div v-if="!day.isEmpty && day.hasEvent" class="event-indicators">
            <span class="event-dot"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Side Panel for Events -->
    <div class="events-side-panel" :class="{ 'has-events': selectedDate }">
      <div v-if="selectedDate" class="events-content">
        <h3>{{ selectedDate.toLocaleDateString() }}</h3>
        <div class="events-list">
          <div v-for="event in getEventsForDate(selectedDate)" 
               :key="event.title" 
               class="event-item">
            <h4>{{ event.title }}</h4>
            <a :href="event.url" 
               target="_blank" 
               class="event-link">
              View Event →
            </a>
          </div>
        </div>
      </div>
      <div v-else class="no-date-selected">
        Select a date to view events
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Wrapper layout */
.calendar-wrapper {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 12px;
}

/* Compact calendar container */
.calendar-container {
  flex: 0 0 480px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Improved Top navigation bar */
.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 16px 12px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  margin-bottom: 0;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.month-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.month-selector h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.dropdown-controls {
  display: none; /* Hidden by default, shown when needed */
  gap: 8px;
  margin-top: 8px;
}

.month-dropdown, .year-dropdown {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* Show dropdowns when month name is clicked */
.month-selector:hover .dropdown-controls {
  display: flex;
}

/* Compact calendar grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  padding: 0 8px 8px;
  background: #f9fafb;
}

.calendar-cell {
  height: 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 2px 2px;
  position: relative;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.calendar-cell.header {
  height: auto;
  padding: 10px 2px;
  background: #f8f9fa;
  font-weight: 600;
  cursor: default;
  color: #4b5563;
  border-bottom: none;
  margin-bottom: 2px;
}

.calendar-cell.empty {
  background: #f9fafb;
  cursor: default;
}

.calendar-cell.today {
  background: #e5edff;
  font-weight: bold;
}

.calendar-cell.selected {
  background: #617afa;
  color: white;
}

.calendar-cell.selected .event-dot {
  background-color: white;
}

.calendar-cell.has-event {
  font-weight: bold;
}

.event-indicators {
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding: 4px 0;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #617afa;
}

.calendar-cell.selected .event-dot {
  background-color: white;
}
</style>