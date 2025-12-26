"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, Package, Truck, Shield, CreditCard, ArrowLeft, Loader2, Heart, Share2, ChevronRight } from "lucide-react";

export default function CartPage() {
    const router = useRouter();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingItems, setUpdatingItems] = useState({});
    const [removingItems, setRemovingItems] = useState({});

    // Fetch cart data
    const fetchCart = async () => {
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
        fetchCart();
    }, []);

    // Update quantity
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 99) return;
        
        setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));
        
        try {
            const response = await fetch(`/api/product/cart/updateCart?id=${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            
            const result = await response.json();
            
            if (result.status === "success") {
                await fetchCart(); // Refresh cart data
            } else {
                alert(result.msg || "Failed to update quantity");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update quantity");
        } finally {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    // Remove item from cart
    const removeItem = async (cartItemId) => {
        if (!confirm("Are you sure you want to remove this item from your cart?")) return;
        
        setRemovingItems(prev => ({ ...prev, [cartItemId]: true }));
        
        try {
            const response = await fetch(`/api/product/cart/deleteCart?id=${cartItemId}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (result.status === "success") {
                await fetchCart(); // Refresh cart data
            } else {
                alert(result.msg || "Failed to remove item");
            }
        } catch (error) {
            console.error("Remove error:", error);
            alert("Failed to remove item");
        } finally {
            setRemovingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    // Calculate totals
    const calculateTotals = () => {
        if (!cartData?.items?.length) return { subtotal: 0, discount: 0, total: 0, totalItems: 0 };
        
        let subtotal = 0;
        let totalItems = 0;
        let discount = 0;
        
        cartData.items.forEach(item => {
            const itemPrice = item.product.price;
            const itemDiscount = item.product.discountPercent || 0;
            const discountedPrice = itemPrice - (itemPrice * itemDiscount / 100);
            
            subtotal += discountedPrice * item.quantity;
            totalItems += item.quantity;
            discount += (itemPrice * itemDiscount / 100) * item.quantity;
        });
        
        const shipping = subtotal > 1000 ? 0 : 60; // Free shipping over 1000
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + shipping + tax;
        
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)),
            shipping: parseFloat(shipping.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            totalItems
        };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const totals = calculateTotals();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{
                background: "linear-gradient(to bottom, var(--primary-50), white)"
            }}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 border-4 rounded-full animate-spin" style={{
                        borderColor: "var(--primary-400)",
                        borderTopColor: "var(--accent-600)"
                    }}></div>
                    <p className="text-lg font-bold" style={{ color: "var(--primary-700)" }}>
                        Loading your cart...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{
                background: "linear-gradient(to bottom, var(--primary-50), white)"
            }}>
                <div className="max-w-md mx-4 text-center">
                    <div className="mb-6 text-7xl" style={{ color: "var(--primary-400)" }}>🛒</div>
                    <h2 className="mb-3 text-2xl font-bold" style={{ color: "var(--primary-800)" }}>
                        Unable to Load Cart
                    </h2>
                    <p className="mb-8" style={{ color: "var(--primary-600)" }}>
                        {error}
                    </p>
                    <button 
                        onClick={() => router.push("/")}
                        className="px-8 py-3 rounded-xl font-bold text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        style={{
                            background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                            boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                        }}
                    >
                        ← Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (!cartData?.items?.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{
                background: "linear-gradient(to bottom, var(--primary-50), white)"
            }}>
                <div className="max-w-md mx-4 text-center">
                    <div className="mb-6 text-7xl" style={{ color: "var(--primary-400)" }}>🛒</div>
                    <h2 className="mb-3 text-2xl font-bold" style={{ color: "var(--primary-800)" }}>
                        Your cart is empty
                    </h2>
                    <p className="mb-8" style={{ color: "var(--primary-600)" }}>
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <button 
                        onClick={() => router.push("/")}
                        className="px-8 py-3 rounded-xl font-bold text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        style={{
                            background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                            boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                        }}
                    >
                        ← Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{
            background: "linear-gradient(to bottom, var(--primary-25), white)"
        }}>
            {/* Header */}
            <div className="py-6" style={{ backgroundColor: "var(--primary-50)" }}>
                <div className="px-4 mx-auto sm:container">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => router.push("/")}
                                className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-primary-100"
                                style={{ color: "var(--primary-700)" }}
                            >
                                <ArrowLeft size={20} />
                                <span className="font-medium">Continue Shopping</span>
                            </button>
                        </div>
                        <h1 className="text-3xl font-bold text-center sm:text-left" style={{ color: "var(--primary-900)" }}>
                            Shopping Cart ({totals.totalItems} items)
                        </h1>
                        <div className="text-lg font-bold text-center sm:text-right" style={{ color: "var(--primary-700)" }}>
                            Total: {formatPrice(totals.total)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 mx-auto sm:py-8 sm:container">
                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Cart Items - 2/3 width */}
                    <div className="lg:col-span-2">
                        <div className="p-4 mb-6 rounded-xl" style={{
                            backgroundColor: "var(--accent-50)",
                            border: "1px solid var(--accent-200)"
                        }}>
                            <div className="flex items-center gap-3">
                                <Package className="w-6 h-6" style={{ color: "var(--accent-600)" }} />
                                <div>
                                    <h3 className="font-bold" style={{ color: "var(--accent-800)" }}>
                                        Free shipping on orders over {formatPrice(1000)}
                                    </h3>
                                    <p className="text-sm" style={{ color: "var(--accent-600)" }}>
                                        You're {formatPrice(1000 - totals.subtotal)} away from free shipping!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {cartData.items.map((item) => {
                                const itemPrice = item.product.price;
                                const itemDiscount = item.product.discountPercent || 0;
                                const discountedPrice = itemPrice - (itemPrice * itemDiscount / 100);
                                const itemTotal = discountedPrice * item.quantity;
                                
                                return (
                                    <div 
                                        key={item.id}
                                        className="p-4 transition-all duration-200 border-2 rounded-xl hover:shadow-lg"
                                        style={{
                                            backgroundColor: "white",
                                            borderColor: "var(--primary-200)"
                                        }}
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <div 
                                                    className="relative w-full h-40 overflow-hidden rounded-lg sm:w-32 sm:h-32"
                                                    style={{ backgroundColor: "var(--primary-50)" }}
                                                >
                                                    <img 
                                                        src={item.product.images?.[0]} 
                                                        alt={item.product.name}
                                                        className="object-contain w-full h-full p-2 cursor-pointer"
                                                        onClick={() => router.push(`/product/${item.product.id}`)}
                                                    />
                                                    {item.product.discountPercent > 0 && (
                                                        <div className="absolute px-2 py-1 text-xs font-bold text-white rounded top-2 left-2" style={{
                                                            background: "linear-gradient(to right, var(--secondary-500), var(--secondary-600))"
                                                        }}>
                                                            -{item.product.discountPercent}%
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <div className="flex flex-col justify-between h-full">
                                                    <div>
                                                        <div className="flex flex-col justify-between mb-2 sm:flex-row sm:items-start">
                                                            <div>
                                                                <h3 
                                                                    className="text-lg font-bold cursor-pointer hover:underline"
                                                                    style={{ color: "var(--primary-800)" }}
                                                                    onClick={() => router.push(`/product/${item.product.id}`)}
                                                                >
                                                                    {item.product.name}
                                                                </h3>
                                                                <p className="text-sm" style={{ color: "var(--primary-600)" }}>
                                                                    {item.product.brand}
                                                                </p>
                                                            </div>
                                                            <div className="mt-2 text-lg font-bold sm:mt-0" style={{ color: "var(--primary-900)" }}>
                                                                {formatPrice(itemTotal)}
                                                            </div>
                                                        </div>

                                                        {/* Variants */}
                                                        <div className="flex flex-wrap gap-4 mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium" style={{ color: "var(--primary-700)" }}>
                                                                    Size:
                                                                </span>
                                                                <span className="px-2 py-1 text-sm rounded" style={{
                                                                    backgroundColor: "var(--primary-100)",
                                                                    color: "var(--primary-700)"
                                                                }}>
                                                                    {item.size}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium" style={{ color: "var(--primary-700)" }}>
                                                                    Color:
                                                                </span>
                                                                <span 
                                                                    className="w-6 h-6 border rounded-full"
                                                                    style={{
                                                                        backgroundColor: item.color.toLowerCase(),
                                                                        borderColor: "var(--primary-300)"
                                                                    }}
                                                                    title={item.color}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Price per unit */}
                                                        <div className="mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-bold" style={{ color: "var(--accent-600)" }}>
                                                                    {formatPrice(discountedPrice)}
                                                                </span>
                                                                {itemDiscount > 0 && (
                                                                    <>
                                                                        <span className="text-sm line-through" style={{ color: "var(--primary-400)" }}>
                                                                            {formatPrice(itemPrice)}
                                                                        </span>
                                                                        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{
                                                                            backgroundColor: "var(--secondary-100)",
                                                                            color: "var(--secondary-700)"
                                                                        }}>
                                                                            Save {itemDiscount}%
                                                                        </span>
                                                                    </>
                                                                )}
                                                                <span className="text-sm" style={{ color: "var(--primary-500)" }}>
                                                                    per unit
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex flex-col justify-between gap-4 mt-4 sm:flex-row sm:items-center">
                                                        <div className="flex items-center gap-3">
                                                            {/* Quantity Control */}
                                                            <div className="flex items-center border rounded-lg" style={{ borderColor: "var(--primary-200)" }}>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1 || updatingItems[item.id]}
                                                                    className="px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    style={{ color: "var(--primary-600)" }}
                                                                >
                                                                    {updatingItems[item.id] ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <Minus size={16} />
                                                                    )}
                                                                </button>
                                                                <span className="px-4 font-bold" style={{ color: "var(--primary-800)" }}>
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    disabled={item.quantity >= item.product.inventory || updatingItems[item.id]}
                                                                    className="px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    style={{ color: "var(--primary-600)" }}
                                                                >
                                                                    {updatingItems[item.id] ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <Plus size={16} />
                                                                    )}
                                                                </button>
                                                            </div>
                                                            
                                                            {/* Stock info */}
                                                            <div className="text-sm" style={{ color: "var(--primary-600)" }}>
                                                                {item.product.inventory > 0 
                                                                    ? `${item.product.inventory} in stock`
                                                                    : "Out of stock"}
                                                            </div>
                                                        </div>

                                                        {/* Remove button */}
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                disabled={removingItems[item.id]}
                                                                className="flex items-center gap-2 px-4 py-2 font-medium transition-colors rounded-lg hover:bg-red-50"
                                                                style={{ color: "var(--neutral-600)" }}
                                                            >
                                                                {removingItems[item.id] ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 size={16} />
                                                                )}
                                                                Remove
                                                            </button>
                                                            <button
                                                                onClick={() => router.push(`/pages/product/detail/${item.product.id}`)}
                                                                className="px-4 py-2 font-medium transition-colors border rounded-lg hover:bg-primary-50"
                                                                style={{
                                                                    color: "var(--primary-700)",
                                                                    borderColor: "var(--primary-300)"
                                                                }}
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary - 1/3 width */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="p-6 rounded-xl" style={{
                                backgroundColor: "white",
                                border: "1px solid var(--primary-200)",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}>
                                <h2 className="mb-6 text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
                                    Order Summary
                                </h2>

                                {/* Price Breakdown */}
                                <div className="mb-6 space-y-3">
                                    <div className="flex justify-between">
                                        <span style={{ color: "var(--primary-600)" }}>Subtotal</span>
                                        <span className="font-medium" style={{ color: "var(--primary-800)" }}>
                                            {formatPrice(totals.subtotal)}
                                        </span>
                                    </div>
                                    
                                    {totals.discount > 0 && (
                                        <div className="flex justify-between">
                                            <span style={{ color: "var(--secondary-600)" }}>Discount</span>
                                            <span className="font-medium" style={{ color: "var(--secondary-600)" }}>
                                                -{formatPrice(totals.discount)}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between">
                                        <span style={{ color: "var(--primary-600)" }}>Shipping</span>
                                        <span className="font-medium" style={{ color: "var(--primary-800)" }}>
                                            {totals.shipping === 0 ? (
                                                <span style={{ color: "var(--accent-600)" }}>FREE</span>
                                            ) : (
                                                formatPrice(totals.shipping)
                                            )}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span style={{ color: "var(--primary-600)" }}>Tax (5%)</span>
                                        <span className="font-medium" style={{ color: "var(--primary-800)" }}>
                                            {formatPrice(totals.tax)}
                                        </span>
                                    </div>
                                    
                                    <div className="pt-3 border-t" style={{ borderColor: "var(--primary-200)" }}>
                                        <div className="flex justify-between text-lg font-bold">
                                            <span style={{ color: "var(--primary-900)" }}>Total</span>
                                            <span style={{ color: "var(--primary-900)" }}>
                                                {formatPrice(totals.total)}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm" style={{ color: "var(--primary-500)" }}>
                                            {totals.totalItems} items
                                        </p>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="w-full py-4 mb-4 font-bold text-white transition-all duration-300 rounded-xl hover:shadow-xl"
                                    style={{
                                        background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                                        boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                                    }}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <CreditCard size={20} />
                                        Proceed to Checkout
                                    </div>
                                </button>

                                {/* Trust Badges */}
                                <div className="pt-6 mt-6 border-t" style={{ borderColor: "var(--primary-200)" }}>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{
                                                backgroundColor: "var(--accent-100)",
                                                color: "var(--accent-600)"
                                            }}>
                                                <Truck size={16} />
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: "var(--primary-700)" }}>
                                                Free Shipping
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{
                                                backgroundColor: "var(--warning-100)",
                                                color: "var(--warning-600)"
                                            }}>
                                                <Shield size={16} />
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: "var(--primary-700)" }}>
                                                Secure Payment
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue Shopping */}
                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full py-3 mt-6 font-medium transition-colors border rounded-xl hover:bg-primary-50"
                                    style={{
                                        color: "var(--primary-700)",
                                        borderColor: "var(--primary-300)"
                                    }}
                                >
                                    Continue Shopping
                                </button>
                            </div>

                            {/* Promo Code Section (Optional) */}
                            <div className="p-6 mt-6 rounded-xl" style={{
                                backgroundColor: "var(--primary-50)",
                                border: "1px solid var(--primary-200)"
                            }}>
                                <h3 className="mb-3 font-bold" style={{ color: "var(--primary-800)" }}>
                                    Have a promo code?
                                </h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter promo code"
                                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "var(--primary-300)",
                                            backgroundColor: "white"
                                        }}
                                    />
                                    <button
                                        className="px-4 py-2 font-medium text-white rounded-lg"
                                        style={{
                                            backgroundColor: "var(--primary-700)"
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}