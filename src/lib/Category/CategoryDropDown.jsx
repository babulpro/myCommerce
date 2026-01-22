"use client"

import Link from 'next/link'
import useGetCategory from './GetCategory'
 
export default function CategoriesDropdown({ isMobile = false, onClose }) {
    const { data, loading } = useGetCategory()

    const handleLinkClick = () => {
        if (isMobile && onClose) {
            onClose()
        }
    }

    if (isMobile) {
        return (
            <div>
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--primary-25)' }}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                        <span className="text-lg">📂</span>
                    </div>
                    <span className="font-medium" style={{ color: 'var(--primary-800)' }}>Categories</span>
                </div>
                
                {/* Categories List */}
                <div className="pl-4 mt-2 ml-4 space-y-2 border-l-2" style={{ borderColor: 'var(--primary-100)' }}>
                    {loading ? (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-25)' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{
                                    borderColor: 'var(--primary-200)',
                                    borderTopColor: 'var(--accent-500)'
                                }}></div>
                                <span className="text-sm" style={{ color: 'var(--primary-600)' }}>Loading...</span>
                            </div>
                        </div>
                    ) : data.length > 0 ? (
                        data.map((category, index) => (
                            <Link
                                key={category.id || index}
                                href={`/pages/categoryPage/${category.name}?id=${category.id}`}
                                onClick={handleLinkClick}
                                className="flex items-center justify-between p-3 transition-all duration-200 rounded-lg hover:shadow-sm group"
                                style={{ backgroundColor: 'var(--primary-25)' }}
                            >
                                <span className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                    {category.name}
                                </span>
                                <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ color: 'var(--accent-500)' }}>
                                    →
                                </span>
                            </Link>
                        ))
                    ) : (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-25)' }}>
                            <span className="text-sm" style={{ color: 'var(--primary-600)' }}>No categories</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Desktop version
    return (
        <div className="absolute left-0 invisible w-64 mt-2 transition-all duration-300 transform translate-y-2 opacity-0 top-full group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            <div className="overflow-hidden bg-white border shadow-2xl rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                <div className="p-3 overflow-y-auto max-h-96">
                    {loading ? (
                        <div className="p-4 text-center">
                            <div className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{
                                borderColor: 'var(--primary-200)',
                                borderTopColor: 'var(--accent-500)'
                            }}></div>
                        </div>
                    ) : data.length > 0 ? (
                        data.map((category, index) => (
                            <Link
                                key={category.id || index}
                                href={`/pages/categoryPage/${category.name}?id=${category.id}`}
                                className="flex items-center justify-between p-3 mb-2 transition-all duration-200 rounded-xl hover:shadow-md group/item last:mb-0"
                                style={{
                                    backgroundColor: 'var(--primary-25)'
                                }}
                            >
                                <span className="font-medium transition-all duration-200 group-hover/item:font-semibold" style={{ color: 'var(--primary-700)' }}>
                                    {category.name}
                                </span>
                                <span className="transition-opacity duration-300 opacity-0 group-hover/item:opacity-100" style={{ color: 'var(--accent-500)' }}>
                                    →
                                </span>
                            </Link>
                        ))
                    ) : (
                        <div className="p-4 text-center" style={{ color: 'var(--primary-600)' }}>
                            <span className="block mb-2 text-2xl">📭</span>
                            No categories
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}