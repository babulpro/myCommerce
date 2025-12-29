"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileCart() {
    const router = useRouter();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cart data
    const fetchCartData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/product/cart/getCart');
            const data = await response.json();
            
            if (data.status === "success") {
                setCartData(data.data);
            } else {
                setError("Failed to load cart");
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // Get total number of unique cart items
    const getUniqueItemCount = () => {
        if (!cartData?.items?.length) return 0;
        return cartData.items.length;
    };

    const itemCount = getUniqueItemCount();

    // Format price function
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: cartData?.items?.[0]?.product?.currency || 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Calculate total price for preview
    const calculateTotalPrice = () => {
        if (!cartData?.items?.length) return 0;
        
        return cartData.items.reduce((total, item) => {
            const itemPrice = item.product.price;
            const itemDiscount = item.product.discountPercent || 0;
            const discountedPrice = itemPrice - (itemPrice * itemDiscount / 100);
            return total + (discountedPrice * item.quantity);
        }, 0);
    };

    const totalPrice = calculateTotalPrice();

    // Handle click to navigate to cart page
    const handleCartClick = () => {
        router.push("/pages/cart");
    };

    if (loading) {
        return (
            <div 
                className="relative hidden p-2 transition-colors rounded-lg cursor-pointer lg:block hover:bg-primary-50"
                onClick={handleCartClick}
            >
                <ShoppingCart className="w-6 h-6" style={{ color: "var(--primary-600)" }} />
                <div className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-1 -right-1 animate-pulse" style={{
                    backgroundColor: "var(--primary-200)"
                }}></div>
            </div>
        );
    }

    return (
        <div className="relative hidden lg:block group">
            {/* Cart Icon with Badge */}
            <div 
                className="p-2 transition-colors rounded-lg cursor-pointer hover:bg-primary-50"
                onClick={handleCartClick}
            >
                <ShoppingCart className="w-6 h-6" style={{ color: "var(--primary-600)" }} />
                
                {/* Cart Item Count Badge */}
                {itemCount > 0 && (
                    <div className="absolute flex items-center justify-center h-5 px-1 text-xs font-bold text-white rounded-full -top-1 -right-1 min-w-5" style={{
                        backgroundColor: "var(--accent-600)"
                    }}>
                        {itemCount > 99 ? '99+' : itemCount}
                    </div>
                )}
            </div>

            {/* Cart Preview Dropdown */}
            <div className="absolute right-0 z-50 invisible transition-all duration-200 shadow-2xl opacity-0 top-full w-80 rounded-xl group-hover:opacity-100 group-hover:visible" style={{
                backgroundColor: "white",
                border: "1px solid var(--primary-200)",
                transform: "translateY(10px)"
            }}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold" style={{ color: "var(--primary-900)" }}>
                            Shopping Cart
                        </h3>
                        <span className="px-2 py-1 text-sm font-medium rounded" style={{
                            backgroundColor: "var(--primary-100)",
                            color: "var(--primary-700)"
                        }}>
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    {/* Cart Items List */}
                    {cartData?.items?.length > 0 ? (
                        <>
                            <div className="pr-2 space-y-3 overflow-y-auto max-h-60">
                                {cartData.items.slice(0, 3).map((item) => {
                                    const itemPrice = item.product.price;
                                    const itemDiscount = item.product.discountPercent || 0;
                                    const discountedPrice = itemPrice - (itemPrice * itemDiscount / 100);
                                    
                                    return (
                                        <div key={item.id} className="flex gap-3 p-3 transition-colors rounded-lg hover:bg-primary-50">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg" style={{
                                                backgroundColor: "var(--primary-50)"
                                            }}>
                                                <img 
                                                    src={item.product.images?.[0]} 
                                                    alt={item.product.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold truncate" style={{ color: "var(--primary-800)" }}>
                                                    {item.product.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                                                        backgroundColor: "var(--primary-100)",
                                                        color: "var(--primary-600)"
                                                    }}>
                                                        {item.size}
                                                    </span>
                                                    <div 
                                                        className="w-3 h-3 border rounded-full"
                                                        style={{
                                                            backgroundColor: item.color.toLowerCase(),
                                                            borderColor: "var(--primary-300)"
                                                        }}
                                                        title={item.color}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm font-bold" style={{ color: "var(--accent-600)" }}>
                                                        {formatPrice(discountedPrice)}
                                                    </span>
                                                    <span className="text-sm" style={{ color: "var(--primary-600)" }}>
                                                        Qty: {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {/* Show "more items" indicator if there are more than 3 */}
                                {cartData.items.length > 3 && (
                                    <div className="py-2 text-sm text-center" style={{ color: "var(--primary-500)" }}>
                                        +{cartData.items.length - 3} more items
                                    </div>
                                )}
                            </div>

                            {/* Cart Summary */}
                            <div className="pt-4 mt-4 border-t" style={{ borderColor: "var(--primary-200)" }}>
                                <div className="flex items-center justify-between mb-3">
                                    <span style={{ color: "var(--primary-700)" }}>Subtotal:</span>
                                    <span className="font-bold" style={{ color: "var(--primary-900)" }}>
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={handleCartClick}
                                    className="w-full py-3 font-bold text-white transition-all duration-200 rounded-lg hover:shadow-lg"
                                    style={{
                                        background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                                        boxShadow: "0 2px 4px rgba(14, 165, 233, 0.2)"
                                    }}
                                >
                                    View Cart & Checkout
                                </button>
                                
                                <p className="mt-2 text-xs text-center" style={{ color: "var(--primary-500)" }}>
                                    Free shipping on orders over {formatPrice(1000)}
                                </p>
                            </div>
                        </>
                    ) : (
                        // Empty cart state
                        <div className="py-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{
                                backgroundColor: "var(--primary-100)",
                                color: "var(--primary-400)"
                            }}>
                                <ShoppingCart size={24} />
                            </div>
                            <p className="mb-4" style={{ color: "var(--primary-600)" }}>
                                Your cart is empty
                            </p>
                            <button 
                                onClick={() => router.push("/")}
                                className="px-4 py-2 font-medium transition-colors rounded-lg"
                                style={{
                                    backgroundColor: "var(--primary-100)",
                                    color: "var(--primary-700)"
                                }}
                            >
                                Start Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}