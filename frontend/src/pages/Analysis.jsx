import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts'
import {
    Youtube, Sparkles, TrendingUp, Heart,
    Search, AlertCircle, MessageSquare,
    ThumbsUp, Eye, Loader2, CheckCircle2,
    XCircle, Play, Users
} from 'lucide-react'
import axios from 'axios'

const SENTIMENT_COLORS = {
    POSITIVE: '#22d3ee',
    NEUTRAL: '#60a5fa',
    NEGATIVE: '#f472b6',
}

const EMOTION_COLORS = ['#22d3ee', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

const EMOTION_EMOJIS = {
    joy: '😄', anger: '😠', sadness: '😢',
    surprise: '😲', fear: '😨', disgust: '🤢'
}

const SENTIMENT_EMOJIS = { POSITIVE: '😊', NEUTRAL: '😐', NEGATIVE: '😔' }

const FETCH_STEPS = [
    { id: 1, label: 'Validating YouTube URL…', icon: Youtube },
    { id: 2, label: 'Fetching video details…', icon: Play },
]

const ANALYZE_STEPS = [
    { id: 1, label: 'Fetching comments…', icon: MessageSquare },
    { id: 2, label: 'Running AI sentiment model…', icon: TrendingUp },
    { id: 3, label: 'Generating insights…', icon: Sparkles },
]

const formatNumber = (n) => {
    if (!n && n !== 0) return '—'
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
    return String(n)
}

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800/95 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-3 shadow-xl">
                <p className="text-slate-200 font-semibold">{payload[0].name}</p>
                <p className="text-cyan-400 text-sm">{payload[0].value}</p>
            </div>
        )
    }
    return null
}

const LoadingCard = ({ steps, currentStep }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 shadow-xl mb-8"
    >
        <div className="flex flex-col gap-4">
            {steps.map(step => {
                const Icon = step.icon
                const done = currentStep > step.id
                const active = currentStep === step.id
                return (
                    <div key={step.id} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${done ? 'bg-cyan-500/20 text-cyan-400' : active ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-600'}`}>
                            {active
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Icon className="w-4 h-4" />
                            }
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${done ? 'text-cyan-400' : active ? 'text-slate-200' : 'text-slate-600'}`}>
                            {step.label}
                        </span>
                        {done && <span className="ml-auto text-cyan-500 text-xs font-semibold">✓ Done</span>}
                    </div>
                )
            })}
        </div>
    </motion.div>
)

const Analysis = () => {
    const [url, setUrl] = useState('')

    // stage: 'idle' | 'fetching' | 'preview' | 'analyzing' | 'results'
    const [stage, setStage] = useState('idle')
    const [fetchStep, setFetchStep] = useState(0)
    const [analyzeStep, setAnalyzeStep] = useState(0)

    const [error, setError] = useState('')
    const [videoData, setVideoData] = useState(null)
    const [result, setResult] = useState(null)

    // ── helpers ────────────────────────────────────────────────────────────
    const buildChartData = (obj) =>
        Object.entries(obj || {}).map(([name, val]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            value: typeof val === 'object' ? Number(val.count ?? val.percentage ?? 0) : Number(val),
        }))

    const getDominant = (arr) =>
        arr.length ? arr.reduce((a, b) => (b.value > a.value ? b : a)) : null

    // ── Stage 1: Fetch video metadata ──────────────────────────────────────
    const handleFetchVideo = async () => {
        if (!url.trim()) {
            setError('Please paste a YouTube URL first.')
            return
        }
        setError('')
        setVideoData(null)
        setResult(null)
        setStage('fetching')
        setFetchStep(1)

        try {
            await new Promise(r => setTimeout(r, 700))
            setFetchStep(2)

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/youtube/video-meta-data`,
                { youtubeUrl: url },
                { withCredentials: true }
            )

            if (!data.success) throw new Error(data.message || 'Could not fetch video details.')

            setVideoData(data.videoMetaData)
            setStage('preview')
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Something went wrong.')
            setStage('idle')
        } finally {
            setFetchStep(0)
        }
    }

    // ── Stage 2: Analyze emotions ──────────────────────────────────────────
    const handleAnalyzeEmotions = async () => {
        setError('')
        setResult(null)
        setStage('analyzing')
        setAnalyzeStep(1)

        try {
            await new Promise(r => setTimeout(r, 700))
            setAnalyzeStep(2)

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/youtube/analyze`,
                { youtubeUrl: url },
                { withCredentials: true }
            )

            if (!data.success) throw new Error(data.message || 'Analysis failed.')

            setAnalyzeStep(3)
            await new Promise(r => setTimeout(r, 500))

            setResult(data)
            setStage('results')
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Something went wrong.')
            setStage('preview')
        } finally {
            setAnalyzeStep(0)
        }
    }

    // ── derived chart data ─────────────────────────────────────────────────
    const sentimentArr = result ? buildChartData(result.statistics?.sentiment) : []
    const emotionArr = result ? buildChartData(result.statistics?.emotion) : []
    const dominantSentiment = getDominant(sentimentArr)
    const dominantEmotion = getDominant(emotionArr)

    const hasComments = videoData?.commentCount > 0

    return (
        <div className="min-h-screen px-4 py-16">
            <div className="max-w-4xl mx-auto">

                {/* ── Headline ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="inline-block mb-4"
                    >
                        <Sparkles className="w-12 h-12 text-cyan-400" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Analyze YouTube Video Insights
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Paste a public YouTube video link to preview details and analyze audience emotions.
                    </p>
                </motion.div>

                {/* ── Stage 1: Input card ────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Youtube className="w-6 h-6 text-cyan-400" />
                        <h2 className="text-xl font-bold text-slate-200">Paste Your YouTube Link</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="url"
                                value={url}
                                onChange={e => { setUrl(e.target.value); setError('') }}
                                onKeyDown={e => e.key === 'Enter' && stage === 'idle' && handleFetchVideo()}
                                placeholder="https://www.youtube.com/watch?v=..."
                                disabled={stage === 'fetching' || stage === 'analyzing'}
                                className="w-full pl-12 pr-4 py-4 bg-slate-900/70 border border-slate-600 hover:border-cyan-500/50 focus:border-cyan-500 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-colors duration-200 disabled:opacity-50"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleFetchVideo}
                            disabled={stage === 'fetching' || stage === 'analyzing'}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                        >
                            {stage === 'fetching' ? 'Fetching…' : 'Fetch Video'}
                        </motion.button>
                    </div>

                    <p className="text-slate-500 text-xs mt-3 pl-1">We only analyze public videos with visible comments.</p>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 flex items-center gap-2 text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-lg px-4 py-3 text-sm"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── Fetch loading ──────────────────────────────────────── */}
                <AnimatePresence>
                    {stage === 'fetching' && (
                        <LoadingCard steps={FETCH_STEPS} currentStep={fetchStep} />
                    )}
                </AnimatePresence>

                {/* ── Stage 2: Video preview card ────────────────────────── */}
                <AnimatePresence>
                    {(stage === 'preview' || stage === 'analyzing' || stage === 'results') && videoData && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 overflow-hidden mb-8"
                        >
                            {/* thumbnail */}
                            {videoData.thumbnail && (
                                <div className="relative w-full">
                                    <img
                                        src={videoData.thumbnail}
                                        alt={videoData.title}
                                        className="w-full object-cover max-h-72"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                </div>
                            )}

                            <div className="p-8">
                                {/* title & channel */}
                                <h3 className="text-xl font-bold text-slate-100 mb-1 leading-snug">
                                    {videoData.title}
                                </h3>
                                <p className="text-cyan-400 text-sm font-medium mb-6 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {videoData.channelName}
                                </p>

                                {/* stats row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                    {[
                                        { icon: Eye, label: 'Views', value: formatNumber(videoData.views) },
                                        { icon: ThumbsUp, label: 'Likes', value: formatNumber(videoData.likes) },
                                        { icon: MessageSquare, label: 'Comments', value: formatNumber(videoData.commentCount) },
                                        { icon: Play, label: 'Published', value: videoData.publishedAt ? new Date(videoData.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—' },
                                    ].map(stat => (
                                        <div key={stat.label} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                <stat.icon className="w-3.5 h-3.5" />
                                                {stat.label}
                                            </div>
                                            <div className="text-slate-100 font-bold text-lg">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* comments availability badge + CTA */}
                                {stage === 'preview' && (
                                    <AnimatePresence>
                                        {hasComments ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                            >
                                                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium px-4 py-2 rounded-full">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Comments available for analysis
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    onClick={handleAnalyzeEmotions}
                                                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer whitespace-nowrap"
                                                >
                                                    Analyze Emotions
                                                </motion.button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-col gap-3"
                                            >
                                                <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-medium px-4 py-2 rounded-full w-fit">
                                                    <XCircle className="w-4 h-4" />
                                                    Comments are disabled or unavailable
                                                </div>
                                                <p className="text-slate-500 text-sm">
                                                    This video does not have public comments available for analysis.
                                                </p>
                                                <button
                                                    disabled
                                                    className="mt-1 px-8 py-3 bg-slate-700/50 text-slate-500 font-semibold rounded-xl cursor-not-allowed w-fit"
                                                >
                                                    Analyze Emotions
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Analyze loading ────────────────────────────────────── */}
                <AnimatePresence>
                    {stage === 'analyzing' && (
                        <LoadingCard steps={ANALYZE_STEPS} currentStep={analyzeStep} />
                    )}
                </AnimatePresence>

                {/* ── Stage 3: Results ───────────────────────────────────── */}
                <AnimatePresence>
                    {stage === 'results' && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* summary stat cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                {[
                                    { label: 'Total Comments', value: result.totalComments, color: 'from-cyan-400 to-blue-500' },
                                    { label: 'Dominant Sentiment', value: dominantSentiment?.name ?? '—', color: 'from-blue-400 to-purple-500' },
                                    { label: 'Dominant Emotion', value: dominantEmotion?.name ?? '—', color: 'from-purple-400 to-pink-500' },
                                ].map(card => (
                                    <div key={card.label} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20 text-center">
                                        <div className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent mb-1`}>
                                            {card.value}
                                        </div>
                                        <div className="text-slate-400 text-sm">{card.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* sentiment bar chart */}
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <TrendingUp className="w-6 h-6 text-cyan-400" />
                                        <h3 className="text-xl font-bold text-slate-200">Sentiment Distribution</h3>
                                    </div>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={sentimentArr}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '13px' }} />
                                            <YAxis stroke="#94a3b8" style={{ fontSize: '13px' }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                                {sentimentArr.map((entry, i) => (
                                                    <Cell key={i} fill={SENTIMENT_COLORS[entry.name.toUpperCase()] ?? '#60a5fa'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                                        {sentimentArr.map(item => (
                                            <div key={item.name} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS[item.name.toUpperCase()] ?? '#60a5fa' }} />
                                                <span className="text-slate-300 text-sm">{item.name}: {item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* emotion pie chart */}
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Heart className="w-6 h-6 text-cyan-400" />
                                        <h3 className="text-xl font-bold text-slate-200">Emotion Breakdown</h3>
                                    </div>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={emotionArr}
                                                cx="50%" cy="50%"
                                                outerRadius={95}
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                dataKey="value"
                                            >
                                                {emotionArr.map((_, i) => (
                                                    <Cell key={i} fill={EMOTION_COLORS[i % EMOTION_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        {emotionArr.map((item, i) => (
                                            <div key={item.name} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: EMOTION_COLORS[i % EMOTION_COLORS.length] }} />
                                                <span className="text-slate-300 text-sm">{item.name}: {item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* dominant cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/30 shadow-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-slate-300">Dominant Sentiment</h4>
                                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                            <span className="text-3xl">{SENTIMENT_EMOJIS[dominantSentiment?.name?.toUpperCase()] ?? '📊'}</span>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                                {dominantSentiment?.name ?? '—'}
                                            </div>
                                            <div className="text-slate-400 text-sm mt-1">{dominantSentiment?.value ?? 0} comments</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-slate-300">Dominant Emotion</h4>
                                        <Heart className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                            <span className="text-3xl">{EMOTION_EMOJIS[dominantEmotion?.name?.toLowerCase()] ?? '💡'}</span>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                                {dominantEmotion?.name ?? '—'}
                                            </div>
                                            <div className="text-slate-400 text-sm mt-1">{dominantEmotion?.value ?? 0} comments</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}

export default Analysis