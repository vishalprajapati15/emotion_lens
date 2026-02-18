import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Brain, Smile, PieChart, Zap, Shield, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Feature = () => {

    const navigate = useNavigate();

    const features = [
        {
            icon: MessageSquare,
            title: "YouTube Comment Extraction",
            description: "Automatically fetch and analyze real-time YouTube comments from any public video.",
            gradient: "from-cyan-500 to-blue-500"
        },
        {
            icon: Brain,
            title: "AI Sentiment Analysis",
            description: "Powered by advanced AI models to classify comments as positive, negative, or neutral.",
            gradient: "from-blue-500 to-purple-500"
        },
        {
            icon: Smile,
            title: "Emotion Detection",
            description: "Detect emotions like joy, anger, sadness, and more from user comments.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: PieChart,
            title: "Visual Analytics Dashboard",
            description: "Interactive charts and insights to understand audience mood instantly.",
            gradient: "from-pink-500 to-rose-500"
        },
        {
            icon: Zap,
            title: "Fast Processing",
            description: "Get results within seconds using optimized AI pipelines.",
            gradient: "from-yellow-500 to-orange-500"
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your data is processed securely with no unnecessary storage.",
            gradient: "from-green-500 to-emerald-500"
        }
    ]

    const highlights = [
        { emoji: "🧠", text: "AI Sentiment Analysis" },
        { emoji: "😊", text: "Emotion Detection" },
        { emoji: "📊", text: "Visual Analytics Dashboard" },
        { emoji: "⚡", text: "Fast Processing" },
        { emoji: "🔐", text: "Secure & Private" }
    ]

    return (
        <div className="min-h-screen px-4 py-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                        Powerful Features
                    </h1>
                    <p className="text-xl text-slate-300 mb-8">
                        Everything you need to analyze YouTube comments with AI
                    </p>

                    {/* Highlight Tags */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {highlights.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-full"
                            >
                                <span className="text-2xl mr-2">{item.emoji}</span>
                                <span className="text-slate-300 text-sm font-medium">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="group"
                            >
                                <div className="h-full bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20">
                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 shadow-lg`}
                                    >
                                        <Icon className="w-full h-full text-white" />
                                    </motion.div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-200 mb-3 group-hover:text-cyan-400 transition-colors">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Decorative Bottom Line */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileHover={{ width: "100%" }}
                                        transition={{ duration: 0.3 }}
                                        className={`h-1 mt-6 rounded-full bg-gradient-to-r ${feature.gradient}`}
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-center mt-16"
                >
                    <p className="text-slate-400 mb-6">
                        Ready to unlock powerful insights from your YouTube comments?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all cursor-pointer duration-300"
                        onClick={()=>navigate('/analysis')}
                    >
                        Get Started Now
                    </motion.button>
                </motion.div>
            </div>
        </div>
    )
}

export default Feature