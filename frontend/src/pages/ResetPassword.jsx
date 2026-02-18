import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, Lock, Mail, Sparkles, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../services/apiClient'
import * as authService from '../services/authService'
import toast from 'react-hot-toast'

const ResetPassword = () => {
    const navigate = useNavigate()


    const [stage, setStage] = useState('request')       // stage: 'request' | 'reset' | 'done'
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [form, setForm] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    })

    const canSendOtp = useMemo(() => Boolean(form.email.trim()), [form.email])
    const canReset = useMemo(() => {
        if (!form.email.trim() || !form.otp.trim() || !form.newPassword) return false
        if (form.newPassword !== form.confirmPassword) return false
        return true
    }, [form])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSendOtp = async (e) => {
        e.preventDefault()
        if (!canSendOtp) return

        setIsLoading(true)
        try {
            const data = await authService.sendResetOtp({ email: form.email })
            if (!data?.success) throw new Error(data?.message || 'Failed to send OTP')
            toast.success('OTP sent! Please check your inbox.')
            setStage('reset')
        } catch (err) {
            toast.error(getApiErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!canReset) {
            return
        }

        setIsLoading(true)
        try {
            const data = await authService.resetPassword({
                email: form.email,
                otp: form.otp,
                newPassword: form.newPassword,
            })
            if (!data?.success) throw new Error(data?.message || 'Failed to reset password')
            toast.success('Password reset successful!')
            setStage('done')
        } catch (err) {
            toast.error(getApiErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="inline-block mb-4"
                        >
                            <Sparkles className="w-12 h-12 text-cyan-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                            Reset Password
                        </h2>
                        <p className="text-slate-400">
                            {stage === 'request'
                                ? 'Enter your email to receive an OTP.'
                                : stage === 'reset'
                                    ? 'Enter the OTP and your new password.'
                                    : 'All set!'}
                        </p>
                    </div>

                    {/* Forms */}
                    {stage !== 'done' ? (
                        <form onSubmit={stage === 'request' ? handleSendOtp : handleResetPassword} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        disabled={isLoading || stage === 'reset'}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-60"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <p className="text-slate-500 text-xs mt-2">We’ll send a 6-digit OTP to this email.</p>
                            </div>

                            {/* OTP + Password fields */}
                            <AnimatePresence>
                                {stage === 'reset' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="space-y-5"
                                    >
                                        {/* OTP */}
                                        <div>
                                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                                OTP
                                            </label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="otp"
                                                    value={form.otp}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    inputMode="numeric"
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-60"
                                                    placeholder="Enter 6-digit OTP"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="newPassword"
                                                    value={form.newPassword}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    className="w-full pl-11 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-60"
                                                    placeholder="Enter new password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(v => !v)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    value={form.confirmPassword}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    className="w-full pl-11 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-60"
                                                    placeholder="Re-enter new password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(v => !v)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                                                <p className="text-pink-400 text-xs mt-2">Passwords do not match.</p>
                                            )}
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStage('request')
                                                    setForm(prev => ({ ...prev, otp: '', newPassword: '', confirmPassword: '' }))
                                                    setError('')
                                                    setSuccess('')
                                                }}
                                                className="text-sm text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                                disabled={isLoading}
                                            >
                                                Change email
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                                disabled={isLoading || !canSendOtp}
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={isLoading || (stage === 'request' ? !canSendOtp : !canReset)}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {stage === 'request'
                                    ? (isLoading ? 'Sending OTP…' : 'Send OTP')
                                    : (isLoading ? 'Resetting…' : 'Reset Password')}
                            </motion.button>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer"
                            >
                                Go to Sign In
                            </motion.button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-slate-400">
                            Remembered your password?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ResetPassword