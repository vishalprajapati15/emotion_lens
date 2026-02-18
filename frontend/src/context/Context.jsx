import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '../services/apiClient'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const isAuthenticated = Boolean(user)

  const refreshMe = async () => {
    try {
      setError('')
      const data = await authService.getMe()
      if (data?.success && data?.user) setUser(data.user)
      else setUser(null)
    } catch (err) {
      setUser(null)
    }
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      await refreshMe()
      setIsLoading(false)
    })()
  }, [])

  const login = async (payload) => {
    try {
      setError('')
      const data = await authService.login(payload)
      if (!data?.success) throw new Error(data?.message || 'Login failed')
      await refreshMe()
      return data
    } catch (err) {
      const msg = getApiErrorMessage(err)
      setError(msg)
      return { success: false, message: msg }
    }
  }

  const register = async (payload) => {
    try {
      setError('')
      const data = await authService.register(payload)
      if (!data?.success) throw new Error(data?.message || 'Registration failed')
      await refreshMe()
      return data
    } catch (err) {
      const msg = getApiErrorMessage(err)
      setError(msg)
      return { success: false, message: msg }
    }
  }

  const logout = async () => {
    try {
      setError('')
      const data = await authService.logout()
      setUser(null)
      return data
    } catch (err) {
      const msg = getApiErrorMessage(err)
      setError(msg)
      setUser(null)
      return { success: false, message: msg }
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      setError,
      refreshMe,
      login,
      register,
      logout,
    }),
    [user, isAuthenticated, isLoading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext