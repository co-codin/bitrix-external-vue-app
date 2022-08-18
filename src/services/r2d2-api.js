import axios from 'axios'
import store from '../store'

console.log(process.env)

const api = axios.create({
  baseURL: process.env.VUE_APP_R2D2_API_URL,
  headers: {
    common: {
      Accept: 'text/plain, */*'
    }
  }
})

api.interceptors.request.use((config) => {
  config.headers['bitrix_access_token'] = window.BX24.getAuth().access_token
  config.headers['Authorization'] = `Bearer ${store.state.user.r2d2Token}`

  return config
})

export default api
