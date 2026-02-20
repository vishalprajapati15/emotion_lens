import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { formatNumber } from './helpers'

// Props: data (full analysis object)
const SentimentStats = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.15 }}
    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
  >
    {/* Total Comments */}
    <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 text-center">
      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
        {formatNumber(data.totalComments)}
      </div>
      <div className="text-slate-400 text-sm">Total Comments</div>
    </div>

    {/* Positive */}
    <div className="bg-slate-800/40 rounded-2xl p-6 border border-emerald-500/20 text-center">
      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
        {(data.sentimentPositivePercentage ?? 0).toFixed(1)}%
      </div>
      <div className="text-slate-400 text-sm mb-2">Positive Sentiment</div>
      <div className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
        <MessageSquare className="w-3 h-3" />
        {formatNumber(data.sentimentPositiveCount ?? 0)} comments
      </div>
    </div>

    {/* Negative */}
    <div className="bg-slate-800/40 rounded-2xl p-6 border border-rose-500/20 text-center">
      <div className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-1">
        {(data.sentimentNegativePercentage ?? 0).toFixed(1)}%
      </div>
      <div className="text-slate-400 text-sm mb-2">Negative Sentiment</div>
      <div className="inline-flex items-center gap-1.5 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full">
        <MessageSquare className="w-3 h-3" />
        {formatNumber(data.sentimentNegativeCount ?? 0)} comments
      </div>
    </div>
  </motion.div>
)

export default SentimentStats
