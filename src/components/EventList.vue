<template>
  <div>
    <div v-if="events.length">
      <div v-for="event in events" :key="event.id">
        {{ event.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { getEvents } from './services/eventService'

export default {
  name: 'EventList',
  data() {
    return {
      events: []
    }
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await getEvents()
        this.events = response.data
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
  },
  mounted() {
    this.fetchEvents()
  }
}
</script>
