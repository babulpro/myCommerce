export default function SettingsPage() {
    const notifications = [
        { id: 1, label: "Order updates", description: "Get notified about order status changes", enabled: true },
        { id: 2, label: "Promotional emails", description: "Receive special offers and discounts", enabled: false },
        { id: 3, label: "Product restocks", description: "Get alerts when wishlist items are back", enabled: true },
        { id: 4, label: "Newsletter", description: "Weekly newsletter with latest trends", enabled: true },
        { id: 5, label: "Security alerts", description: "Important updates about your account", enabled: true }
    ]

    return (
        <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--primary-25)' }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold" style={{ color: 'var(--primary-900)' }}>
                        Account Settings
                    </h1>
                    <p className="text-lg" style={{ color: 'var(--primary-600)' }}>
                        Manage your preferences and account details
                    </p>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {/* Profile Settings */}
                    <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                        <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                            Profile Information
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                    First Name
                                </label>
                                <input type="text" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} 
                                       defaultValue="John" />
                            </div>
                            
                            <div>
                                <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                    Last Name
                                </label>
                                <input type="text" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} 
                                       defaultValue="Doe" />
                            </div>
                            
                            <div>
                                <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                    Email Address
                                </label>
                                <input type="email" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} 
                                       defaultValue="john.doe@example.com" />
                            </div>
                            
                            <div>
                                <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                    Phone Number
                                </label>
                                <input type="tel" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} 
                                       defaultValue="(123) 456-7890" />
                            </div>
                            
                            <div className="md:col-span-2">
                                <button className="px-6 py-3 font-bold transition-all duration-300 rounded-lg hover:shadow-lg"
                                        style={{ 
                                            backgroundColor: 'var(--accent-500)',
                                            color: 'white'
                                        }}>
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                        <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                            Notification Preferences
                        </h2>
                        
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg" 
                                     style={{ borderColor: 'var(--primary-100)' }}>
                                    <div>
                                        <h4 className="mb-1 font-medium" style={{ color: 'var(--primary-800)' }}>
                                            {notification.label}
                                        </h4>
                                        <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                            {notification.description}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={notification.enabled} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                        <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                            Privacy & Security
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="mb-3 font-medium" style={{ color: 'var(--primary-800)' }}>
                                    Change Password
                                </h4>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-2 text-sm" style={{ color: 'var(--primary-700)' }}>
                                            Current Password
                                        </label>
                                        <input type="password" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm" style={{ color: 'var(--primary-700)' }}>
                                            New Password
                                        </label>
                                        <input type="password" className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button className="px-6 py-3 font-bold transition-all duration-300 border rounded-lg hover:shadow-md"
                                                style={{ 
                                                    borderColor: 'var(--primary-200)',
                                                    color: 'var(--primary-700)'
                                                }}>
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t" style={{ borderColor: 'var(--primary-100)' }}>
                                <h4 className="mb-3 font-medium" style={{ color: 'var(--primary-800)' }}>
                                    Account Actions
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                    <button className="px-6 py-3 font-bold transition-all duration-300 border rounded-lg hover:shadow-md"
                                            style={{ 
                                                borderColor: 'var(--warning-300)',
                                                color: 'var(--warning-600)'
                                            }}>
                                        Download Data
                                    </button>
                                    <button className="px-6 py-3 font-bold transition-all duration-300 border rounded-lg hover:shadow-md"
                                            style={{ 
                                                borderColor: 'var(--error-300)',
                                                color: 'var(--error-600)'
                                            }}>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Language & Region */}
                    <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                        <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                            Language & Region
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                    Language
                                </label>
                                <select className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }}>
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                    Currency
                                </label>
                                <select className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }}>
                                    <option>USD - US Dollar</option>
                                    <option>EUR - Euro</option>
                                    <option>GBP - British Pound</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block mb-2 font-medium" style={{ color: 'var(--primary-700)' }}>
                                    Timezone
                                </label>
                                <select className="w-full p-3 border rounded-lg" style={{ borderColor: 'var(--primary-200)' }}>
                                    <option>(GMT-5) Eastern Time (US & Canada)</option>
                                    <option>(GMT-8) Pacific Time (US & Canada)</option>
                                    <option>(GMT+0) London</option>
                                    <option>(GMT+1) Central European Time</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2">
                                <button className="px-6 py-3 font-bold transition-all duration-300 rounded-lg hover:shadow-lg"
                                        style={{ 
                                            backgroundColor: 'var(--accent-500)',
                                            color: 'white'
                                        }}>
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}