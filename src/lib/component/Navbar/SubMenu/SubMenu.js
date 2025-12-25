"use client"

import Login from "./Login";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function UserProfile() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn || false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Load wishlist based on auth status
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        
        if (isLoggedIn) {
          // Load from server for logged-in users
          await loadServerWishlist();
        } else {
          // Load from localStorage for guest users
          loadLocalWishlist();
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadWishlist();
  }, [isLoggedIn]);

  const loadLocalWishlist = () => {
    const savedWishlist = localStorage.getItem('nextshop-wishlist');
    if (savedWishlist) {
      try {
        const productIds = JSON.parse(savedWishlist);
        // For demo, we'll just use IDs. In real app, you'd fetch product details
        setWishlistItems(productIds.map(id => ({ id, product: { id, name: `Product ${id}`, price: 0 } })));
      } catch (error) {
        console.error("Error parsing localStorage wishlist:", error);
        setWishlistItems([]);
      }
    } else {
      setWishlistItems([]);
    }
  };

  const loadServerWishlist = async () => {
    try {
      const response = await fetch('/api/product/wishList/getWishList');
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setWishlistItems(data.data || []);
        }
      }
    } catch (error) {
      console.error("Failed to load server wishlist:", error);
      setWishlistItems([]);
    }
  };

  // Toggle wishlist item (for guest users)
  const toggleWishlistItem = async (productId, productName) => {
    if (isLoggedIn) {
      // For logged-in users, use API
      // This would be handled in product detail page
      return;
    }
    
    // For guest users, use localStorage
    const savedWishlist = localStorage.getItem('nextshop-wishlist');
    let wishlistArray = [];
    
    if (savedWishlist) {
      try {
        wishlistArray = JSON.parse(savedWishlist);
      } catch (error) {
        wishlistArray = [];
      }
    }
    
    const isInWishlist = wishlistArray.includes(productId);
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlistArray.filter(id => id !== productId);
      localStorage.setItem('nextshop-wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist.map(id => ({ id, product: { id, name: `Product ${id}`, price: 0 } })));
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlistArray, productId];
      localStorage.setItem('nextshop-wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist.map(id => ({ id, product: { id, name: `Product ${id}`, price: 0 } })));
    }
  };

  // Sync localStorage wishlist to server when user logs in
  const syncWishlistToServer = async () => {
    const localWishlist = localStorage.getItem('nextshop-wishlist');
    if (!localWishlist) return;
    
    try {
      const productIds = JSON.parse(localWishlist);
      
      // Sync each product to server
      for (const productId of productIds) {
        await fetch(`/api/product/wishList/addWishList?id=${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Clear localStorage after successful sync
      localStorage.removeItem('nextshop-wishlist');
      // Reload server wishlist
      await loadServerWishlist();
    } catch (error) {
      console.error("Failed to sync wishlist:", error);
    }
  };

  // Auto-sync when user logs in
  useEffect(() => {
    if (isLoggedIn && !authLoading) {
      syncWishlistToServer();
    }
  }, [isLoggedIn, authLoading]);

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
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-2.5 hover:bg-gray-50 transition-colors">
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
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold" style={{ color: 'var(--primary-800)' }}>
                  <span className="text-lg">❤️</span>
                  My Wishlist
                </h3>
                <span className="text-sm font-normal px-2.5 py-0.5 rounded-full" style={{ 
                  backgroundColor: 'var(--secondary-100)', 
                  color: 'var(--secondary-700)' 
                }}>
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              {!isLoggedIn && wishlistItems.length > 0 && (
                <p className="mt-2 text-xs" style={{ color: 'var(--warning-600)' }}>
                  🔒 Saved locally - <span className="font-medium">Login to save permanently</span>
                </p>
              )}
            </div>
            
            <div className="p-3 overflow-y-auto max-h-96">
              {loading || authLoading ? (
                // Loading state
                <div className="py-8 text-center">
                  <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-400 rounded-full border-t-blue-600 animate-spin"></div>
                  <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                    Loading wishlist...
                  </p>
                </div>
              ) : wishlistItems.length === 0 ? (
                // Empty state
                <div className="py-8 text-center">
                  <div className="mb-4 text-4xl" style={{ color: 'var(--primary-300)' }}>❤️</div>
                  <p className="mb-4 text-sm" style={{ color: 'var(--primary-600)' }}>
                    {isLoggedIn ? 'Your wishlist is empty' : 'No items in wishlist'}
                  </p>
                  <Link 
                    href="/products"
                    className="inline-block px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:shadow-md"
                    style={{
                      background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                      color: 'white'
                    }}
                  >
                    ✨ Browse Products
                  </Link>
                  {!isLoggedIn && (
                    <p className="mt-4 text-xs" style={{ color: 'var(--primary-500)' }}>
                      Add items and they'll be saved locally
                    </p>
                  )}
                </div>
              ) : (
                // Wishlist items
                <>
                  {wishlistItems.slice(0, 3).map((item) => {
                    const product = item.product || {};
                    
                    return (
                      <li 
                        key={item.id || product.id}
                        className="flex items-center p-3 mb-2 transition-all duration-200 rounded-xl hover:shadow-md group" 
                        style={{ 
                          backgroundColor: 'var(--primary-25)',
                          border: '1px solid var(--primary-100)'
                        }}
                      >
                        <div className="flex items-center justify-center mr-3 overflow-hidden w-14 h-14 rounded-xl" style={{ 
                          background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))' 
                        }}>
                          {product.images?.[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-xl">📦</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {product.id ? (
                            <Link 
                              href={`/pages/product/detail/${product.id}`}
                              className="block mb-1 text-sm font-medium truncate transition-colors hover:text-blue-600" 
                              style={{ color: 'var(--primary-800)' }}
                              title={product.name}
                            >
                              {product.name || `Product ${product.id}`}
                            </Link>
                          ) : (
                            <p className="mb-1 text-sm font-medium truncate" style={{ color: 'var(--primary-800)' }}>
                              Product {item.id}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2">
                            {product.price ? (
                              <>
                                <span className="text-sm font-bold" style={{ color: 'var(--primary-900)' }}>
                                  {formatPrice(product.discountPercent ? 
                                    calculateDiscountedPrice(product.price, product.discountPercent) : 
                                    product.price
                                  )}
                                </span>
                                {product.discountPercent > 0 && (
                                  <>
                                    <span className="text-xs line-through" style={{ color: 'var(--primary-500)' }}>
                                      {formatPrice(product.price)}
                                    </span>
                                    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ 
                                      backgroundColor: 'var(--secondary-100)', 
                                      color: 'var(--secondary-700)' 
                                    }}>
                                      -{product.discountPercent}%
                                    </span>
                                  </>
                                )}
                              </>
                            ) : (
                              <span className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                Price not available
                              </span>
                            )}
                          </div>
                          
                          {product.inventory !== undefined && (
                            <div className="mt-1">
                              {product.inventory === 0 ? (
                                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                  Out of Stock
                                </span>
                              ) : product.inventory <= 5 ? (
                                <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                  Only {product.inventory} left
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                                  In Stock
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {product.id ? (
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
                        ) : (
                          <button
                            onClick={() => toggleWishlistItem(item.id, `Product ${item.id}`)}
                            className="btn btn-xs font-bold text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 opacity-0 group-hover:opacity-100" 
                            style={{
                              background: 'linear-gradient(to right, var(--error-500), var(--error-600))',
                              border: 'none',
                              minHeight: '1.5rem',
                              height: '1.5rem',
                              padding: '0 0.5rem'
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    );
                  })}
                  
                  {wishlistItems.length > 3 && (
                    <div className="py-2 text-sm text-center" style={{ color: 'var(--primary-600)' }}>
                      +{wishlistItems.length - 3} more items
                    </div>
                  )}
                  
                  {!isLoggedIn && wishlistItems.length > 0 && (
                    <div className="p-3 mt-3 rounded-lg" style={{ backgroundColor: 'var(--warning-50)' }}>
                      <p className="text-sm text-center" style={{ color: 'var(--warning-700)' }}>
                        <span className="font-medium">💡 Tip:</span> Login to sync your {wishlistItems.length} items to your account
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="p-4 border-t" style={{ borderColor: 'var(--primary-100)' }}>
              {wishlistItems.length > 0 ? (
                <Link 
                  href="/pages/wishlist"
                  className="block w-full py-2.5 text-center rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95" 
                  style={{
                    background: 'linear-gradient(to right, var(--primary-700), var(--primary-800))',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  View All Wishlist Items
                </Link>
              ) : !isLoggedIn ? (
                <div className="text-center">
                  <p className="mb-3 text-sm" style={{ color: 'var(--primary-600)' }}>
                    Add products to wishlist while browsing
                  </p>
                  <Link 
                    href="/login"
                    className="inline-block px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:shadow-md"
                    style={{
                      background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                      color: 'white'
                    }}
                  >
                    🔐 Login to Get Started
                  </Link>
                </div>
              ) : null}
            </div>
          </ul>
        </div>
      </div>

      {/* Shopping Cart - Hidden on Mobile */}
      <div className="hidden lg:block dropdown dropdown-end">
        <div className="relative">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-2.5 hover:bg-gray-50 transition-colors">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary-700)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-600)] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-[10px] text-white font-bold">0</span>
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
                <span className="font-medium" style={{ color: 'var(--primary-700)' }}>0 items in cart</span>
                <span className="text-lg font-bold" style={{ color: 'var(--primary-900)' }}>$0.00</span>
              </div>
              
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--primary-600)' }}>Subtotal</span>
                  <span style={{ color: 'var(--primary-700)' }}>$0.00</span>
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
      <Login/>
    </div>
  );
}