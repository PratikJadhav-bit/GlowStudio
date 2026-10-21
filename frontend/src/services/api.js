import axios from 'axios'

const api = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gs_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gs_token')
      localStorage.removeItem('gs_user')
    }
    return Promise.reject(error)
  }
)

// ── Service methods ──────────────────────────────────────────────────────────

export const servicesAPI = {
  getAll: () => api.get('/api/services'),
}

export const staffAPI = {
  getAll: () => api.get('/api/staff'),
  getPerformance: () => api.get('/api/analytics/staff-performance'),
}

export const appointmentsAPI = {
  create: (data) => api.post('/api/appointments', data),
  getAll: () => api.get('/api/appointments'),
}

export const productsAPI = {
  getAll: () => api.get('/api/products'),
}

export const analyticsAPI = {
  getRevenue: () => api.get('/api/analytics/revenue'),
  getBookings: () => api.get('/api/analytics/bookings'),
}

export const queueAPI = {
  getQueue: () => api.get('/api/queue'),
}

export const loyaltyAPI = {
  getTiers: () => api.get('/api/loyalty/tiers'),
}

export const remindersAPI = {
  getAll: () => api.get('/api/reminders'),
}

export const aiAPI = {
  recommend: (data) => api.post('/api/ai/recommend', data),
}

export default api
