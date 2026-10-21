import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gs_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('gs_token') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)
      const res = await api.post('/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      const { access_token, client } = res.data
      setToken(access_token)
      setUser(client)
      localStorage.setItem('gs_token', access_token)
      localStorage.setItem('gs_user', JSON.stringify(client))
      return { success: true, user: client }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    setLoading(true)
    try {
      const res = await api.post('/api/auth/register', data)
      const { access_token, client } = res.data
      setToken(access_token)
      setUser(client)
      localStorage.setItem('gs_token', access_token)
      localStorage.setItem('gs_user', JSON.stringify(client))
      return { success: true, user: client }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('gs_token')
    localStorage.removeItem('gs_user')
    delete api.defaults.headers.common['Authorization']
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
