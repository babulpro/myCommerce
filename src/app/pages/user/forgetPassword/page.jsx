"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful email send
      setIsSubmitted(true)
      
      // Start 30-second countdown for resend
      setCountdown(30)
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
    } catch (error) {
      setErrors({ submit: 'Failed to send reset email. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    if (countdown > 0) return
    
    setIsLoading(true)
    setErrors({})
    
    // Simulate resend
    setTimeout(() => {
      setIsLoading(false)
      setCountdown(30)
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{
      background: 'linear-gradient(135deg, var(--primary-50), white)'
    }}>
      <div className="w-full max-w-md px-4 mx-auto sm:px-6">
        {/* Success Message */}
        {isSubmitted && (
          <div className="p-4 mb-4 border rounded-2xl animate-fade-in" style={{
            backgroundColor: 'var(--accent-50)',
            borderColor: 'var(--accent-200)'
          }}>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full" style={{
                backgroundColor: 'var(--accent-100)',
                color: 'var(--accent-600)'
              }}>
                <span className="text-lg">📬</span>
              </div>
              <div className="flex-1">
                <div className="mb-1 font-bold" style={{ color: 'var(--primary-800)' }}>
                  Check Your Email!
                </div>
                <div className="mb-3 text-sm" style={{ color: 'var(--primary-600)' }}>
                  We've sent password reset instructions to:<br/>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--primary-500)' }}>
                  Didn't receive the email? Check spam folder or
                  <button
                    onClick={handleResend}
                    disabled={countdown > 0 || isLoading}
                    className="ml-1 font-bold transition-colors duration-200 disabled:opacity-50"
                    style={{ color: 'var(--accent-600)' }}
                  >
                    resend {countdown > 0 && `(${countdown}s)`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="overflow-hidden bg-white border shadow-xl rounded-2xl" style={{
          borderColor: 'var(--primary-100)'
        }}>
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[var(--primary-50)] to-white border-b" style={{
            borderColor: 'var(--primary-100)'
          }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{
                  background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
                  color: 'white'
                }}>
                  <span className="text-xl">🔑</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--primary-800)' }}>
                    Reset Password
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                    We'll send you a reset link
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                backgroundColor: 'var(--secondary-100)',
                color: 'var(--secondary-700)'
              }}>
                HELP
              </div>
            </div>
          </div>

          {/* Instructions */}
          {!isSubmitted && (
            <div className="p-5 border-b" style={{ borderColor: 'var(--primary-100)' }}>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg" style={{
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-600)'
                }}>
                  <span className="text-base">💡</span>
                </div>
                <div>
                  <div className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-800)' }}>
                    How it works
                  </div>
                  <ul className="space-y-1 text-xs" style={{ color: 'var(--primary-600)' }}>
                    <li className="flex items-center gap-1.5">
                      <span>1.</span>
                      <span>Enter your account email address</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span>2.</span>
                      <span>Check your email for reset link</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span>3.</span>
                      <span>Follow instructions to set new password</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {!isSubmitted && (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Email Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--primary-700)' }}>
                    <span className="text-base">📧</span>
                    Your Email Address
                  </label>
                  {errors.email && (
                    <span className="text-xs font-medium" style={{ color: 'var(--secondary-600)' }}>
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your account email"
                    className={`w-full px-4 py-2.5 pl-10 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-[var(--accent-400)] focus:ring-2 focus:ring-[var(--accent-100)] ${errors.email ? 'border-[var(--secondary-400)]' : ''}`}
                    style={{ 
                      borderColor: errors.email ? 'var(--secondary-400)' : 'var(--primary-200)',
                      backgroundColor: 'var(--primary-25)',
                      color: 'var(--primary-800)'
                    }}
                  />
                  <div className="absolute text-base -translate-y-1/2 left-3 top-1/2">
                    @
                  </div>
                </div>
                <div className="mt-1.5 text-xs" style={{ color: 'var(--primary-500)' }}>
                  Enter the email associated with your NextShop account
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-2.5 rounded-xl" style={{
                  backgroundColor: 'var(--secondary-50)',
                  border: '1px solid var(--secondary-200)'
                }}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--secondary-700)' }}>
                      {errors.submit}
                    </span>
                  </div>
                </div>
              )}

              {/* Send Reset Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
                  color: 'white',
                  border: 'none'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    <span className="text-sm">Sending reset link...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-base">📤</span>
                    <span className="text-sm">Send Reset Link</span>
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Bottom Links */}
          <div className="p-5 border-t" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-sm" style={{ color: 'var(--primary-600)' }}>
                  Remember your password?{' '}
                </span>
                <Link 
                  href="/login"
                  className="text-sm font-bold transition-colors duration-200 hover:text-[var(--accent-600)]"
                  style={{ color: 'var(--accent-500)' }}
                >
                  Back to login
                </Link>
              </div>
              
              {!isSubmitted && (
                <div className="pt-2 text-center">
                  <Link 
                    href="/signup"
                    className="text-sm font-bold transition-colors duration-200 hover:text-[var(--accent-600)]"
                    style={{ color: 'var(--primary-600)' }}
                  >
                    Need an account? <span style={{ color: 'var(--accent-500)' }}>Sign up here</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Tips */}
        {!isSubmitted && (
          <div className="mt-6">
            <div className="mb-3 text-center">
              <span className="text-xs font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--primary-600)' }}>
                Security Tips
              </span>
            </div>
            <div className="space-y-2">
              {[
                { icon: '🔒', text: 'Reset link expires in 1 hour for security' },
                { icon: '📱', text: 'Use a strong, unique password' },
                { icon: '👁️', text: 'Never share your reset link with anyone' }
              ].map((tip, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 transition-all duration-300 rounded-xl hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--primary-25)',
                    border: '1px solid var(--primary-100)'
                  }}
                >
                  <div className="text-lg">{tip.icon}</div>
                  <div className="flex-1 text-xs font-medium" style={{ color: 'var(--primary-700)' }}>
                    {tip.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: 'var(--primary-500)' }}>
            Need help? Contact{' '}
            <Link href="/support" className="font-medium hover:underline" style={{ color: 'var(--accent-600)' }}>
              support@nextshop.com
            </Link>
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}