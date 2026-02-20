import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from 'recharts'
import {
  Activity, TrendingUp, Shield, Target, Zap, Loader2,
} from 'lucide-react'
import { METRIC_COLORS } from './constants'

// ─── helpers local to metrics ─────────────────────────────────────────────────

const buildRadarData = (m) => [
  { metric: 'Satisfaction',   score: Number(((m.satisfactionScore + 100) / 2).toFixed(1)) },
  { metric: 'Net Sentiment',  score: Number(((m.netSentimentScore + 1) / 2 * 100).toFixed(1)) },
  { metric: 'Pos Ratio',      score: Number((Math.min(m.positiveRatio, 10) / 10 * 100).toFixed(1)) },
  { metric: 'Concentration',  score: Number((m.concentration * 100).toFixed(1)) },
  { metric: 'Neg Risk Index', score: Number((m.negativeRiskIndex * 100).toFixed(1)) },
]

const buildHistData = (m) => [
  { name: 'Satisfaction',  value: m.satisfactionScore,                              unit: 'pts' },
  { name: 'Net Sentiment', value: m.netSentimentScore,                              unit: ''    },
  { name: 'Pos Ratio',     value: m.positiveRatio,                                  unit: 'x'   },
  { name: 'Concentration', value: Number((m.concentration * 100).toFixed(1)),       unit: '%'   },
  { name: 'Neg Risk Index',value: m.negativeRiskIndex,                              unit: ''    },
]

const buildKpiCards = (m) => [
  {
    icon: TrendingUp,
    label: 'Satisfaction Score',
    display: `${m.satisfactionScore > 0 ? '+' : ''}${m.satisfactionScore}`,
    unit: 'pts',
    desc: 'Positive % − Negative %',
    grad:   m.satisfactionScore >= 0 ? 'from-emerald-400 to-teal-400'  : 'from-rose-400 to-pink-500',
    border: m.satisfactionScore >= 0 ? 'border-emerald-500/20'         : 'border-rose-500/20',
  },
  {
    icon: Activity,
    label: 'Net Sentiment',
    display: `${m.netSentimentScore > 0 ? '+' : ''}${m.netSentimentScore}`,
    unit: '',
    desc: '(Pos − Neg) / Total',
    grad:   m.netSentimentScore >= 0 ? 'from-cyan-400 to-blue-400'    : 'from-orange-400 to-rose-400',
    border: m.netSentimentScore >= 0 ? 'border-cyan-500/20'           : 'border-orange-500/20',
  },
  {
    icon: Zap,
    label: 'Positive Ratio',
    display: m.positiveRatio,
    unit: 'x',
    desc: 'Positive per 1 Negative',
    grad:   'from-yellow-400 to-amber-400',
    border: 'border-yellow-500/20',
  },
  {
    icon: Target,
    label: 'Emotion Concentration',
    display: `${(m.concentration * 100).toFixed(1)}`,
    unit: '%',
    desc: 'Dominant emotion share',
    grad:   'from-violet-400 to-purple-500',
    border: 'border-violet-500/20',
  },
  {
    icon: Shield,
    label: 'Negative Risk Index',
    display: m.negativeRiskIndex,
    unit: '',
    desc: 'Anger + Disgust weighted risk',
    grad:
      m.negativeRiskIndex < 0.3 ? 'from-emerald-400 to-green-500'
        : m.negativeRiskIndex < 0.6 ? 'from-amber-400 to-orange-500'
          : 'from-rose-400 to-red-500',
    border:
      m.negativeRiskIndex < 0.3 ? 'border-emerald-500/20'
        : m.negativeRiskIndex < 0.6 ? 'border-amber-500/20'
          : 'border-rose-500/20',
  },
]

const FORMULAS = [
  { color: '#22d3ee', label: 'Satisfaction Score',    formula: 'Positive% − Negative%',                            note: 'Range: −100 to +100.' },
  { color: '#a78bfa', label: 'Net Sentiment',         formula: '(Positive − Negative) ÷ Total',                   note: 'Normalised −1 to +1.' },
  { color: '#f59e0b', label: 'Positive Ratio',        formula: 'Positive ÷ Negative',                             note: 'Positive per 1 negative.' },
  { color: '#10b981', label: 'Emotion Concentration', formula: 'Dominant Emotion Count ÷ Total',                  note: '0 = spread · 1 = one emotion.' },
  { color: '#f472b6', label: 'Negative Risk Index',   formula: '(Negative% ÷ 100) × (Anger + Disgust) ÷ 100',   note: 'Low < 0.3 · Med < 0.6 · High ≥ 0.6' },
]

// ─── sub-tooltips ─────────────────────────────────────────────────────────────

const RadarTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-violet-500/30 rounded-lg p-3 shadow-xl">
      <p className="text-slate-200 font-semibold text-xs">{payload[0].payload.metric}</p>
      <p className="text-violet-400 text-sm font-bold">
        {payload[0].value}<span className="text-slate-400 text-xs"> / 100</span>
      </p>
    </div>
  )
}

const PieTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-3 shadow-xl">
      <p className="text-slate-200 text-xs font-semibold">{payload[0].name}</p>
      <p className="text-cyan-400 text-sm font-bold">
        {payload[0].value} <span className="text-slate-400 text-xs">/ 100</span>
      </p>
    </div>
  )
}

const HistTip = ({ active, payload, label, histData }) => {
  if (!active || !payload?.length) return null
  const entry = histData.find(d => d.name === label)
  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-amber-500/30 rounded-lg p-3 shadow-xl">
      <p className="text-slate-200 text-xs font-semibold">{label}</p>
      <p className="text-amber-400 text-sm font-bold">{payload[0].value}{entry?.unit}</p>
    </div>
  )
}

const PieInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return percent > 0.06 ? (
    <text x={x} y={y} fill="#f1f5f9" textAnchor="middle"
      dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null
}

// ─── VideoMetrics ─────────────────────────────────────────────────────────────
// Props:
//   metrics        – object from /api/youtube/video-metrics (or null)
//   metricsLoading – bool

const VideoMetrics = ({ metrics, metricsLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="mt-8"
    >
      {/* section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-violet-500/10">
          <Activity className="w-5 h-5 text-violet-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-200">Video Performance Metrics</h2>
      </div>

      {/* loading */}
      {metricsLoading && (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
          <span className="text-sm">Loading metrics…</span>
        </div>
      )}

      {/* no data */}
      {!metricsLoading && !metrics && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <Activity className="w-7 h-7 text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">Metrics unavailable for this video.</p>
        </div>
      )}

      {/* metrics content */}
      {!metricsLoading && metrics && (() => {
        const radarData = buildRadarData(metrics)
        const histData  = buildHistData(metrics)
        const kpiCards  = buildKpiCards(metrics)

        return (
          <>
            {/* ── KPI cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              {kpiCards.map(({ icon: Icon, label, display, unit, desc, grad, border }) => (
                <div key={label} className={`bg-slate-800/40 rounded-2xl p-4 border ${border} flex flex-col gap-2`}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-700/50">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-slate-400 text-xs leading-tight">{label}</span>
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${grad} bg-clip-text text-transparent`}>
                    {display}<span className="text-sm ml-0.5">{unit}</span>
                  </div>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              ))}
            </div>

            {/* ── Radar + formulas ── */}
            <div className="bg-slate-800/40 rounded-2xl p-6 border border-violet-500/20 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-slate-300">Normalised Performance Radar</h3>
                <span className="ml-auto text-xs text-slate-500">All values scaled 0 – 100</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Radar name="Score" dataKey="score"
                      stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.25} strokeWidth={2} />
                    <Tooltip content={<RadarTip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  </RadarChart>
                </ResponsiveContainer>

                <div className="flex flex-col gap-3">
                  {FORMULAS.map(({ color, label, formula, note }) => (
                    <div key={label} className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/40 flex gap-3">
                      <div className="w-1 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: color }} />
                      <div>
                        <p className="text-slate-200 text-xs font-semibold mb-0.5">{label}</p>
                        <p className="font-mono text-xs px-2 py-0.5 rounded-md inline-block mb-1"
                          style={{ backgroundColor: `${color}18`, color }}>
                          {formula}
                        </p>
                        <p className="text-slate-500 text-xs">{note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Pie + Histogram ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Score share pie */}
              <div className="bg-slate-800/40 rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-slate-300">Score Share Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={radarData} dataKey="score" nameKey="metric"
                      cx="50%" cy="50%" outerRadius={90}
                      labelLine={false} label={<PieInnerLabel />}>
                      {radarData.map((_, i) => (
                        <Cell key={i} fill={METRIC_COLORS[i % METRIC_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 gap-1.5 mt-2">
                  {radarData.map((d, i) => (
                    <div key={d.metric} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: METRIC_COLORS[i % METRIC_COLORS.length] }} />
                      <span className="text-slate-400 text-xs">{d.metric}</span>
                      <span className="ml-auto text-slate-300 text-xs font-medium">{d.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw values histogram */}
              <div className="bg-slate-800/40 rounded-2xl p-6 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-300">Raw Metric Values</h3>
                  <span className="ml-auto text-xs text-slate-500">Actual scores</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={histData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569"
                      tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569"
                      tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<HistTip histData={histData} />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}
                      label={({ x, y, width, value, index }) => (
                        <text x={x + width / 2} y={y - 6}
                          fill="#94a3b8" textAnchor="middle" fontSize={11} fontWeight={500}>
                          {value}{histData[index]?.unit}
                        </text>
                      )}>
                      {histData.map((_, i) => (
                        <Cell key={i} fill={METRIC_COLORS[i % METRIC_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1.5 mt-3">
                  {histData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: METRIC_COLORS[i % METRIC_COLORS.length] }} />
                      <span className="text-slate-400 text-xs">{d.name}</span>
                      <span className="ml-auto text-slate-300 text-xs font-medium">{d.value}{d.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )
      })()}
    </motion.div>
  )
}

export default VideoMetrics
