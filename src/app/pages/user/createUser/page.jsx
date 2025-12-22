"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      
      const response = await fetch(`/api/user/createUser`,{
        method:"POST",
        headers:{
        "Content-type":"application/json"
        },
        body:JSON.stringify(formData)
    })

    if(!response.ok){
      alert("something went wrong")
    }

    const json = await response.json()
    if(json.status==="success"){
      alert("registration success")
      router.back()
      
       setFormData({
        name: '',
        email: '',
        password: ''
      })

    } 
       
      
    } catch (error) {
      setErrors({ submit: 'Failed to create account. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{
      background: 'linear-gradient(135deg, var(--primary-50), white)'
    }}>
      <div className="w-full max-w-xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Compact Form Card - Optimized for all screens */}
        <div className="overflow-hidden bg-white border shadow-xl rounded-2xl" style={{
          borderColor: 'var(--primary-100)'
        }}>
          {/* Header - More Compact */}
          <div className="p-5 bg-gradient-to-r from-[var(--primary-50)] to-white border-b" style={{
            borderColor: 'var(--primary-100)'
          }}>
            <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--primary-800)' }}>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{
                background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
                color: 'white'
              }}>
                <span className="text-lg">👤</span>
              </div>
              Create Account
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--primary-600)' }}>
              Join NextShop for premium shopping experience
            </p>
          </div>

          {/* Form - Reduced padding for compactness */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Name Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--primary-700)' }}>
                  <span className="text-base">👋</span>
                  Full Name
                </label>
                {errors.name && (
                  <span className="text-xs font-medium" style={{ color: 'var(--secondary-600)' }}>
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2.5 pl-10 border-2 rounded-xl transition-all duration-300 focus:outline-none ${errors.name ? 'border-[var(--secondary-400)]' : ''}`}
                  style={{ 
                    borderColor: errors.name ? 'var(--secondary-400)' : 'var(--primary-200)',
                    backgroundColor: 'var(--primary-25)',
                    color: 'var(--primary-800)'
                  }}
                />
                <div className="absolute text-base -translate-y-1/2 left-3 top-1/2">
                  👤
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--primary-700)' }}>
                  <span className="text-base">📧</span>
                  Email Address
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
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 pl-10 border-2 rounded-xl transition-all duration-300 focus:outline-none ${errors.email ? 'border-[var(--secondary-400)]' : ''}`}
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
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--primary-700)' }}>
                  <span className="text-base">🔒</span>
                  Password
                </label>
                {errors.password && (
                  <span className="text-xs font-medium" style={{ color: 'var(--secondary-600)' }}>
                    {errors.password}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-2.5 pl-10 border-2 rounded-xl transition-all duration-300 focus:outline-none ${errors.password ? 'border-[var(--secondary-400)]' : ''}`}
                  style={{ 
                    borderColor: errors.password ? 'var(--secondary-400)' : 'var(--primary-200)',
                    backgroundColor: 'var(--primary-25)',
                    color: 'var(--primary-800)'
                  }}
                />
                <div className="absolute text-base -translate-y-1/2 left-3 top-1/2">
                  🔑
                </div>
              </div>
              {/* Password Strength Indicator - Simplified */}
              {formData.password && (
                <div className="mt-1.5">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          formData.password.length >= i * 3 
                            ? (formData.password.length >= 8 ? 'bg-green-400' : 'bg-yellow-400') 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs" style={{ color: 'var(--primary-500)' }}>
                    {formData.password.length < 6 ? 'Weak' : formData.password.length < 10 ? 'Good' : 'Strong'} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--primary-700)' }}>
                  <span className="text-base">✓</span>
                  Confirm Password
                </label>
                {errors.confirmPassword && (
                  <span className="text-xs font-medium" style={{ color: 'var(--secondary-600)' }}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-2.5 pl-10 border-2 rounded-xl transition-all duration-300 focus:outline-none ${errors.confirmPassword ? 'border-[var(--secondary-400)]' : ''}`}
                  style={{ 
                    borderColor: errors.confirmPassword ? 'var(--secondary-400)' : 'var(--primary-200)',
                    backgroundColor: 'var(--primary-25)',
                    color: 'var(--primary-800)'
                  }}
                />
                <div className="absolute text-base -translate-y-1/2 left-3 top-1/2">
                  🔒
                </div>
              </div>
            </div>

            {/* Terms & Conditions - Compact */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-0.5 transition-all duration-300 rounded"
                style={{ 
                  accentColor: 'var(--accent-500)',
                  backgroundColor: 'var(--primary-100)'
                }}
              />
              <label htmlFor="terms" className="text-xs" style={{ color: 'var(--primary-600)' }}>
                I agree to the{' '}
                <a href="#" className="font-bold hover:underline" style={{ color: 'var(--accent-600)' }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-bold hover:underline" style={{ color: 'var(--accent-600)' }}>
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-2.5 rounded-xl" style={{
                backgroundColor: 'var(--secondary-50)',
                border: '1px solid var(--secondary-200)'
              }}>
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span className="text-xs font-medium" style={{ color: 'var(--secondary-700)' }}>
                    {errors.submit}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button - Compact */}
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
                  <span className="text-sm">Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base">✨</span>
                  <span className="text-sm">Create Premium Account</span>
                </div>
              )}
            </button>

            {/* Divider - Compact */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--primary-100)' }}></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <Link href={`/pages/user/login`} className="px-3 bg-white" style={{ color: 'var(--primary-500)' }}>
                  Already have an account?
                </Link>
              </div>
            </div>

            {/* Sign In Link - Compact */}
            <div className="text-center">
              <Link  
                href="/pages/user/login"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl font-bold transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border"
                style={{
                  borderColor: 'var(--primary-300)',
                  color: 'var(--primary-700)',
                  backgroundColor: 'white'
                }}
              >
                <span>🔓</span>
                <span>Sign In Instead</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Benefits - More Compact */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            { icon: '🚀', text: 'Fast Shipping' },
            { icon: '🔒', text: 'Secure Checkout' },
            { icon: '💎', text: 'Premium Quality' },
            { icon: '🎁', text: 'Member Rewards' }
          ].map((benefit, index) => (
            <div 
              key={index}
              className="p-2.5 text-center transition-all duration-300 rounded-xl hover:scale-105"
              style={{
                backgroundColor: 'var(--primary-25)',
                border: '1px solid var(--primary-100)'
              }}
            >
              <div className="mb-0.5 text-xl">{benefit.icon}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--primary-700)' }}>
                {benefit.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}