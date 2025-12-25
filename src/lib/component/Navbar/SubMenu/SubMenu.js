"use client"

import Login from "./Login";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function UserProfile() {
  const [wishlistItems, setWishlistItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch wishlist data from API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/product/wishList/getWishList');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Wishlist API response:", data); // Debug log
        
        if (data.status === "success") {
          // Extract product items from the response
          const items = data.data || [];
          console.log("Wishlist items:", items); // Debug log
          setWishlistItems(items);
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);

  // Fetch cart data (you'll need to implement this endpoint)
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Replace with your actual cart API endpoint
        // const response = await fetch('/api/cart/getCart');
        // const data = await response.json();
        // if (data.status === "success") {
        //   setCartCount(data.data.items?.length || 0);
        //   setCartTotal(data.data.total || 0);
        // }
        
        // For now, using mock data
        setCartCount(0);
        setCartTotal(0);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartCount(0);
        setCartTotal(0);
      }
    };
    
    fetchCartData();
  }, []);

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discountPercent) => {
    if (!discountPercent) return price;
    return price - (price * discountPercent / 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex items-center gap-3">
      
      {/* Wishlist Icon - Hidden on Mobile */}
      <div className="hidden lg:block dropdown dropdown-end">
        <div className="relative">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-2.5 hover:bg-gray-100 transition-colors">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary-700)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[10px] text-white font-bold">{wishlistItems.length}</span>
                </div>
              )}
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
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </span>
              </h3>
            </div>
            
            <div className="p-3 overflow-y-auto max-h-96">
              {loading ? (
                // Loading state
                <div className="py-8 text-center">
                  <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-400 rounded-full border-t-blue-600 animate-spin"></div>
                  <p className="text-sm" style={{ color: 'var(--primary-600)' }}>Loading wishlist...</p>
                </div>
              ) : wishlistItems.length === 0 ? (
                // Empty state
                <div className="py-8 text-center">
                  <div className="mb-4 text-4xl" style={{ color: 'var(--primary-300)' }}>❤️</div>
                  <p className="mb-4 text-sm" style={{ color: 'var(--primary-600)' }}>Your wishlist is empty</p>
                  <Link 
                    href="/products"
                    className="inline-block px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:shadow-md"
                    style={{
                      background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                      color: 'white'
                    }}
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                // Wishlist items
                <>
                  {wishlistItems.map((item) => {
                    // Access the product data correctly
                    const product = item.product;
                    if (!product) {
                      console.warn("No product data found for item:", item);
                      return null;
                    }
                    
                    console.log("Processing product:", product); // Debug log
                    
                    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent || 0);
                    const isDiscounted = (product.discountPercent || 0) > 0;
                    const price = product.price || 0;
                    const discountPercent = product.discountPercent || 0;
                    
                    return (
                      <li 
                        key={item.id}
                        className="flex items-center p-3 mb-2 transition-all duration-200 rounded-xl hover:shadow-md group" 
                        style={{ 
                          backgroundColor: 'var(--primary-25)',
                          border: '1px solid var(--primary-100)'
                        }}
                      >
                        <div className="flex items-center justify-center mr-3 overflow-hidden w-14 h-14 rounded-xl" style={{ 
                          background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))' 
                        }}>
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name || 'Product'}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                              }}
                            />
                          ) : (
                            <span className="text-xl">📦</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/pages/product/detail/${product.id}`}
                            className="block mb-1 text-sm font-medium truncate transition-colors hover:text-blue-600" 
                            style={{ color: 'var(--primary-800)' }}
                            title={product.name || 'Product'}
                          >
                            {product.name || 'Unnamed Product'}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold" style={{ color: 'var(--primary-900)' }}>
                              {formatPrice(discountedPrice)}
                            </span>
                            {isDiscounted && price > 0 && (
                              <>
                                <span className="text-xs line-through" style={{ color: 'var(--primary-500)' }}>
                                  {formatPrice(price)}
                                </span>
                                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ 
                                  backgroundColor: 'var(--secondary-100)', 
                                  color: 'var(--secondary-700)' 
                                }}>
                                  -{Math.round(discountPercent)}%
                                </span>
                              </>
                            )}
                          </div>
                          <div className="mt-1">
                            {product.inventory === 0 ? (
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                Out of Stock
                              </span>
                            ) : product.inventory && product.inventory <= 5 ? (
                              <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                Only {product.inventory} left
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                                In Stock
                              </span>
                            )}
                          </div>
                        </div>
                        <Link 
                          href={`/pages/product/detail/${product.id}`}
                          className="btn btn-xs font-bold text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 opacity-0 group-hover:opacity-100" 
                          style={{
                            background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                            border: 'none',
                            minHeight: '1.5rem',
                            height: '1.5rem',
                            padding: '0 0.5rem'
                          }}
                        >
                          View
                        </Link>
                      </li>
                    );
                  })}
                </>
              )}
            </div>
            
            {wishlistItems.length > 0 && (
              <div className="p-4 border-t" style={{ borderColor: 'var(--primary-100)' }}>
                <Link 
                  href="/wishlist"
                  className="block w-full py-2.5 text-center rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95" 
                  style={{
                    background: 'linear-gradient(to right, var(--primary-700), var(--primary-800))',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  View All Wishlist Items
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>

      {/* Shopping Cart - Hidden on Mobile */}
      <div className="hidden lg:block dropdown dropdown-end">
        <div className="relative">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-2.5 hover:bg-gray-100 transition-colors">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary-700)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-600)] rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[10px] text-white font-bold">{cartCount}</span>
                </div>
              )}
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
                <span className="font-medium" style={{ color: 'var(--primary-700)' }}>
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
                </span>
                <span className="text-lg font-bold" style={{ color: 'var(--primary-900)' }}>
                  {formatPrice(cartTotal)}
                </span>
              </div>
              
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--primary-600)' }}>Subtotal</span>
                  <span style={{ color: 'var(--primary-700)' }}>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--primary-600)' }}>Shipping</span>
                  <span style={{ color: 'var(--primary-700)' }}>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link 
                  href="/cart"
                  className="block w-full py-2.5 text-center rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95" 
                  style={{
                    background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  🛒 View Cart
                </Link>
                <Link 
                  href="/checkout"
                  className="block w-full py-2.5 text-center rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 border" 
                  style={{
                    backgroundColor: 'white',
                    color: 'var(--accent-600)',
                    borderColor: 'var(--accent-400)'
                  }}
                >
                  🔒 Checkout
                </Link>
              </div>
            </div>
          </ul>
        </div>
      </div>

      {/* User Profile - Always Visible */}
      {/* <Login/> */}
    </div>
  );
}