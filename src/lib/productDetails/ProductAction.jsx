"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductActions = ({ 
    product, 
    quantity, 
    setQuantity, 
    selectedColor, 
    selectedSize, 
    router 
}) => {
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const routerInstance = useRouter();

    // Check if product is in wishlist on component mount
    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (!product?.id) return;
            
            try {
                const response = await fetch(`/api/product/wishList/check?productId=${product.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setIsWishlisted(data.isInWishlist || false);
                }
            } catch (error) {
                console.error("Failed to check wishlist status:", error);
            }
        };

        checkWishlistStatus();
    }, [product?.id]);

    const handleAddToCart = async () => {
        if (!product) return;
        
        setIsAddingToCart(true);
        
        try {
            const response = await fetch(`/api/product/cart/addCart?id=${product.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: Number(quantity),
                    size: selectedSize.toUpperCase(),
                    color: selectedColor.toUpperCase()
                })
            });

            const result = await response.json();
            
            if (result.status === "success") {
                alert(result.msg || "Item added to cart successfully!");
            } else {
                alert(result.msg || "Failed to add item to cart");
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            alert("An error occurred while adding to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!product || product.inventory === 0) {
            alert("Product is out of stock!");
            return;
        }

        if (quantity > product.inventory) {
            alert(`Only ${product.inventory} items available in stock`);
            return;
        }

        const note = window.prompt("Add a note for your order (optional):", "");
        if (note === null) return;

        setIsPlacingOrder(true);

        try {
            const response = await fetch(`/api/product/order/newOrder?productId=${product.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: Number(quantity),
                    size: selectedSize.toUpperCase(),
                    color: selectedColor.toUpperCase(),
                    customerNote: note || ""
                })
            });

            const result = await response.json();
            
            if (result.status === "success") {
                alert(`✅ Order placed successfully!\nOrder ID: ${result.order.id}\nTotal: ${result.order.totalAmount}`);
                routerInstance.push(`/user/dashboard/order`);
            } else {
                alert(`❌ ${result.msg || "Failed to place order"}`);
            }
        } catch (error) {
            console.error("Buy Now error:", error);
            alert("❌ An error occurred while placing order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const toggleWishlist = async () => {
        if (!product?.id) return;
        
        setIsWishlistLoading(true);
        
        try {
            if (isWishlisted) {
                // Remove from wishlist
                const response = await fetch(`/api/product/wishList/DeleteWishList?id=${product.id}`, {
                    method: 'DELETE',
                });

                const result = await response.json();
                
                if (result.status === "success") {
                    setIsWishlisted(false);
                    alert(`❤️ ${result.msg || "Removed from wishlist"}`);
                } else {
                    alert(`❌ ${result.msg || "Failed to remove from wishlist"}`);
                }
            } else {
                // Add to wishlist
                const response = await fetch(`/api/product/wishList/addWishList?id=${product.id}`, {
                    method: 'POST',
                });

                const result = await response.json();
                
                if (result.status === "success") {
                    setIsWishlisted(true);
                    alert("✅ Added to wishlist!");
                } else if (result.msg === "wishlist already added") {
                    setIsWishlisted(true);
                    alert("❤️ Already in your wishlist!");
                } else {
                    alert(`❌ ${result.msg || "Failed to add to wishlist"}`);
                }
            }
        } catch (error) {
            console.error("Wishlist toggle error:", error);
            alert("❌ An error occurred. Please try again.");
        } finally {
            setIsWishlistLoading(false);
        }
    };

    const shareProduct = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("✅ Link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
            alert("❌ Failed to copy link");
        }
    };

    return (
        <div className="mt-6 sm:mt-8">
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:gap-4 sm:mb-6">
                <div className="flex items-center justify-between border-2 rounded-xl border-primary-200 sm:justify-start">
                    <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="px-4 py-3 text-xl font-bold transition-colors text-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                    >
                        −
                    </button>
                    <span className="px-4 py-3 text-xl font-bold text-primary-800 sm:px-6">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(prev => Math.min(product.inventory, prev + 1))}
                        className="px-4 py-3 text-xl font-bold transition-colors text-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity >= product.inventory}
                    >
                        +
                    </button>
                </div>
                <div className="text-sm text-center text-primary-600 sm:text-left sm:text-base">
                    Max: {product.inventory} units
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.inventory === 0}
                    className={`flex items-center justify-center gap-3 px-6 py-4 font-bold text-white transition-all duration-300 rounded-xl hover:shadow-xl active:scale-95 sm:px-8 ${
                        isAddingToCart ? 'opacity-70 cursor-not-allowed' : ''
                    } ${product.inventory === 0 ? 'bg-gradient-to-r from-neutral-400 to-neutral-500' : 'bg-gradient-to-r from-accent-500 to-accent-600'}`}
                >
                    {isAddingToCart ? (
                        <>
                            <div className="w-5 h-5 border-2 rounded-full border-t-transparent animate-spin"></div>
                            Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={20} />
                            {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </>
                    )}
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={product.inventory === 0 || isPlacingOrder}
                    className={`flex items-center justify-center gap-3 px-6 py-4 font-bold text-white transition-all duration-300  rounded-xl hover:shadow-xl active:scale-95 sm:px-8 ${
                        product.inventory === 0 || isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''
                    } ${product.inventory === 0 || isPlacingOrder ? 'bg-gradient-to-r from-neutral-400 to-neutral-500' : 'bg-gradient-to-r from-primary-800 to-primary-900'}`}
                >
                    {isPlacingOrder ? (
                        <>
                            <div className="w-5 h-5 border-2 rounded-full border-t-transparent animate-spin"></div>
                            Placing Order...
                        </>
                    ) : (
                        <>
                            ⚡ {product.inventory === 0 ? 'Out of Stock' : 'Buy Now (COD)'}
                        </>
                    )}
                </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3 mt-4 sm:gap-4 sm:mt-4">
                <button
                    onClick={toggleWishlist}
                    disabled={isWishlistLoading}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                        isWishlisted ? "scale-105 bg-secondary-50 border-secondary-500 text-secondary-600" : "bg-slate-600  text-primary-700 hover:bg-primary-50"
                    }`}
                >
                    {isWishlistLoading ? (
                        <div className="w-4 h-4 border-2 rounded-full border-t-transparent animate-spin border-primary-600"></div>
                    ) : (
                        <>
                            <Heart 
                                size={18} 
                                className="sm:w-5 sm:h-5" 
                                fill={isWishlisted ? "var(--secondary-600)" : "transparent"} 
                                color={isWishlisted ? "var(--secondary-600)" : "var(--primary-700)"}
                            />
                            <span className="text-sm font-medium sm:text-base">
                                {isWishlisted ? "Wishlisted" : "Wishlist"}
                            </span>
                        </>
                    )}
                </button>
                <button
                    onClick={shareProduct}
                    className="flex items-center justify-center flex-1 gap-2 px-4 py-3 transition-all duration-200 border-2 bg-slate-600 rounded-xl text-primary-700 hover:bg-primary-50 active:scale-95"
                >
                    <Share2 size={18} className="sm:w-5 sm:h-5" />
                    <span className="text-sm font-medium sm:text-base">Share</span>
                </button>
            </div>
        </div>
    );
};

export default ProductActions;