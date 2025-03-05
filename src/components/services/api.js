import axios from 'axios'

const api = axios.create({
  baseURL: 'https://steelytoe.com/dev.titudev.com/api/v1',
  timeout: 70000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
