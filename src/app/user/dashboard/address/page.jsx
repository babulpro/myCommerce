import React from "react"

export default function AddressPage() {
    const addresses = [
        {
            id: 1,
            type: "Home",
            default: true,
            name: "John Doe",
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            phone: "(123) 456-7890"
        },
        {
            id: 2,
            type: "Work",
            default: false,
            name: "John Doe",
            street: "456 Business Ave",
            city: "Brooklyn",
            state: "NY",
            zipCode: "11201",
            phone: "(123) 456-7890"
        },
        {
            id: 3,
            type: "Parents' Home",
            default: false,
            name: "John Doe",
            street: "789 Family Road",
            city: "Queens",
            state: "NY",
            zipCode: "11355",
            phone: "(098) 765-4321"
        }
    ]

    return (
        <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--primary-25)' }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold" style={{ color: 'var(--primary-900)' }}>
                        My Addresses
                    </h1>
                    <p className="text-lg" style={{ color: 'var(--primary-600)' }}>
                        Manage your shipping and billing addresses
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Add New Address Card */}
                    <div className="lg:col-span-3">
                        <div className="p-6 mb-8 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                                    Add New Address
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                        Address Type
                                    </label>
                                    <select className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }}>
                                        <option>Home</option>
                                        <option>Work</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                        Full Name
                                    </label>
                                    <input type="text" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} placeholder="John Doe" />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                        Street Address
                                    </label>
                                    <input type="text" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} placeholder="123 Main Street" />
                                </div>
                                
                                <div>
                                    <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                        City
                                    </label>
                                    <input type="text" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} placeholder="New York" />
                                </div>
                                
                                <div>
                                    <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                        State
                                    </label>
                                    <input type="text" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} placeholder="NY" />
                                </div>
                                
                                <div>
                                    <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                        ZIP Code
                                    </label>
                                    <input type="text" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} placeholder="10001" />
                                </div>
                                
                                <div>
                                    <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                        Phone Number
                                    </label>
                                    <input type="tel" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} placeholder="(123) 456-7890" />
                                </div>
                                
                                <div className="flex items-center gap-4 mt-4 md:col-span-2">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="default" className="mr-2" />
                                        <label htmlFor="default" style={{ color: 'var(--primary-700)' }}>
                                            Set as default address
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <button className="w-full py-3 font-bold transition-all duration-300 rounded-lg hover:shadow-lg"
                                        style={{ 
                                            backgroundColor: 'var(--accent-500)',
                                            color: 'white'
                                        }}>
                                        Add Address
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Existing Addresses */}
                    <div className="lg:col-span-3">
                        <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                            Saved Addresses
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {addresses.map((address) => (
                                <div key={address.id} className="relative p-6 bg-white border shadow-sm rounded-2xl"
                                    style={{ 
                                        borderColor: address.default ? 'var(--accent-400)' : 'var(--primary-100)',
                                        borderWidth: address.default ? '2px' : '1px'
                                    }}>
                                    
                                    {address.default && (
                                        <div className="absolute px-3 py-1 text-xs font-bold rounded-full -top-2 -right-2"
                                            style={{ 
                                                backgroundColor: 'var(--accent-500)',
                                                color: 'white'
                                            }}>
                                            Default
                                        </div>
                                    )}
                                    
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold" style={{ color: 'var(--primary-900)' }}>
                                                {address.type}
                                            </h3>
                                            <span className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                                {address.name}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 rounded-lg hover:bg-gray-100" title="Edit">
                                                <span>✏️</span>
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-gray-100" title="Delete">
                                                <span>🗑️</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6 space-y-2">
                                        <p style={{ color: 'var(--primary-800)' }}>{address.street}</p>
                                        <p style={{ color: 'var(--primary-800)' }}>{address.city}, {address.state} {address.zipCode}</p>
                                        <p style={{ color: 'var(--primary-800)' }}>Phone: {address.phone}</p>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 text-sm font-medium transition-colors rounded-lg"
                                            style={{ 
                                                backgroundColor: address.default ? 'var(--accent-100)' : 'var(--primary-100)',
                                                color: address.default ? 'var(--accent-700)' : 'var(--primary-700)'
                                            }}
                                            disabled={address.default}>
                                            {address.default ? 'Default Address' : 'Set as Default'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}