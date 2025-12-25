// import Link from "next/link";

// // components/ProductCard.js
// export default function ProductCard({ product }) {
//   // Safe data access
//   const images = product?.images || [];
//   const primaryImage = images[0] || '/placeholder-image.jpg';
//   const colors = product?.color || [];
//   const sizes = product?.size || [];
//   const itemName = product?.item?.name || 'Uncategorized';
//   const discountPercent = product?.discountPercent || 0;
  
//   // Calculate discounted price
//   const discountedPrice = product?.price ? product.price - (product.price * discountPercent / 100) : 0;

//   return (
//     <div className="transition-all duration-300 bg-white border border-gray-200 shadow-sm card rounded-xl hover:shadow-md group">
//       <figure className="relative overflow-hidden rounded-t-xl">
//         <img 
//           src={primaryImage} 
//           alt={product?.name || 'Product image'}
//           className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
//         />
        
//         {/* Discount Badge */}
//         {discountPercent > 0 && (
//           <div className="absolute px-2 py-1 text-sm font-semibold text-white rounded-md top-3 left-3 bg-error">
//             -{discountPercent}%
//           </div>
//         )}
        
//         {/* Featured Badge */}
//         {product?.featured && (
//           <div className="absolute px-2 py-1 text-sm font-semibold text-white rounded-md top-3 right-3 bg-primary-600">
//             Featured
//           </div>
//         )}
//       </figure>
      
//       <div className="p-4 card-body">
//         {/* Category */}
//         <div className="mb-1 text-xs font-medium text-gray-500 uppercase">
//           {itemName}
//         </div>
        
//         {/* Product Name */}
//         <Link key={product.id} href={`/pages/product/${product.id}`} className="mb-2 text-lg font-semibold text-gray-900 card-title line-clamp-1">
//           {product?.name || 'Product Name'}
//         </Link>
        
//         {/* Description */}
//         <p className="mb-3 text-sm text-gray-600 line-clamp-2">
//           {product?.description || 'Product description'}
//         </p>
        
//         {/* Price Section */}
//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-xl font-bold text-primary-700">
//             ${discountedPrice.toFixed(2)}
//           </span>
          
//           {discountPercent > 0 && (
//             <span className="text-sm text-gray-500 line-through">
//               ${product?.price?.toFixed(2)}
//             </span>
//           )}
//         </div>
        
//         {/* Inventory Status */}
//         <div className="flex items-center justify-between mb-3">
//           <span className={`text-sm font-medium ${product?.inventory > 0 ? 'text-success' : 'text-error'}`}>
//             {product?.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
//           </span>
//         </div>
        
//         {/* Action Buttons */}
//         {/* <div className="card-actions">
//           <button 
//             className="flex-1 text-white border-0 btn bg-primary-600 hover:bg-primary-700"
//             disabled={!product?.inventory || product.inventory === 0}
//           >
//             {product?.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
//           </button>
         
//         </div> */}
//       </div>
//     </div>
//   );
// }