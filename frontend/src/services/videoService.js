import { apiClient } from './apiClient'

export const fetchVideoCards = async () => {
  const { data } = await apiClient.get('/api/videos/cards')
  return data
}

export const fetchFullVideoDetails = async (videoId) => {
  const { data } = await apiClient.get(`/api/videos/${videoId}`)
  return data
}

export const generateVideoSummary = async (videoId) => {
  const { data } = await apiClient.post('/api/groq/generate-summary-by-id', { videoId })
  return data
}

export const fetchVideoMetrics = async (videoId) => {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`
  const { data } = await apiClient.post('/api/youtube/video-metrics', { youtubeUrl })
  return data
}

export const generateAnalysisSummaryByUrl = async (youtubeUrl) => {
  const { data } = await apiClient.post('/api/groq/generate-summary', { youtubeUrl })
  return data
}

export const fetchVideoMetricsByUrl = async (youtubeUrl) => {
  const { data } = await apiClient.post('/api/youtube/video-metrics', { youtubeUrl })
  return data
}
