import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Youtube, Sparkles, Search, MessageSquare,
    Loader2, CheckCircle2, XCircle, Activity, Play
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import VideoHero from '../components/videoDetails/VideoHero'
import SentimentStats from '../components/videoDetails/SentimentStats'
import SentimentCharts from '../components/videoDetails/SentimentCharts'
import DominantCards from '../components/videoDetails/DominantCards'
import AiSummary from '../components/videoDetails/AiSummary'
import VideoMetrics from '../components/videoDetails/VideoMetrics'
import { generateAnalysisSummaryByUrl, fetchVideoMetricsByUrl } from '../services/videoService'

// ── extract video ID from YouTube URL ───────────────────────────────────────
const extractVideoId = (rawUrl) => {
    try {
        const u = new URL(rawUrl)
        return u.searchParams.get('v') ?? u.pathname.split('/').pop()
    } catch { return '' }
}

const FETCH_STEPS = [
    { id: 1, label: 'Validating YouTube URL…', icon: Youtube },
    { id: 2, label: 'Fetching video details…', icon: Play },
]

const ANALYZE_STEPS = [
    { id: 1, label: 'Fetching comments…', icon: MessageSquare },
    { id: 2, label: 'Running AI sentiment model…', icon: Activity },
    { id: 3, label: 'Generating insights…', icon: Sparkles },
]

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

    const [videoData, setVideoData] = useState(null)
    const [result, setResult] = useState(null)

    const [summary, setSummary] = useState('')
    const [summarizing, setSummarizing] = useState(false)
    const [metricsTriggered, setMetricsTriggered] = useState(false)
    const [metrics, setMetrics] = useState(null)
    const [metricsLoading, setMetricsLoading] = useState(false)

    // ── helpers ────────────────────────────────────────────────────────────
    const buildChartData = (obj) =>
        Object.entries(obj || {}).map(([name, val]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            value: typeof val === 'object' ? Number(val.count ?? 0) : Number(val),
            pct: typeof val === 'object' ? Number(val.percentage ?? 0) : Number(val),
        }))

    const getDominant = (arr) =>
        arr.length ? arr.reduce((a, b) => (b.value > a.value ? b : a)) : null

    // ── Stage 1: Fetch video metadata ──────────────────────────────────────
    const handleFetchVideo = async () => {
        if (!url.trim()) {
            toast.error('Please paste a YouTube URL first.')
            return
        }
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
            toast.error(err.response?.data?.message || err.message || 'Something went wrong.')
            setStage('idle')
        } finally {
            setFetchStep(0)
        }
    }

    // ── Stage 2: Analyze emotions ──────────────────────────────────────────
    const handleAnalyzeEmotions = async () => {
        setResult(null)
        setSummary('')
        setSummarizing(false)
        setMetricsTriggered(false)
        setMetrics(null)
        setMetricsLoading(false)
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

            toast.success('Analysis complete!')
            setResult(data)
            setStage('results')
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Something went wrong.')
            setStage('preview')
        } finally {
            setAnalyzeStep(0)
        }
    }

    // ── AI Summary ─────────────────────────────────────────────────────────
    const handleSummarize = async () => {
        setSummarizing(true)
        try {
            const res = await generateAnalysisSummaryByUrl(url)
            if (res?.success && res?.summary) {
                setSummary(res.summary)
                toast.success('Summary generated!')
            } else {
                toast.error(res?.message ?? 'Failed to generate summary.')
            }
        } catch (err) {
            toast.error(err?.response?.data?.message ?? err?.message ?? 'Something went wrong.')
        } finally {
            setSummarizing(false)
        }
    }

    // ── Video Metrics ──────────────────────────────────────────────────────
    const handleGenerateMetrics = async () => {
        setMetricsTriggered(true)
        setMetricsLoading(true)
        try {
            const res = await fetchVideoMetricsByUrl(url)
            if (res?.success && res?.metrices) setMetrics(res.metrices)
        } catch (_) { /* silent */ }
        finally { setMetricsLoading(false) }
    }

    // ── derived chart data ─────────────────────────────────────────────────
    const sentimentArr = result ? buildChartData(result.statistics?.sentiment) : []
    const emotionArr = result ? buildChartData(result.statistics?.emotion) : []
    const dominantSentiment = getDominant(sentimentArr)
    const dominantEmotion = getDominant(emotionArr)

    // Positive + Negative only (no Neutral bar — matches VideoDetails behaviour)
    const sentimentChartData = sentimentArr.filter(s => s.name !== 'Neutral')

    // Normalized shape expected by SentimentStats + DominantCards
    const analysisData = result ? {
        totalComments: result.totalComments,
        sentimentPositivePercentage: result.statistics?.sentiment?.positive?.percentage ?? 0,
        sentimentPositiveCount: result.statistics?.sentiment?.positive?.count ?? 0,
        sentimentNegativePercentage: result.statistics?.sentiment?.negative?.percentage ?? 0,
        sentimentNegativeCount: result.statistics?.sentiment?.negative?.count ?? 0,
        dominantSentimentLabel: dominantSentiment?.name,
        dominantSentimentCount: dominantSentiment?.value,
        dominantEmotionLabel: dominantEmotion?.name,
        dominantEmotionCount: dominantEmotion?.value,
    } : null

    const hasComments = videoData?.commentCount > 0


    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

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
                            onChange={e => setUrl(e.target.value)}
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

            </motion.div>

            {/* ── Fetch loading ──────────────────────────────────────── */}
            <AnimatePresence>
                {stage === 'fetching' && (
                    <LoadingCard steps={FETCH_STEPS} currentStep={fetchStep} />
                )}
            </AnimatePresence>

            {/* ── Stage 2: VideoHero + analyze CTA ──────────────────── */}
            <AnimatePresence>
                {(stage === 'preview' || stage === 'analyzing' || stage === 'results') && videoData && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <VideoHero
                            meta={videoData}
                            totalComments={result?.totalComments ?? videoData.commentCount}
                            videoId={extractVideoId(url)}
                        />

                        {/* Analyze CTA — only shown in preview stage */}
                        {stage === 'preview' && (
                            <div className="mb-8">
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
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>


            {/* ── Analyze loading ────────────────────────────────────── */}
            <AnimatePresence>
                {stage === 'analyzing' && (
                    <LoadingCard steps={ANALYZE_STEPS} currentStep={analyzeStep} />
                )}
            </AnimatePresence>

            {/* ── Stage 3: Results ──────────────────────────────────── */}
            <AnimatePresence>
                {stage === 'results' && result && analysisData && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Stat cards (Total / Positive / Negative) */}
                        <SentimentStats data={analysisData} />

                        {/* Sentiment bar + Emotion pie */}
                        <SentimentCharts
                            sentimentData={sentimentChartData}
                            emotionData={emotionArr}
                        />

                        {/* Dominant sentiment + emotion */}
                        <DominantCards data={analysisData} />

                        {/* ── AI Summary ── */}
                        <AiSummary
                            summary={summary}
                            summarizing={summarizing}
                            onGenerate={handleSummarize}
                        />

                        {/* ── Generate Metrics button / VideoMetrics ── */}
                        <AnimatePresence>
                            {summary && !metricsTriggered && (
                                <motion.div
                                    key="metrics-cta"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-8 flex justify-center"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={handleGenerateMetrics}
                                        className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 transition-all duration-300 cursor-pointer"
                                    >
                                        <Activity className="w-5 h-5" />
                                        Generate Performance Metrics
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {metricsTriggered && (
                            <VideoMetrics metrics={metrics} metricsLoading={metricsLoading} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default Analysis