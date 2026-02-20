import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, Wand2 } from 'lucide-react'

// Props:
//   summary         – string (empty = not generated yet)
//   summarizing     – bool
//   onGenerate      – () => void

const AiSummary = ({ summary, summarizing, onGenerate }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.35 }}
    className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20
      rounded-2xl p-6 sm:p-8 mt-8"
  >
    {/* header */}
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-200">AI Summary</h2>
      </div>
      {!summarizing && (
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium
            bg-cyan-500/10 border border-cyan-500/30 text-cyan-400
            hover:bg-cyan-500/20 transition-colors duration-200"
        >
          <Wand2 className="w-3.5 h-3.5" />
          {summary ? 'Regenerate' : 'Generate Summary'}
        </button>
      )}
    </div>

    {/* body */}
    <AnimatePresence mode="wait">
      {summarizing ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex items-center gap-3 py-6 text-slate-400"
        >
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400 shrink-0" />
          <span className="text-sm">Analysing statistics with Groq AI…</span>
        </motion.div>
      ) : summary ? (
        <motion.p
          key="summary"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="text-slate-300 leading-relaxed text-sm whitespace-pre-line"
        >
          {summary}
        </motion.p>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-8 text-center"
        >
          <div className="p-4 rounded-2xl bg-slate-700/30 border border-slate-600/30">
            <Sparkles className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-sm">No summary generated yet</p>
            <p className="text-slate-500 text-xs mt-1">
              Click below to let Groq AI summarise this video's statistics.
            </p>
          </div>
          <button
            onClick={onGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500
              text-white shadow-lg shadow-cyan-500/20 transition-all duration-200"
          >
            <Wand2 className="w-4 h-4" />
            Generate Summary
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

export default AiSummary
