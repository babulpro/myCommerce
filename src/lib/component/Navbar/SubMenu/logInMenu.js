"use client"
 import React from "react";
import Logout from "./LogOut";


export default function LogInMenu() {
    
  return (
    <div className="flex items-center gap-3">
      
      {/* Wishlist Icon - Hidden on Mobile */}
      <div className="hidden lg:block dropdown dropdown-end">
        <div className="relative">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-2.5">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary-700)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-[10px] text-white font-bold">3</span>
              </div>
            </div>
          </div>
          
          {/* Wishlist Dropdown */}
          <ul tabIndex={0} className="z-50 p-0 mt-3 bg-white border shadow-2xl dropdown-content w-80 rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="p-4 bg-gradient-to-r from-[var(--primary-50)] to-white border-b" style={{ borderColor: 'var(--primary-100)' }}>
              <h3 className="flex items-center gap-2 font-bold" style={{ color: 'var(--primary-800)' }}>
                <span className="text-lg">❤️</span>
                My Wishlist
                <span className="ml-auto text-sm font-normal px-2.5 py-0.5 rounded-full" style={{ 
                  backgroundColor: 'var(--secondary-100)', 
                  color: 'var(--secondary-700)' 
                }}>
                  3 items
                </span>
              </h3>
            </div>
            
            <div className="p-3 overflow-y-auto max-h-96">
              {/* Wishlist Item 1 */}
              <li className="flex items-center p-3 mb-2 transition-all duration-200 rounded-xl hover:shadow-md" style={{ 
                backgroundColor: 'var(--primary-25)',
                border: '1px solid var(--primary-100)'
              }}>
                <div className="flex items-center justify-center mr-3 w-14 h-14 rounded-xl" style={{ 
                  background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))' 
                }}>
                  <span className="text-xl">🎧</span>
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-800)' }}>Wireless Headphones</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: 'var(--primary-900)' }}>$129.99</span>
                    <span className="text-xs line-through" style={{ color: 'var(--primary-500)' }}>$199.99</span>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ 
                      backgroundColor: 'var(--secondary-100)', 
                      color: 'var(--secondary-700)' 
                    }}>
                      -35%
                    </span>
                  </div>
                </div>
                <button className="btn btn-xs font-bold text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5" style={{
                  background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                  border: 'none'
                }}>
                  🛒 Add
                </button>
              </li>
              
              {/* Wishlist Item 2 */}
              <li className="flex items-center p-3 transition-all duration-200 rounded-xl hover:shadow-md" style={{ 
                backgroundColor: 'var(--primary-25)',
                border: '1px solid var(--primary-100)'
              }}>
                <div className="flex items-center justify-center mr-3 w-14 h-14 rounded-xl" style={{ 
                  background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))' 
                }}>
                  <span className="text-xl">⌚</span>
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-800)' }}>Smart Watch Pro</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: 'var(--primary-900)' }}>$249.99</span>
                  </div>
                </div>
                <button className="btn btn-xs font-bold text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5" style={{
                  background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                  border: 'none'
                }}>
                  🛒 Add
                </button>
              </li>
            </div>
            
            <div className="p-4 border-t" style={{ borderColor: 'var(--primary-100)' }}>
              <button className="w-full py-2.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95" style={{
                background: 'linear-gradient(to right, var(--primary-700), var(--primary-800))',
                color: 'white',
                border: 'none'
              }}>
                View All Wishlist Items
              </button>
            </div>
          </ul>
        </div>
      </div>

      {/* Shopping Cart - Hidden on Mobile */}
      <div className="hidden lg:block dropdown dropdown-end">
        <div className="relative">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-2.5">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary-700)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-600)] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-[10px] text-white font-bold">8</span>
              </div>
            </div>
          </div>
          
          {/* Cart Dropdown */}
          <ul tabIndex={0} className="z-50 p-0 mt-3 bg-white border shadow-2xl dropdown-content w-72 rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="p-4 bg-gradient-to-r from-[var(--primary-50)] to-white border-b" style={{ borderColor: 'var(--primary-100)' }}>
              <h3 className="flex items-center gap-2 font-bold" style={{ color: 'var(--primary-800)' }}>
                <span className="text-lg">🛒</span>
                Shopping Cart
              </h3>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium" style={{ color: 'var(--primary-700)' }}>8 items in cart</span>
                <span className="text-lg font-bold" style={{ color: 'var(--primary-900)' }}>$999.00</span>
              </div>
              
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--primary-600)' }}>Subtotal</span>
                  <span style={{ color: 'var(--primary-700)' }}>$899.10</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--primary-600)' }}>Shipping</span>
                  <span style={{ color: 'var(--primary-700)' }}>$9.90</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--primary-600)' }}>Tax</span>
                  <span style={{ color: 'var(--primary-700)' }}>$90.00</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full py-2.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95" style={{
                  background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                  color: 'white',
                  border: 'none'
                }}>
                  🛒 View Cart
                </button>
                <button className="w-full py-2.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 border" style={{
                  backgroundColor: 'white',
                  color: 'var(--accent-600)',
                  borderColor: 'var(--accent-400)'
                }}>
                  🔒 Checkout
                </button>
              </div>
            </div>
          </ul>
        </div>
      </div>

      {/* User Profile - Always Visible */}
     
      <Logout/>
    </div>
  );
}