const ProductTags = ({ tags, router }) => (
    <div className="mt-6 sm:mt-8">
        <h3 className="flex items-center gap-2 mb-2 text-lg font-bold text-primary-800 sm:mb-3">
            <span className="text-accent-500">🏷️</span> Product Tags
        </h3>
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <button
                    key={index}
                    onClick={() => router.push(`/search?tag=${tag}`)}
                    className="px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-lg bg-primary-50 text-primary-700 border border-primary-200 active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
                >
                    #{tag}
                </button>
            ))}
        </div>
    </div>
);

export default ProductTags;