"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    ShoppingCart, Trash2, Plus, Minus, Package, Truck, Shield, 
    CreditCard, ArrowLeft, Loader2, Heart, Share2, ChevronRight, 
    AlertCircle, CheckCircle, ShoppingBag, Rocket
} from "lucide-react";

export default function CartPage() {
    const router = useRouter();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingItems, setUpdatingItems] = useState({});
    const [removingItems, setRemovingItems] = useState({});
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderMessage, setOrderMessage] = useState(null);
    const [customerNote, setCustomerNote] = useState("");
    const [showNoteModal, setShowNoteModal] = useState(false);

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

    // Optimized: Update quantity without full refresh
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 99) return;
        
        // Update local state immediately for instant UI feedback
        setCartData(prev => {
            if (!prev?.items) return prev;
            
            return {
                ...prev,
                items: prev.items.map(item => 
                    item.id === cartItemId 
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            };
        });
        
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
            
            if (result.status !== "success") {
                // If API fails, revert to original data
                fetchCart(); // Refresh to get correct data
                alert(result.msg || "Failed to update quantity");
            }
        } catch (error) {
            console.error("Update error:", error);
            // Revert on error
            fetchCart();
            alert("Failed to update quantity");
        } finally {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    // Optimized: Remove item without full refresh
    const removeItem = async (cartItemId) => {
        if (!confirm("Are you sure you want to remove this item from your cart?")) return;
        
        // Save the original item for potential rollback
        const itemToRemove = cartData?.items?.find(item => item.id === cartItemId);
        
        // Remove from local state immediately
        setCartData(prev => {
            if (!prev?.items) return prev;
            
            return {
                ...prev,
                items: prev.items.filter(item => item.id !== cartItemId)
            };
        });
        
        setRemovingItems(prev => ({ ...prev, [cartItemId]: true }));
        
        try {
            const response = await fetch(`/api/product/cart/deleteCart?id=${cartItemId}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (result.status !== "success") {
                // If API fails, add the item back
                setCartData(prev => {
                    if (!prev?.items) return prev;
                    
                    return {
                        ...prev,
                        items: [...prev.items, itemToRemove].sort((a, b) => a.id - b.id)
                    };
                });
                alert(result.msg || "Failed to remove item");
            }
        } catch (error) {
            console.error("Remove error:", error);
            // Add item back on error
            setCartData(prev => {
                if (!prev?.items) return prev;
                
                return {
                    ...prev,
                    items: [...prev.items, itemToRemove].sort((a, b) => a.id - b.id)
                };
            });
            alert("Failed to remove item");
        } finally {
            setRemovingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    // Order All Items from Cart
    const handleOrderAll = async () => {
        if (!cartData?.items?.length) {
            setOrderMessage({ 
                type: "error", 
                text: "Your cart is empty" 
            });
            return;
        }

        setOrderLoading(true);
        setOrderMessage(null);

        try {
            const response = await fetch('/api/product/order/newOrder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerNote: customerNote.trim() || undefined
                })
            });

            const data = await response.json();

            if (data.status === "success") {
                setOrderMessage({ 
                    type: "success", 
                    text: "Order placed successfully!" 
                });
                
                // Clear cart from state
                setCartData(prev => ({
                    ...prev,
                    items: []
                }));
                
                // Hide note modal
                setShowNoteModal(false);
                setCustomerNote("");
                
                // Redirect to orders page after 2 seconds
                setTimeout(() => {
                    router.push("/orders");
                }, 2000);
            } else {
                setOrderMessage({ 
                    type: "error", 
                    text: data.msg || "Failed to place order" 
                });
            }
        } catch (err) {
            setOrderMessage({ 
                type: "error", 
                text: "Network error. Please try again." 
            });
            console.error("Order error:", err);
        } finally {
            setOrderLoading(false);
        }
    };

    // Check stock availability
    const checkStockAvailability = () => {
        if (!cartData?.items?.length) return { allAvailable: true, outOfStock: [] };
        
        const outOfStock = cartData.items.filter(item => 
            item.product.inventory < item.quantity
        );
        
        return {
            allAvailable: outOfStock.length === 0,
            outOfStock
        };
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
        
        const shipping = subtotal > 1000 ? 0 : 60;
        const tax = subtotal * 0.05;
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
    const stockCheck = checkStockAvailability();

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
            {/* Order Message */}
            {orderMessage && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg max-w-md w-full ${
                    orderMessage.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    <div className="flex items-center gap-3">
                        {orderMessage.type === 'success' ? (
                            <CheckCircle className="flex-shrink-0 text-green-600" size={20} />
                        ) : (
                            <AlertCircle className="flex-shrink-0 text-red-600" size={20} />
                        )}
                        <p>{orderMessage.text}</p>
                    </div>
                </div>
            )}

            {/* Customer Note Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded-xl">
                        <h3 className="mb-4 text-xl font-bold" style={{ color: "var(--primary-900)" }}>
                            Add Order Note
                        </h3>
                        <p className="mb-4 text-sm" style={{ color: "var(--primary-600)" }}>
                            Add special instructions for your order (optional)
                        </p>
                        <textarea
                            value={customerNote}
                            onChange={(e) => setCustomerNote(e.target.value)}
                            placeholder="e.g., Please deliver after 5 PM, special packaging, etc."
                            className="w-full p-3 mb-4 border rounded-lg resize-none"
                            style={{
                                borderColor: "var(--primary-200)",
                                minHeight: "100px"
                            }}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowNoteModal(false);
                                    setCustomerNote("");
                                }}
                                className="flex-1 py-2 font-medium transition-colors border rounded-lg hover:bg-primary-50"
                                style={{
                                    color: "var(--primary-700)",
                                    borderColor: "var(--primary-300)"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleOrderAll}
                                disabled={orderLoading}
                                className="flex-1 py-2 font-medium text-white transition-all rounded-lg"
                                style={{
                                    background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                                    opacity: orderLoading ? 0.7 : 1
                                }}
                            >
                                {orderLoading ? "Processing..." : "Place Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                {/* Out of Stock Warning */}
                {!stockCheck.allAvailable && (
                    <div className="p-4 mb-6 rounded-xl" style={{
                        backgroundColor: "var(--warning-50)",
                        border: "1px solid var(--warning-200)"
                    }}>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: "var(--warning-600)" }} />
                            <div>
                                <h3 className="font-bold" style={{ color: "var(--warning-800)" }}>
                                    Insufficient Stock
                                </h3>
                                <p className="mt-1 text-sm" style={{ color: "var(--warning-700)" }}>
                                    Some items don't have enough stock. Please adjust quantities:
                                </p>
                                <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--warning-600)" }}>
                                    {stockCheck.outOfStock.map(item => (
                                        <li key={item.id}>
                                            • {item.product.name}: Available {item.product.inventory}, Requested {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

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
                                        You're {formatPrice(Math.max(0, 1000 - totals.subtotal))} away from free shipping!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Order Button */}
                        <div className="p-4 mb-6 rounded-xl" style={{
                            backgroundColor: "white",
                            border: "2px solid var(--accent-200)",
                            boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.1)"
                        }}>
                            <div className="flex flex-col items-center gap-4 md:flex-row">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{
                                        backgroundColor: "var(--accent-100)"
                                    }}>
                                        <Rocket style={{ color: "var(--accent-600)" }} size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold" style={{ color: "var(--primary-900)" }}>
                                            Order All Items at Once
                                        </h3>
                                        <p className="text-sm" style={{ color: "var(--primary-600)" }}>
                                            Skip checkout and order directly
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowNoteModal(true)}
                                    disabled={orderLoading || !stockCheck.allAvailable}
                                    className="flex items-center gap-2 px-6 py-3 font-bold text-white transition-all duration-300 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                                    }}
                                >
                                    {orderLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag size={20} />
                                            Order All Items
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {cartData.items.map((item) => {
                                const itemPrice = item.product.price;
                                const itemDiscount = item.product.discountPercent || 0;
                                const discountedPrice = itemPrice - (itemPrice * itemDiscount / 100);
                                const itemTotal = discountedPrice * item.quantity;
                                const isOutOfStock = item.product.inventory < item.quantity;
                                
                                return (
                                    <div 
                                        key={item.id}
                                        className="p-4 transition-all duration-200 border-2 rounded-xl hover:shadow-lg"
                                        style={{
                                            backgroundColor: "white",
                                            borderColor: isOutOfStock ? "var(--warning-200)" : "var(--primary-200)"
                                        }}
                                    >
                                        {isOutOfStock && (
                                            <div className="p-2 mb-3 text-sm rounded-lg" style={{
                                                backgroundColor: "var(--warning-50)",
                                                color: "var(--warning-700)"
                                            }}>
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle size={16} />
                                                    <span>
                                                        Only {item.product.inventory} available, but you ordered {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
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
                                                                    onClick={() => router.push(`/pages/product/detail/${item.product.id}`)}
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
                                                            <div className={`text-sm ${isOutOfStock ? 'text-warning-600' : 'text-primary-600'}`}>
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

                                {/* Order All Button */}
                                <button
                                    onClick={() => setShowNoteModal(true)}
                                    disabled={orderLoading || !stockCheck.allAvailable}
                                    className="w-full py-3 mb-3 font-bold text-white transition-all duration-300 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        background: "linear-gradient(to right, var(--accent-500), var(--accent-600))"
                                    }}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <ShoppingBag size={20} />
                                        Order All Items
                                    </div>
                                </button>

                                {/* OR separator */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t" style={{ borderColor: "var(--primary-200)" }}></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white" style={{ color: "var(--primary-500)" }}>
                                            OR
                                        </span>
                                    </div>
                                </div>

                                {/* Regular Checkout Button */}
                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="w-full py-3 mb-4 font-bold text-white transition-all duration-300 rounded-lg hover:shadow-lg"
                                    style={{
                                        background: "linear-gradient(to right, var(--primary-500), var(--primary-600))"
                                    }}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <CreditCard size={20} />
                                        Proceed to Checkout
                                    </div>
                                </button>

                                {/* Quick Order Info */}
                                <div className="p-4 mb-4 rounded-lg" style={{
                                    backgroundColor: "var(--accent-50)",
                                    border: "1px solid var(--accent-200)"
                                }}>
                                    <div className="flex items-start gap-3">
                                        <Rocket className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent-600)" }} size={16} />
                                        <div>
                                            <h4 className="text-sm font-bold" style={{ color: "var(--accent-800)" }}>
                                                Order All Items
                                            </h4>
                                            <p className="text-xs mt-0.5" style={{ color: "var(--accent-600)" }}>
                                                Skip checkout. Use your default address. Fastest way to order.
                                            </p>
                                        </div>
                                    </div>
                                </div>

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
                                    className="w-full py-3 mt-6 font-medium transition-colors border rounded-lg hover:bg-primary-50"
                                    style={{
                                        color: "var(--primary-700)",
                                        borderColor: "var(--primary-300)"
                                    }}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}