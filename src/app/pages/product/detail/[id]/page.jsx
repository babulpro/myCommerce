
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight, Check, Package } from "lucide-react";

export default function Page() { 
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageZoom, setImageZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [currentSlide, setCurrentSlide] = useState(0);

     

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/product/detail?id=${id}`);
                const data = await response.json();
                console.log("Fetched product data:", data);
                
                if (data.status === "success") {
                    setProduct(data.data);
                    setSelectedColor(data.data.color?.[0] || "");
                    setSelectedSize(data.data.size?.[0] || "");
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                setError("Failed to load product details");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const handleImageHover = (e) => {
        if (!imageZoom) return;
        
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const handleAddToCart = () => {
        alert(`Added ${quantity} ${product.name} to cart!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push("/checkout");
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        alert(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
    };

    const shareProduct = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const calculateDiscountedPrice = (price, discount) => {
        return price - (price * discount / 100);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: product?.currency || 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleImageClick = (index) => {
        setSelectedImage(index);
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        if (product?.images) {
            const next = (currentSlide + 1) % product.images.length;
            setCurrentSlide(next);
            setSelectedImage(next);
        }
    };

    const prevSlide = () => {
        if (product?.images) {
            const prev = (currentSlide - 1 + product.images.length) % product.images.length;
            setCurrentSlide(prev);
            setSelectedImage(prev);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{
                background: "linear-gradient(to bottom, var(--primary-50), white)"
            }}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 border-4 rounded-full animate-spin" style={{
                        borderColor: "var(--primary-400)",
                        borderTopColor: "var(--accent-600)"
                    }}></div>
                    <p className="text-lg font-bold" style={{ color: "var(--primary-700)" }}>
                        Loading product details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{
                background: "linear-gradient(to bottom, var(--primary-50), white)"
            }}>
                <div className="max-w-md mx-4 text-center">
                    <div className="mb-6 text-7xl" style={{ color: "var(--primary-400)" }}>😔</div>
                    <h2 className="mb-3 text-2xl font-bold" style={{ color: "var(--primary-800)" }}>
                        Product Not Found
                    </h2>
                    <p className="mb-8" style={{ color: "var(--primary-600)" }}>
                        The product you're looking for doesn't exist or has been removed.
                    </p>
                    <button 
                        onClick={() => router.push("/")}
                        className="px-8 py-3 rounded-xl font-bold text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        style={{
                            background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                            boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(14, 165, 233, 0.4)"}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(14, 165, 233, 0.2)"}
                    >
                        ← Back to Shopping
                    </button>
                </div>
            </div>
        );
    }

    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
    const isDiscounted = product.discountPercent > 0;
    const stockStatus = product.inventory > 10 ? "In Stock" : product.inventory > 0 ? "Low Stock" : "Out of Stock";
    const stockColor = product.inventory > 10 ? "var(--accent-600)" : product.inventory > 0 ? "var(--warning-600)" : "var(--neutral-600)";

    return (
        <div className="min-h-screen" style={{
            background: "linear-gradient(to bottom, var(--primary-25), white)"
        }}>
            {/* Breadcrumb */}
            <div className="py-4" style={{ backgroundColor: "var(--primary-50)" }}>
                <div className="px-4 mx-auto sm:container">
                    <div className="flex items-center gap-2 text-sm">
                        <button 
                            onClick={() => router.push("/")}
                            className="font-medium hover:underline"
                            style={{ color: "var(--primary-600)" }}
                        >
                            Home
                        </button>
                        <span style={{ color: "var(--primary-400)" }}>›</span>
                        <span className="font-medium line-clamp-1" style={{ color: "var(--primary-800)" }}>
                            {product.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 mx-auto sm:py-8 sm:container">
                <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12">
                    {/* Left Column - Images - Mobile First */}
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        {/* Main Image with Zoom */}
                        <div 
                            className="relative overflow-hidden shadow-lg rounded-xl sm:rounded-2xl"
                            style={{
                                border: "2px solid var(--primary-100)",
                                backgroundColor: "white"
                            }}
                            onMouseEnter={() => setImageZoom(true)}
                            onMouseLeave={() => setImageZoom(false)}
                            onMouseMove={handleImageHover}
                        >
                            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] overflow-hidden bg-gradient-to-br from-primary-50 to-primary-25">
                                <img 
                                    src={product.images?.[selectedImage]} 
                                    alt={product.name}
                                    className="object-contain w-full h-full p-4 transition-transform duration-300"
                                    style={{
                                        transform: imageZoom ? "scale(1.5)" : "scale(1)",
                                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                    }}
                                />
                                
                                {/* Navigation Arrows */}
                                {product.images?.length > 1 && (
                                    <>
                                        <button 
                                            onClick={prevSlide}
                                            className="absolute flex items-center justify-center w-10 h-10 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg left-2 sm:left-4 top-1/2 hover:scale-110 active:scale-95"
                                            style={{
                                                backgroundColor: "white",
                                                color: "var(--primary-700)",
                                                border: "2px solid var(--primary-200)"
                                            }}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button 
                                            onClick={nextSlide}
                                            className="absolute flex items-center justify-center w-10 h-10 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg right-2 sm:right-4 top-1/2 hover:scale-110 active:scale-95"
                                            style={{
                                                backgroundColor: "white",
                                                color: "var(--primary-700)",
                                                border: "2px solid var(--primary-200)"
                                            }}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                                
                                {/* Badges - Mobile Optimized */}
                                <div className="absolute flex flex-col gap-1 top-2 left-2 sm:top-4 sm:left-4 sm:gap-2">
                                    {product.featured && (
                                        <span className="px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg sm:px-4 sm:py-2 sm:text-sm" style={{
                                            background: "linear-gradient(to right, var(--accent-500), var(--accent-600))"
                                        }}>
                                            ⭐ Featured
                                        </span>
                                    )}
                                    {isDiscounted && (
                                        <span className="px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg sm:px-4 sm:py-2 sm:text-sm" style={{
                                            background: "linear-gradient(to right, var(--secondary-500), var(--secondary-600))"
                                        }}>
                                            🔥 {product.discountPercent}% OFF
                                        </span>
                                    )}
                                </div>
                                
                                {/* Zoom Indicator */}
                                {imageZoom && (
                                    <div className="absolute hidden px-3 py-1.5 text-xs font-medium rounded-lg bottom-4 right-4 sm:block" style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        color: "var(--primary-700)",
                                        border: "1px solid var(--primary-200)"
                                    }}>
                                        🔍 Hover to zoom
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Images - Mobile Scrollable */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-2 pb-2 mt-3 overflow-x-auto sm:mt-4 sm:pb-0">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageClick(index)}
                                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 active:scale-95 ${
                                            selectedImage === index ? "scale-105 ring-2" : "hover:scale-105"
                                        }`}
                                        style={{
                                            borderColor: selectedImage === index ? "var(--accent-500)" : "var(--primary-200)",
                                            backgroundColor: "white",
                                            ringColor: "var(--accent-500)"
                                        }}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${product.name} ${index + 1}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Info - Mobile First */}
                    <div className="flex flex-col gap-6 sm:gap-8">
                        {/* Brand & Category - Mobile Stacked */}
                        <div className="flex flex-wrap gap-2 mb-2 sm:gap-4">
                            {product.brand && (
                                <span className="px-3 py-1.5 text-sm font-bold rounded-lg" style={{
                                    background: "linear-gradient(to right, var(--primary-100), var(--primary-200))",
                                    color: "var(--primary-700)"
                                }}>
                                    {product.brand}
                                </span>
                            )}
                            {product.type && (
                                <span className="px-3 py-1.5 text-sm font-bold rounded-lg" style={{
                                    background: "linear-gradient(to right, var(--primary-50), var(--primary-100))",
                                    color: "var(--primary-600)",
                                    border: "1px solid var(--primary-200)"
                                }}>
                                    {product.type}
                                </span>
                            )}
                        </div>

                        {/* Product Name */}
                        <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl" style={{ color: "var(--primary-900)" }}>
                            {product.name}
                        </h1>

                        {/* Rating & Stock - Mobile Stacked */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className="sm:w-5 sm:h-5"
                                        fill={i < Math.floor(product.rating) ? "var(--warning-500)" : "var(--primary-200)"}
                                        color={i < Math.floor(product.rating) ? "var(--warning-500)" : "var(--primary-200)"}
                                    />
                                ))}
                                <span className="ml-2 font-bold" style={{ color: "var(--primary-700)" }}>
                                    {product.rating.toFixed(1)}
                                </span>
                                <span className="ml-1 text-sm sm:text-base" style={{ color: "var(--primary-500)" }}>
                                    ({product.reviewCount} reviews)
                                </span>
                            </div>
                            <div className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full w-fit" style={{ 
                                backgroundColor: stockStatus === "In Stock" ? "var(--accent-50)" : 
                                               stockStatus === "Low Stock" ? "var(--warning-50)" : "var(--neutral-50)",
                                color: stockColor,
                                border: `1px solid ${stockStatus === "In Stock" ? "var(--accent-200)" : 
                                         stockStatus === "Low Stock" ? "var(--warning-200)" : "var(--neutral-200)"}`
                            }}>
                                <Package size={14} />
                                {stockStatus}
                            </div>
                        </div>

                        {/* Price - Mobile Optimized */}
                        <div className="mt-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
                                <span className="text-3xl font-bold sm:text-4xl lg:text-5xl" style={{ color: "var(--primary-900)" }}>
                                    {formatPrice(discountedPrice)}
                                </span>
                                {isDiscounted && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xl line-through sm:text-2xl" style={{ color: "var(--primary-400)" }}>
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="px-3 py-1 text-sm font-bold rounded-lg" style={{
                                            backgroundColor: "var(--secondary-100)",
                                            color: "var(--secondary-700)"
                                        }}>
                                            Save {product.discountPercent}%
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-sm sm:text-base" style={{ color: "var(--primary-600)" }}>
                                {product.inventory} units available • Free shipping
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <h3 className="flex items-center gap-2 mb-2 text-lg font-bold sm:mb-3" style={{ color: "var(--primary-800)" }}>
                                <span style={{ color: "var(--accent-500)" }}>📄</span> Description
                            </h3>
                            <p className="text-sm leading-relaxed sm:text-base sm:leading-loose" style={{ color: "var(--primary-600)" }}>
                                {product.description}
                            </p>
                        </div>

                        {/* Characteristics - Mobile Scrollable */}
                        {product.char?.filter(c => c.trim()).length > 0 && (
                            <div className="mt-4">
                                <h3 className="flex items-center gap-2 mb-2 text-lg font-bold sm:mb-3" style={{ color: "var(--primary-800)" }}>
                                    <span style={{ color: "var(--accent-500)" }}>✨</span> Key Features
                                </h3>
                                <div className="pr-2 overflow-y-auto max-h-60 sm:max-h-none sm:overflow-visible sm:space-y-2">
                                    {product.char.filter(c => c.trim()).map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 mb-2 rounded-lg sm:mb-0" style={{
                                            backgroundColor: "var(--primary-50)",
                                            border: "1px solid var(--primary-100)"
                                        }}>
                                            <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full" style={{
                                                backgroundColor: "var(--accent-100)",
                                                color: "var(--accent-600)"
                                            }}>
                                                <Check size={14} />
                                            </div>
                                            <span className="text-sm sm:text-base" style={{ color: "var(--primary-700)", flex: 1 }}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection - Mobile Scrollable */}
                        {product.color?.length > 0 && (
                            <div className="mt-4">
                                <h4 className="mb-2 text-lg font-semibold sm:mb-3" style={{ color: "var(--primary-800)" }}>
                                    Color: <span style={{ color: "var(--accent-600)", fontWeight: "bold" }}>{selectedColor}</span>
                                </h4>
                                <div className="flex gap-2 pb-2 overflow-x-auto sm:overflow-visible sm:gap-3 sm:pb-0">
                                    {product.color.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-200 active:scale-95 ${
                                                selectedColor === color ? "ring-2 ring-offset-1 sm:ring-offset-2" : "hover:scale-110"
                                            }`}
                                            style={{
                                                backgroundColor: color.toLowerCase(),
                                                borderColor: selectedColor === color ? "var(--accent-500)" : "white",
                                                ringColor: "var(--accent-500)"
                                            }}
                                            title={color}
                                        >
                                            {selectedColor === color && (
                                                <div className="flex items-center justify-center w-full h-full bg-black rounded-full bg-opacity-30">
                                                    <Check size={16} className="sm:w-5 sm:h-5" color="white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection - Mobile Scrollable */}
                        {product.size?.length > 0 && (
                            <div className="mt-4">
                                <h4 className="mb-2 text-lg font-semibold sm:mb-3" style={{ color: "var(--primary-800)" }}>
                                    Size: <span style={{ color: "var(--accent-600)", fontWeight: "bold" }}>{selectedSize}</span>
                                </h4>
                                <div className="flex gap-2 pb-2 overflow-x-auto sm:flex-wrap sm:overflow-visible sm:gap-3 sm:pb-0">
                                    {product.size.map((size, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(size)}
                                            className={`flex-shrink-0 px-4 py-2 text-base font-bold rounded-lg border-2 transition-all duration-200 active:scale-95 sm:px-6 sm:py-3 sm:text-lg sm:rounded-xl ${
                                                selectedSize === size ? "scale-105" : "hover:scale-105"
                                            }`}
                                            style={
                                                selectedSize === size
                                                    ? {
                                                        background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                                                        color: "white",
                                                        borderColor: "var(--accent-500)",
                                                        boxShadow: "0 2px 4px -1px rgba(14, 165, 233, 0.2)"
                                                    }
                                                    : {
                                                        backgroundColor: "white",
                                                        color: "var(--primary-700)",
                                                        borderColor: "var(--primary-200)"
                                                    }
                                            }
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Actions - Mobile Optimized */}
                        <div className="mt-6 sm:mt-8">
                            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:gap-4 sm:mb-6">
                                <div className="flex items-center justify-between border-2 rounded-xl sm:justify-start" style={{ borderColor: "var(--primary-200)" }}>
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="px-4 py-3 text-xl font-bold transition-colors active:bg-primary-50"
                                        style={{ color: "var(--primary-600)" }}
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-3 text-xl font-bold sm:px-6" style={{ color: "var(--primary-800)" }}>
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(prev => Math.min(product.inventory, prev + 1))}
                                        className="px-4 py-3 text-xl font-bold transition-colors active:bg-primary-50"
                                        style={{ color: "var(--primary-600)" }}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-sm text-center sm:text-left sm:text-base" style={{ color: "var(--primary-600)" }}>
                                    Max: {product.inventory} units
                                </div>
                            </div>

                            {/* Action Buttons - Mobile Stacked */}
                            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex items-center justify-center gap-3 px-6 py-4 font-bold text-white transition-all duration-300 rounded-xl hover:shadow-xl active:scale-95 sm:px-8"
                                    style={{
                                        background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                                        boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                                    }}
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex items-center justify-center gap-3 px-6 py-4 font-bold transition-all duration-300 rounded-xl hover:shadow-xl active:scale-95 sm:px-8"
                                    style={{
                                        background: "linear-gradient(to right, var(--primary-800), var(--primary-900))",
                                        color: "white",
                                        boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.2)"
                                    }}
                                >
                                    ⚡ Buy Now
                                </button>
                            </div>

                            {/* Secondary Actions - Mobile Centered */}
                            <div className="flex gap-3 mt-4 sm:gap-4 sm:mt-4">
                                <button
                                    onClick={toggleWishlist}
                                    className={`flex-1 px-4 py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
                                        isWishlisted ? "scale-105" : ""
                                    }`}
                                    style={
                                        isWishlisted
                                            ? {
                                                backgroundColor: "var(--secondary-50)",
                                                borderColor: "var(--secondary-500)",
                                                color: "var(--secondary-600)"
                                            }
                                            : {
                                                backgroundColor: "white",
                                                borderColor: "var(--primary-200)",
                                                color: "var(--primary-700)"
                                            }
                                    }
                                >
                                    <Heart size={18} className="sm:w-5 sm:h-5" fill={isWishlisted ? "var(--secondary-600)" : "transparent"} />
                                    <span className="text-sm sm:text-base">{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
                                </button>
                                <button
                                    onClick={shareProduct}
                                    className="flex items-center justify-center flex-1 gap-2 px-4 py-3 transition-all duration-200 border-2 rounded-xl active:scale-95"
                                    style={{
                                        backgroundColor: "white",
                                        borderColor: "var(--primary-200)",
                                        color: "var(--primary-700)"
                                    }}
                                >
                                    <Share2 size={18} className="sm:w-5 sm:h-5" />
                                    <span className="text-sm sm:text-base">Share</span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges - Mobile Grid */}
                        <div className="grid grid-cols-2 gap-3 p-4 mt-6 rounded-xl sm:grid-cols-4 sm:gap-4 sm:mt-8" style={{
                            backgroundColor: "var(--primary-50)",
                            border: "1px solid var(--primary-100)"
                        }}>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full sm:w-12 sm:h-12" style={{
                                    backgroundColor: "var(--accent-100)",
                                    color: "var(--accent-600)"
                                }}>
                                    <Truck size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <span className="text-xs font-medium sm:text-sm" style={{ color: "var(--primary-700)" }}>
                                    Free Shipping
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full sm:w-12 sm:h-12" style={{
                                    backgroundColor: "var(--secondary-100)",
                                    color: "var(--secondary-600)"
                                }}>
                                    <RefreshCw size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <span className="text-xs font-medium sm:text-sm" style={{ color: "var(--primary-700)" }}>
                                    7-Day Returns
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full sm:w-12 sm:h-12" style={{
                                    backgroundColor: "var(--warning-100)",
                                    color: "var(--warning-600)"
                                }}>
                                    <Shield size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <span className="text-xs font-medium sm:text-sm" style={{ color: "var(--primary-700)" }}>
                                    1 Year Warranty
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full sm:w-12 sm:h-12" style={{
                                    backgroundColor: "var(--primary-100)",
                                    color: "var(--primary-600)"
                                }}>
                                    <Check size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <span className="text-xs font-medium sm:text-sm" style={{ color: "var(--primary-700)" }}>
                                    Authentic Product
                                </span>
                            </div>
                        </div>

                        {/* Tags - Mobile Wrap */}
                        {product.tags?.length > 0 && (
                            <div className="mt-6 sm:mt-8">
                                <h3 className="flex items-center gap-2 mb-2 text-lg font-bold sm:mb-3" style={{ color: "var(--primary-800)" }}>
                                    <span style={{ color: "var(--accent-500)" }}>🏷️</span> Product Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <button
                                            key={index}
                                            onClick={() => router.push(`/search?tag=${tag}`)}
                                            className="px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-lg active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
                                            style={{
                                                backgroundColor: "var(--primary-50)",
                                                color: "var(--primary-700)",
                                                border: "1px solid var(--primary-200)"
                                            }}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

















// "use client";
// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight, Check, Package } from "lucide-react";

// export default function Page() { 
//     const { id } = useParams();
//     const router = useRouter();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedImage, setSelectedImage] = useState(0);
//     const [selectedColor, setSelectedColor] = useState("");
//     const [selectedSize, setSelectedSize] = useState("");
//     const [quantity, setQuantity] = useState(1);
//     const [isWishlisted, setIsWishlisted] = useState(false);
//     const [relatedProducts, setRelatedProducts] = useState([]);
//     const [imageZoom, setImageZoom] = useState(false);
//     const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//     const [currentSlide, setCurrentSlide] = useState(0);

//     console.log("Product ID from URL:", id);

//     useEffect(() => {
//         const fetchProductDetails = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`/api/product/detail?id=${id}`);
//                 const data = await response.json();
//                 console.log("Fetched product data:", data);
                
//                 if (data.status === "success") {
//                     setProduct(data.data);
//                     setSelectedColor(data.data.color?.[0] || "");
//                     setSelectedSize(data.data.size?.[0] || "");
                    
//                     // Fetch related products by tags
//                     // if (data.data.tags && data.data.tags.length > 0) {
//                     //     const relatedResponse = await fetch(`/api/product/related?tags=${data.data.tags.join(",")}&exclude=${id}`);
//                     //     const relatedData = await relatedResponse.json();
//                     //     if (relatedData.status === "success") {
//                     //         setRelatedProducts(relatedData.data);
//                     //     }
//                     // }
//                 } else {
//                     setError("Product not found");
//                 }
//             } catch (err) {
//                 setError("Failed to load product details");
//                 console.error("Error:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchProductDetails();
//         }
//     }, [id]);

//     const handleImageHover = (e) => {
//         if (!imageZoom) return;
        
//         const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
//         const x = ((e.clientX - left) / width) * 100;
//         const y = ((e.clientY - top) / height) * 100;
//         setZoomPosition({ x, y });
//     };

//     const handleAddToCart = () => {
//         // Add cart logic here
//         alert(`Added ${quantity} ${product.name} to cart!`);
//     };

//     const handleBuyNow = () => {
//         handleAddToCart();
//         router.push("/checkout");
//     };

//     const toggleWishlist = () => {
//         setIsWishlisted(!isWishlisted);
//         alert(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
//     };

//     const shareProduct = async () => {
//         try {
//             await navigator.clipboard.writeText(window.location.href);
//             alert("Link copied to clipboard!");
//         } catch (err) {
//             console.error("Failed to copy:", err);
//         }
//     };

//     const calculateDiscountedPrice = (price, discount) => {
//         return price - (price * discount / 100);
//     };

//     const formatPrice = (price) => {
//         return new Intl.NumberFormat('en-BD', {
//             style: 'currency',
//             currency: product?.currency || 'BDT',
//             minimumFractionDigits: 0,
//         }).format(price);
//     };

//     const handleImageClick = (index) => {
//         setSelectedImage(index);
//         setCurrentSlide(index);
//     };

//     const nextSlide = () => {
//         if (product?.images) {
//             const next = (currentSlide + 1) % product.images.length;
//             setCurrentSlide(next);
//             setSelectedImage(next);
//         }
//     };

//     const prevSlide = () => {
//         if (product?.images) {
//             const prev = (currentSlide - 1 + product.images.length) % product.images.length;
//             setCurrentSlide(prev);
//             setSelectedImage(prev);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen" style={{
//                 background: "linear-gradient(to bottom, var(--primary-50), white)"
//             }}>
//                 <div className="text-center">
//                     <div className="w-16 h-16 mx-auto mb-6 border-4 rounded-full animate-spin" style={{
//                         borderColor: "var(--primary-400)",
//                         borderTopColor: "var(--accent-600)"
//                     }}></div>
//                     <p className="text-lg font-bold" style={{ color: "var(--primary-700)" }}>
//                         Loading product details...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !product) {
//         return (
//             <div className="flex items-center justify-center min-h-screen" style={{
//                 background: "linear-gradient(to bottom, var(--primary-50), white)"
//             }}>
//                 <div className="max-w-md mx-4 text-center">
//                     <div className="mb-6 text-7xl" style={{ color: "var(--primary-400)" }}>😔</div>
//                     <h2 className="mb-3 text-2xl font-bold" style={{ color: "var(--primary-800)" }}>
//                         Product Not Found
//                     </h2>
//                     <p className="mb-8" style={{ color: "var(--primary-600)" }}>
//                         The product you're looking for doesn't exist or has been removed.
//                     </p>
//                     <button 
//                         onClick={() => router.push("/")}
//                         className="px-8 py-3 rounded-xl font-bold text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
//                         style={{
//                             background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
//                             boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
//                         }}
//                         onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(14, 165, 233, 0.4)"}
//                         onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(14, 165, 233, 0.2)"}
//                     >
//                         ← Back to Shopping
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
//     const isDiscounted = product.discountPercent > 0;
//     const stockStatus = product.inventory > 10 ? "In Stock" : product.inventory > 0 ? "Low Stock" : "Out of Stock";
//     const stockColor = product.inventory > 10 ? "var(--accent-600)" : product.inventory > 0 ? "var(--warning-600)" : "var(--neutral-600)";

//     return (
//         <div className="min-h-screen" style={{
//             background: "linear-gradient(to bottom, var(--primary-25), white)"
//         }}>
//             {/* Breadcrumb */}
//             <div className="py-4" style={{ backgroundColor: "var(--primary-50)" }}>
//                 <div className="container px-4 mx-auto">
//                     <div className="flex items-center gap-2 text-sm">
//                         <button 
//                             onClick={() => router.push("/")}
//                             className="font-medium hover:underline"
//                             style={{ color: "var(--primary-600)" }}
//                         >
//                             Home
//                         </button>
//                         <span style={{ color: "var(--primary-400)" }}>›</span>
//                         <span className="font-medium" style={{ color: "var(--primary-800)" }}>
//                             {product.name}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             <div className="container px-4 py-8 mx-auto">
//                 <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
//                     {/* Left Column - Images */}
//                     <div>
//                         {/* Main Image with Zoom */}
//                         <div 
//                             className="relative mb-4 overflow-hidden shadow-xl rounded-2xl cursor-crosshair"
//                             style={{
//                                 border: "2px solid var(--primary-100)",
//                                 backgroundColor: "white"
//                             }}
//                             onMouseEnter={() => setImageZoom(true)}
//                             onMouseLeave={() => setImageZoom(false)}
//                             onMouseMove={handleImageHover}
//                         >
//                             <div className="relative h-96 lg:h-[500px] overflow-hidden bg-gradient-to-br from-primary-50 to-primary-25">
//                                 <img 
//                                     src={product.images?.[selectedImage]} 
//                                     alt={product.name}
//                                     className="object-contain w-full h-full p-4 transition-transform duration-300"
//                                     style={{
//                                         transform: imageZoom ? "scale(1.5)" : "scale(1)",
//                                         transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
//                                     }}
//                                 />
                                
//                                 {/* Navigation Arrows */}
//                                 {product.images?.length > 1 && (
//                                     <>
//                                         <button 
//                                             onClick={prevSlide}
//                                             className="absolute flex items-center justify-center w-12 h-12 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 hover:scale-110"
//                                             style={{
//                                                 backgroundColor: "white",
//                                                 color: "var(--primary-700)",
//                                                 border: "2px solid var(--primary-200)"
//                                             }}
//                                         >
//                                             <ChevronLeft size={24} />
//                                         </button>
//                                         <button 
//                                             onClick={nextSlide}
//                                             className="absolute flex items-center justify-center w-12 h-12 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 hover:scale-110"
//                                             style={{
//                                                 backgroundColor: "white",
//                                                 color: "var(--primary-700)",
//                                                 border: "2px solid var(--primary-200)"
//                                             }}
//                                         >
//                                             <ChevronRight size={24} />
//                                         </button>
//                                     </>
//                                 )}
                                
//                                 {/* Badges */}
//                                 <div className="absolute flex flex-col gap-2 top-4 left-4">
//                                     {product.featured && (
//                                         <span className="px-4 py-2 text-sm font-bold text-white rounded-full shadow-lg" style={{
//                                             background: "linear-gradient(to right, var(--accent-500), var(--accent-600))"
//                                         }}>
//                                             ⭐ Featured
//                                         </span>
//                                     )}
//                                     {isDiscounted && (
//                                         <span className="px-4 py-2 text-sm font-bold text-white rounded-full shadow-lg" style={{
//                                             background: "linear-gradient(to right, var(--secondary-500), var(--secondary-600))"
//                                         }}>
//                                             🔥 {product.discountPercent}% OFF
//                                         </span>
//                                     )}
//                                 </div>
                                
//                                 {/* Zoom Indicator */}
//                                 {imageZoom && (
//                                     <div className="absolute bottom-4 right-4 px-3 py-1.5 text-xs font-medium rounded-lg" style={{
//                                         backgroundColor: "rgba(255, 255, 255, 0.9)",
//                                         color: "var(--primary-700)",
//                                         border: "1px solid var(--primary-200)"
//                                     }}>
//                                         🔍 Hover to zoom
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Thumbnail Images */}
//                         <div className="flex gap-2 pb-2 overflow-x-auto">
//                             {product.images?.map((img, index) => (
//                                 <button
//                                     key={index}
//                                     onClick={() => handleImageClick(index)}
//                                     className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
//                                         selectedImage === index ? "scale-105 ring-2" : "hover:scale-105"
//                                     }`}
//                                     style={{
//                                         borderColor: selectedImage === index ? "var(--accent-500)" : "var(--primary-200)",
//                                         backgroundColor: "white",
//                                         ringColor: "var(--accent-500)"
//                                     }}
//                                 >
//                                     <img 
//                                         src={img} 
//                                         alt={`${product.name} ${index + 1}`}
//                                         className="object-cover w-full h-full"
//                                     />
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Right Column - Product Info */}
//                     <div>
//                         {/* Brand & Category */}
//                         <div className="flex items-center gap-4 mb-4">
//                             <span className="px-3 py-1.5 text-sm font-bold rounded-lg" style={{
//                                 background: "linear-gradient(to right, var(--primary-100), var(--primary-200))",
//                                 color: "var(--primary-700)"
//                             }}>
//                                 {product.brand || "Generic"}
//                             </span>
//                             <span className="px-3 py-1.5 text-sm font-bold rounded-lg" style={{
//                                 background: "linear-gradient(to right, var(--primary-50), var(--primary-100))",
//                                 color: "var(--primary-600)",
//                                 border: "1px solid var(--primary-200)"
//                             }}>
//                                 {product.type || "Product"}
//                             </span>
//                         </div>

//                         {/* Product Name */}
//                         <h1 className="mb-4 text-3xl font-bold lg:text-4xl" style={{ color: "var(--primary-900)" }}>
//                             {product.name}
//                         </h1>

//                         {/* Rating & Stock */}
//                         <div className="flex items-center gap-4 mb-6">
//                             <div className="flex items-center gap-1">
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star
//                                         key={i}
//                                         size={20}
//                                         fill={i < Math.floor(product.rating) ? "var(--warning-500)" : "var(--primary-200)"}
//                                         color={i < Math.floor(product.rating) ? "var(--warning-500)" : "var(--primary-200)"}
//                                     />
//                                 ))}
//                                 <span className="ml-2 font-bold" style={{ color: "var(--primary-700)" }}>
//                                     {product.rating.toFixed(1)}
//                                 </span>
//                                 <span className="ml-1" style={{ color: "var(--primary-500)" }}>
//                                     ({product.reviewCount} reviews)
//                                 </span>
//                             </div>
//                             <div className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full" style={{ 
//                                 backgroundColor: stockStatus === "In Stock" ? "var(--accent-50)" : 
//                                                stockStatus === "Low Stock" ? "var(--warning-50)" : "var(--neutral-50)",
//                                 color: stockColor,
//                                 border: `1px solid ${stockStatus === "In Stock" ? "var(--accent-200)" : 
//                                          stockStatus === "Low Stock" ? "var(--warning-200)" : "var(--neutral-200)"}`
//                             }}>
//                                 <Package size={14} />
//                                 {stockStatus}
//                             </div>
//                         </div>

//                         {/* Price */}
//                         <div className="mb-8">
//                             <div className="flex items-baseline gap-3 mb-2">
//                                 <span className="text-4xl font-bold lg:text-5xl" style={{ color: "var(--primary-900)" }}>
//                                     {formatPrice(discountedPrice)}
//                                 </span>
//                                 {isDiscounted && (
//                                     <>
//                                         <span className="text-2xl line-through" style={{ color: "var(--primary-400)" }}>
//                                             {formatPrice(product.price)}
//                                         </span>
//                                         <span className="px-3 py-1 text-sm font-bold rounded-lg" style={{
//                                             backgroundColor: "var(--secondary-100)",
//                                             color: "var(--secondary-700)"
//                                         }}>
//                                             Save {product.discountPercent}%
//                                         </span>
//                                     </>
//                                 )}
//                             </div>
//                             <p style={{ color: "var(--primary-600)" }}>
//                                 {product.inventory} units available • Free shipping
//                             </p>
//                         </div>

//                         {/* Description */}
//                         <div className="mb-8">
//                             <h3 className="flex items-center gap-2 mb-3 text-lg font-bold" style={{ color: "var(--primary-800)" }}>
//                                 <span style={{ color: "var(--accent-500)" }}>📄</span> Description
//                             </h3>
//                             <p style={{ color: "var(--primary-600)", lineHeight: "1.8" }}>
//                                 {product.description}
//                             </p>
//                         </div>

//                         {/* Characteristics */}
//                         {product.char?.filter(c => c.trim()).length > 0 && (
//                             <div className="mb-8">
//                                 <h3 className="flex items-center gap-2 mb-3 text-lg font-bold" style={{ color: "var(--primary-800)" }}>
//                                     <span style={{ color: "var(--accent-500)" }}>✨</span> Key Features
//                                 </h3>
//                                 <div className="space-y-2">
//                                     {product.char.filter(c => c.trim()).map((feature, index) => (
//                                         <div key={index} className="flex items-start gap-3 p-3 rounded-lg" style={{
//                                             backgroundColor: "var(--primary-50)",
//                                             border: "1px solid var(--primary-100)"
//                                         }}>
//                                             <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{
//                                                 backgroundColor: "var(--accent-100)",
//                                                 color: "var(--accent-600)"
//                                             }}>
//                                                 <Check size={14} />
//                                             </div>
//                                             <span style={{ color: "var(--primary-700)", flex: 1 }}>
//                                                 {feature}
//                                             </span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Color Selection */}
//                         {product.color?.length > 0 && (
//                             <div className="mb-6">
//                                 <h4 className="mb-3 text-lg font-semibold" style={{ color: "var(--primary-800)" }}>
//                                     Color: <span style={{ color: "var(--accent-600)", fontWeight: "bold" }}>{selectedColor}</span>
//                                 </h4>
//                                 <div className="flex gap-3">
//                                     {product.color.map((color, index) => (
//                                         <button
//                                             key={index}
//                                             onClick={() => setSelectedColor(color)}
//                                             className={`w-12 h-12 rounded-full border-2 transition-all duration-200 transform hover:scale-110 ${
//                                                 selectedColor === color ? "ring-2 ring-offset-2" : ""
//                                             }`}
//                                             style={{
//                                                 backgroundColor: color.toLowerCase(),
//                                                 borderColor: selectedColor === color ? "var(--accent-500)" : "white",
//                                                 ringColor: "var(--accent-500)"
//                                             }}
//                                             title={color}
//                                         >
//                                             {selectedColor === color && (
//                                                 <div className="flex items-center justify-center w-full h-full bg-black rounded-full bg-opacity-30">
//                                                     <Check size={20} color="white" />
//                                                 </div>
//                                             )}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Size Selection */}
//                         {product.size?.length > 0 && (
//                             <div className="mb-6">
//                                 <h4 className="mb-3 text-lg font-semibold" style={{ color: "var(--primary-800)" }}>
//                                     Size: <span style={{ color: "var(--accent-600)", fontWeight: "bold" }}>{selectedSize}</span>
//                                 </h4>
//                                 <div className="flex flex-wrap gap-3">
//                                     {product.size.map((size, index) => (
//                                         <button
//                                             key={index}
//                                             onClick={() => setSelectedSize(size)}
//                                             className={`px-6 py-3 text-lg font-bold rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
//                                                 selectedSize === size ? "scale-105" : ""
//                                             }`}
//                                             style={
//                                                 selectedSize === size
//                                                     ? {
//                                                         background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
//                                                         color: "white",
//                                                         borderColor: "var(--accent-500)",
//                                                         boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
//                                                     }
//                                                     : {
//                                                         backgroundColor: "white",
//                                                         color: "var(--primary-700)",
//                                                         borderColor: "var(--primary-200)"
//                                                     }
//                                             }
//                                         >
//                                             {size}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Quantity & Actions */}
//                         <div className="mb-8">
//                             <div className="flex items-center gap-4 mb-6">
//                                 <div className="flex items-center border-2 rounded-xl" style={{ borderColor: "var(--primary-200)" }}>
//                                     <button
//                                         onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
//                                         className="px-4 py-3 text-xl font-bold transition-colors"
//                                         style={{ color: "var(--primary-600)" }}
//                                         onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-50)"}
//                                         onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
//                                     >
//                                         −
//                                     </button>
//                                     <span className="px-6 py-3 text-xl font-bold" style={{ color: "var(--primary-800)" }}>
//                                         {quantity}
//                                     </span>
//                                     <button
//                                         onClick={() => setQuantity(prev => Math.min(product.inventory, prev + 1))}
//                                         className="px-4 py-3 text-xl font-bold transition-colors"
//                                         style={{ color: "var(--primary-600)" }}
//                                         onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-50)"}
//                                         onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                                 <div className="text-sm" style={{ color: "var(--primary-600)" }}>
//                                     Max: {product.inventory} units
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//                                 <button
//                                     onClick={handleAddToCart}
//                                     className="px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
//                                     style={{
//                                         background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
//                                         boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
//                                     }}
//                                     onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(14, 165, 233, 0.4)"}
//                                     onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(14, 165, 233, 0.2)"}
//                                 >
//                                     <ShoppingCart size={20} />
//                                     Add to Cart
//                                 </button>
//                                 <button
//                                     onClick={handleBuyNow}
//                                     className="px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-bold transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
//                                     style={{
//                                         background: "linear-gradient(to right, var(--primary-800), var(--primary-900))",
//                                         color: "white",
//                                         boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.2)"
//                                     }}
//                                     onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(15, 23, 42, 0.4)"}
//                                     onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(15, 23, 42, 0.2)"}
//                                 >
//                                     ⚡ Buy Now
//                                 </button>
//                             </div>

//                             <div className="flex gap-4 mt-4">
//                                 <button
//                                     onClick={toggleWishlist}
//                                     className={`px-4 py-3 rounded-xl border-2 flex items-center gap-2 transition-all duration-200 ${
//                                         isWishlisted ? "scale-105" : ""
//                                     }`}
//                                     style={
//                                         isWishlisted
//                                             ? {
//                                                 backgroundColor: "var(--secondary-50)",
//                                                 borderColor: "var(--secondary-500)",
//                                                 color: "var(--secondary-600)"
//                                             }
//                                             : {
//                                                 backgroundColor: "white",
//                                                 borderColor: "var(--primary-200)",
//                                                 color: "var(--primary-700)"
//                                             }
//                                     }
//                                     onMouseEnter={(e) => {
//                                         if (!isWishlisted) {
//                                             e.currentTarget.style.backgroundColor = "var(--primary-50)";
//                                             e.currentTarget.style.borderColor = "var(--secondary-400)";
//                                             e.currentTarget.style.color = "var(--secondary-600)";
//                                         }
//                                     }}
//                                     onMouseLeave={(e) => {
//                                         if (!isWishlisted) {
//                                             e.currentTarget.style.backgroundColor = "white";
//                                             e.currentTarget.style.borderColor = "var(--primary-200)";
//                                             e.currentTarget.style.color = "var(--primary-700)";
//                                         }
//                                     }}
//                                 >
//                                     <Heart size={20} fill={isWishlisted ? "var(--secondary-600)" : "transparent"} />
//                                     {isWishlisted ? "Wishlisted" : "Wishlist"}
//                                 </button>
//                                 <button
//                                     onClick={shareProduct}
//                                     className="flex items-center gap-2 px-4 py-3 transition-all duration-200 border-2 rounded-xl"
//                                     style={{
//                                         backgroundColor: "white",
//                                         borderColor: "var(--primary-200)",
//                                         color: "var(--primary-700)"
//                                     }}
//                                     onMouseEnter={(e) => {
//                                         e.currentTarget.style.backgroundColor = "var(--primary-50)";
//                                         e.currentTarget.style.borderColor = "var(--accent-400)";
//                                         e.currentTarget.style.color = "var(--accent-600)";
//                                     }}
//                                     onMouseLeave={(e) => {
//                                         e.currentTarget.style.backgroundColor = "white";
//                                         e.currentTarget.style.borderColor = "var(--primary-200)";
//                                         e.currentTarget.style.color = "var(--primary-700)";
//                                     }}
//                                 >
//                                     <Share2 size={20} />
//                                     Share
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Trust Badges */}
//                         <div className="grid grid-cols-2 gap-4 p-4 mb-8 lg:grid-cols-4 rounded-xl" style={{
//                             backgroundColor: "var(--primary-50)",
//                             border: "1px solid var(--primary-100)"
//                         }}>
//                             <div className="flex flex-col items-center text-center">
//                                 <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full" style={{
//                                     backgroundColor: "var(--accent-100)",
//                                     color: "var(--accent-600)"
//                                 }}>
//                                     <Truck size={24} />
//                                 </div>
//                                 <span className="text-sm font-medium" style={{ color: "var(--primary-700)" }}>
//                                     Free Shipping
//                                 </span>
//                             </div>
//                             <div className="flex flex-col items-center text-center">
//                                 <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full" style={{
//                                     backgroundColor: "var(--secondary-100)",
//                                     color: "var(--secondary-600)"
//                                 }}>
//                                     <RefreshCw size={24} />
//                                 </div>
//                                 <span className="text-sm font-medium" style={{ color: "var(--primary-700)" }}>
//                                     7-Day Returns
//                                 </span>
//                             </div>
//                             <div className="flex flex-col items-center text-center">
//                                 <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full" style={{
//                                     backgroundColor: "var(--warning-100)",
//                                     color: "var(--warning-600)"
//                                 }}>
//                                     <Shield size={24} />
//                                 </div>
//                                 <span className="text-sm font-medium" style={{ color: "var(--primary-700)" }}>
//                                     1 Year Warranty
//                                 </span>
//                             </div>
//                             <div className="flex flex-col items-center text-center">
//                                 <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full" style={{
//                                     backgroundColor: "var(--primary-100)",
//                                     color: "var(--primary-600)"
//                                 }}>
//                                     <Check size={24} />
//                                 </div>
//                                 <span className="text-sm font-medium" style={{ color: "var(--primary-700)" }}>
//                                     Authentic Product
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Tags */}
//                         {product.tags?.length > 0 && (
//                             <div className="mb-8">
//                                 <h3 className="flex items-center gap-2 mb-3 text-lg font-bold" style={{ color: "var(--primary-800)" }}>
//                                     <span style={{ color: "var(--accent-500)" }}>🏷️</span> Product Tags
//                                 </h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     {product.tags.map((tag, index) => (
//                                         <span
//                                             key={index}
//                                             className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer hover:scale-105"
//                                             style={{
//                                                 backgroundColor: "var(--primary-50)",
//                                                 color: "var(--primary-700)",
//                                                 border: "1px solid var(--primary-200)"
//                                             }}
//                                             onClick={() => router.push(`/search?tag=${tag}`)}
//                                             onMouseEnter={(e) => {
//                                                 e.currentTarget.style.backgroundColor = "var(--accent-50)";
//                                                 e.currentTarget.style.borderColor = "var(--accent-300)";
//                                                 e.currentTarget.style.color = "var(--accent-700)";
//                                             }}
//                                             onMouseLeave={(e) => {
//                                                 e.currentTarget.style.backgroundColor = "var(--primary-50)";
//                                                 e.currentTarget.style.borderColor = "var(--primary-200)";
//                                                 e.currentTarget.style.color = "var(--primary-700)";
//                                             }}
//                                         >
//                                             #{tag}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Related Products
//                 {relatedProducts.length > 0 && (
//                     <div className="mt-16">
//                         <div className="flex items-center justify-between mb-8">
//                             <h2 className="text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
//                                 <span style={{ color: "var(--accent-600)" }}>✨</span> Related Products
//                             </h2>
//                             <button
//                                 onClick={() => router.push(`/search?tags=${product.tags?.join(",")}`)}
//                                 className="px-4 py-2 text-sm font-medium transition-colors rounded-lg"
//                                 style={{
//                                     backgroundColor: "var(--primary-50)",
//                                     color: "var(--primary-700)"
//                                 }}
//                                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-100)"}
//                                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-50)"}
//                             >
//                                 View All →
//                             </button>
//                         </div>
//                         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                             {relatedProducts.slice(0, 4).map((related) => {
//                                 const relatedDiscountedPrice = calculateDiscountedPrice(related.price, related.discountPercent);
//                                 const relatedIsDiscounted = related.discountPercent > 0;
                                
//                                 return (
//                                     <div
//                                         key={related.id}
//                                         onClick={() => router.push(`/product/${related.id}`)}
//                                         className="overflow-hidden transition-all duration-300 shadow-lg cursor-pointer rounded-xl hover:-translate-y-2"
//                                         style={{
//                                             backgroundColor: "white",
//                                             border: "1px solid var(--primary-100)"
//                                         }}
//                                         onMouseEnter={(e) => {
//                                             e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
//                                         }}
//                                         onMouseLeave={(e) => {
//                                             e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
//                                         }}
//                                     >
//                                         <div className="relative h-48">
//                                             <img 
//                                                 src={related.images?.[0]} 
//                                                 alt={related.name}
//                                                 className="object-cover w-full h-full"
//                                             />
//                                             {relatedIsDiscounted && (
//                                                 <div className="absolute px-3 py-1 text-xs font-bold text-white rounded-full top-2 left-2" style={{
//                                                     background: "linear-gradient(to right, var(--secondary-500), var(--secondary-600))"
//                                                 }}>
//                                                     {related.discountPercent}% OFF
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="p-4">
//                                             <h4 className="mb-2 font-bold line-clamp-1" style={{ color: "var(--primary-800)" }}>
//                                                 {related.name}
//                                             </h4>
//                                             <div className="flex items-center gap-2 mb-2">
//                                                 {relatedIsDiscounted ? (
//                                                     <>
//                                                         <span className="font-bold" style={{ color: "var(--primary-900)" }}>
//                                                             {formatPrice(relatedDiscountedPrice)}
//                                                         </span>
//                                                         <span className="text-sm line-through" style={{ color: "var(--primary-500)" }}>
//                                                             {formatPrice(related.price)}
//                                                         </span>
//                                                     </>
//                                                 ) : (
//                                                     <span className="font-bold" style={{ color: "var(--primary-900)" }}>
//                                                         {formatPrice(related.price)}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <div className="flex items-center gap-1">
//                                                 <Star size={14} fill="var(--warning-500)" color="var(--warning-500)" />
//                                                 <span className="text-sm" style={{ color: "var(--primary-600)" }}>
//                                                     {related.rating.toFixed(1)} ({related.reviewCount})
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 )} */}
//             </div>
//         </div>
//     );
// }