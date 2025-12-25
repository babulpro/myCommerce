"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setError(null);
        
        if (isLoggedIn) {
          // Load from server for logged-in users
          await loadServerWishlist();
        } else {
          // Load from localStorage for guest users
          await loadLocalWishlist();
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
        setError(error.message);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      loadWishlist();
    }
  }, [isLoggedIn, authLoading]);

  const loadLocalWishlist = async () => {
    const savedWishlist = localStorage.getItem('nextshop-wishlist');
    if (savedWishlist) {
      try {
        const productIds = JSON.parse(savedWishlist);
        // Fetch product details for each ID
        const items = await Promise.all(
          productIds.map(async (productId) => {
            try {
              const response = await fetch(`/api/product/getProduct?id=${productId}`);
              const data = await response.json();
              if (data.status === "success" && data.data) {
                return {
                  id: `local_${productId}`,
                  productId: productId,
                  product: data.data,
                  createdAt: new Date().toISOString(),
                  isLocal: true
                };
              }
              return null;
            } catch (error) {
              console.error(`Failed to fetch product ${productId}:`, error);
              return {
                id: `local_${productId}`,
                productId: productId,
                product: {
                  id: productId,
                  name: `Product ${productId}`,
                  price: 0
                },
                createdAt: new Date().toISOString(),
                isLocal: true
              };
            }
          })
        );
        setWishlistItems(items.filter(Boolean));
      } catch (error) {
        console.error("Error loading local wishlist:", error);
        setWishlistItems([]);
      }
    } else {
      setWishlistItems([]);
    }
  };

  const loadServerWishlist = async () => {
    try {
      const response = await fetch('/api/product/wishList/getWishList');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "success") {
        const items = data.data || [];
        setWishlistItems(items);
      } else {
        throw new Error(data.msg || "Failed to load wishlist");
      }
    } catch (error) {
      throw error;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (item) => {
    try {
      if (isLoggedIn) {
        // Remove from server
        const response = await fetch(`/api/product/wishList/DeleteWishList?id=${item.productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setWishlistItems(prev => prev.filter(i => i.id !== item.id));
        }
      } else {
        // Remove from localStorage
        const savedWishlist = localStorage.getItem('nextshop-wishlist');
        if (savedWishlist) {
          const productIds = JSON.parse(savedWishlist);
          const updatedIds = productIds.filter(id => id !== item.productId);
          localStorage.setItem('nextshop-wishlist', JSON.stringify(updatedIds));
          setWishlistItems(prev => prev.filter(i => i.id !== item.id));
        }
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      alert("Failed to remove item from wishlist. Please try again.");
    }
  };

  // Sync local wishlist to server
  const syncToServer = async () => {
    try {
      const localWishlist = localStorage.getItem('nextshop-wishlist');
      if (!localWishlist) return;
      
      const productIds = JSON.parse(localWishlist);
      
      // Add each product to server wishlist
      for (const productId of productIds) {
        await fetch(`/api/product/wishList/addWishList?id=${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Clear localStorage and reload server wishlist
      localStorage.removeItem('nextshop-wishlist');
      await loadServerWishlist();
      
      alert("✅ Wishlist synced to your account!");
    } catch (error) {
      console.error("Failed to sync wishlist:", error);
      alert("❌ Failed to sync wishlist. Please try again.");
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discountPercent) => {
    if (!discountPercent) return price;
    return price - (price * discountPercent / 100);
  };

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-400 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="text-gray-700">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error && wishlistItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-8 text-center bg-white rounded-lg shadow">
          <div className="mb-4 text-6xl">❌</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Unable to load wishlist</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalValue = wishlistItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0);
  }, 0);

  const onSaleCount = wishlistItems.filter(item => item.product?.discountPercent > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <h1 className="mb-3 text-4xl font-bold text-center text-white">My Wishlist</h1>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-center text-white/90">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
            {!isLoggedIn && wishlistItems.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-full bg-black/20">
                <span>💾</span>
                <span>Saved locally - </span>
                <Link href="/login" className="font-bold underline hover:no-underline">
                  Login to save permanently
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Sync Notification for Guest Users */}
        {!isLoggedIn && wishlistItems.length > 0 && (
          <div className="p-6 mb-8 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="p-3 text-2xl bg-yellow-100 rounded-full">💡</div>
                <div>
                  <h3 className="font-bold text-gray-800">Save your wishlist permanently!</h3>
                  <p className="text-sm text-gray-600">
                    You have {wishlistItems.length} items saved locally. 
                    Login to sync them to your account and access from any device.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 md:ml-auto">
                <Link
                  href="/login"
                  className="px-6 py-3 font-bold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg"
                >
                  🔐 Login Now
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your local wishlist?")) {
                      localStorage.removeItem('nextshop-wishlist');
                      setWishlistItems([]);
                    }
                  }}
                  className="px-6 py-3 font-bold text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50"
                >
                  🗑️ Clear Local
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="max-w-2xl py-16 mx-auto text-center bg-white shadow-sm rounded-2xl">
            <div className="mb-6 text-gray-300 text-8xl">❤️</div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              {isLoggedIn ? 'Your wishlist is empty' : 'No items in wishlist'}
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              {isLoggedIn 
                ? 'Start adding products you love to your wishlist!'
                : 'Browse products and add them to your wishlist - they will be saved locally'}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link 
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                ✨ Browse Products
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="px-8 py-4 font-bold text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50"
                >
                  🔐 Login to Get Started
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => {
                const product = item.product;
                if (!product) return null;
                
                const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
                const isDiscounted = product.discountPercent > 0;
                
                return (
                  <div 
                    key={item.id}
                    className="overflow-hidden transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md group"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100">
                      <Link href={`/pages/product/detail/${product.id}`} className="block h-full">
                        <img 
                          src={product.images?.[0] || "/api/placeholder/400/400"} 
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                      
                      {/* Local Storage Badge */}
                      {!isLoggedIn && item.isLocal && (
                        <div className="absolute px-3 py-1 text-xs font-bold text-white bg-gray-600 rounded-full top-3 left-3">
                          💾 Local
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {isDiscounted && (
                        <div className={`absolute px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full ${!isLoggedIn && item.isLocal ? 'top-10' : 'top-3'} left-3`}>
                          -{product.discountPercent}% OFF
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(item)}
                        className="absolute p-2 text-white transition-colors bg-red-500 rounded-full top-3 right-3 hover:bg-red-600"
                        title="Remove from wishlist"
                      >
                        ❌
                      </button>
                      
                      {/* Stock Indicator */}
                      <div className="absolute bottom-3 left-3">
                        {product.inventory === 0 ? (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-gray-600 rounded-full">
                            Out of Stock
                          </span>
                        ) : product.inventory && product.inventory <= 5 ? (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full">
                            Only {product.inventory} left
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                            In Stock
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      {/* Product Name */}
                      <h3 className="mb-2 font-semibold text-gray-800 line-clamp-1">
                        <Link 
                          href={`/pages/product/detail/${product.id}`}
                          className="transition-colors hover:text-blue-600"
                        >
                          {product.name || `Product ${product.id}`}
                        </Link>
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        {product.price > 0 ? (
                          isDiscounted ? (
                            <>
                              <span className="text-xl font-bold text-gray-900">
                                {formatPrice(discountedPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                              <span className="ml-auto text-xs font-bold text-red-600">
                                Save {product.discountPercent}%
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                          )
                        ) : (
                          <span className="text-sm text-gray-500">Price not available</span>
                        )}
                      </div>
                      
                      {/* Additional Info */}
                      {(product.brand || product.categoryId) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {product.brand && product.brand !== "Others" && (
                            <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
                              {product.brand}
                            </span>
                          )}
                          {product.categoryId && (
                            <span className="px-2 py-1 text-xs text-blue-600 rounded bg-blue-50">
                              Category
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Added Date & Status */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-xs text-gray-500">
                          Added: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        {!isLoggedIn && item.isLocal && (
                          <div className="text-xs text-gray-500">💾 Local</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="p-6 mt-12 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center md:text-left">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">Total Items</h3>
                  <div className="text-3xl font-bold text-blue-600">{wishlistItems.length}</div>
                  <p className="mt-1 text-sm text-gray-600">
                    {!isLoggedIn && wishlistItems.length > 0 ? "Saved locally" : "Products saved"}
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">Total Value</h3>
                  <div className="text-3xl font-bold text-green-600">
                    {formatPrice(totalValue)}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Current worth</p>
                </div>
                
                <div className="text-center md:text-right">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">On Sale</h3>
                  <div className="text-3xl font-bold text-red-600">
                    {onSaleCount}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Discounted items</p>
                </div>
              </div>
              
              <div className="flex flex-col justify-center gap-4 pt-6 mt-6 border-t border-gray-200 sm:flex-row">
                <Link 
                  href="/"
                  className="px-6 py-3 font-medium text-center text-gray-800 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  ← Continue Shopping
                </Link>
                <Link 
                  href="/pages/cart"
                  className="px-6 py-3 font-medium text-center text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md"
                >
                  View Cart →
                </Link>
                {!isLoggedIn && wishlistItems.length > 0 && (
                  <button
                    onClick={syncToServer}
                    className="px-6 py-3 font-medium text-center text-white transition-all rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-md"
                  >
                    🔄 Sync to Account
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Note */}
      <div className="py-6 mt-8 bg-gray-800">
        <div className="container px-4 mx-auto text-center">
          <p className="text-gray-300">
            {isLoggedIn 
              ? "❤️ Your wishlist is saved to your account"
              : "💾 Your wishlist is saved locally in your browser"}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {wishlistItems.length > 0 
              ? `Last updated: ${new Date().toLocaleDateString()}`
              : 'Start adding products to build your wishlist!'}
          </p>
          {!isLoggedIn && (
            <Link 
              href="/login" 
              className="inline-block mt-3 text-sm text-blue-300 underline hover:text-blue-200"
            >
              Login to save your wishlist permanently
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}