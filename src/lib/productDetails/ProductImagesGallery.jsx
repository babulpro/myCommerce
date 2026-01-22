"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const ProductImagesGallery = ({ product, selectedImage, setSelectedImage }) => {
    const [imageZoom, setImageZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleImageHover = (e) => {
        if (!imageZoom) return;
        
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
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

    const isDiscounted = product.discountPercent > 0;

    return (
        <>
            {/* Main Image with Zoom */}
            <div 
                className="relative overflow-hidden bg-white border-2 shadow-lg rounded-xl sm:rounded-2xl border-primary-100"
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
                                className="absolute flex items-center justify-center w-10 h-10 transition-all duration-200 -translate-y-1/2 border-2 rounded-full shadow-lg bg-slate-800 left-2 sm:left-4 top-1/2 hover:scale-110 active:scale-95 border-primary-200 text-primary-700"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute flex items-center justify-center w-10 h-10 transition-all duration-200 -translate-y-1/2 border-2 rounded-full shadow-lg bg-slate-800 right-2 sm:right-4 top-1/2 hover:scale-110 active:scale-95 border-primary-200 text-primary-700"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute flex flex-col gap-1 top-2 left-2 sm:top-4 sm:left-4 sm:gap-2">
                        {product.featured && (
                            <span className="px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-accent-500 to-accent-600 sm:px-4 sm:py-2 sm:text-sm">
                                ⭐ Featured
                            </span>
                        )}
                        {isDiscounted && (
                            <span className="px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-secondary-500 to-secondary-600 sm:px-4 sm:py-2 sm:text-sm">
                                🔥 {product.discountPercent}% OFF
                            </span>
                        )}
                    </div>
                    
                    {/* Zoom Indicator */}
                    {imageZoom && (
                        <div className="absolute hidden px-3 py-1.5 text-xs font-medium bg-white rounded-lg bottom-4 right-4 sm:block bg-opacity-90 text-primary-700 border border-primary-200">
                            🔍 Hover to zoom
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
                <div className="flex gap-2 pb-2 mt-3 overflow-x-auto sm:mt-4 sm:pb-0">
                    {product.images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 active:scale-95 ${
                                selectedImage === index ? "scale-105 ring-2 ring-accent-500 border-accent-500" : "border-primary-200 hover:scale-105"
                            }`}
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
        </>
    );
};

// Make sure you have this default export
export default ProductImagesGallery;