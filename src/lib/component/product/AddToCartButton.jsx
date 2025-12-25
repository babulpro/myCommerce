"use client"
import { useState } from "react";

export default function AddToCartButton({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // Call your cart API
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          productName: product.name,
          price: product.price
        })
      });

      if (response.ok) {
        // Show success message
        alert(`${product.name} added to cart!`);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      alert('Failed to add item to cart');
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || product.inventory === 0}
      className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-white rounded-lg lg:rounded-xl hover:shadow-xl transition-all duration-300 font-bold transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-accent-500 to-accent-600 shadow-accent-200 hover:shadow-accent-400"
    >
      {isAdding ? '🔄 Adding...' : product.inventory === 0 ? '😔 Out of Stock' : '🛒 Add to Cart'}
    </button>
  );
}