<script setup>
import { ref, computed, onMounted } from 'vue'

defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-date', 'close'])

const currentDate = ref(new Date())
const selectedDate = ref(null)
const events = ref([])

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
    const hasEvent = events.value.some(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })

    days.push({
      day: i,
      isEmpty: false,
      isToday: isToday(date),
      hasEvent,
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
    const dayEvents = events.value.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === day.date.toDateString()
    })
    emit('select-date', { date: day.date, events: dayEvents })
  }
}

// Add close handler
const handleClose = () => {
  emit('close')
}

// Fetch events (contoh data)
onMounted(async () => {
  // Simulasi fetch data events
  events.value = [
    {
      id: 1,
      title: 'Jakarta Marathon',
      date: '2024-04-15',
      location: 'Jakarta'
    },
    // ... more events
  ]
})
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
          'has-event': day.hasEvent
        }"
        @click="selectDate(day)"
      >
        {{ day.day }}
        <span v-if="day.hasEvent" class="event-indicator"></span>
      </div>
    </div>

    <!-- Event Modal/Panel -->
    <div v-if="selectedDate" class="event-panel">
      <h3>{{ selectedDate.toLocaleDateString() }}</h3>
      <div v-for="event in events.filter(e => 
        new Date(e.date).toDateString() === selectedDate.toDateString()
      )" :key="event.id" class="event-item">
        <h4>{{ event.title }}</h4>
        <p>{{ event.location }}</p>
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
</style>