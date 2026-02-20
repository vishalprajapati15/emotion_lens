import React from 'react'
import { motion } from 'framer-motion'
import { Eye, ThumbsUp, MessageSquare, Calendar, Users, Youtube } from 'lucide-react'
import { formatNumber, formatDate } from './helpers'

//small badge used inside the hero grid 
const StatBadge = ({ icon: Icon, label, value, color = 'text-cyan-400' }) => (
  <div className="flex flex-col gap-1 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
    <div className={`flex items-center gap-2 text-xs ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
    <div className="text-slate-100 font-bold text-xl">{value}</div>
  </div>
)

//  VideoHero 
// Props: meta (videoMetaDataId object), totalComments (number), videoId (string)

const VideoHero = ({ meta = {}, totalComments, videoId }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20
      shadow-2xl shadow-cyan-500/10 overflow-hidden mb-8"
  >
    {meta.thumbnail && (
      <div className="relative w-full">
        <img
          src={meta.thumbnail}
          alt={meta.title}
          className="w-full object-cover max-h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
      </div>
    )}

    <div className="p-6 sm:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug mb-2">
        {meta.title ?? 'Untitled Video'}
      </h1>
      <p className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-6">
        <Users className="w-4 h-4" />
        {meta.channelName ?? '—'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBadge icon={Eye}           label="Views"     value={formatNumber(meta.views)}      color="text-cyan-400"   />
        <StatBadge icon={ThumbsUp}      label="Likes"     value={formatNumber(meta.likes)}      color="text-blue-400"   />
        <StatBadge icon={MessageSquare} label="Comments"  value={formatNumber(totalComments)}   color="text-purple-400" />
        <StatBadge icon={Calendar}      label="Published" value={formatDate(meta.publishedAt)}  color="text-slate-400"  />
      </div>

      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-5 text-xs text-slate-400
          hover:text-red-400 transition-colors duration-200"
      >
        <Youtube className="w-4 h-4" />
        Watch on YouTube
      </a>
    </div>
  </motion.div>
)

export default VideoHero
