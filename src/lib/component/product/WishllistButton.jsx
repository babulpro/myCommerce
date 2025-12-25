"use client"

export default function WishlistButton({ 
  productId, 
  productName, 
  isInWishlist, 
  onToggleWishlist,
  variant = "floating" // "floating" | "inline" | "simple"
}) {
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(productId, productName);
  };

  if (variant === "floating") {
    return (
      <button
        onClick={handleClick}
        className="absolute z-10 flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 opacity-0 top-3 right-3 group-hover:opacity-100 hover:scale-110 text-slate-600"
        title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg shadow-gray-400">
          <span className={`text-xl transition-all duration-300 ${isInWishlist ? 'scale-125' : ''} ${isInWishlist ? 'text-error-500' : 'text-primary-500'}`}>
            {isInWishlist ? '❤️' : '🤍'}
          </span>
        </div>
        <span className="mt-1 text-xs font-medium whitespace-nowrap text-slate-700">
          {isInWishlist ? 'Added' : 'Wishlist'}
        </span>
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleClick}
        className="p-2 ml-auto transition-all duration-300 rounded-full hover:bg-gray-50 text-slate-600"
        title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <span className={`text-lg transition-transform duration-300 hover:scale-110 ${isInWishlist ? 'animate-pulse' : ''} ${isInWishlist ? 'text-error-500' : 'text-primary-400'}`}>
          {isInWishlist ? '❤️' : '🤍'}
        </span>
      </button>
    );
  }

  // Simple variant
  return (
    <button
      onClick={handleClick}
      className="p-2 transition-all duration-300 rounded-full hover:bg-gray-100"
      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <span className={isInWishlist ? 'text-error-500' : 'text-gray-500'}>
        {isInWishlist ? '❤️' : '🤍'}
      </span>
    </button>
  );
}