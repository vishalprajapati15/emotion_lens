import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { fetchFullVideoDetails, generateVideoSummary, fetchVideoMetrics } from '../services/videoService'
import VideoHero       from '../components/videoDetails/VideoHero'
import SentimentStats  from '../components/videoDetails/SentimentStats'
import SentimentCharts from '../components/videoDetails/SentimentCharts'
import DominantCards   from '../components/videoDetails/DominantCards'
import AiSummary       from '../components/videoDetails/AiSummary'
import VideoMetrics    from '../components/videoDetails/VideoMetrics'

const VideoDetails = () => {
    const { videoId } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated, isLoading: authLoading } = useAuth()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [summary, setSummary] = useState('')
    const [summarizing, setSummarizing] = useState(false)
    const [metrics, setMetrics] = useState(null)
    const [metricsLoading, setMetricsLoading] = useState(false)

    useEffect(() => {
        if (!authLoading && !isAuthenticated) navigate('/login', { replace: true })
    }, [authLoading, isAuthenticated, navigate])

    useEffect(() => {
        if (!data || !videoId) return
            ; (async () => {
                setMetricsLoading(true)
                try {
                    const res = await fetchVideoMetrics(videoId)
                    if (res?.success && res?.metrices) setMetrics(res.metrices)
                } catch (_) { /* silent – metrics are supplementary */ }
                finally { setMetricsLoading(false) }
            })()
    }, [data, videoId])

    useEffect(() => {
        if (!isAuthenticated || !videoId) return
            ; (async () => {
                setLoading(true)
                setError('')
                try {
                    const res = await fetchFullVideoDetails(videoId)
                    if (res?.success && res?.videoData) {
                        setData(res.videoData)
                        setSummary(res.videoData.summary ?? '')
                    } else {
                        setError(res?.message ?? 'Failed to load video details.')
                    }
                } catch (err) {
                    const msg = err?.response?.data?.message ?? err?.message ?? 'Something went wrong.'
                    setError(msg)
                    toast.error(msg)
                } finally {
                    setLoading(false)
                }
            })()
    }, [isAuthenticated, videoId])

    // generate summary 
    const handleGenerateSummary = async () => {
        setSummarizing(true)
        try {
            const res = await generateVideoSummary(videoId)
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

    // ── derived data 

    const sentimentData = data ? [
        { name: 'Positive', value: data.sentimentPositiveCount ?? 0, pct: data.sentimentPositivePercentage ?? 0 },
        { name: 'Negative', value: data.sentimentNegativeCount ?? 0, pct: data.sentimentNegativePercentage ?? 0 },
    ] : []

    const emotionData = data ? [
        { name: 'Joy', value: data.emotionJoyCount ?? 0, pct: data.emotionJoyPercentage ?? 0 },
        { name: 'Anger', value: data.emotionAngerCount ?? 0, pct: data.emotionAngerPercentage ?? 0 },
        { name: 'Sadness', value: data.emotionSadnessCount ?? 0, pct: data.emotionSadnessPercentage ?? 0 },
        { name: 'Fear', value: data.emotionFearCount ?? 0, pct: data.emotionFearPercentage ?? 0 },
        { name: 'Surprise', value: data.emotionSurpriseCount ?? 0, pct: data.emotionSurprisePercentage ?? 0 },
        { name: 'Disgust', value: data.emotionDisgustCount ?? 0, pct: data.emotionDisgustPercentage ?? 0 },
    ].filter(e => e.value > 0) : []

    // ── loading / error / auth-guard 

    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                <p className="text-slate-400 text-sm">Loading video details…</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <AlertCircle className="w-12 h-12 text-rose-400" />
                <p className="text-slate-300 font-medium">{error}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                >
                    Back to Dashboard
                </button>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm mb-8
          transition-colors duration-200 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Dashboard
            </motion.button>

            <VideoHero
                meta={data.videoMetaDataId ?? {}}
                totalComments={data.totalComments}
                videoId={videoId}
            />
            <SentimentStats data={data} />
            <SentimentCharts sentimentData={sentimentData} emotionData={emotionData} />
            <DominantCards data={data} />
            <AiSummary
                summary={summary}
                summarizing={summarizing}
                onGenerate={handleGenerateSummary}
            />
            <VideoMetrics metrics={metrics} metricsLoading={metricsLoading} />
        </div>
    )
}

export default VideoDetails
