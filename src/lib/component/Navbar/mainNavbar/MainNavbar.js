"use client"

import Link from 'next/link' 
import { useEffect, useState } from 'react'

export default function MainNavbar() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        // Fixed: Properly combined fetch options
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
  }, []) // Removed 'data' from dependencies to prevent infinite loop

  // Optional: Add a separate effect for debugging
  useEffect(() => {
    console.log('Categories data:', data)
  }, [data])

  return (
    <div className="w-full">
      <div className="fixed top-0 z-50 bg-white border-b border-gray-200 shadow-md navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="text-gray-600 btn btn-ghost lg:hidden hover:text-slate-600 hover:bg-slate-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="z-50 w-56 p-3 mt-3 bg-white border border-gray-100 shadow-xl menu menu-sm dropdown-content rounded-box">
              <li><Link href={`/`} className="py-2 font-medium text-gray-800 hover:text-slate-600 hover:bg-slate-50">Products</Link></li>
              <li>
                <details>
                  <summary className="py-2 font-medium text-gray-800 hover:text-slate-600">Categories</summary>
                  <ul className="bg-white border-t border-gray-100">
                    {loading ? (
                      <li><span className="py-2 text-gray-600">Loading...</span></li>
                    ) : data.length > 0 ? (
                      data.map((value, index) => (
                        <li key={index}>
                          <Link 
                            href={`/pages/categoryPage/${value.name}?id=${value.id}`}
                            className="w-full py-2 text-gray-600 hover:text-slate-600 hover:bg-slate-50"
                          >
                            {value.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li><span className="py-2 text-gray-600">No categories</span></li>
                    )}
                  </ul>
                </details>
              </li>
              <li><a className="py-2 font-medium text-gray-800 hover:text-slate-600 hover:bg-slate-50">Deals</a></li>
            </ul>
          </div>
          <Link href="/" className="px-4 py-3 text-3xl font-extrabold transition-colors duration-200 text-slate-500 hover:text-slate-600">
            NextShop
          </Link>
        </div>
        
        <div className="hidden navbar-center lg:flex">
          <ul className="gap-2 px-1 menu menu-horizontal">
            <li><Link href={`/`} className="px-4 py-2 font-medium text-gray-700 transition-all rounded-lg hover:text-slate-600 hover:bg-slate-50">Products</Link></li>
            <li>
              <details>
                <summary className="w-full px-4 py-2 font-medium text-gray-700 transition-all rounded-lg hover:text-slate-600">
                  Categories
                </summary>
                <ul className="bg-white border-t border-gray-100 p-2 min-w-40">
                  {loading ? (
                    <li><span className="py-2 text-gray-600">Loading...</span></li>
                  ) : data.length > 0 ? (
                    data.map((value, index) => (
                      <li key={index}>
                        <Link 
                          href={`/pages/categoryPage/${value.name}?id=${value.id}`}
                          className="w-full py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        >
                          {value.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li><span className="py-2 text-gray-600">No categories</span></li>
                  )}
                </ul>
              </details>
            </li>
            <li><a className="px-4 py-2 font-medium text-gray-700 transition-all rounded-lg hover:text-slate-600 hover:bg-slate-50">Deals</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}