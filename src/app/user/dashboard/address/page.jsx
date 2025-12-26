"use client"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Home, Edit, Save, X, Loader, CheckCircle, AlertCircle } from "lucide-react"

export default function AddressPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [address, setAddress] = useState({
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Bangladesh",
        phone: ""
    })
    const [originalAddress, setOriginalAddress] = useState(null)
    const [hasExistingAddress, setHasExistingAddress] = useState(false)

    // Fetch existing address on component mount
    useEffect(() => {
        fetchAddress()
    }, [])

    const fetchAddress = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/auth/userAddress', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                if (data.status === "success" && data.msg && data.msg.length > 0) {
                    // Get the first address from the array
                    const userAddress = data.msg[0]
                    setAddress(userAddress)
                    setOriginalAddress(userAddress)
                    setHasExistingAddress(true)
                    setIsEditing(false) // Reset to view mode when data is loaded
                } else {
                    // No address exists yet
                    setHasExistingAddress(false)
                    setIsEditing(true) // Switch to add mode if no address
                }
            } else {
                throw new Error("Failed to fetch address")
            }
        } catch (error) {
            console.error("Error fetching address:", error)
            alert("Failed to load address. Please refresh the page.")
        } finally {
            setIsLoading(false)
        }
    }

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setAddress(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            // Always use POST method (API handles both create and update)
            const response = await fetch('/api/auth/userAddress', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(address)
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.msg || "Failed to save address")
            }

            if (data.status === "success") {
                alert(data.msg || "Address saved successfully!")
                await fetchAddress() // Refresh the address data
                setIsEditing(false) // Switch back to view mode
            }

        } catch (error) {
            alert(error.message || "Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelEdit = () => {
        if (originalAddress) {
            setAddress(originalAddress)
            setIsEditing(false)
        } else {
            // If no original address (adding new), clear the form
            setAddress({
                firstName: "",
                lastName: "",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "Bangladesh",
                phone: ""
            })
        }
    }

    const handleDeleteAddress = async () => {
        if (!window.confirm("Are you sure you want to delete your address?")) {
            return
        }

        try {
            // Since we don't have DELETE method in API, we'll clear the address
            // by setting hasExistingAddress to false and showing add form
            setAddress({
                firstName: "",
                lastName: "",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "Bangladesh",
                phone: ""
            })
            setOriginalAddress(null)
            setHasExistingAddress(false)
            setIsEditing(true)
            alert("Address cleared. Save a new address when ready.")
            
        } catch (error) {
            alert(error.message || "Something went wrong. Please try again.")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader className="w-10 h-10 mx-auto mb-4 text-blue-600 animate-spin" />
                    <p className="font-medium text-gray-700">Loading your address...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'var(--primary-25)', borderColor: 'var(--primary-100)' }}>
                <div className="max-w-4xl px-4 py-4 mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="p-2 transition-colors rounded-lg hover:bg-white/50"
                                style={{ color: 'var(--primary-700)' }}
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>
                                    My Address
                                </h1>
                                <p className="mt-1 text-sm" style={{ color: 'var(--primary-600)' }}>
                                    {hasExistingAddress 
                                        ? "Manage your shipping address" 
                                        : "Add your shipping address"}
                                </p>
                            </div>
                        </div>
                        
                        {hasExistingAddress && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg"
                                style={{ 
                                    backgroundColor: 'var(--accent-500)',
                                    color: 'white'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-600)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-500)'}
                            >
                                <Edit className="w-4 h-4" />
                                Edit Address
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2">
                        <div className="p-6 rounded-2xl"
                            style={{ 
                                backgroundColor: 'white',
                                border: '1px solid var(--primary-100)',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                            }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg" 
                                    style={{ 
                                        backgroundColor: hasExistingAddress 
                                            ? 'var(--success-50)' 
                                            : 'var(--primary-50)'
                                    }}>
                                    <Home className="w-5 h-5" 
                                        style={{ 
                                            color: hasExistingAddress 
                                                ? 'var(--success-600)' 
                                                : 'var(--primary-600)'
                                        }} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                                        {hasExistingAddress 
                                            ? (isEditing ? "Update Your Address" : "Your Address") 
                                            : "Add Your Address"}
                                    </h2>
                                    <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                        {hasExistingAddress && !isEditing 
                                            ? "This is your current shipping address" 
                                            : "Fill in your details below"}
                                    </p>
                                </div>
                            </div>

                            {/* View Mode */}
                            {hasExistingAddress && !isEditing ? (
                                <div className="space-y-6">
                                    <div className="p-4 rounded-lg" 
                                        style={{ 
                                            backgroundColor: 'var(--primary-25)',
                                            border: '1px solid var(--primary-100)'
                                        }}>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <p className="mb-1 text-sm" style={{ color: 'var(--primary-500)' }}>Full Name</p>
                                                <p className="font-medium" style={{ color: 'var(--primary-800)' }}>
                                                    {address.firstName} {address.lastName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-sm" style={{ color: 'var(--primary-500)' }}>Phone Number</p>
                                                <p className="font-medium" style={{ color: 'var(--primary-800)' }}>{address.phone}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="mb-1 text-sm" style={{ color: 'var(--primary-500)' }}>Street Address</p>
                                                <p className="font-medium" style={{ color: 'var(--primary-800)' }}>{address.street}</p>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-sm" style={{ color: 'var(--primary-500)' }}>City</p>
                                                <p className="font-medium" style={{ color: 'var(--primary-800)' }}>{address.city}</p>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-sm" style={{ color: 'var(--primary-500)' }}>State/Division</p>
                                                <p className="font-medium" style={{ color: 'var(--primary-800)' }}>{address.state}</p>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-sm" style={{ color: 'var(--primary-500)' }}>ZIP Code</p>
                                                <p className="font-medium" style={{ color: 'var(--primary-800)' }}>{address.zipCode}</p>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-sm" style={{ color: 'var(--primary-500)' }}>Country</p>
                                                <p className="font-medium" style={{ color: 'var(--primary-800)' }}>{address.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4 pt-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-6 py-3 font-medium transition-colors rounded-lg"
                                            style={{ 
                                                backgroundColor: 'var(--accent-500)',
                                                color: 'white'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-600)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-500)'}
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Address
                                        </button>
                                        <button
                                            onClick={handleDeleteAddress}
                                            className="px-6 py-3 font-medium transition-colors border rounded-lg"
                                            style={{ 
                                                borderColor: 'var(--error-300)',
                                                color: 'var(--error-600)',
                                                backgroundColor: 'var(--error-50)'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--error-100)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--error-50)'}
                                        >
                                            Delete Address
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Edit/Add Mode */
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={address.firstName}
                                                onChange={onChangeHandler}
                                                required
                                                className="w-full px-4 py-3 transition-all rounded-lg focus:ring-2 focus:outline-none"
                                                style={{ 
                                                    backgroundColor: 'var(--primary-25)',
                                                    border: '1px solid var(--primary-200)',
                                                    color: 'var(--primary-900)'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-400)'}
                                                onBlur={(e) => e.target.style.borderColor = 'var(--primary-200)'}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={address.lastName}
                                                onChange={onChangeHandler}
                                                required
                                                className="w-full px-4 py-3 transition-all rounded-lg focus:ring-2 focus:outline-none"
                                                style={{ 
                                                    backgroundColor: 'var(--primary-25)',
                                                    border: '1px solid var(--primary-200)',
                                                    color: 'var(--primary-900)'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-400)'}
                                                onBlur={(e) => e.target.style.borderColor = 'var(--primary-200)'}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={address.phone}
                                            onChange={onChangeHandler}
                                            required
                                            className="w-full px-4 py-3 transition-all rounded-lg focus:ring-2 focus:outline-none"
                                            style={{ 
                                                backgroundColor: 'var(--primary-25)',
                                                border: '1px solid var(--primary-200)',
                                                color: 'var(--primary-900)'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-400)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--primary-200)'}
                                            placeholder="+880 1XXX XXXXXX"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="street" className="block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                            Street Address *
                                        </label>
                                        <textarea
                                            id="street"
                                            name="street"
                                            value={address.street}
                                            onChange={onChangeHandler}
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 transition-all rounded-lg resize-none focus:ring-2 focus:outline-none"
                                            style={{ 
                                                backgroundColor: 'var(--primary-25)',
                                                border: '1px solid var(--primary-200)',
                                                color: 'var(--primary-900)'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-400)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--primary-200)'}
                                            placeholder="House/Apartment number, Street, Area"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <label htmlFor="city" className="block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={address.city}
                                                onChange={onChangeHandler}
                                                required
                                                className="w-full px-4 py-3 transition-all rounded-lg focus:ring-2 focus:outline-none"
                                                style={{ 
                                                    backgroundColor: 'var(--primary-25)',
                                                    border: '1px solid var(--primary-200)',
                                                    color: 'var(--primary-900)'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-400)'}
                                                onBlur={(e) => e.target.style.borderColor = 'var(--primary-200)'}
                                                placeholder="Dhaka"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="state" className="block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                                State/Division *
                                            </label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={address.state}
                                                onChange={onChangeHandler}
                                                required
                                                className="w-full px-4 py-3 transition-all rounded-lg focus:ring-2 focus:outline-none"
                                                style={{ 
                                                    backgroundColor: 'var(--primary-25)',
                                                    border: '1px solid var(--primary-200)',
                                                    color: 'var(--primary-900)'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-400)'}
                                                onBlur={(e) => e.target.style.borderColor = 'var(--primary-200)'}
                                                placeholder="Dhaka Division"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="zipCode" className="block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                name="zipCode"
                                                value={address.zipCode}
                                                onChange={onChangeHandler}
                                                required
                                                className="w-full px-4 py-3 transition-all rounded-lg focus:ring-2 focus:outline-none"
                                                style={{ 
                                                    backgroundColor: 'var(--primary-25)',
                                                    border: '1px solid var(--primary-200)',
                                                    color: 'var(--primary-900)'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-400)'}
                                                onBlur={(e) => e.target.style.borderColor = 'var(--primary-200)'}
                                                placeholder="1207"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="country" className="block text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={address.country}
                                            onChange={onChangeHandler}
                                            disabled
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{ 
                                                backgroundColor: 'var(--primary-100)',
                                                border: '1px solid var(--primary-200)',
                                                color: 'var(--primary-600)'
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="flex items-center gap-2 px-6 py-3 font-medium transition-colors border rounded-lg"
                                            style={{ 
                                                borderColor: 'var(--primary-300)',
                                                color: 'var(--primary-700)',
                                                backgroundColor: 'var(--primary-50)'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-100)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-50)'}
                                        >
                                            <X className="w-4 h-4" />
                                            {hasExistingAddress ? "Cancel" : "Clear Form"}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-6 py-3 font-medium transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ 
                                                backgroundColor: 'var(--accent-500)',
                                                color: 'white'
                                            }}
                                            onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = 'var(--accent-600)')}
                                            onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = 'var(--accent-500)')}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    {hasExistingAddress ? "Update Address" : "Save Address"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Information */}
                    <div className="lg:col-span-1">
                        <div className="sticky space-y-6 top-24">
                            {/* Status Card */}
                            <div className="p-5 rounded-xl" 
                                style={{ 
                                    backgroundColor: 'white',
                                    border: '1px solid var(--primary-100)'
                                }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary-50)' }}>
                                        <MapPin className="w-5 h-5" style={{ color: 'var(--primary-600)' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold" style={{ color: 'var(--primary-900)' }}>Address Status</h3>
                                        <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                            {hasExistingAddress 
                                                ? "You have a saved address" 
                                                : "No address saved yet"}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className={`p-3 rounded-lg ${hasExistingAddress ? 'border' : 'border'}`}
                                    style={{ 
                                        backgroundColor: hasExistingAddress ? 'var(--success-50)' : 'var(--warning-50)',
                                        borderColor: hasExistingAddress ? 'var(--success-200)' : 'var(--warning-200)'
                                    }}>
                                    <div className="flex items-center gap-2">
                                        {hasExistingAddress ? (
                                            <CheckCircle className="w-4 h-4" style={{ color: 'var(--success-600)' }} />
                                        ) : (
                                            <AlertCircle className="w-4 h-4"   />
                                        )}
                                        <p className="text-sm font-medium text-slate-800" 
                                            >
                                            {hasExistingAddress 
                                                ? "✓ Your address is ready for shipping"
                                                : "⚠️ Add an address to complete checkout"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="p-5 rounded-xl"
                                style={{ 
                                    backgroundColor: 'white',
                                    border: '1px solid var(--primary-100)'
                                }}>
                                <h4 className="mb-3 font-bold" style={{ color: 'var(--primary-900)' }}>Shipping Tips</h4>
                                <ul className="space-y-3 text-sm" style={{ color: 'var(--primary-600)' }}>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5" 
                                            style={{ backgroundColor: 'var(--accent-500)' }}></div>
                                        <span>Ensure your phone number is active for delivery updates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5" 
                                            style={{ backgroundColor: 'var(--accent-500)' }}></div>
                                        <span>Include specific landmarks for easy delivery</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5" 
                                            style={{ backgroundColor: 'var(--accent-500)' }}></div>
                                        <span>Double-check your ZIP code for accurate delivery</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5" 
                                            style={{ backgroundColor: 'var(--accent-500)' }}></div>
                                        <span>Update your address if you move to a new location</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Actions */}
                            {hasExistingAddress && !isEditing && (
                                <div className="p-5 rounded-xl"
                                    style={{ 
                                        backgroundColor: 'white',
                                        border: '1px solid var(--primary-100)'
                                    }}>
                                    <h4 className="mb-3 font-bold" style={{ color: 'var(--primary-900)' }}>Quick Actions</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full p-3 text-left transition-colors rounded-lg"
                                            style={{ 
                                                border: '1px solid var(--primary-200)',
                                                color: 'var(--primary-700)',
                                                backgroundColor: 'var(--primary-50)'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-100)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-50)'}
                                        >
                                            Edit Address Details
                                        </button>
                                        <button
                                            onClick={handleDeleteAddress}
                                            className="w-full p-3 text-left text-red-900 transition-colors rounded-lg"
                                            style={{ 
                                                border: '1px solid var(--error-200)',
                                                backgroundColor: 'var(--error-50)'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--error-100)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--error-50)'}
                                        >
                                            Remove Address
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}