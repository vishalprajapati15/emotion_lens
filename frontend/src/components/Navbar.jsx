import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    const { user, isAuthenticated, logout } = useAuth()

    const handleLogout = async () => {
        setDropdownOpen(false)
        await logout()
        navigate('/')
    }

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const userInitial = (user?.name || user?.email || 'U').trim().charAt(0).toUpperCase()

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Feature', path: '#features' },
        { name: 'Pricing', path: '#pricing' },
        { name: 'Contact Us', path: '/contact' }
    ]

    const toggleMenu = () => setIsOpen(!isOpen)

    const handleNavClick = (e, path) => {
        if (path.startsWith('#')) {
            e.preventDefault()
            if (location.pathname !== '/') {
                navigate(`/${path}`)
            } else {
                // If on home page, just scroll
                const element = document.querySelector(path)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }
        }
        setIsOpen(false)
    }

    useEffect(() => {
        if (location.hash && location.pathname === '/') {
            setTimeout(() => {
                const element = document.querySelector(location.hash)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }, 100) 
        }
    }, [location])

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-cyan-500/10 border-b border-cyan-500/20"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-8 h-8 text-cyan-400" />
                        </motion.div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Emotion Lens
                        </span>
                    </motion.div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <Link
                                    to={link.path}
                                    onClick={(e) => handleNavClick(e, link.path)}
                                    className="relative text-slate-200 font-medium text-lg group hover:text-cyan-300 transition-colors"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <motion.span
                                        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Auth Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="hidden md:block"
                    >
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setDropdownOpen(v => !v)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30 select-none cursor-pointer"
                                    title={user?.name || user?.email || 'User'}
                                >
                                    {userInitial}
                                </motion.button>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-xl shadow-cyan-500/10 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-slate-700">
                                                <p className="text-slate-200 font-semibold text-sm truncate">{user?.name || 'User'}</p>
                                                <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-pink-400 hover:bg-pink-500/10 transition-colors cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(34, 211, 238, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer"
                            >
                                Sign Up
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMenu}
                            className="text-slate-200 hover:text-cyan-400 transition-colors"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden bg-slate-800/95 border-t border-cyan-500/20"
            >
                <div className="px-4 py-4 space-y-3">
                    {navLinks.map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={link.path}
                                onClick={(e) => {
                                    handleNavClick(e, link.path);
                                    setIsOpen(false);
                                }}
                                className="block py-2 px-4 text-slate-200 hover:bg-slate-700/50 hover:text-cyan-300 rounded-lg transition-colors font-medium"
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                    {isAuthenticated ? (
                        <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-slate-900/40 border border-cyan-500/20">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30 select-none"
                                    title={user?.name || user?.email || 'User'}
                                >
                                    {userInitial}
                                </div>
                                <div className="text-slate-200 font-medium">
                                    {user?.name || user?.email || 'User'}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                navigate('/login')
                                setIsOpen(false)
                            }}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30"
                        >
                            Sign Up
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.nav>
    )
}

export default Navbar