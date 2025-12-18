"use client"
 
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Register = () => {
    const initData = {
        name: "",
        email: "",
        password: ""
    }
    const [data, setData] = useState({...initData})
    const [isLoading, setIsLoading] = useState(false)

    const HandleChange = (name, value) => { 
        setData((prev) => ({...prev, [name]: value})) 
    }

    const HandleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const config = { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            };
            
            let response = await fetch("/api/User", config);
            let json = await response.json();
            
            if (json.status === "ok") {
                setData({...initData})
                toast.success('🎉 Registration Successful! Welcome to HouseRent!')
            } else {
                toast.error("❌ Email already registered. Please use a different email.")
            }
        }
        catch(error){
            console.log(error)
            toast.error("⚠️ Network error. Please try again.")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl w-full max-w-md">
                <form onSubmit={HandleRegistrationSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                            🏠
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Join HouseRent
                        </h1>
                        <p className="text-emerald-100/70 text-sm mt-2">
                            Create your account and find your perfect home
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400">
                                👤
                            </div>
                            <input 
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                                type="text" 
                                name='name' 
                                value={data.name} 
                                placeholder="Full Name" 
                                onChange={(e) => HandleChange(e.target.name, e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400">
                                ✉️
                            </div>
                            <input 
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                                type="email" 
                                name="email" 
                                value={data.email} 
                                placeholder="Email Address" 
                                onChange={(e) => HandleChange(e.target.name, e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400">
                                🔒
                            </div>
                            <input 
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                                type="password" 
                                value={data.password} 
                                placeholder="Password" 
                                name="password" 
                                onChange={(e) => HandleChange(e.target.name, e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-2xl disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Get Started</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </>
                        )}
                    </button>

                    {/* Additional Info */}
                    <div className="text-center">
                        <p className="text-emerald-100/60 text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                                Sign In
                            </a>
                        </p>
                    </div>

                    {/* Security Note */}
                    <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-3 text-center">
                        <p className="text-emerald-200/80 text-xs">
                            🔒 Your information is secure and encrypted
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;