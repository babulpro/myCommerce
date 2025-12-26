"use client"
import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

export default function Wishlist(){
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Fetch wishlist data
    useEffect(() => {
        const fetchWishlist = async () => {
            try { 
                setLoading(true);
                const response = await fetch('/api/product/wishList/getWishList');
                
                if (!response.ok) {
                    setWishlistItems([]);
                    return;
                }
                
                const data = await response.json();
                
                if (data.status === "success") {
                    const items = data.data || [];
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

    const handleMouseEnter = () => {
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = (e) => {
        // Check if mouse left both button and dropdown
        if (dropdownRef.current && 
            !dropdownRef.current.contains(e.relatedTarget) && 
            buttonRef.current && 
            !buttonRef.current.contains(e.relatedTarget)) {
            setIsDropdownOpen(false);
        }
    };

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
        <div className="relative hidden lg:block">
            {/* Wishlist Button */}
            <div 
                ref={buttonRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative p-2 transition-colors rounded-lg cursor-pointer hover:bg-primary-50"
            >
                <Heart className="w-6 h-6" style={{ color: "var(--primary-600)" }} />
                
                {/* Wishlist Item Count Badge */}
                {wishlistItems.length > 0 && (
                    <div className="absolute flex items-center justify-center h-5 px-1 text-xs font-bold text-white rounded-full -top-1 -right-1 min-w-5" style={{
                        backgroundColor: "var(--secondary-600)"
                    }}>
                        {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                    </div>
                )}
            </div>

            {/* Wishlist Dropdown */}
            {isDropdownOpen && (
                <div 
                    ref={dropdownRef}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={handleMouseLeave}
                    className="absolute right-0 z-50 duration-200 shadow-2xl top-full w-80 rounded-xl animate-in fade-in slide-in-from-top-2"
                    style={{
                        backgroundColor: "white",
                        border: "1px solid var(--primary-200)",
                        transform: "translateY(10px)"
                    }}
                >
                    <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="flex items-center gap-2 text-lg font-bold" style={{ color: "var(--primary-900)" }}>
                                <Heart size={18} style={{ color: "var(--secondary-600)" }} />
                                My Wishlist
                            </h3>
                            <span className="px-2 py-1 text-sm font-medium rounded" style={{
                                backgroundColor: "var(--secondary-100)",
                                color: "var(--secondary-700)"
                            }}>
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {/* Wishlist Items */}
                        <div className="pr-2 space-y-3 overflow-y-auto max-h-60">
                            {loading ? (
                                // Loading state
                                <div className="py-8 text-center">
                                    <div className="w-8 h-8 mx-auto mb-4 border-2 rounded-full animate-spin" style={{
                                        borderColor: "var(--primary-400)",
                                        borderTopColor: "var(--accent-600)"
                                    }}></div>
                                    <p className="text-sm" style={{ color: "var(--primary-600)" }}>
                                        Loading wishlist...
                                    </p>
                                </div>
                            ) : wishlistItems.length === 0 ? (
                                // Empty state
                                <div className="py-8 text-center">
                                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{
                                        backgroundColor: "var(--primary-100)",
                                        color: "var(--primary-400)"
                                    }}>
                                        <Heart size={24} />
                                    </div>
                                    <p className="mb-4 text-sm" style={{ color: "var(--primary-600)" }}>
                                        Your wishlist is empty
                                    </p>
                                    <Link 
                                        href="/products"
                                        className="inline-block px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:shadow-md"
                                        style={{
                                            backgroundColor: "var(--primary-100)",
                                            color: "var(--primary-700)"
                                        }}
                                    >
                                        Browse Products
                                    </Link>
                                </div>
                            ) : (
                                // Wishlist items
                                <>
                                    {wishlistItems.slice(0, 3).map((item) => {
                                        const product = item.product;
                                        if (!product) return null;
                                        
                                        const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
                                        const isDiscounted = product.discountPercent > 0;
                                        
                                        return (
                                            <div 
                                                key={item.id}
                                                className="flex gap-3 p-3 transition-colors rounded-lg hover:bg-primary-50 group"
                                            >
                                                {/* Product Image */}
                                                <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg" style={{
                                                    backgroundColor: "var(--primary-50)"
                                                }}>
                                                    {product.images?.[0] ? (
                                                        <img 
                                                            src={product.images[0]} 
                                                            alt={product.name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full" style={{ color: "var(--primary-400)" }}>
                                                            <Heart size={20} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <Link 
                                                        href={`/pages/product/detail/${product.id}`}
                                                        className="block text-sm font-semibold truncate hover:underline"
                                                        style={{ color: "var(--primary-800)" }}
                                                        title={product.name}
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    
                                                    {/* Price */}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm font-bold" style={{ color: "var(--accent-600)" }}>
                                                            {formatPrice(discountedPrice)}
                                                        </span>
                                                        {isDiscounted && (
                                                            <>
                                                                <span className="text-xs line-through" style={{ color: "var(--primary-400)" }}>
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{
                                                                    backgroundColor: "var(--secondary-100)",
                                                                    color: "var(--secondary-700)"
                                                                }}>
                                                                    -{product.discountPercent}%
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Stock Status */}
                                                    <div className="mt-2">
                                                        {product.inventory === 0 ? (
                                                            <span className="text-xs px-2 py-0.5 rounded" style={{
                                                                backgroundColor: "var(--neutral-100)",
                                                                color: "var(--neutral-600)"
                                                            }}>
                                                                Out of Stock
                                                            </span>
                                                        ) : product.inventory <= 5 ? (
                                                            <span className="text-xs px-2 py-0.5 rounded" style={{
                                                                backgroundColor: "var(--warning-100)",
                                                                color: "var(--warning-700)"
                                                            }}>
                                                                Only {product.inventory} left
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs px-2 py-0.5 rounded" style={{
                                                                backgroundColor: "var(--accent-100)",
                                                                color: "var(--accent-700)"
                                                            }}>
                                                                In Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* View Button */}
                                                <Link 
                                                    href={`/pages/product/detail/${product.id}`}
                                                    className="self-center transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                                >
                                                    <div className="flex items-center justify-center w-8 h-8 text-white transition-all duration-200 rounded-full hover:scale-110" style={{
                                                        backgroundColor: "var(--accent-600)"
                                                    }}>
                                                        →
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Show "more items" indicator */}
                                    {wishlistItems.length > 3 && (
                                        <div className="py-2 text-sm text-center" style={{ color: "var(--primary-500)" }}>
                                            +{wishlistItems.length - 3} more items
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer - View All Button */}
                        {wishlistItems.length > 0 && (
                            <div className="pt-4 mt-4 border-t" style={{ borderColor: "var(--primary-200)" }}>
                                <Link 
                                    href="/pages/wishlist"
                                    className="block w-full py-3 font-bold text-center text-white transition-all duration-200 rounded-lg hover:shadow-lg"
                                    style={{
                                        background: "linear-gradient(to right, var(--primary-700), var(--primary-800))",
                                        boxShadow: "0 2px 4px rgba(15, 23, 42, 0.2)"
                                    }}
                                >
                                    View All Wishlist Items
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}