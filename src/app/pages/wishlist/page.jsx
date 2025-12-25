"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wishlist data from API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/product/wishList/getWishList');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch wishlist: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === "success") {
          // Extract product items from the response - data.data contains the array
          const items = data.data || [];
          setWishlistItems(items);
        } 
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError(error.message);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discountPercent) => {
    if (!discountPercent) return price;
    return price - (price * discountPercent / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-400 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="text-gray-700">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <h1 className="mb-3 text-4xl font-bold text-center text-white">My Wishlist</h1>
          <p className="text-center text-white/90">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="max-w-2xl py-16 mx-auto text-center bg-white shadow-sm rounded-2xl">
            <div className="mb-6 text-gray-300 text-8xl">❤️</div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">Your wishlist is empty</h2>
            <p className="mb-8 text-lg text-gray-600">
              Start adding products you love to your wishlist!
            </p>
            <Link 
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              ✨ Browse Products
            </Link>
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
                      
                      {/* Discount Badge */}
                      {isDiscounted && (
                        <div className="absolute px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full top-3 left-3">
                          -{product.discountPercent}% OFF
                        </div>
                      )}
                      
                      {/* Stock Indicator */}
                      <div className="absolute bottom-3 left-3">
                        {product.inventory === 0 ? (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-gray-600 rounded-full">
                            Out of Stock
                          </span>
                        ) : product.inventory <= 5 ? (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full">
                            Only {product.inventory} left
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                            In Stock ({product.inventory})
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
                          {product.name}
                        </Link>
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        {isDiscounted ? (
                          <>
                            <span className="text-xl font-bold text-gray-900">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price}
                            </span>
                            <span className="ml-auto text-xs font-bold text-red-600">
                              Save {product.discountPercent}%
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      
                      {/* Additional Info */}
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
                      
                      {/* Added Date */}
                      <div className="mt-4 text-xs text-gray-500">
                        Added on: {new Date(item.createdAt).toLocaleDateString()}
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
                  <p className="mt-1 text-sm text-gray-600">Products saved</p>
                </div>
                
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">Total Value</h3>
                  <div className="text-3xl font-bold text-green-600">
                    ${wishlistItems.reduce((sum, item) => sum + (item.product?.price || 0), 0).toFixed(2)}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Current worth</p>
                </div>
                
                <div className="text-center md:text-right">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">On Sale</h3>
                  <div className="text-3xl font-bold text-red-600">
                    {wishlistItems.filter(item => item.product?.discountPercent > 0).length}
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
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Note */}
      <div className="py-6 mt-8 bg-gray-800">
        <div className="container px-4 mx-auto text-center">
          <p className="text-gray-300">
            ❤️ Your wishlist is automatically saved to your account
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Added on: {wishlistItems.length > 0 ? 
              new Date(Math.max(...wishlistItems.map(item => new Date(item.createdAt).getTime()))).toLocaleDateString() 
              : 'Never'}
          </p>
        </div>
      </div>
    </div>
  );
}