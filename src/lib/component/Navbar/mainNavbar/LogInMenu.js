"use client"

import Link from 'next/link' 
import { useEffect, useState } from 'react'
import LogInMenu from '../SubMenu/logInMenu'
import FooterMobileView from '../SubMenu/FooterMobileView'

export default function LogInMainMenu() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/category/getCategory', {
          method: "GET",
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        
        const result = await response.json()
        setData(result.data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen) {
        const mobileMenu = document.getElementById('mobile-menu')
        const mobileButton = document.getElementById('mobile-menu-button')
        
        if (mobileMenu && 
            !mobileMenu.contains(event.target) && 
            !mobileButton?.contains(event.target)) {
          setMobileMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen])

  return (
    <div className="w-full">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] text-white py-1.5 px-4 text-sm font-medium text-center">
        🚀 Free shipping on orders over $50 • 🔥 Holiday sale live now!
      </div>

      {/* Main Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 shadow-xl' : 'py-3 shadow-md'}`} 
        style={{
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'white',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid var(--primary-100)`
        }}>
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between">
            
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button 
                  id="mobile-menu-button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2.5 rounded-xl transition-all duration-300 hover:bg-[var(--primary-50)] hover:scale-105 active:scale-95"
                >
                  <div className="space-y-1.5">
                    <span className="block w-6 h-0.5 rounded-full" style={{ background: 'var(--primary-700)' }}></span>
                    <span className="block w-4 h-0.5 rounded-full" style={{ background: 'var(--primary-700)' }}></span>
                    <span className="block w-6 h-0.5 rounded-full" style={{ background: 'var(--primary-700)' }}></span>
                  </div>
                </button>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                  <div 
                    id="mobile-menu"
                    className="absolute z-50 w-64 mt-2 bg-white border shadow-2xl left-4 top-full rounded-2xl" 
                    style={{ borderColor: 'var(--primary-100)' }}
                  >
                    <div className="p-4">
                      <div className="space-y-2">
                        {/* Products */}
                        <Link 
                          href="/"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 transition-all duration-200 rounded-xl hover:shadow-md"
                          style={{ backgroundColor: 'var(--primary-25)' }}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                            <span className="text-lg">🛍️</span>
                          </div>
                          <span className="font-medium" style={{ color: 'var(--primary-800)' }}>Products</span>
                        </Link>

                        {/* Categories Section */}
                        <div>
                          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--primary-25)' }}>
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                              <span className="text-lg">📂</span>
                            </div>
                            <span className="font-medium" style={{ color: 'var(--primary-800)' }}>Categories</span>
                          </div>
                          
                          {/* Categories List */}
                          <div className="pl-4 mt-2 ml-4 space-y-2 border-l-2" style={{ borderColor: 'var(--primary-100)' }}>
                            {loading ? (
                              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-25)' }}>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{
                                    borderColor: 'var(--primary-200)',
                                    borderTopColor: 'var(--accent-500)'
                                  }}></div>
                                  <span className="text-sm" style={{ color: 'var(--primary-600)' }}>Loading...</span>
                                </div>
                              </div>
                            ) : data.length > 0 ? (
                              data.map((category, index) => (
                                <Link
                                  key={index}
                                  href={`/pages/categoryPage/${category.name}?id=${category.id}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center justify-between p-3 transition-all duration-200 rounded-lg hover:shadow-sm group"
                                  style={{ backgroundColor: 'var(--primary-25)' }}
                                >
                                  <span className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                    {category.name}
                                  </span>
                                  <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ color: 'var(--accent-500)' }}>
                                    →
                                  </span>
                                </Link>
                              ))
                            ) : (
                              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-25)' }}>
                                <span className="text-sm" style={{ color: 'var(--primary-600)' }}>No categories</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Deals */}
                        <Link 
                          href="/pages/deals"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 transition-all duration-200 rounded-xl hover:shadow-md"
                          style={{ backgroundColor: 'var(--primary-25)' }}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                            <span className="text-lg">🔥</span>
                          </div>
                          <span className="font-medium" style={{ color: 'var(--primary-800)' }}>Hot Deals</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-400)] to-[var(--accent-600)] rounded-xl blur-sm opacity-60"></div>
                  <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[var(--primary-700)] to-[var(--primary-900)] rounded-xl shadow-lg">
                    <span className="text-xl font-bold text-white">N</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight" style={{
                    background: 'linear-gradient(135deg, var(--primary-800), var(--primary-900))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    NextShop
                  </h1>
                  <p className="text-[10px] font-medium tracking-wider uppercase opacity-75" style={{ color: 'var(--primary-600)' }}>
                    Premium Shopping
                  </p>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation - FIXED WIDTH CONTAINER */}
            <div className="items-center justify-center flex-1 hidden lg:flex">
              <div className="flex items-center gap-1">
                <Link href="/" className="group relative px-5 py-2.5 rounded-xl transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-white group-hover:from-[var(--accent-50)] group-hover:to-white transition-all duration-300">
                      <span className="text-lg transition-transform duration-300 group-hover:scale-110">🛍️</span>
                    </div>
                    <span className="font-semibold transition-all duration-300 min-w-[80px] text-center" style={{ color: 'var(--primary-800)' }}>
                      Products
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-4/5 h-0.5 rounded-full bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] transition-all duration-300"></div>
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 hover:bg-[var(--primary-50)]">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-white group-hover:from-[var(--accent-50)] group-hover:to-white transition-all duration-300">
                      <span className="text-lg transition-transform duration-300 group-hover:scale-110">📂</span>
                    </div>
                    <span className="font-semibold transition-all duration-300 min-w-[90px] text-center" style={{ color: 'var(--primary-800)' }}>
                      Categories
                    </span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-600)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {/* Categories Dropdown */}
                  <div className="absolute left-0 invisible w-64 mt-2 transition-all duration-300 transform translate-y-2 opacity-0 top-full group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                    <div className="overflow-hidden bg-white border shadow-2xl rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                      <div className="p-3 overflow-y-auto max-h-96">
                        {loading ? (
                          <div className="p-4 text-center">
                            <div className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{
                              borderColor: 'var(--primary-200)',
                              borderTopColor: 'var(--accent-500)'
                            }}></div>
                          </div>
                        ) : data.length > 0 ? (
                          data.map((category, index) => (
                            <Link
                              key={index}
                              href={`/pages/categoryPage/${category.name}?id=${category.id}`}
                              className="flex items-center justify-between p-3 mb-2 transition-all duration-200 rounded-xl hover:shadow-md group/item last:mb-0"
                              style={{
                                backgroundColor: 'var(--primary-25)'
                              }}
                            >
                              <span className="font-medium transition-all duration-200 group-hover/item:font-semibold" style={{ color: 'var(--primary-700)' }}>
                                {category.name}
                              </span>
                              <span className="transition-opacity duration-300 opacity-0 group-hover/item:opacity-100" style={{ color: 'var(--accent-500)' }}>
                                →
                              </span>
                            </Link>
                          ))
                        ) : (
                          <div className="p-4 text-center" style={{ color: 'var(--primary-600)' }}>
                            <span className="block mb-2 text-2xl">📭</span>
                            No categories
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/pages/deals" className="group relative px-5 py-2.5 rounded-xl transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-white group-hover:from-[var(--secondary-50)] group-hover:to-white transition-all duration-300">
                      <span className="text-lg transition-transform duration-300 group-hover:scale-110">🔥</span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] rounded-full animate-ping opacity-75"></div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] rounded-full"></div>
                    </div>
                    <span className="font-semibold transition-all duration-300 min-w-[85px] text-center" style={{ color: 'var(--primary-800)' }}>
                      Hot Deals
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-4/5 h-0.5 rounded-full bg-gradient-to-r from-[var(--secondary-500)] to-[var(--secondary-600)] transition-all duration-300"></div>
                </Link>
              </div>
            </div>

            {/* Right: User Profile */}
            <div className="flex items-center gap-2">
              <LogInMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bottom Bar - Optimized (Removed Categories duplicate) */}
      <FooterMobileView/>
     
    </div>
  )
}