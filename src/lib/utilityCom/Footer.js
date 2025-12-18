'use client'
import React from 'react';
import Link from 'next/link'

const Footer = () => {
    return (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                🏠
                            </div>
                            <h4 className="font-bold text-2xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                HouseRent
                            </h4>
                        </div>
                        <p className="text-emerald-100/80 text-sm leading-relaxed">
                            Making renting and hosting simple, secure, and delightful for everyone. 
                            Find your perfect home today.
                        </p>
                        <div className="flex space-x-3 mt-4">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-400/30 cursor-pointer hover:bg-emerald-500/30 transition-all">
                                📘
                            </div>
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-400/30 cursor-pointer hover:bg-emerald-500/30 transition-all">
                                📷
                            </div>
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-400/30 cursor-pointer hover:bg-emerald-500/30 transition-all">
                                🐦
                            </div>
                        </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg text-white mb-4 flex items-center">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/footerLink/about" className="text-emerald-100/70 hover:text-emerald-300 transition-all duration-300 flex items-center group text-sm">
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/footerLink/contact" className="text-emerald-100/70 hover:text-emerald-300 transition-all duration-300 flex items-center group text-sm">
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/footerLink/privacy" className="text-emerald-100/70 hover:text-emerald-300 transition-all duration-300 flex items-center group text-sm">
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/footerLink/terms" className="text-emerald-100/70 hover:text-emerald-300 transition-all duration-300 flex items-center group text-sm">
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-lg text-white mb-4 flex items-center">
                            <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
                            Support
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/footerLink/help" className="text-emerald-100/70 hover:text-emerald-300 transition-all duration-300 flex items-center group text-sm">
                                    <span className="w-1 h-1 bg-teal-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/footerLink/safety" className="text-emerald-100/70 hover:text-emerald-300 transition-all duration-300 flex items-center group text-sm">
                                    <span className="w-1 h-1 bg-teal-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Safety
                                </Link>
                            </li>
                            <li>
                                <Link href="/footerLink/feedBack" className="text-emerald-100/70 hover:text-emerald-300 transition-all duration-300 flex items-center group text-sm">
                                    <span className="w-1 h-1 bg-teal-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Feedback
                                </Link>
                            </li>
                            <li>
                                <Link href="/footerLink/liveSupport" className="text-emerald-100/70 hover:text-emerald-300 transition-all duration-300 flex items-center group text-sm">
                                    <span className="w-1 h-1 bg-teal-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Live Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg text-white mb-4 flex items-center">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                            Contact Info
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center text-emerald-100/70 text-sm">
                                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 mr-3 border border-cyan-400/30">
                                    ✉️
                                </span>
                                <div>
                                    <p className="text-white font-medium">Email</p>
                                    <p>babul1946@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-center text-emerald-100/70 text-sm">
                                <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mr-3 border border-emerald-400/30">
                                    📞
                                </span>
                                <div>
                                    <p className="text-white font-medium">Phone</p>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center text-emerald-100/70 text-sm">
                                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mr-3 border border-purple-400/30">
                                    🕒
                                </span>
                                <div>
                                    <p className="text-white font-medium">Hours</p>
                                    <p>24/7 Support</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Section */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-emerald-100/60 text-sm">
                                &copy; 2024 HouseRent. All rights reserved. Crafted with ❤️ for better living.
                            </p>
                        </div>
                        <div className="flex items-center space-x-6 text-emerald-100/60">
                            <span className="text-xs bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                                🏠 Trusted Platform
                            </span>
                            <span className="text-xs bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30">
                                🔒 Secure & Safe
                            </span>
                            <span className="text-xs bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
                                ⭐ 5-Star Service
                            </span>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="flex justify-center space-x-4 mt-6 opacity-50">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

export default Footer;