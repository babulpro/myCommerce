export default function OrdersPage() {
    const orders = [
        {
            id: "ORD-7841",
            date: "Dec 12, 2024",
            items: 3,
            total: 245.99,
            status: "Delivered",
            statusColor: "var(--success-500)",
            tracking: "TRK-78411234",
            estimatedDelivery: "Dec 10, 2024"
        },
        {
            id: "ORD-7840",
            date: "Dec 10, 2024",
            items: 2,
            total: 189.50,
            status: "Processing",
            statusColor: "var(--warning-500)",
            tracking: "TRK-78401234",
            estimatedDelivery: "Dec 15, 2024"
        },
        {
            id: "ORD-7839",
            date: "Dec 8, 2024",
            items: 1,
            total: 320.75,
            status: "Shipped",
            statusColor: "var(--info-500)",
            tracking: "TRK-78391234",
            estimatedDelivery: "Dec 13, 2024"
        },
        {
            id: "ORD-7838",
            date: "Dec 5, 2024",
            items: 4,
            total: 145.25,
            status: "Delivered",
            statusColor: "var(--success-500)",
            tracking: "TRK-78381234",
            estimatedDelivery: "Dec 8, 2024"
        },
        {
            id: "ORD-7837",
            date: "Dec 3, 2024",
            items: 1,
            total: 89.99,
            status: "Cancelled",
            statusColor: "var(--error-500)",
            tracking: null,
            estimatedDelivery: null
        }
    ]

    const orderFilters = ["All", "Delivered", "Processing", "Shipped", "Cancelled"]
    const timeFilters = ["Last 30 days", "Last 3 months", "Last 6 months", "2024"]

    return (
        <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--primary-25)' }}>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold" style={{ color: 'var(--primary-900)' }}>
                        My Orders
                    </h1>
                    <p className="text-lg" style={{ color: 'var(--primary-600)' }}>
                        Track and manage all your orders
                    </p>
                </div>

                {/* Filters */}
                <div className="p-6 mb-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                    <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex-1">
                            <h3 className="mb-3 font-medium" style={{ color: 'var(--primary-700)' }}>
                                Order Status
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {orderFilters.map((filter) => (
                                    <button key={filter} 
                                            className="px-4 py-2 transition-all duration-300 border rounded-lg"
                                            style={{ 
                                                borderColor: filter === "All" ? 'var(--accent-400)' : 'var(--primary-200)',
                                                backgroundColor: filter === "All" ? 'var(--accent-50)' : 'transparent',
                                                color: filter === "All" ? 'var(--accent-700)' : 'var(--primary-700)'
                                            }}>
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-3 font-medium" style={{ color: 'var(--primary-700)' }}>
                                Time Period
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {timeFilters.map((filter) => (
                                    <button key={filter} 
                                            className="px-4 py-2 transition-all duration-300 border rounded-lg"
                                            style={{ 
                                                borderColor: filter === "Last 30 days" ? 'var(--accent-400)' : 'var(--primary-200)',
                                                backgroundColor: filter === "Last 30 days" ? 'var(--accent-50)' : 'transparent',
                                                color: filter === "Last 30 days" ? 'var(--accent-700)' : 'var(--primary-700)'
                                            }}>
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-hidden bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left" style={{ backgroundColor: 'var(--primary-50)' }}>
                                    <th className="p-4 font-medium" style={{ color: 'var(--primary-600)' }}>Order ID</th>
                                    <th className="p-4 font-medium" style={{ color: 'var(--primary-600)' }}>Date</th>
                                    <th className="p-4 font-medium" style={{ color: 'var(--primary-600)' }}>Items</th>
                                    <th className="p-4 font-medium" style={{ color: 'var(--primary-600)' }}>Total</th>
                                    <th className="p-4 font-medium" style={{ color: 'var(--primary-600)' }}>Status</th>
                                    <th className="p-4 font-medium" style={{ color: 'var(--primary-600)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="transition-colors border-b hover:bg-gray-50" 
                                        style={{ borderColor: 'var(--primary-100)' }}>
                                        <td className="p-4">
                                            <span className="font-bold" style={{ color: 'var(--primary-900)' }}>
                                                {order.id}
                                            </span>
                                        </td>
                                        <td className="p-4" style={{ color: 'var(--primary-700)' }}>
                                            {order.date}
                                        </td>
                                        <td className="p-4" style={{ color: 'var(--primary-700)' }}>
                                            {order.items} item{order.items > 1 ? 's' : ''}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold" style={{ color: 'var(--primary-900)' }}>
                                                ${order.total.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1.5 rounded-full text-sm font-medium"
                                                  style={{ 
                                                    backgroundColor: `${order.statusColor}20`,
                                                    color: order.statusColor
                                                  }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
                                                        style={{ 
                                                            borderColor: 'var(--primary-200)',
                                                            color: 'var(--primary-700)'
                                                        }}>
                                                    View
                                                </button>
                                                {order.status === "Delivered" && (
                                                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                            style={{ 
                                                                backgroundColor: 'var(--accent-50)',
                                                                color: 'var(--accent-700)'
                                                            }}>
                                                        Review
                                                    </button>
                                                )}
                                                {order.tracking && (
                                                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
                                                            style={{ 
                                                                borderColor: 'var(--primary-200)',
                                                                color: 'var(--primary-700)'
                                                            }}>
                                                        Track
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Details Modal */}
                <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3">
                    {/* Order Tracking */}
                    <div className="lg:col-span-2">
                        <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                            <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                                Order Tracking: ORD-7840
                            </h2>
                            
                            <div className="space-y-8">
                                {/* Timeline */}
                                <div className="relative">
                                    {[
                                        { status: "Order Placed", date: "Dec 10, 2024", time: "10:30 AM", completed: true },
                                        { status: "Processing", date: "Dec 10, 2024", time: "2:15 PM", completed: true },
                                        { status: "Shipped", date: "Dec 12, 2024", time: "9:45 AM", completed: false },
                                        { status: "Out for Delivery", date: "Est. Dec 15, 2024", time: "", completed: false },
                                        { status: "Delivered", date: "Est. Dec 15, 2024", time: "", completed: false }
                                    ].map((step, index, array) => (
                                        <div key={index} className="flex items-start mb-8 last:mb-0">
                                            <div className="relative z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 mr-4 rounded-full"
                                                 style={{ 
                                                    backgroundColor: step.completed ? 'var(--success-500)' : 'var(--primary-200)',
                                                    color: step.completed ? 'white' : 'var(--primary-600)'
                                                 }}>
                                                {step.completed ? '✓' : (index + 1)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="mb-1 font-medium" style={{ color: 'var(--primary-800)' }}>
                                                    {step.status}
                                                </h4>
                                                <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                                    {step.date} {step.time && `• ${step.time}`}
                                                </p>
                                            </div>
                                            {index < array.length - 1 && (
                                                <div className="absolute left-4 top-8 bottom-0 w-0.5 z-0" 
                                                     style={{ 
                                                        backgroundColor: step.completed ? 'var(--success-300)' : 'var(--primary-200)',
                                                        height: 'calc(100% - 2rem)'
                                                     }}></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Tracking Info */}
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                        <div>
                                            <h4 className="mb-1 font-medium" style={{ color: 'var(--primary-800)' }}>
                                                Tracking Number: TRK-78401234
                                            </h4>
                                            <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                                Carrier: Express Shipping
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg"
                                                    style={{ 
                                                        borderColor: 'var(--primary-200)',
                                                        color: 'var(--primary-700)'
                                                    }}>
                                                Copy Tracking
                                            </button>
                                            <button className="px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                                                    style={{ 
                                                        backgroundColor: 'var(--accent-500)',
                                                        color: 'white'
                                                    }}>
                                                Track Package
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                            <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--primary-900)' }}>
                                Order Summary
                            </h2>
                            
                            <div className="mb-6 space-y-4">
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--primary-600)' }}>Subtotal</span>
                                    <span style={{ color: 'var(--primary-800)' }}>$189.50</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--primary-600)' }}>Shipping</span>
                                    <span style={{ color: 'var(--primary-800)' }}>$9.99</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--primary-600)' }}>Tax</span>
                                    <span style={{ color: 'var(--primary-800)' }}>$15.16</span>
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span style={{ color: 'var(--primary-900)' }}>Total</span>
                                        <span style={{ color: 'var(--primary-900)' }}>$214.65</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="font-medium" style={{ color: 'var(--primary-800)' }}>
                                    Shipping Address
                                </h4>
                                <div className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                    <p>John Doe</p>
                                    <p>123 Main Street</p>
                                    <p>New York, NY 10001</p>
                                    <p>(123) 456-7890</p>
                                </div>
                                
                                <h4 className="mt-4 font-medium" style={{ color: 'var(--primary-800)' }}>
                                    Payment Method
                                </h4>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded">
                                        <span className="text-blue-600">💳</span>
                                    </div>
                                    <span style={{ color: 'var(--primary-600)' }}>Visa ending in 4321</span>
                                </div>
                            </div>
                            
                            <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--primary-100)' }}>
                                <button className="w-full py-3 font-bold transition-all duration-300 border rounded-lg hover:shadow-md"
                                        style={{ 
                                            borderColor: 'var(--error-200)',
                                            color: 'var(--error-600)'
                                        }}>
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}