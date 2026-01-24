"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const [data, setData] = useState({email: "", password: ""})
    const [remember, setRemember] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const inputChange = (name, value) => {
        setData((pre) => ({
            ...pre,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault() // Prevent default form submission
        
        // Basic validation
        if (!data.email || !data.password) {
            alert("Please fill in both email and password")
            return
        }
        
        setIsLoading(true)
        
        try {
            const response = await fetch(`/api/user/loginUser`, {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Login failed")
            }

            const json = await response.json()
            if (json.status === "success") {
                alert("🎉 Login successful!")
                setData({email:"",password:""})
                // window.location.reload()
                if(json.user.role==="ADMIN"){

                    router.push("/admin/pages/order")
                }
                router.refresh()
                setTimeout(() => {
                    router.back()
                    
                }, 100);
               
            } else {
                alert(json.message || "Login failed")
            }
        }
        catch (error) {
            console.error("Login error:", error)
            alert(error.message || "Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }
    
     
    return (
        <div>
            <div className="flex justify-center w-full min-h-screen px-4 bg-white bg-primary-50">
                <div className="">
                    <div  className="z-50 p-0 mt-3 border shadow-2xl w-80 dropdown-content rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                        {/* Login Header */}
                        <div className="p-4 bg-gradient-to-r from-[var(--primary-50)] to-white border-b" style={{ borderColor: 'var(--primary-100)' }}>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ 
                                    backgroundColor: 'var(--accent-100)',
                                    color: 'var(--accent-600)'
                                }}>
                                    <span className="text-xl">🔐</span>
                                </div>
                                <div>
                                    <div className="font-bold" style={{ color: 'var(--primary-800)' }}>Welcome Back</div>
                                    <div className="text-sm" style={{ color: 'var(--primary-600)' }}>Sign in to your account</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Login Form */}
                        <form className="p-4 space-y-4" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div>
                                <label className="block mb-1.5 text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                    <div className="flex items-center gap-1.5">
                                        <span>📧</span>
                                        <span>Email Address</span>
                                    </div>
                                </label>
                                <input 
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => inputChange("email", e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-[var(--accent-400)] focus:ring-2 focus:ring-[var(--accent-100)]"
                                    style={{ 
                                        borderColor: 'var(--primary-200)',
                                        backgroundColor: 'var(--primary-25)',
                                        color: 'var(--primary-800)'
                                    }}
                                />
                            </div>
                            
                            {/* Password Input */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                        <div className="flex items-center gap-1.5">
                                            <span>🔒</span>
                                            <span>Password</span>
                                        </div>
                                    </label>
                                    <Link href={`/pages/user/forgetPassword`}
                                        className="text-xs font-medium transition-colors duration-200 hover:text-[var(--accent-600)]"
                                        style={{ color: 'var(--primary-500)' }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={(e) => inputChange("password", e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-[var(--accent-400)] focus:ring-2 focus:ring-[var(--accent-100)]"
                                    style={{ 
                                        borderColor: 'var(--primary-200)',
                                        backgroundColor: 'var(--primary-25)',
                                        color: 'var(--primary-800)'
                                    }}
                                />
                            </div>
                            
                            {/* Remember Me */}
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="remember"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 transition-all duration-300 rounded"
                                    style={{ 
                                        accentColor: 'var(--accent-500)',
                                        backgroundColor: 'var(--primary-100)'
                                    }}
                                />
                                <label 
                                    htmlFor="remember"
                                    className="text-sm"
                                    style={{ color: 'var(--primary-600)' }}
                                >
                                    Remember me for 30 days
                                </label>
                            </div>
                            
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>🚀</span>
                                        <span>Sign In</span>
                                    </div>
                                )}
                            </button>
                        </form>
                        
                        {/* Divider */}
                        <div className="relative px-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t" style={{ borderColor: 'var(--primary-100)' }}></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-white" style={{ color: 'var(--primary-500)' }}>
                                    New to NextShop?
                                </span>
                            </div>
                        </div>
                        
                        {/* Sign Up Link */}
                        <div className="p-4 border-t" style={{ borderColor: 'var(--primary-100)' }}>
                            <div className="text-center">
                                <span className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                    Don't have an account?{' '}
                                </span>
                                <Link 
                                    href={`/pages/user/createUser`}
                                    className="text-sm font-bold transition-colors duration-200 hover:text-[var(--accent-600)]"
                                    style={{ color: 'var(--accent-500)' }}
                                >
                                    Sign up now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}