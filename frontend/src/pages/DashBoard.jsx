import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, ThumbsUp, MessageSquare, Calendar,
  TrendingUp, Sparkles, Youtube, PlusCircle,
  LayoutGrid, Loader2, AlertCircle, Smile
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { fetchVideoCards } from '../services/videoService'
import { SENTIMENT_CONFIG, EMOTION_CONFIG } from '../components/videoDetails/constants'

// helpers 

const formatNumber = (n) => {
  if (n == null) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const getSentiment = (key) =>
  SENTIMENT_CONFIG[key?.toUpperCase()] ?? SENTIMENT_CONFIG.NEUTRAL

const getEmotion = (key) =>
  EMOTION_CONFIG[key?.toLowerCase()] ?? {
    emoji: '🤔', color: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-400/30'
  }

// ─── Skeleton card ───────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden animate-pulse">
    <div className="w-full aspect-video bg-slate-700/60" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-700/60 rounded w-3/4" />
      <div className="h-3 bg-slate-700/40 rounded w-1/2" />
      <div className="flex gap-3 mt-3">
        <div className="h-3 bg-slate-700/40 rounded w-14" />
        <div className="h-3 bg-slate-700/40 rounded w-14" />
        <div className="h-3 bg-slate-700/40 rounded w-14" />
      </div>
      <div className="h-2 bg-slate-700/40 rounded w-full mt-2" />
    </div>
  </div>
)

// ─── Video card ──────────────────────────────────────────────────────────────

const VideoCard = ({ video, index }) => {
  const navigate  = useNavigate()
  const sentiment = getSentiment(video.dominantSentiment)
  const emotion   = getEmotion(video.dominantEmotion)
  const positive  = Math.round(video.positivePercentage ?? 0)
  const negative  = Math.round(video.negativePercentage ?? 0)
  const neutral   = Math.max(0, 100 - positive - negative)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.055 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/video/${video.videoId}`)}
      className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50
                 hover:border-cyan-500/40 shadow-lg hover:shadow-cyan-500/10
                 overflow-hidden flex flex-col transition-colors duration-200 group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-900">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title ?? 'Video thumbnail'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube className="w-10 h-10 text-slate-600" />
          </div>
        )}
        {/* Sentiment pill overlay */}
        <span className={`absolute top-2 right-2 flex items-center gap-1.5 text-xs font-semibold
          px-2 py-1 rounded-full border backdrop-blur-md ${sentiment.bg} ${sentiment.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sentiment.dot}`} />
          {sentiment.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title & channel */}
        <div>
          <h3 className="text-slate-100 font-semibold text-sm leading-snug line-clamp-2">
            {video.title ?? 'Untitled Video'}
          </h3>
          <p className="text-slate-400 text-xs mt-1 truncate">
            {video.channelName ?? '—'}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-cyan-500/70" />
            {formatNumber(video.views)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-500/70" />
            {formatNumber(video.likes)}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500/70" />
            {formatNumber(video.totalComments)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {formatDate(video.publishedAt)}
          </span>
        </div>

        {/* Emotion badge */}
        <div className="flex items-center gap-2">
          <Smile className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5
            rounded-full border ${emotion.bg} ${emotion.color}`}>
            {emotion.emoji}&nbsp;
            {video.dominantEmotion
              ? video.dominantEmotion.charAt(0).toUpperCase() + video.dominantEmotion.slice(1)
              : 'Unknown'}
          </span>
        </div>

        {/* Sentiment bar */}
        <div className="mt-auto pt-1">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span className="text-emerald-400/80">+{positive}%</span>
            <span className="text-blue-400/80">{neutral}% neutral</span>
            <span className="text-rose-400/80">-{negative}%</span>
          </div>
          <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
            <div
              className="bg-emerald-500/70 transition-all duration-700"
              style={{ width: `${positive}%` }}
            />
            <div
              className="bg-blue-500/60 transition-all duration-700"
              style={{ width: `${neutral}%` }}
            />
            <div
              className="bg-rose-500/70 transition-all duration-700"
              style={{ width: `${negative}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Dashboard page ──────────────────────────────────────────────────────────

const DashBoard = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [videos,  setVideos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  // Fetch video cards
  useEffect(() => {
    if (!isAuthenticated) return
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchVideoCards()
        if (data?.success) {
          setVideos(data.videos ?? [])
        } else {
          // API returned success:false — treat as empty, not a hard error
          setVideos([])
        }
      } catch (err) {
        const msg = err?.response?.data?.message ?? err?.message ?? 'Something went wrong.'
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    })()
  }, [isAuthenticated])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  const avgPositive = videos.length
    ? Math.round(videos.reduce((s, v) => s + (v.positivePercentage ?? 0), 0) / videos.length)
    : 0

  const totalComments = videos.reduce((s, v) => s + (v.totalComments ?? 0), 0)

  const topEmotion = (() => {
    const freq = {}
    videos.forEach((v) => {
      if (v.dominantEmotion) freq[v.dominantEmotion] = (freq[v.dominantEmotion] ?? 0) + 1
    })
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]
    return top ? top[0].charAt(0).toUpperCase() + top[0].slice(1) : '—'
  })()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <LayoutGrid className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              My Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {loading
                ? 'Loading your analyses…'
                : `${videos.length} video${videos.length !== 1 ? 's' : ''} analysed`}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/analysis')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer
            bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500
            text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Analyse New Video
        </motion.button>
      </motion.div>

      {/* ── Stats strip ── */}
      <AnimatePresence>
        {!loading && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { icon: Youtube,       label: 'Total Videos',   value: videos.length,              color: 'text-cyan-400',   bg: 'bg-cyan-400/10'   },
              { icon: TrendingUp,    label: 'Avg Positive',   value: `${avgPositive}%`,           color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { icon: MessageSquare, label: 'Total Comments', value: formatNumber(totalComments), color: 'text-purple-400', bg: 'bg-purple-400/10'  },
              { icon: Sparkles,      label: 'Top Emotion',    value: topEmotion,                  color: 'text-yellow-400', bg: 'bg-yellow-400/10'  },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-slate-800/50 rounded-xl border border-slate-700/50 px-4 py-3"
              >
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className={`text-base font-bold ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-20 text-center"
        >
          <AlertCircle className="w-12 h-12 text-rose-400" />
          <p className="text-slate-300 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && videos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center gap-5 py-24 text-center"
        >
          <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <Youtube className="w-12 h-12 text-cyan-400" />
          </div>
          <div>
            <p className="text-slate-200 font-semibold text-lg">No videos analysed yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Analyse your first YouTube video to see insights here.
            </p>
          </div>
          <button
            onClick={() => navigate('/analysis')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20
              hover:from-cyan-400 hover:to-blue-500 transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4" />
            Analyse New Video
          </button>
        </motion.div>
      )}

      {/* ── Video cards grid ── */}
      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {videos.map((video, i) => (
              <VideoCard key={video.videoId ?? i} video={video} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default DashBoard