export default function WishlistPage() {
    const wishlistItems = [
        {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 129.99,
            originalPrice: 199.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            category: "Electronics",
            rating: 4.5,
            stock: 15
        },
        {
            id: 2,
            name: "Smart Watch Series 8",
            price: 299.99,
            originalPrice: 399.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=400&fit=crop",
            category: "Wearables",
            rating: 4.8,
            stock: 8
        },
        {
            id: 3,
            name: "Organic Cotton T-Shirt",
            price: 24.99,
            originalPrice: 34.99,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
            category: "Fashion",
            rating: 4.3,
            stock: 42
        },
        {
            id: 4,
            name: "Ceramic Coffee Mug Set",
            price: 39.99,
            originalPrice: 49.99,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop",
            category: "Home",
            rating: 4.7,
            stock: 23
        },
        {
            id: 5,
            name: "Gaming Keyboard RGB",
            price: 89.99,
            originalPrice: 129.99,
            image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
            category: "Gaming",
            rating: 4.6,
            stock: 12
        },
        {
            id: 6,
            name: "Yoga Mat Premium",
            price: 34.99,
            originalPrice: 49.99,
            image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
            category: "Fitness",
            rating: 4.4,
            stock: 31
        }
    ]

    return (
        <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--primary-25)' }}>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold" style={{ color: 'var(--primary-900)' }}>
                        My Wishlist
                    </h1>
                    <p className="text-lg" style={{ color: 'var(--primary-600)' }}>
                        {wishlistItems.length} items saved for later
                    </p>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="overflow-hidden transition-all duration-300 bg-white border shadow-sm rounded-2xl hover:shadow-lg">
                            <div className="relative">
                                <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="object-cover w-full h-48"
                                />
                                <button className="absolute flex items-center justify-center w-10 h-10 transition-colors bg-white rounded-full shadow-md top-3 right-3 hover:bg-red-50"
                                        style={{ color: 'var(--error-500)' }}>
                                    <span className="text-xl">❤️</span>
                                </button>
                                
                                {item.originalPrice > item.price && (
                                    <div className="absolute px-2 py-1 text-xs font-bold text-white bg-red-500 rounded top-3 left-3">
                                        SALE
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4">
                                <div className="mb-2">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full" 
                                          style={{ 
                                            backgroundColor: 'var(--primary-100)',
                                            color: 'var(--primary-700)'
                                          }}>
                                        {item.category}
                                    </span>
                                </div>
                                
                                <h3 className="mb-2 font-bold line-clamp-2" style={{ color: 'var(--primary-900)' }}>
                                    {item.name}
                                </h3>
                                
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center">
                                        <span className="mr-1 text-yellow-500">★</span>
                                        <span className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                            {item.rating}
                                        </span>
                                    </div>
                                    <span className="mx-2" style={{ color: 'var(--primary-300)' }}>•</span>
                                    <span className="text-sm" style={{ color: item.stock > 10 ? 'var(--success-600)' : 'var(--warning-600)' }}>
                                        {item.stock > 10 ? 'In Stock' : 'Low Stock'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                                            ${item.price}
                                        </span>
                                        {item.originalPrice > item.price && (
                                            <span className="ml-2 text-sm line-through" style={{ color: 'var(--primary-400)' }}>
                                                ${item.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-md active:scale-95"
                                            style={{ 
                                                backgroundColor: 'var(--accent-500)',
                                                color: 'white'
                                            }}>
                                        Add to Cart
                                    </button>
                                    <button className="flex items-center justify-center w-12 transition-colors border rounded-lg"
                                            style={{ 
                                                borderColor: 'var(--primary-200)',
                                                color: 'var(--primary-600)'
                                            }}
                                            title="Quick View">
                                        <span>👁️</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State (commented out) */}
                {/* 
                <div className="py-16 text-center">
                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 text-4xl rounded-full"
                         style={{ backgroundColor: 'var(--primary-100)' }}>
                        ❤️
                    </div>
                    <h3 className="mb-2 text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>
                        Your wishlist is empty
                    </h3>
                    <p className="mb-6" style={{ color: 'var(--primary-600)' }}>
                        Save items you love for later
                    </p>
                    <button className="px-6 py-3 font-bold transition-all duration-300 rounded-lg hover:shadow-lg"
                            style={{ 
                                backgroundColor: 'var(--accent-500)',
                                color: 'white'
                            }}>
                        Start Shopping
                    </button>
                </div>
                */}

                {/* Summary */}
                <div className="p-6 mt-8 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div>
                            <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--primary-900)' }}>
                                Wishlist Summary
                            </h3>
                            <p style={{ color: 'var(--primary-600)' }}>
                                Total estimated value: <span className="text-xl font-bold" style={{ color: 'var(--accent-600)' }}>
                                    $619.94
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-3 font-bold transition-all duration-300 border rounded-lg hover:shadow-md"
                                    style={{ 
                                        borderColor: 'var(--primary-200)',
                                        color: 'var(--primary-700)'
                                    }}>
                                Share Wishlist
                            </button>
                            <button className="px-6 py-3 font-bold transition-all duration-300 rounded-lg hover:shadow-lg"
                                    style={{ 
                                        backgroundColor: 'var(--accent-500)',
                                        color: 'white'
                                    }}>
                                Add All to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}