import axios from 'axios';

export const eventService = {
  async getEventHeader(pageNumber = 1, pageSize = 12) {
    try {
      const response = await axios.get('https://steelytoe.com/dev.titudev.com/api/v1/resources/event_public_header', {
        params: {
          pageNumber,
          pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getEventDetail(eventId) {
    try {
      console.log('Fetching event with ID:', eventId);
      const response = await axios.get(`https://steelytoe.com/dev.titudev.com/api/v1/resources/event_public_header/${eventId}`);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};