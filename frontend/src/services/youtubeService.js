import { apiClient } from './apiClient'

export const fetchVideoMetaData = async (youtubeUrl) => {
  const { data } = await apiClient.post('/api/youtube/video-meta-data', { youtubeUrl })
  return data
}

export const analyzeYouTubeVideo = async (youtubeUrl) => {
  const { data } = await apiClient.post('/api/youtube/analyze', { youtubeUrl })
  return data
}

export const fetchYouTubeComments = async (youtubeUrl) => {
  const { data } = await apiClient.post('/api/youtube/get-comments', { youtubeUrl })
  return data
}
