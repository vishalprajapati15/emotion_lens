import { Youtube, Play, MessageSquare, Activity, Sparkles } from 'lucide-react'

// ─── chart colours ───────────────────────────────────────────────────────────

export const SENTIMENT_COLORS = {
  POSITIVE: '#22d3ee',
  NEUTRAL:  '#60a5fa',
  NEGATIVE: '#f472b6',
}

export const EMOTION_COLORS = [
  '#22d3ee', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f59e0b', '#10b981',
]

export const METRIC_COLORS = [
  '#22d3ee', '#a78bfa', '#f59e0b', '#10b981', '#f472b6',
]

// emoji maps 

export const EMOTION_EMOJIS = {
  joy:      '😄',
  anger:    '😠',
  sadness:  '😢',
  surprise: '😲',
  fear:     '😨',
  disgust:  '🤢',
}

export const SENTIMENT_EMOJIS = {
  POSITIVE: '😊',
  NEUTRAL:  '😐',
  NEGATIVE: '😔',
}

// dashboard UI configs

export const SENTIMENT_CONFIG = {
  POSITIVE: { label: 'Positive', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', dot: 'bg-emerald-400' },
  NEUTRAL:  { label: 'Neutral',  color: 'text-blue-400',    bg: 'bg-blue-400/10 border-blue-400/30',       dot: 'bg-blue-400'   },
  NEGATIVE: { label: 'Negative', color: 'text-rose-400',    bg: 'bg-rose-400/10 border-rose-400/30',       dot: 'bg-rose-400'   },
}

export const EMOTION_CONFIG = {
  joy:      { emoji: '😄', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  anger:    { emoji: '😠', color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/30'       },
  sadness:  { emoji: '😢', color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/30'     },
  surprise: { emoji: '😲', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
  fear:     { emoji: '😨', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
  disgust:  { emoji: '🤢', color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30'   },
}

// analysis progress steps

export const FETCH_STEPS = [
  { id: 1, label: 'Validating YouTube URL…', icon: Youtube },
  { id: 2, label: 'Fetching video details…', icon: Play },
]

export const ANALYZE_STEPS = [
  { id: 1, label: 'Fetching comments…', icon: MessageSquare },
  { id: 2, label: 'Running AI sentiment model…', icon: Activity },
  { id: 3, label: 'Generating insights…', icon: Sparkles },
]
