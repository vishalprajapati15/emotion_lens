import { apiClient } from './apiClient'

export const login = async (payload) => {
  const { data } = await apiClient.post('/api/auth/login', payload)
  return data
}

export const register = async (payload) => {
  const { data } = await apiClient.post('/api/auth/register', payload)
  return data
}

export const logout = async () => {
  const { data } = await apiClient.post('/api/auth/logout')
  return data
}

export const getMe = async () => {
  const { data } = await apiClient.get('/api/auth/me')
  return data
}

export const sendResetOtp = async (payload) => {
  const { data } = await apiClient.post('/api/auth/send-reset-otp', payload)
  return data
}

export const resetPassword = async (payload) => {
  const { data } = await apiClient.post('/api/auth/reset-password', payload)
  return data
}
