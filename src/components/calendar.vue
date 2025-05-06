<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import events from '../components/data/events.json';

const emit = defineEmits(['select-date', 'show-header']) 

const currentDate = ref(new Date())
const selectedDate = ref(null)
const apiEvents = ref([])
const currentView = ref('month') // 'month' or 'day'
const selectedEvent = ref(null)
const currentTimeInterval = ref(null)

// Animation control variables
const isLoading = ref(false)
const slideDirection = ref('right')
const isTransitioning = ref(false)
const viewTransitionName = ref('fade-scale')

// Fetch events from API endpoint with loading animation
const fetchApiEvents = async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://steelytoe.com/dev.titudev.com/api/v1/resources/event_public_header')
    
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }

    const data = await response.json()
    const eventsList = Array.isArray(data) ? data : data.data || []
    
    apiEvents.value = eventsList.map(event => {
      try {
        const startDate = new Date(event.evnhStartDate)
        if (isNaN(startDate.getTime())) {
          console.warn(`Invalid date for event ${event.evnhName}:`, event.evnhStartDate)
          return null
        }
        
        return {
          id: event.evnhId,
          title: event.evnhName,
          date: startDate,
          endDate: new Date(startDate.getTime() + 60 * 60 * 1000),
          location: event.evnhLocation || 'Location TBD',
          url: `/race-detail/${event.evnhId}`,
          image: event.evnhImage || '/images/placeholder.jpg'
        }
      } catch (e) {
        console.error('Error processing event:', e)
        return null
      }
    }).filter(Boolean)
  } catch (err) {
    console.error('Error fetching API events:', err)
  } finally {
    // Add slight delay to make loading animation visible
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
}

// Component lifecycle hooks
onMounted(() => {
  fetchApiEvents()
  
  currentTimeInterval.value = setInterval(() => {
    currentDate.value = new Date()
  }, 60000)

  if (calendarBodyRef.value) {
    calendarBodyRef.value.addEventListener('scroll', handleScroll)
  }
})

// Improved lifecycle hook
const cleanupTimers = () => {
  if (currentTimeInterval.value) {
    clearInterval(currentTimeInterval.value)
  }
}

onBeforeUnmount(() => {
  cleanupTimers()
  if (calendarBodyRef.value) {
    calendarBodyRef.value.removeEventListener('scroll', handleScroll)
  }
})

// Combine events from local JSON and API
const combinedEvents = computed(() => {
  return [...raceEvents.value, ...apiEvents.value]
})

// Process events from local JSON with date validation
const raceEvents = computed(() => {
  if (!events || !Array.isArray(events)) return []
  
  return events
    .filter(event => event.date)
    .map(event => {
      try {
        let eventDate = new Date(event.date)
        
        if (isNaN(eventDate.getTime())) {
          if (event.year) {
            eventDate = new Date(parseInt(event.year), 0, 1)
          } else {
            return null
          }
        }

        return {
          ...event,
          date: eventDate
        }
      } catch (e) {
        console.error(`Invalid date for event "${event.title}":`, event.date)
        return null
      }
    })
    .filter(Boolean)
})

// Group events by date for easier lookup
const eventsByDate = computed(() => {
  const grouped = {}
  combinedEvents.value.forEach(event => {
    try {
      if (!event.date || isNaN(event.date.getTime())) {
        return
      }
      
      const year = event.date.getFullYear();
      const month = event.date.getMonth() + 1;
      const day = event.date.getDate();
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(event);
    } catch (e) {
      console.error('Error processing event:', event)
    }
  })
  return grouped
})

// Check if date has events
const hasEvents = (date) => {
  if (!date) return false
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return !!eventsByDate.value[dateStr];
  } catch (e) {
    return false
  }
}

// Get events for specific date
const getEventsForDate = (date) => {
  if (!date) return []
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return combinedEvents.value.filter(event => {
      if (!event.date) return false;
      const eventYear = event.date.getFullYear();
      const eventMonth = event.date.getMonth() + 1;
      const eventDay = event.date.getDate();
      const eventDateStr = `${eventYear}-${eventMonth.toString().padStart(2, '0')}-${eventDay.toString().padStart(2, '0')}`;
      return eventDateStr === dateStr;
    });
  } catch (e) {
    console.error('Error getting events for date:', e);
    return [];
  }
}

// Calendar constants and computed values
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

// Animated month navigation
const previousMonth = () => {
  if (isTransitioning.value) return
  
  slideDirection.value = 'right'
  isTransitioning.value = true
  
  setTimeout(() => {
    const newDate = new Date(currentYear.value, currentDate.value.getMonth() - 1)
    currentDate.value = newDate
    selectedMonthIndex.value = newDate.getMonth()
    selectedYear.value = newDate.getFullYear()
    
    setTimeout(() => {
      isTransitioning.value = false
    }, 100)
  }, 250)
}

const nextMonth = () => {
  if (isTransitioning.value) return
  
  slideDirection.value = 'left'
  isTransitioning.value = true
  
  setTimeout(() => {
    const newDate = new Date(currentYear.value, currentDate.value.getMonth() + 1)
    currentDate.value = newDate
    selectedMonthIndex.value = newDate.getMonth()
    selectedYear.value = newDate.getFullYear()
    
    setTimeout(() => {
      isTransitioning.value = false
    }, 100)
  }, 250)
}

// Add auto-scroll when switching to day view
const switchToDayView = (date) => {
  viewTransitionName.value = 'zoom-fade'
  selectedDate.value = date
  
  setTimeout(() => {
    currentView.value = 'day'
    scrollToTop()
  }, 100)
}

const switchToMonthView = () => {
  viewTransitionName.value = 'slide-up'
  
  setTimeout(() => {
    currentView.value = 'month'
  }, 100)
}

// Update selectDate to use auto-scroll when switching to day view
const selectDate = (day) => {
  if (!day.isEmpty) {
    selectedDate.value = day.date
    const dayEvents = getEventsForDate(day.date)
    emit('select-date', { date: day.date, events: dayEvents })
    
    // Add animation when switching to day view with events
    if (dayEvents.length > 0) {
      switchToDayView(day.date)
    }
  }
}

// Refs for dropdown selectors
const selectedMonthIndex = ref(currentDate.value.getMonth())
const selectedYear = ref(currentDate.value.getFullYear())

// Generate year options (5 years before and after current year)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i)
  }
  return years
})

// Navigation functions
const updateMonth = () => {
  currentDate.value = new Date(selectedYear.value, selectedMonthIndex.value)
}

const updateYear = () => {
  currentDate.value = new Date(selectedYear.value, selectedMonthIndex.value)
}

// Go to today
const goToToday = () => {
  const today = new Date()
  
  if (currentView.value === 'month') {
    currentDate.value = today
    selectedMonthIndex.value = today.getMonth()
    selectedYear.value = today.getFullYear()
    
    // Find today in the calendar days and select it
    const todayObj = calendarDays.value.find(day => !day.isEmpty && day.isToday)
    if (todayObj) {
      selectDate(todayObj)
    }
  } else {
    selectedDate.value = today
  }
}

// NEW METHODS FOR DAY VIEW

// Get events for the selected day
const getDayEvents = computed(() => {
  if (!selectedDate.value) return []
  
  return getEventsForDate(selectedDate.value)
})

// Calculate position and height for event blocks
const getEventPositionStyle = (event, index) => {
  // Dapatkan index event dalam array
  const eventIndex = getDayEvents.value.findIndex(e => 
    (e.id || e.title) === (event.id || event.title)
  )
  
  // Hitung jumlah event
  const totalEvents = getDayEvents.value.length
  
  // Tetapkan semua event mulai jam 6 pagi tepat
  const startHour = 6 // 6 AM
  
  // Hitung posisi untuk jam 6 pagi (dalam timeline 6AM-12PM)
  // Dalam timeline 6 jam, jam 6 adalah di posisi 0%
  const topPosition = 0
  
  // Hitung lebar per event berdasarkan jumlah event
  const widthPercentage = totalEvents === 1 
    ? 80  // Jika hanya 1 event, beri lebar 80%
    : Math.max(30, 90 / totalEvents) // Minimal 30% lebar
  
  // Hitung posisi left dengan margin lebih sesuai
  const leftPosition = totalEvents === 1
    ? 10  // Jika hanya 1 event, tempatkan di tengah (10% dari kiri)
    : (eventIndex * widthPercentage) + 5 // 5% margin dari kiri
  
  // Height yang lebih besar untuk semua event
  const heightPercentage = 15 
  
  return {
    top: `${topPosition}%`,
    height: `${heightPercentage}%`,
    left: `${leftPosition}%`,
    width: `${widthPercentage - 2}%`, // Kurangi 2% untuk margin antar event
    position: 'absolute'
  }
}

// Format time untuk event blocks - menampilkan waktu 6 AM untuk semua event
const formatEventTime = (event) => {
  // Semua event mulai jam 6 pagi
  return "6:00 AM"
}

// Format date for event modal
const formatEventDate = (event) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return event.date.toLocaleDateString([], options)
}

// Check if two dates are the same day
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Navigation for day view
const previousDay = () => {
  if (!selectedDate.value) return
  
  const prevDay = new Date(selectedDate.value)
  prevDay.setDate(prevDay.getDate() - 1)
  selectedDate.value = prevDay
  scrollToTop()
}

const nextDay = () => {
  if (!selectedDate.value) return
  
  const nextDay = new Date(selectedDate.value)
  nextDay.setDate(nextDay.getDate() + 1)
  selectedDate.value = nextDay
  scrollToTop()
}

// Get event color
const getEventColor = (event) => {
  // Generate color based on event ID or title
  const identifier = event.id || event.title
  const hash = Array.from(identifier.toString()).reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  // Use predefined colors for consistency
  const colors = [
    '#4285F4', // Google Blue
    '#EA4335', // Google Red
    '#FBBC05', // Google Yellow
    '#34A853', // Google Green
    '#8e24aa', // Purple
    '#0097a7', // Teal
    '#f57c00', // Orange
  ]
  
  return colors[Math.abs(hash) % colors.length]
}

// Get event preview for month view
const getEventPreviewForDate = (date) => {
  const events = getEventsForDate(date)
  return events.slice(0, 2) // Only show first 2 events
}

// View event details
const viewEventDetails = (event) => {
  selectedEvent.value = event
  scrollToTop()
}

// Close event details
const closeEventDetails = () => {
  selectedEvent.value = null
  scrollToTop()
}

// Update the existing viewAllEvents method to use the new auto-scroll function
const viewAllEvents = (date) => {
  switchToDayView(date)
}

// Helper function untuk scroll ke atas
const scrollToTop = (delay = 50) => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, delay)
}

// Add prop to identify if calendar is in popup
const props = defineProps({
  isInPopup: {
    type: Boolean,
    default: false
  }
})

// Add scroll detection
const isHeaderScrolled = ref(false)
const calendarBodyRef = ref(null)

// Track scroll position
const handleScroll = () => {
  if (calendarBodyRef.value) {
    isHeaderScrolled.value = calendarBodyRef.value.scrollTop > 0
  }
}

// Emit event untuk trigger header
const showMainHeader = () => {
  emit('show-header');
}
</script>

<template>
  <div class="google-calendar" :class="{ 'in-popup': isInPopup }">
    <!-- Loading overlay with animation -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- Animated view switching -->
    <transition :name="viewTransitionName" mode="out-in">
      <!-- Month View -->
      <div v-if="currentView === 'month'" :key="'month-view'" class="month-view">
        <!-- Calendar Header -->
        <div class="calendar-header" :class="{ 'scrolled': isHeaderScrolled }" @mouseenter="showMainHeader">
          <div class="header-left">
            <div class="nav-buttons">
              <button @click="previousMonth" class="nav-button" :disabled="isTransitioning">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button @click="nextMonth" class="nav-button" :disabled="isTransitioning">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
            <h2 class="current-date">{{ currentMonth }} {{ currentYear }}</h2>
          </div>
          
          <div class="view-options">
            <select v-model="selectedMonthIndex" @change="updateMonth" class="month-dropdown">
              <option v-for="(month, index) in MONTHS" :key="month" :value="index">{{ month }}</option>
            </select>
            <select v-model="selectedYear" @change="updateYear" class="year-dropdown">
              <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
        </div>

        <!-- Calendar Grid with animations -->
        <div class="calendar-body" ref="calendarBodyRef">
          <!-- Weekday Headers -->
          <div class="weekday-row">
            <div v-for="day in DAYS" :key="day" class="weekday-header">{{ day }}</div>
          </div>
          
          <!-- Calendar Days with transition -->
          <transition :name="slideDirection === 'left' ? 'slide-left' : 'slide-right'" mode="out-in">
            <div 
              :key="currentDate.getMonth() + '-' + currentDate.getFullYear()" 
              class="month-grid"
            >
              <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                class="day-cell" 
                :class="{
                  'empty': day.isEmpty,
                  'today': day.isToday,
                  'selected': selectedDate && !day.isEmpty && day.date.toDateString() === selectedDate.toDateString(),
                  'has-events': !day.isEmpty && day.hasEvent
                }"
                @click="selectDate(day)"
              >
                <!-- Date Number -->
                <div class="date-number" :class="{ 'has-event': !day.isEmpty && day.hasEvent }">
                  {{ day.day }}
                </div>
                
                <!-- Event List with animated previews -->
                <div v-if="!day.isEmpty" class="event-list">
                  <transition-group name="list-animation">
                    <div 
                      v-for="(event, eventIndex) in getEventPreviewForDate(day.date)"
                      :key="eventIndex"
                      class="event-preview"
                      :style="{ backgroundColor: getEventColor(event) }"
                      @click.stop="viewEventDetails(event)"
                    >
                      {{ event.title }}
                    </div>
                  </transition-group>
                  
                  <!-- "More" indicator if there are more events -->
                  <div 
                    v-if="getEventsForDate(day.date).length > 2" 
                    class="more-events"
                    @click.stop="viewAllEvents(day.date)"
                  >
                    +{{ getEventsForDate(day.date).length - 2 }} more
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      
      <!-- Day View with animations -->
      <div v-else-if="currentView === 'day' && selectedDate" :key="'day-view'" class="day-view">
        <!-- Day View Header -->
        <div class="day-view-header">
          <div class="header-top">
            <button @click="switchToMonthView" class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              Back to Calendar
            </button>
          </div>
          
          <div class="header-main">
            <h2>{{ selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }}</h2>
            
            <div class="day-navigation">
              <button @click="previousDay" class="nav-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button @click="nextDay" class="nav-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Day view event list with staggered animations -->
        <div class="day-list-view">
          <div v-if="getDayEvents.length === 0" class="no-events-placeholder">
            <div class="empty-day-message">No events scheduled for this day</div>
          </div>
          
          <transition-group 
            name="list-animation" 
            tag="div" 
            class="events-list"
          >
            <div 
              v-for="(event, index) in getDayEvents" 
              :key="event.id || event.title" 
              class="list-event-item"
              :style="{ animationDelay: index * 0.05 + 's' }"
              @click="viewEventDetails(event)"
            >
              <div class="event-color-marker" :style="{ backgroundColor: getEventColor(event) }"></div>
              <div class="event-details">
                <div class="event-title-list">{{ event.title }}</div>
                <div v-if="event.location" class="event-location-list">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {{ event.location }}
                </div>
              </div>
              <div class="event-actions">
                <a :href="event.url" class="event-link-small" @click.stop target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </transition>
    
    <!-- Event Details Modal with animation -->
    <transition name="modal-fade">
      <div v-if="selectedEvent" class="event-modal" @click="closeEventDetails">
        <div class="modal-content" @click.stop>
          <div class="modal-header" :style="{ backgroundColor: getEventColor(selectedEvent) }">
            <button @click="closeEventDetails" class="close-button">×</button>
            <h3>{{ selectedEvent.title }}</h3>
            <div class="event-date">{{ formatEventDate(selectedEvent) }}</div>
          </div>
          
          <div class="modal-body">
            <div v-if="selectedEvent.location" class="modal-field">
              <div class="field-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Location
              </div>
              <div class="field-value">{{ selectedEvent.location }}</div>
            </div>
            
            <div class="modal-actions">
              <a :href="selectedEvent.url" class="event-link" target="_blank">
                View Event Details
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.google-calendar {
  font-family: 'Roboto', Arial, sans-serif;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  max-width: 1800px; /* Lebih lebar */
  margin: 0 auto;
  position: relative;
  width: 95%;
}

/* View Selector Styles */
.view-selector {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.view-selector button {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.view-selector button.active {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
}

/* Month View Styles */
.month-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Calendar Header */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0; /* Default untuk di dalam popup */
  background: white;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  transition: box-shadow 0.3s ease;
}

/* Ketika calendar digunakan di halaman utama (bukan dalam popup) */
.google-calendar:not(.in-popup) .calendar-header {
  top: 80px; /* Sesuaikan dengan tinggi header website Anda */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.today-button {
  padding: 8px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.2s;
}

.today-button:hover {
  background: #1765cc;
}

.nav-buttons {
  display: flex;
  gap: 8px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-button:hover {
  background: #f1f3f4;
}

.current-date {
  font-size: 22px;
  font-weight: 400;
  color: #3c4043;
  margin: 0;
}

.view-options {
  display: flex;
  gap: 10px;
}

.month-dropdown, .year-dropdown {
  padding: 8px 12px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  color: #3c4043;
  background: white;
}

/* Calendar Grid Styles */
.calendar-body {
  overflow-y: auto;
  flex-grow: 1;
  padding: 0;
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e0e0e0;
}

.weekday-header {
  padding: 12px 0;
  text-align: center;
  color: #70757a;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, auto);
  border-left: 1px solid #e0e0e0;
  transition: opacity 0.3s ease-in-out;
  animation: fadeIn 0.4s ease-in-out;
}

/* Animation for day cells */
.day-cell {
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px;
  min-height: 100px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease-in-out;
}

.day-cell:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.day-cell.empty {
  background: #f8f9fa;
  cursor: default;
}

.day-cell.today {
  background: #e8f0fe;
}

.day-cell.selected {
  background: #e8eaed;
}

.date-number {
  margin-bottom: 8px;
  font-size: 14px;
  color: #3c4043;
}

.date-number.has-event {
  font-weight: 500;
}

.day-cell.today .date-number {
  color: #1a73e8;
  font-weight: 500;
}

/* Event styles for month view */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
}

/* Event styles for month view */
.event-preview {
  padding: 3px 6px;  
  border-radius: 6px; 
  color: white;
  margin-bottom: 3px; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15); /* Shadow lebih terlihat */
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: left center;
  border: 1px solid rgba(255,255,255,0.15); /* Tambahkan border tipis */
}

.event-preview:hover {
  transform: scale(1.05) translateX(2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  z-index: 5;
}

.more-events {
  font-size: 12px;
  color: #1a73e8;
  padding: 2px 4px;
  cursor: pointer;
}

.more-events:hover {
  text-decoration: underline;
}

/* Day View Styles - menghilangkan batasan lebar */
.day-view {
  display: flex;
  flex-direction: column;
  height: 90vh; /* Lebih tinggi */
  min-height: 700px; /* Lebih tinggi */
  padding: 0;
  width: 100%;
  max-width: 100%; /* Menghilangkan batasan lebar maksimal */
  align-items: center; /* Menggunakan posisi tengah */
  animation: slideDown 0.3s ease-out;
}

/* Day View header revisi */
.day-view-header {
  display: flex;
  flex-direction: column;
  padding: 12px 20px;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
}

.header-top {
  margin-bottom: 12px;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-view-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #3c4043;
}

.day-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid #dadce0;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #3c4043;
}

.back-button:hover {
  background: #f1f3f4;
}

.day-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* List View Styles */
.day-list-view {
  padding: 16px;
  overflow-y: auto;
  max-height: calc(80vh - 120px);
  width: 98%;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Day View List Event Item - menyesuaikan border */
.list-event-item {
  display: flex;
  background: white;
  border-radius: 8px; /* Sedikit lebih kecil dari 10px */
  border: 1px solid #e0e0e0;
  padding: 14px 18px; /* Sedikit lebih kecil */
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeSlideIn 0.4s ease-out;
  animation-fill-mode: both;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Sedikit shadow untuk konsistensi */
}

.list-event-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
  border-color: #dadce0; /* Border sedikit lebih gelap saat hover */
}

/* Memperbaiki marker warna di list event agar lebih sesuai dengan preview */
.event-color-marker {
  width: 6px;
  height: auto; /* Full height */
  border-radius: 3px;
  margin-right: 16px;
  align-self: stretch; /* Memastikan tinggi penuh */
}

.event-details {
  flex: 1;
}

.event-time-list {
  font-size: 12px;
  color: #5f6368;
  margin-bottom: 4px;
}

.event-title-list {
  font-size: 18px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 6px;
}

.event-location-list {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #5f6368;
  margin-top: 4px;
}

.event-actions {
  display: flex;
  align-items: center;
}

.event-link-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #5f6368;
  border-radius: 50%;
  transition: all 0.2s;
}

.event-link-small:hover {
  background: #f1f3f4;
  color: #1a73e8;
}

/* Modal Styles */
.event-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-header {
  padding: 16px 20px;
  color: white;
  border-radius: 8px 8px 0 0;
  position: relative;
}

.modal-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 400;
}

.event-date {
  font-size: 14px;
  opacity: 0.9;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 16px 20px;
}

.modal-field {
  margin-bottom: 16px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #70757a;
  margin-bottom: 4px;
  font-size: 13px;
}

.field-value {
  font-size: 14px;
}

.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.event-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #1a73e8;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.event-link:hover {
  background: #1765cc;
}

/* New Day View Toggle and List View Styles */
.day-view-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
}

.event-count {
  font-size: 14px;
  color: #5f6368;
}

/* Responsive */
@media (max-width: 768px) {
  .day-timeline {
    flex-direction: column;
    height: auto;
  }
  
  .time-column {
    display: none;
  }
  
  .events-column {
    height: auto;
    min-height: 1440px;
  }
}

/* Staggered animation for list items */
.events-list .list-event-item:nth-child(1) { animation-delay: 0.05s; }
.events-list .list-event-item:nth-child(2) { animation-delay: 0.1s; }
.events-list .list-event-item:nth-child(3) { animation-delay: 0.15s; }
.events-list .list-event-item:nth-child(4) { animation-delay: 0.2s; }
.events-list .list-event-item:nth-child(5) { animation-delay: 0.25s; }

/* Keyframe animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalPop {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

/* ===== ANIMATION STYLES ===== */

/* Loading animation */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(26, 115, 232, 0.3);
  border-radius: 50%;
  border-top-color: #1a73e8;
  animation: spin 0.8s linear infinite;
}

/* Month transition animations */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

/* View transition animations */
.fade-scale-enter-active,
.fade-scale-leave-active,
.zoom-fade-enter-active,
.zoom-fade-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

/* Events list animation */
.list-animation-enter-active, 
.list-animation-leave-active {
  transition: all 0.3s ease;
}

.list-animation-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-animation-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Modal animation */
.modal-fade-enter-active, 
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, 
.modal-fade-leave-to {
  opacity: 0;
}

.modal-content {
  animation: modalPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Event preview hover animation */
.event-preview {
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: left center;
}

.event-preview:hover {
  transform: scale(1.05) translateX(2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  z-index: 5;
}

/* Today cell pulse effect */
.day-cell.today {
  animation: subtle-pulse 2s infinite;
}

/* Keyframe Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes subtle-pulse {
  0% { box-shadow: 0 0 0 0 rgba(26, 115, 232, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(26, 115, 232, 0); }
  100% { box-shadow: 0 0 0 0 rgba(26, 115, 232, 0); }
}

@keyframes modalPop {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

/* Special animations for day cells with events */
.day-cell.has-events {
  overflow: hidden;
}

.day-cell.has-events::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4285F4, #EA4335, #FBBC05, #34A853);
  transform: translateX(-100%);
  animation: slide-gradient 1.5s ease forwards;
}

@keyframes slide-gradient {
  to { transform: translateX(0); }
}
</style>