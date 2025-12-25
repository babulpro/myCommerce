"use client"
import Link from "next/link";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, isInWishlist, onToggleWishlist }) {
  const calculateDiscountedPrice = (price, discountPercent) => {
    if (!discountPercent) return price;
    return price - (price * discountPercent / 100);
  };

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
  const isDiscounted = product.discountPercent > 0;

  return (
    <div className="overflow-hidden transition-all duration-500 bg-white border-2 shadow-lg group rounded-xl lg:rounded-2xl hover:-translate-y-2 border-primary-100 hover:shadow-2xl">
      {/* Product Image */}
      <div className="relative">
        <Link href={`/pages/product/detail/${product.id}`} className="block">
          <div className="relative h-56 overflow-hidden lg:h-72 bg-gradient-to-br from-primary-25 to-primary-50">
            <img 
              src={product.images?.[0] || "https://via.placeholder.com/300x300"} 
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Wishlist Button */}
            <WishlistButton
              productId={product.id}
              productName={product.name}
              isInWishlist={isInWishlist}
              onToggleWishlist={onToggleWishlist}
              variant="floating"
            />
            
            {/* Badges */}
            {isDiscounted && (
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-secondary-500 to-secondary-600 lg:top-4 lg:left-4 lg:px-4 lg:py-1.5">
                🔥 {product.discountPercent}%
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 lg:p-6">
        {/* Category and Wishlist */}
        {product.category && (
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full lg:px-4 lg:py-1.5 lg:text-sm bg-primary-50 text-primary-700">
              {product.category}
            </span>
            
            <WishlistButton
              productId={product.id}
              productName={product.name}
              isInWishlist={isInWishlist}
              onToggleWishlist={onToggleWishlist}
              variant="inline"
            />
          </div>
        )}
        
        {/* Product Name */}
        <h3 className="mb-2 text-lg font-bold transition-colors lg:text-xl lg:mb-3 line-clamp-1 text-primary-900 hover:text-accent-600">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4 lg:gap-3 lg:mb-6">
          {isDiscounted ? (
            <>
              <span className="text-xl font-bold lg:text-2xl text-primary-900">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="text-base line-through lg:text-lg text-primary-500">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold lg:text-2xl text-primary-900">
              ${product.price}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 lg:gap-3">
          <AddToCartButton product={product} />
          
          <Link 
            href={`/pages/product/detail/${product.id}`}
            className="flex-1 px-4 py-2 text-sm font-medium transition-all duration-300 border-2 rounded-lg lg:px-6 lg:py-3 lg:rounded-xl lg:text-base border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-accent-400 hover:text-accent-600"
          >
            👁️ View Details
          </Link>
        </div>
      </div>
    </div>
  );
}