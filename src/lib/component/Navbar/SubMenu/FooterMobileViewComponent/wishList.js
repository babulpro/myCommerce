"use client"
import React, { useEffect, useState } from "react";

export function WishlistItemCount() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/product/wishList/getWishList');
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      
      const data = await response.json();
      if (data.status === "success") {
        setWishlistItems(data.data || []);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    
    // Optional: Set up polling
    const interval = setInterval(fetchWishlist, 30000);
    
    // Optional: Listen for custom events
    const handleWishlistUpdate = () => fetchWishlist();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, []);

  if (wishlistItems.length === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] rounded-full flex items-center justify-center">
      <span className="text-[8px] text-white font-bold">
        {isLoading ? '...' : wishlistItems.length}
      </span>
    </div>
  );
}