"use client"
import React, { useEffect, useState } from "react";

export function CartItemCount() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/product/cart/getCart',{store:'no-store'});
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const data = await response.json();
      if (data.status === "success") {
        setCartItems(data.data.items || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    
       }, []);

  
 
  return (
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-600)] rounded-full flex items-center justify-center">
      <span className="text-[8px] text-white font-bold">
        {isLoading ?0: cartItems.length}
      </span>
    </div>
  );
}