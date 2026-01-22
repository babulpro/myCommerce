const ProductNotFound = ({ router }) => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-md mx-4 text-center">
            <div className="mb-6 text-7xl text-primary-400">😔</div>
            <h2 className="mb-3 text-2xl font-bold text-primary-800">
                Product Not Found
            </h2>
            <p className="mb-8 text-primary-600">
                The product you're looking for doesn't exist or has been removed.
            </p>
            <button 
                onClick={() => router.push("/")}
                className="px-8 py-3 font-bold text-white transition-all duration-300 transform rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 hover:shadow-xl hover:-translate-y-0.5"
            >
                ← Back to Shopping
            </button>
        </div>
    </div>
);

export default ProductNotFound;