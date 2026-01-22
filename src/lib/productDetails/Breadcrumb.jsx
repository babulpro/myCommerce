const Breadcrumb = ({ productName, router }) => (
    <div className="py-4 bg-primary-50">
        <div className="px-4 mx-auto sm:container">
            <div className="flex items-center gap-2 text-sm">
                <button 
                    onClick={() => router.push("/")}
                    className="font-medium text-primary-600 hover:underline"
                >
                    Home
                </button>
                <span className="text-primary-400">›</span>
                <span className="font-medium text-primary-800 line-clamp-1">
                    {productName}
                </span>
            </div>
        </div>
    </div>
);

export default Breadcrumb;