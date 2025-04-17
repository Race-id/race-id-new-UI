<script setup>
import { ref, computed, onMounted } from 'vue';
import events from '../components/data/events.json';

const emit = defineEmits(['select-date', 'close'])

const currentDate = ref(new Date())
const selectedDate = ref(null)

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
  raceEvents.value.forEach(event => {
    try {
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

// Nama-nama hari dan bulan dalam Bahasa Indonesia
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December']

// Computed properties untuk kalendar
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
  currentDate.value = new Date(currentYear.value, currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentDate.value.getMonth() + 1)
}

const selectDate = (day) => {
  if (!day.isEmpty) {
    selectedDate.value = day.date
    const dayEvents = getEventsForDate(day.date)
    emit('select-date', { date: day.date, events: dayEvents })
  }
}

// Add close handler
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="previousMonth">&lt;</button>
      <h2>{{ currentMonth }} {{ currentYear }}</h2>
      <button @click="nextMonth">&gt;</button>
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
          'has-event': !day.isEmpty && day.hasEvent
        }"
        @click="selectDate(day)"
      >
        {{ day.day }}
        
        <!-- Event indicator -->
        <div v-if="!day.isEmpty && day.hasEvent" class="event-indicators">
          <span class="event-dot"></span>
          <span v-if="getEventsForDate(day.date).length > 1" 
                class="event-count">
            {{ getEventsForDate(day.date).length }}
          </span>
        </div>

        <!-- Tooltip with event details -->
        <div v-if="!day.isEmpty && day.hasEvent" class="event-tooltip">
          <div v-for="event in getEventsForDate(day.date)" 
               :key="event.title" 
               class="event-item">
            <a :href="event.url" 
               target="_blank" 
               class="event-link">
              {{ event.title }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Event panel -->
    <div v-if="selectedDate" class="event-panel">
      <h3>{{ selectedDate.toLocaleDateString() }}</h3>
      <div v-for="event in getEventsForDate(selectedDate)" 
           :key="event.title" 
           class="event-item">
        <h4>{{ event.title }}</h4>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header button {
  padding: 8px 16px;
  background: #617afa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.calendar-cell.header {
  background: #f3f4f6;
  font-weight: 600;
  cursor: default;
}

.calendar-cell.empty {
  background: #f9fafb;
  cursor: default;
}

.calendar-cell.today {
  background: #e5edff;
  font-weight: bold;
}

.calendar-cell.has-event {
  font-weight: bold;
  color: #617afa;
}

.event-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #617afa;
  border-radius: 50%;
}

.event-panel {
  margin-top: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.event-item {
  padding: 10px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

@media (max-width: 640px) {
  .calendar-container {
    padding: 10px;
    width: 100%;
    max-width: none;
  }

  .calendar-header h2 {
    font-size: 16px;
  }

  .calendar-grid {
    gap: 2px;
  }

  .calendar-cell {
    padding: 4px;
    font-size: 12px;
  }
}

.calendar-day {
  position: relative;
  padding-bottom: 16px;
}

.event-indicators {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  align-items: center;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #617afa;
}

.event-count {
  font-size: 10px;
  color: #6b7280;
}

.event-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  width: 200px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.calendar-day:hover .event-tooltip {
  display: block;
}

.event-item {
  padding: 4px 0;
}

.event-link {
  color: #617afa;
  text-decoration: none;
  font-size: 12px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-link:hover {
  text-decoration: underline;
}

.has-events {
  background-color: #f0f4ff;
}

.has-events:hover {
  background-color: #e5ebff;
}
</style>