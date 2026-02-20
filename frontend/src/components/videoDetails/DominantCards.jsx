import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Heart } from 'lucide-react'
import { SENTIMENT_EMOJIS, EMOTION_EMOJIS } from './constants'
import { cap, formatNumber } from './helpers'

// Props: data (full analysis object)
const DominantCards = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
    className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10"
  >
    {/* Dominant Sentiment */}
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6
      border border-cyan-500/30 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-slate-300">Dominant Sentiment</h4>
        <TrendingUp className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500
          flex items-center justify-center shadow-lg shadow-cyan-500/30 text-2xl shrink-0">
          {SENTIMENT_EMOJIS[data.dominantSentimentLabel?.toUpperCase()] ?? '📊'}
        </div>
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500
            bg-clip-text text-transparent">
            {cap(data.dominantSentimentLabel)}
          </div>
          <div className="text-slate-400 text-sm mt-0.5">
            {formatNumber(data.dominantSentimentCount)} comments
          </div>
        </div>
      </div>
    </div>

    {/* Dominant Emotion */}
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6
      border border-purple-500/30 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-slate-300">Dominant Emotion</h4>
        <Heart className="w-5 h-5 text-purple-400" />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500
          flex items-center justify-center shadow-lg shadow-purple-500/30 text-2xl shrink-0">
          {EMOTION_EMOJIS[data.dominantEmotionLabel?.toLowerCase()] ?? '💡'}
        </div>
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500
            bg-clip-text text-transparent">
            {cap(data.dominantEmotionLabel)}
          </div>
          <div className="text-slate-400 text-sm mt-0.5">
            {formatNumber(data.dominantEmotionCount)} comments
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)

export default DominantCards
