import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Github, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-cyan-500/20 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="inline-block mb-6"
                            >
                                <Sparkles className="w-6 h-6 text-cyan-400" />
                            </motion.div>
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Emotion Lens
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Analyze YouTube comments with AI-powered sentiment and emotion detection.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-slate-200 font-semibold">Quick Links</h3>
                        <div className="flex flex-col space-y-2">
                            <Link to="/" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                Home
                            </Link>
                            <Link to="/dashboard" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                Dashboard
                            </Link>
                            <Link to="/analysis" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                Analysis
                            </Link>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-slate-200 font-semibold">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="https://github.com/vishalprajapati15" className="text-slate-400 hover:text-cyan-400 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/vishalprajapati15/" className="text-slate-400 hover:text-cyan-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                    <p className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} Emotion Lens. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer