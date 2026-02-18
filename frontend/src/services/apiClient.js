import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL

if (!baseURL) {
  // Keep it as runtime warning; do not crash the app.
  // eslint-disable-next-line no-console
  console.warn('VITE_BACKEND_URL is not set. API calls may fail.')
}

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30_000,
})

export const getApiErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong.'
  )
}
