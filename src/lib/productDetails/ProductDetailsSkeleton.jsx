const ProductDetailsSkeleton = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 rounded-full animate-spin border-primary-400 border-t-accent-600"></div>
            <p className="text-lg font-bold text-primary-700">
                Loading product details...
            </p>
        </div>
    </div>
);

export default ProductDetailsSkeleton;