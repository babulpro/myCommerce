"use client"
 import React from "react";
import Logout from "./LogOut";
import Wishlist from "./wishList";


export default function LogInMenu() {
    
  return (
    <div className="flex items-center gap-3">
      
      {/* Wishlist Icon - Hidden on Mobile */}
      <Wishlist/>

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