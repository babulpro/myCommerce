import Link from "next/link";

// components/ProductCard.js
export default function ProductCard({ product }) {
  // Safe data access
  const images = product?.images || [];
  const primaryImage = images[0] || '/placeholder-image.jpg';
  const colors = product?.color || [];
  const sizes = product?.size || [];
  const itemName = product?.item?.name || 'Uncategorized';
  const discountPercent = product?.discountPercent || 0;
  
  // Calculate discounted price
  const discountedPrice = product?.price ? product.price - (product.price * discountPercent / 100) : 0;

  return (
    <div className="card bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
      <figure className="relative overflow-hidden rounded-t-xl">
        <img 
          src={primaryImage} 
          alt={product?.name || 'Product image'}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-error text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{discountPercent}%
          </div>
        )}
        
        {/* Featured Badge */}
        {product?.featured && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
            Featured
          </div>
        )}
      </figure>
      
      <div className="card-body p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 uppercase font-medium mb-1">
          {itemName}
        </div>
        
        {/* Product Name */}
        <Link key={product.id} href={`/pages/product/${product.id}`} className="card-title text-lg font-semibold text-gray-900 line-clamp-1 mb-2">
          {product?.name || 'Product Name'}
        </Link>
        
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {product?.description || 'Product description'}
        </p>
        
        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary-700">
            ${discountedPrice.toFixed(2)}
          </span>
          
          {discountPercent > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ${product?.price?.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Inventory Status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${product?.inventory > 0 ? 'text-success' : 'text-error'}`}>
            {product?.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
          </span>
        </div>
        
        {/* Action Buttons */}
        {/* <div className="card-actions">
          <button 
            className="btn bg-primary-600 text-white hover:bg-primary-700 border-0 flex-1"
            disabled={!product?.inventory || product.inventory === 0}
          >
            {product?.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
         
        </div> */}
      </div>
    </div>
  );
}