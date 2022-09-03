import axios from 'axios'
import store from '../store'

const api = axios.create({
  baseURL: process.env.VUE_APP_R2D2_API_URL,
  headers: {
    common: {
      Accept: 'application/json, */*'
    }
  }
})

api.interceptors.request.use((config) => {
  config.headers['Authorization'] = `Bearer ${store.state.user.r2d2Token}`

  return config
})

export default api
