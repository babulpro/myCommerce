"use client"

export default function CategoriesLoading({ variant = 'desktop' }) {
    if (variant === 'mobile') {
        return (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-25)' }}>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{
                        borderColor: 'var(--primary-200)',
                        borderTopColor: 'var(--accent-500)'
                    }}></div>
                    <span className="text-sm" style={{ color: 'var(--primary-600)' }}>Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 text-center">
            <div className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{
                borderColor: 'var(--primary-200)',
                borderTopColor: 'var(--accent-500)'
            }}></div>
        </div>
    )
}