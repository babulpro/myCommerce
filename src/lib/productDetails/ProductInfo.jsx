import React from "react";
import { Star, Package } from "lucide-react";

const ProductInfo = ({ product, selectedColor, selectedSize }) => {
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

    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
    const isDiscounted = product.discountPercent > 0;
    const stockStatus = product.inventory > 10 ? "In Stock" : product.inventory > 0 ? "Low Stock" : "Out of Stock";
    const stockColor = product.inventory > 10 ? "text-accent-600" : product.inventory > 0 ? "text-warning-600" : "text-neutral-600";
    const stockBg = product.inventory > 10 ? "bg-accent-50 border-accent-200" : 
                    product.inventory > 0 ? "bg-warning-50 border-warning-200" : "bg-neutral-50 border-neutral-200";

    return (
        <>
            {/* Brand & Category */}
            <div className="flex flex-wrap gap-2 mb-2 sm:gap-4">
                {product.brand && (
                    <span className="px-3 py-1.5 text-sm font-bold rounded-lg bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700">
                        {product.brand}
                    </span>
                )}
                {product.type && (
                    <span className="px-3 py-1.5 text-sm font-bold rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 border border-primary-200">
                        {product.type}
                    </span>
                )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl font-bold text-primary-900 sm:text-3xl lg:text-4xl">
                {product.name}
            </h1>

            {/* Rating & Stock */}
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
                    <span className="ml-2 font-bold text-primary-700">
                        {product.rating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-sm text-primary-500 sm:text-base">
                        ({product.reviewCount} reviews)
                    </span>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full w-fit ${stockBg} ${stockColor}`}>
                    <Package size={14} />
                    {stockStatus}
                </div>
            </div>

            {/* Price */}
            <div className="mt-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
                    <span className="text-3xl font-bold text-primary-900 sm:text-4xl lg:text-5xl">
                        {formatPrice(discountedPrice)}
                    </span>
                    {isDiscounted && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xl line-through text-primary-400 sm:text-2xl">
                                {formatPrice(product.price)}
                            </span>
                            <span className="px-3 py-1 text-sm font-bold rounded-lg bg-secondary-100 text-secondary-700">
                                Save {product.discountPercent}%
                            </span>
                        </div>
                    )}
                </div>
                <p className="mt-1 text-sm text-primary-600 sm:text-base">
                    {product.inventory} units available • Free shipping
                </p>
            </div>

            {/* Description */}
            <div className="mt-4">
                <h3 className="flex items-center gap-2 mb-2 text-lg font-bold text-primary-800 sm:mb-3">
                    <span className="text-accent-500">📄</span> Description
                </h3>
                <p className="text-sm leading-relaxed text-primary-600 sm:text-base sm:leading-loose">
                    {product.description}
                </p>
            </div>
        </>
    );
};

export default ProductInfo;