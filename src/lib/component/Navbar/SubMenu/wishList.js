"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"

export default function Wishlist(){
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
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
                        <h3 className="flex items-center gap-2 font-bold" style={{ color: 'var(--primary-800)' }}>
                            <span className="text-lg">❤️</span>
                            My Wishlist
                            <span className="ml-auto text-sm font-normal px-2.5 py-0.5 rounded-full" style={{ 
                                backgroundColor: 'var(--secondary-100)', 
                                color: 'var(--secondary-700)' 
                            }}>
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                            </span>
                        </h3>
                    </div>
                    
                    <div className="p-3 overflow-y-auto max-h-96">
                        {loading ? (
                            // Loading state
                            <div className="py-8 text-center">
                                <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-400 rounded-full border-t-blue-600 animate-spin"></div>
                                <p className="text-sm" style={{ color: 'var(--primary-600)' }}>Loading wishlist...</p>
                            </div>
                        ) : wishlistItems.length === 0 ? (
                            // Empty state
                            <div className="py-8 text-center">
                                <div className="mb-4 text-4xl" style={{ color: 'var(--primary-300)' }}>❤️</div>
                                <p className="mb-4 text-sm" style={{ color: 'var(--primary-600)' }}>Your wishlist is empty</p>
                                <Link 
                                    href="/products"
                                    className="inline-block px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:shadow-md"
                                    style={{
                                        background: 'linear-gradient(to right, var(--accent-500), var(--accent-600))',
                                        color: 'white'
                                    }}
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            // Real wishlist items
                            <>
                                {wishlistItems.slice(0, 3).map((item) => {
                                    const product = item.product;
                                    if (!product) return null;
                                    
                                    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
                                    const isDiscounted = product.discountPercent > 0;
                                    
                                    return (
                                        <li 
                                            key={item.id}
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
                                                <Link 
                                                    href={`/pages/product/detail/${product.id}`}
                                                    className="block mb-1 text-sm font-medium truncate transition-colors hover:text-blue-600" 
                                                    style={{ color: 'var(--primary-800)' }}
                                                    title={product.name}
                                                >
                                                    {product.name}
                                                </Link>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold" style={{ color: 'var(--primary-900)' }}>
                                                        {formatPrice(discountedPrice)}
                                                    </span>
                                                    {isDiscounted && (
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
                                                </div>
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
                                            </div>
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
                                        </li>
                                    );
                                })}
                                
                                {wishlistItems.length > 3 && (
                                    <div className="py-2 text-sm text-center" style={{ color: 'var(--primary-600)' }}>
                                        +{wishlistItems.length - 3} more items
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                    {wishlistItems.length > 0 && (
                        <div className="p-4 border-t" style={{ borderColor: 'var(--primary-100)' }}>
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
                        </div>
                    )}
                </ul>
            </div>
        </div>
    )
}