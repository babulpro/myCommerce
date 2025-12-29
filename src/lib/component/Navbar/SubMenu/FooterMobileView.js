"use client"
import Link from "next/link";
import React from "react";
import { WishlistItemCount } from "./FooterMobileViewComponent/wishList";
import { CartItemCount } from "./FooterMobileViewComponent/cartItems";

export default function FooterMobileView(){
      
     
    return(
        <div>
             <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-2xl lg:hidden" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="flex items-center justify-around px-4 py-1">
            {/* Shop */}
            <Link href="/" className="flex flex-col items-center gap-1 p-1 transition-all duration-300 rounded-xl active:scale-95">
                <div className="flex items-center justify-center w-6 h-6 rounded-xl" style={{ backgroundColor: 'var(--primary-50)' }}>
                <span className="text-xl">🛍️</span>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--primary-700)' }}>Shop</span>
            </Link>

            {/* Wishlist - Replaced Categories here */}
            <Link href="/pages/wishlist" className="flex flex-col items-center gap-1 p-1 transition-all duration-300 rounded-xl active:scale-95">
                <div className="relative flex items-center justify-center w-6 h-6 rounded-xl" style={{ backgroundColor: 'var(--primary-50)' }}>
                <span className="text-xl">❤️</span>
                 <WishlistItemCount/>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--primary-700)' }}>Wishlist</span>
            </Link>

            {/* Cart */}
            <Link href="/pages/cart" className="flex flex-col items-center gap-1 p-1 transition-all duration-300 rounded-xl active:scale-95">
                <div className="relative flex items-center justify-center w-6 h-6 rounded-xl">
                <span className="text-xl">🛒</span>
                <CartItemCount/>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--primary-700)' }}>Cart</span>
            </Link>

            {/* Deals */}
            <Link href="/pages/deals" className="relative flex flex-col items-center gap-1 p-1 transition-all duration-300 rounded-xl active:scale-95">
                <div className="flex items-center justify-center w-6 h-6 rounded-xl" style={{ backgroundColor: 'var(--primary-50)' }}>
                <span className="text-xl">🔥</span>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--primary-700)' }}>Deals</span>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] rounded-full flex items-center justify-center animate-pulse">
                <span className="text-[8px] text-white font-bold">%</span>
                </div>
            </Link>
            </div>
        </div>
        </div>
    )
}