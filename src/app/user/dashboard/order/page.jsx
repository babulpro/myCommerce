"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw,
  Filter,
  Calendar,
  Eye,
  Star,
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronDown,
  Download,
  Printer,
  MessageSquare
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");
  const [activeTimeFilter, setActiveTimeFilter] = useState("LAST_30_DAYS");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });

  const orderFilters = [
    { value: "ALL", label: "All Orders", icon: Package },
    { value: "PENDING", label: "Pending", icon: Clock, color: "var(--warning-500)" },
    { value: "PROCESSING", label: "Processing", icon: RefreshCw, color: "var(--info-500)" },
    { value: "SHIPPED", label: "Shipped", icon: Truck, color: "var(--primary-500)" },
    { value: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "var(--success-500)" },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "var(--error-500)" },
  ];

  const timeFilters = [
    { value: "LAST_30_DAYS", label: "Last 30 days" },
    { value: "LAST_3_MONTHS", label: "Last 3 months" },
    { value: "LAST_6_MONTHS", label: "Last 6 months" },
    { value: "THIS_YEAR", label: "This Year" },
    { value: "ALL_TIME", label: "All Time" },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'var(--warning-500)';
      case 'PROCESSING': return 'var(--info-500)';
      case 'SHIPPED': return 'var(--primary-500)';
      case 'DELIVERED': return 'var(--success-500)';
      case 'CANCELLED': return 'var(--error-500)';
      default: return 'var(--neutral-500)';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return Clock;
      case 'PROCESSING': return RefreshCw;
      case 'SHIPPED': return Truck;
      case 'DELIVERED': return CheckCircle;
      case 'CANCELLED': return XCircle;
      default: return Package;
    }
  };
  
      // Cancel an order
    const cancelOrder = async (orderId, reason) => {
      const response = await fetch(`/api/product/order/cancelOrder?orderId=${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancellationReason: reason })
      });
      return await response.json();
    };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/order/newOrder?status=${activeStatusFilter}&time=${activeTimeFilter}`);
      const data = await response.json();
      
      if (data.status === "success") {
        setOrders(data.orders);
        calculateStats(data.orders);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList) => {
    const stats = {
      totalOrders: ordersList.length,
      totalSpent: ordersList.reduce((sum, order) => sum + order.totalAmount, 0),
      pendingOrders: ordersList.filter(order => order.status === 'PENDING').length,
      deliveredOrders: ordersList.filter(order => order.status === 'DELIVERED').length,
    };
    setStats(stats);
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.status === "success") {
        alert("Order cancelled successfully!");
        fetchOrders(); // Refresh orders
      } else {
        alert(data.msg || "Failed to cancel order");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatusFilter, activeTimeFilter]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--primary-25)' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 rounded-full animate-spin" style={{
            borderColor: "var(--primary-400)",
            borderTopColor: "var(--accent-600)"
          }}></div>
          <p className="text-lg font-bold" style={{ color: "var(--primary-700)" }}>
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mb-10 " style={{ backgroundColor: 'var(--primary-25)' }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold" style={{ color: 'var(--primary-900)' }}>
                My Orders
              </h1>
              <p className="text-lg" style={{ color: 'var(--primary-600)' }}>
                Track, manage, and review all your orders
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200 border rounded-lg hover:shadow-sm active:scale-95"
                      style={{ 
                        borderColor: 'var(--primary-200)',
                        color: 'var(--primary-700)'
                      }}>
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200 border rounded-lg hover:shadow-sm active:scale-95"
                      style={{ 
                        borderColor: 'var(--primary-200)',
                        color: 'var(--primary-700)'
                      }}>
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>Total Orders</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>{stats.totalOrders}</p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--primary-100)' }}>
                <Package size={20} style={{ color: 'var(--primary-600)' }} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>Total Spent</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>
                  {formatPrice(stats.totalSpent)}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--accent-100)' }}>
                <CreditCard size={20} style={{ color: 'var(--accent-600)' }} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>Pending</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--warning-600)' }}>{stats.pendingOrders}</p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--warning-100)' }}>
                <Clock size={20} style={{ color: 'var(--warning-600)' }} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>Delivered</p>
                <p className="text-2xl font-bold text-slate-800">{stats.deliveredOrders}</p>
              </div>
              <div className="p-3 text-blue-600 bg-blue-200 rounded-full">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 mb-6 bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
          <div className="flex items-center gap-2 mb-6">
            <Filter size={18} style={{ color: 'var(--primary-600)' }} />
            <h3 className="font-medium" style={{ color: 'var(--primary-700)' }}>Filters</h3>
          </div>
          
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1">
              <h4 className="mb-3 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>
                Order Status
              </h4>
              <div className="flex flex-wrap gap-2">
                {orderFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button 
                      key={filter.value}
                      onClick={() => setActiveStatusFilter(filter.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 transition-all duration-300 border rounded-lg hover:shadow-sm active:scale-95 ${
                        activeStatusFilter === filter.value ? 'scale-105' : ''
                      }`}
                      style={{ 
                        borderColor: activeStatusFilter === filter.value ? filter.color || 'var(--accent-400)' : 'var(--primary-200)',
                        backgroundColor: activeStatusFilter === filter.value ? 
                          (filter.color ? `${filter.color}15` : 'var(--accent-50)') : 'transparent',
                        color: activeStatusFilter === filter.value ? 
                          (filter.color || 'var(--accent-700)') : 'var(--primary-700)'
                      }}
                    >
                      <Icon size={16} />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>
                Time Period
              </h4>
              <div className="flex flex-wrap gap-2">
                {timeFilters.map((filter) => (
                  <button 
                    key={filter.value}
                    onClick={() => setActiveTimeFilter(filter.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 transition-all duration-300 border rounded-lg hover:shadow-sm active:scale-95 ${
                      activeTimeFilter === filter.value ? 'scale-105' : ''
                    }`}
                    style={{ 
                      borderColor: activeTimeFilter === filter.value ? 'var(--accent-400)' : 'var(--primary-200)',
                      backgroundColor: activeTimeFilter === filter.value ? 'var(--accent-50)' : 'transparent',
                      color: activeTimeFilter === filter.value ? 'var(--accent-700)' : 'var(--primary-700)'
                    }}
                  >
                    {filter.value === 'LAST_30_DAYS' && <Calendar size={16} />}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {error ? (
          <div className="p-8 text-center bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="mb-4 text-6xl">😔</div>
            <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--primary-800)' }}>
              Unable to Load Orders
            </h3>
            <p className="mb-6" style={{ color: 'var(--primary-600)' }}>{error}</p>
            <button 
              onClick={fetchOrders}
              className="px-6 py-2.5 font-medium transition-all duration-200 rounded-lg hover:shadow-sm"
              style={{ 
                backgroundColor: 'var(--accent-500)',
                color: 'white'
              }}
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center bg-white border shadow-sm rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
            <div className="mb-4 text-6xl">📦</div>
            <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--primary-800)' }}>
              No Orders Yet
            </h3>
            <p className="mb-6" style={{ color: 'var(--primary-600)' }}>
              {activeStatusFilter !== 'ALL' 
                ? `No ${orderFilters.find(f => f.value === activeStatusFilter)?.label.toLowerCase()} orders found.`
                : "Start shopping to see your orders here!"}
            </p>
            <button 
              onClick={() => router.push("/")}
              className="px-6 py-2.5 font-medium transition-all duration-200 rounded-lg hover:shadow-sm"
              style={{ 
                backgroundColor: 'var(--accent-500)',
                color: 'white'
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              const statusColor = getStatusColor(order.status);
              const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              
              return (
                <div key={order.id} className="overflow-hidden bg-white border shadow-sm rounded-2xl" 
                     style={{ borderColor: 'var(--primary-100)' }}>
                  
                  {/* Order Header */}
                  <div className="p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full" style={{ backgroundColor: `${statusColor}15` }}>
                          <StatusIcon size={20} style={{ color: statusColor }} />
                        </div>
                        <div>
                          <h4 className="font-bold" style={{ color: 'var(--primary-900)' }}>
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1.5 rounded-full text-sm font-medium"
                              style={{ 
                                backgroundColor: `${statusColor}15`,
                                color: statusColor
                              }}>
                          {order.status}
                        </span>
                        <span className="text-lg font-bold" style={{ color: 'var(--primary-900)' }}>
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-3">
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-50)' }}>
                        <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>
                          Items
                        </p>
                        <p className="font-bold" style={{ color: 'var(--primary-900)' }}>
                          {totalItems} item{totalItems !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-50)' }}>
                        <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>
                          Delivery Address
                        </p>
                        <p className="font-medium truncate" style={{ color: 'var(--primary-900)' }}>
                          {order.address?.city || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-50)' }}>
                        <p className="mb-1 text-sm font-medium" style={{ color: 'var(--primary-600)' }}>
                          Payment Method
                        </p>
                        <p className="font-medium" style={{ color: 'var(--primary-900)' }}>
                          Cash on Delivery
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="flex items-center justify-center w-full py-3 border-t hover:bg-gray-50"
                    style={{ borderColor: 'var(--primary-100)' }}
                  >
                    {expandedOrder === order.id ? (
                      <ChevronDown size={20} style={{ color: 'var(--primary-600)' }} />
                    ) : (
                      <ChevronRight size={20} style={{ color: 'var(--primary-600)' }} />
                    )}
                  </button>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="p-6 border-t" style={{ borderColor: 'var(--primary-100)', backgroundColor: 'var(--primary-25)' }}>
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                          <h5 className="mb-4 font-bold" style={{ color: 'var(--primary-800)' }}>
                            Order Items
                          </h5>
                          <div className="space-y-4">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex items-start gap-4 p-4 bg-white border rounded-xl" 
                                   style={{ borderColor: 'var(--primary-100)' }}>
                                <img 
                                  src={item.product?.images?.[0]} 
                                  alt={item.product?.name}
                                  className="object-cover w-20 h-20 rounded-lg"
                                />
                                <div className="flex-1">
                                  <h6 className="font-medium" style={{ color: 'var(--primary-900)' }}>
                                    {item.product?.name}
                                  </h6>
                                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                    <span style={{ color: 'var(--primary-600)' }}>
                                      Qty: {item.quantity}
                                    </span>
                                    <span style={{ color: 'var(--primary-600)' }}>
                                      Size: {item.size}
                                    </span>
                                    <span style={{ color: 'var(--primary-600)' }}>
                                      Color: {item.color}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mt-3">
                                    <span className="font-bold" style={{ color: 'var(--primary-900)' }}>
                                      {formatPrice(item.price * item.quantity)}
                                    </span>
                                    {order.status === 'DELIVERED' && (
                                      <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium transition-colors rounded-lg hover:shadow-sm"
                                              style={{ 
                                                backgroundColor: 'var(--accent-50)',
                                                color: 'var(--accent-700)'
                                              }}>
                                        <Star size={14} />
                                        Review
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          
                        {/* Order Timeline */}
                        <div className="p-3 mt-8 bg-sky-200">
                          <h5 className="mb-4 font-bold" style={{ color: 'var(--primary-800)' }}>
                            Order Timeline
                          </h5>
                          <div className="relative">
                            {[
                              { status: 'PENDING', label: 'Order Placed', description: 'Your order has been placed' },
                              { status: 'PROCESSING', label: 'Processing', description: 'We are preparing your order' },
                              { status: 'SHIPPED', label: 'Shipped', description: 'Your order is on the way' },
                              { status: 'DELIVERED', label: 'Delivered', description: 'Your order has been delivered' },
                            ].map((step, index, array) => {
                              // Get the index of the current step and order status
                              const stepIndex = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(step.status);
                              const orderStatusIndex = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status);
                              
                              // Step is completed if order status has reached this step or beyond
                              const isCompleted = orderStatusIndex >= stepIndex;
                              
                              // Step is current if order status exactly matches this step
                              const isCurrent = order.status === step.status;
                              
                              // Step is pending if order status hasn't reached this step yet
                              const isPending = orderStatusIndex < stepIndex;
                              
                              return (
                                <div key={step.status} className="flex items-start mb-6 last:mb-0">
                                  <div 
                                    className="relative z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 mr-4 rounded-full"
                                    style={{ 
                                      backgroundColor: isCurrent ? getStatusColor(step.status) : 
                                                isCompleted ? getStatusColor(step.status) : 'var(--primary-200)',
                                      color: isCompleted ? 'white' : 'var(--primary-600)',
                                      border: isCurrent ? `2px solid white` : 'none',
                                      boxShadow: isCurrent ? `0 0 0 2px ${getStatusColor(step.status)}` : 'none'
                                    }}
                                  >
                                    {isCompleted ? (
                                      isCurrent ? (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      ) : (
                                        '✓'
                                      )
                                    ) : (
                                      index + 1
                                    )}
                                  </div>
                                  <div>
                                    <h6 
                                      className="font-medium" 
                                      style={{ 
                                        color: isCurrent ? getStatusColor(step.status) : 
                                              isCompleted ? getStatusColor(step.status) : 'var(--primary-800)' 
                                      }}
                                    >
                                      {step.label}
                                    </h6>
                                    <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                      {isCurrent ? 'In Progress' : 
                                      isCompleted ? 'Completed' : 'Pending'}
                                    </p>
                                    {isCurrent && (
                                      <p className="mt-1 text-xs" style={{ color: 'var(--primary-500)' }}>
                                        {step.description}
                                      </p>
                                    )}
                                  </div>
                                  {index < array.length - 1 && (
                                    <div 
                                      className="absolute left-4 top-8 bottom-0 w-0.5 z-0" 
                                      style={{ 
                                        backgroundColor: isCompleted ? getStatusColor(step.status) : 'var(--primary-200)',
                                        height: 'calc(100% - 2rem)'
                                      }}
                                    ></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Show estimated delivery for shipped orders */}
                          {order.status === 'SHIPPED' && (
                            <div className="p-4 mt-4 rounded-lg" style={{ 
                              backgroundColor: 'var(--primary-50)',
                              border: '1px solid var(--primary-200)'
                            }}>
                              <div className="flex items-center gap-3">
                                <Truck size={16} style={{ color: 'var(--primary-600)' }} />
                                <div>
                                  <p className="text-sm font-medium" style={{ color: 'var(--primary-800)' }}>
                                    Estimated Delivery
                                  </p>
                                  <p className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                    Your order should arrive within 3-5 business days
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        </div>

                        {/* Order Details Sidebar */}
                        <div>
                          <h5 className="mb-4 font-bold" style={{ color: 'var(--primary-800)' }}>
                            Order Details
                          </h5>
                          <div className="p-4 bg-white border rounded-xl" style={{ borderColor: 'var(--primary-100)' }}>
                            
                            {/* Customer Note */}
                            {order.customerNote && (
                              <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageSquare size={16} style={{ color: 'var(--primary-600)' }} />
                                  <span className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                    Your Note
                                  </span>
                                </div>
                                <p className="p-3 text-sm rounded-lg" style={{ 
                                  backgroundColor: 'var(--primary-50)',
                                  color: 'var(--primary-700)'
                                }}>
                                  "{order.customerNote}"
                                </p>
                              </div>
                            )}

                            {/* Shipping Address */}
                            <div className="mb-6">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin size={16} style={{ color: 'var(--primary-600)' }} />
                                <span className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>
                                  Shipping Address
                                </span>
                              </div>
                              {order.address ? (
                                <div className="text-sm" style={{ color: 'var(--primary-600)' }}>
                                  <p>{order.address.firstName} {order.address.lastName}</p>
                                  <p>{order.address.street}</p>
                                  <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                                  <p>{order.address.country}</p>
                                  <p className="mt-1">{order.address.phone}</p>
                                </div>
                              ) : (
                                <p className="text-sm" style={{ color: 'var(--primary-500)' }}>No address provided</p>
                              )}
                            </div>

                            {/* Order Summary */}
                            <div className="mb-6">
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span style={{ color: 'var(--primary-600)' }}>Subtotal</span>
                                  <span style={{ color: 'var(--primary-800)' }}>
                                    {formatPrice(order.totalAmount)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span style={{ color: 'var(--primary-600)' }}>Shipping</span>
                                  <span style={{ color: 'var(--primary-800)' }}>Free</span>
                                </div>
                                <div className="pt-3 border-t">
                                  <div className="flex justify-between font-bold">
                                    <span style={{ color: 'var(--primary-900)' }}>Total</span>
                                    <span style={{ color: 'var(--primary-900)' }}>
                                      {formatPrice(order.totalAmount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                              <button 
                                onClick={() => router.push(`/user/dashboard/orderDetails/${order.id}`)}
                                className="flex items-center justify-center w-full gap-2 py-2.5 font-medium transition-all duration-200 border rounded-lg hover:shadow-sm active:scale-95"
                                style={{ 
                                  borderColor: 'var(--primary-200)',
                                  color: 'var(--primary-700)'
                                }}
                              >
                                <Eye size={16} />
                                View Full Details
                              </button>
                              
                              {order.status === 'PENDING' && (
                                <button 
                                  onClick={() => cancelOrder(order.id,"all")}
                                  className="flex items-center justify-center w-full gap-2 py-2.5 font-medium transition-all duration-200 border rounded-lg hover:shadow-sm active:scale-95 text-slate-800"
                                   
                                >
                                  <XCircle size={16} />
                                  Cancel Order
                                </button>
                              )}
                              
                              {order.status === 'DELIVERED' && (
                                <button className="flex items-center justify-center w-full gap-2 py-2.5 font-medium transition-all duration-200 rounded-lg hover:shadow-sm active:scale-95"
                                        style={{ 
                                          backgroundColor: 'var(--accent-500)',
                                          color: 'white'
                                        }}>
                                  <Star size={16} />
                                  Write a Review
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}