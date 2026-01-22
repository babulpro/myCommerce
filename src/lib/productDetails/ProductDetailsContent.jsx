"use client";
import React, { useState } from "react";
import ProductImagesGallery from "./ProductImagesGallery";
import Breadcrumb from "./Breadcrumb";
import ProductInfo from "./ProductInfo";
import ProductCharacteristics from "./ProductCharacteristics";
import ProductActions from "./ProductAction";
import TrustBadges from "./TrustBadge";
import ProductTags from "./ProductTags";
import { Check } from "lucide-react";
 

const ProductDetailsContent = ({ product, router }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.color?.[0] || "");
    const [selectedSize, setSelectedSize] = useState(product.size?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-500 to-slate-700">
            <Breadcrumb productName={product.name} router={router} />
            
            <div className="px-4 py-6 mx-auto sm:py-8 sm:container">
                <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12">
                    {/* Left Column - Images */}
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <ProductImagesGallery 
                            product={product}
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                        />
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="flex flex-col gap-6 sm:gap-8">
                        <ProductInfo 
                            product={product}
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                        />
                        
                        <ProductCharacteristics characteristics={product.char} />
                        
                        {/* Color & Size Selection */}
                        {product.color?.length > 0 && (
                            <ColorSelector 
                                colors={product.color}
                                selectedColor={selectedColor}
                                onSelectColor={setSelectedColor}
                            />
                        )}
                        
                        {product.size?.length > 0 && (
                            <SizeSelector 
                                sizes={product.size}
                                selectedSize={selectedSize}
                                onSelectSize={setSelectedSize}
                            />
                        )}

                        {/* Actions */}
                        <ProductActions 
                            product={product}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                            isWishlisted={isWishlisted}
                            setIsWishlisted={setIsWishlisted}
                            router={router}
                        />

                        <TrustBadges />
                        
                        {product.tags?.length > 0 && (
                            <ProductTags tags={product.tags} router={router} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Color Selector Component
const ColorSelector = ({ colors, selectedColor, onSelectColor }) => (
    <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold text-primary-800 sm:mb-3">
            Color: <span className="font-bold text-accent-600">{selectedColor}</span>
        </h4>
        <div className="flex gap-2 pb-2 overflow-x-auto sm:overflow-visible sm:gap-3 sm:pb-0">
            {colors.map((color, index) => (
                <button
                    key={index}
                    onClick={() => onSelectColor(color)}
                    className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-200 active:scale-95 ${
                        selectedColor === color ? "ring-2 ring-offset-1 sm:ring-offset-2 ring-accent-500" : "hover:scale-110"
                    }`}
                    style={{
                        backgroundColor: color.toLowerCase(),
                        borderColor: selectedColor === color ? "var(--accent-500)" : "white",
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
);

// Size Selector Component
const SizeSelector = ({ sizes, selectedSize, onSelectSize }) => (
    <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold text-primary-800 sm:mb-3">
            Size: <span className="font-bold text-accent-600">{selectedSize}</span>
        </h4>
        <div className="flex gap-2 pb-2 overflow-x-auto sm:flex-wrap sm:overflow-visible sm:gap-3 sm:pb-0">
            {sizes.map((size, index) => (
                <button
                    key={index}
                    onClick={() => onSelectSize(size)}
                    className={`flex-shrink-0 px-4 py-2 text-base font-bold rounded-lg border-2 transition-all duration-200 active:scale-95 sm:px-6 sm:py-3 sm:text-lg sm:rounded-xl ${
                        selectedSize === size ? "scale-105 bg-gradient-to-r from-accent-500 to-accent-600 text-white border-accent-500 shadow-md" 
                        : "bg-white text-primary-700 border-primary-200 hover:scale-105"
                    }`}
                >
                    {size}
                </button>
            ))}
        </div>
    </div>
);

export default ProductDetailsContent;