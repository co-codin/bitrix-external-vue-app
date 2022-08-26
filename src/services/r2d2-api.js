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

  config.headers['BitrixAccessToken'] = window.BX24?.getAuth()?.access_token || process.env.VUE_APP_BITRIX_USER_TOKEN

  config.headers['Authorization'] = `Bearer ${store.state.user.r2d2Token || process.env.VUE_APP_R2D2_USER_TOKEN}`

  return config
})

export default api
