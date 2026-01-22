"use client"

import Link from 'next/link'

export default function CategoryItem({ 
    category, 
    variant = 'desktop', 
    onClick 
}) {
    const { id, name } = category
    
    if (variant === 'mobile') {
        return (
            <Link
                href={`/pages/categoryPage/${name}?id=${id}`}
                onClick={onClick}
                className="flex items-center justify-between p-3 transition-all duration-200 rounded-lg hover:shadow-sm group"
                style={{ backgroundColor: 'var(--primary-25)' }}
            >
                <span className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                    {name}
                </span>
                <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ color: 'var(--accent-500)' }}>
                    →
                </span>
            </Link>
        )
    }

    // Desktop variant
    return (
        <Link
            href={`/pages/categoryPage/${name}?id=${id}`}
            className="flex items-center justify-between p-3 mb-2 transition-all duration-200 rounded-xl hover:shadow-md group/item last:mb-0"
            style={{
                backgroundColor: 'var(--primary-25)'
            }}
        >
            <span className="font-medium transition-all duration-200 group-hover/item:font-semibold" style={{ color: 'var(--primary-700)' }}>
                {name}
            </span>
            <span className="transition-opacity duration-300 opacity-0 group-hover/item:opacity-100" style={{ color: 'var(--accent-500)' }}>
                →
            </span>
        </Link>
    )
}