import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Heart } from 'lucide-react'
import { SENTIMENT_COLORS, EMOTION_COLORS, EMOTION_EMOJIS } from './constants'
import { formatNumber } from './helpers'

// ─── shared tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-3 shadow-xl">
        <p className="text-slate-200 font-semibold">{payload[0].name}</p>
        <p className="text-cyan-400 text-sm">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

// ─── SentimentCharts ─────────────────────────────────────────────────────────
// Props:
//   sentimentData  – [{ name, value, pct }]
//   emotionData    – [{ name, value, pct }]

const SentimentCharts = ({ sentimentData, emotionData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

    {/* Sentiment bar chart */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-slate-200">Sentiment Distribution</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={sentimentData} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {sentimentData.map((entry) => (
              <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name.toUpperCase()] ?? '#60a5fa'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-around mt-4">
        {sentimentData.map((s) => (
          <div key={s.name} className="text-center">
            <div className="text-xs text-slate-500">{s.name}</div>
            <div className="font-bold text-slate-200 text-sm">{s.pct.toFixed(1)}%</div>
            <div className="text-xs text-slate-500">{formatNumber(s.value)} comments</div>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Emotion pie chart */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-slate-200">Emotion Breakdown</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={emotionData}
            cx="50%" cy="50%"
            outerRadius={85}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            dataKey="value"
          >
            {emotionData.map((_, i) => (
              <Cell key={i} fill={EMOTION_COLORS[i % EMOTION_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {emotionData.map((e, i) => (
          <div key={e.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: EMOTION_COLORS[i % EMOTION_COLORS.length] }} />
            <span className="text-slate-400 text-xs">
              {EMOTION_EMOJIS[e.name.toLowerCase()] ?? ''} {e.name}: {e.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
)

export default SentimentCharts
