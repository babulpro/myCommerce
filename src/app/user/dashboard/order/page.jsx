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
  ArrowRight,
  ShoppingBag,
  MapPin,
  Calendar,
  Package2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  Shield,
  HeadphonesIcon,
  AlertCircle,
  Ban,
  RotateCcw
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const orderFilters = [
    { value: "ALL", label: "All", count: 0 },
    { value: "PENDING", label: "Pending", count: 0 },
    { value: "PROCESSING", label: "Processing", count: 0 },
    { value: "SHIPPED", label: "Shipped", count: 0 },
    { value: "DELIVERED", label: "Delivered", count: 0 },
    { value: "CANCELLED", label: "Cancelled", count: 0 },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'PENDING': 
        return { 
          icon: Clock, 
          color: "bg-amber-100 text-amber-800 border-amber-200",
          timelineColor: "border-amber-400",
          label: "Order Placed",
          canCancel: true
        };
      case 'PROCESSING': 
        return { 
          icon: RefreshCw, 
          color: "bg-blue-100 text-blue-800 border-blue-200",
          timelineColor: "border-blue-400",
          label: "Processing",
          canCancel: false
        };
      case 'SHIPPED': 
        return { 
          icon: Truck, 
          color: "bg-indigo-100 text-indigo-800 border-indigo-200",
          timelineColor: "border-indigo-400",
          label: "Shipped",
          canCancel: false
        };
      case 'DELIVERED': 
        return { 
          icon: CheckCircle, 
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          timelineColor: "border-emerald-400",
          label: "Delivered",
          canCancel: false
        };
      case 'CANCELLED': 
        return { 
          icon: XCircle, 
          color: "bg-rose-100 text-rose-800 border-rose-200",
          timelineColor: "border-rose-400",
          label: "Cancelled",
          canCancel: false
        };
      default: 
        return { 
          icon: Package, 
          color: "bg-gray-100 text-gray-800 border-gray-200",
          timelineColor: "border-gray-400",
          label: "Unknown",
          canCancel: false
        };
    }
  };

  const getOrderProgress = (status) => {
    const steps = [
      { status: 'PENDING', label: 'Order Placed', progress: 25 },
      { status: 'PROCESSING', label: 'Processing', progress: 50 },
      { status: 'SHIPPED', label: 'Shipped', progress: 75 },
      { status: 'DELIVERED', label: 'Delivered', progress: 100 },
      { status: 'CANCELLED', label: 'Cancelled', progress: 0 },
    ];
    
    const step = steps.find(s => s.status === status);
    return step || { status, label: status, progress: 0 };
  };

 const cancelOrder = async (orderId) => {
  if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
    return;
  }

  setCancellingOrder(orderId);
  try {
    // Note: orderId is passed as query parameter, not in body
    const response = await fetch(`/api/product/order/cancelOrder?orderId=${orderId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        reason: "Cancelled by customer" // Optional cancellation reason
      })
    });

    const data = await response.json();
    
    if (data.status === "success") {
      // Update the order in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId  // Use order.id (not order._id)
            ? { ...order, status: "CANCELLED" }
            : order
        )
      );
      
      alert("Order cancelled successfully!");
    } else {
      alert(data.message || data.msg || "Failed to cancel order. Please try again.");
    }
  } catch (err) {
    console.error("Cancel error:", err);
    alert("An error occurred. Please try again.");
  } finally {
    setCancellingOrder(null);
  }
};
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/order/newOrder?status=${activeStatusFilter}`);
      const data = await response.json();
      
      if (data.status === "success") {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const viewProductDetails = (productId) => {
    if (productId) {
      router.push(`/pages/product/detail/${productId}`);
    }
  };

  const orderAgain = (productId) => {
    if (productId) {
      router.push(`/pages/product/detail/${productId}`);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatusFilter]);

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
              <p className="text-lg font-medium text-gray-700">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-6xl px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="mt-2 text-gray-600">Track and manage all your purchases</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              <span>{orders.length} orders</span>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex p-1 space-x-2 bg-white border border-gray-200 rounded-lg">
            {orderFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveStatusFilter(filter.value)}
                className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeStatusFilter === filter.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-white rounded-full shadow-sm">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">No orders yet</h3>
            <p className="max-w-md mx-auto mb-6 text-gray-600">
              {activeStatusFilter !== 'ALL' 
                ? `You don't have any ${activeStatusFilter.toLowerCase()} orders.`
                : "Start shopping to see your orders here!"}
            </p>
            <button 
              onClick={() => router.push("/")}
              className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const orderProgress = getOrderProgress(order.status);
              const isExpanded = expandedOrder === order.id;
              const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              const isCancelling = cancellingOrder === order.id;
              const isCancelled = order.status === 'CANCELLED';

              return (
                <div key={order.id} className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
                  
                  {/* Order Header */}
                  <div className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border ${statusConfig.color}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Package2 className="w-4 h-4" />
                              <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              <span>{order.address?.city || 'Unknown location'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 mt-3 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                        >
                          {isExpanded ? (
                            <>
                              Hide Details
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              View Details
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Cancel Button for Pending Orders */}
                    {statusConfig.canCancel && (
                      <div className="mt-4">
                        <button
                          onClick={() => cancelOrder(order.id)}
                          disabled={isCancelling}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                            isCancelling
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                          }`}
                        >
                          {isCancelling ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <Ban className="w-4 h-4" />
                              Cancel Order
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {!isCancelled && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Order Progress</span>
                          <span className="text-sm text-gray-500">{orderProgress.progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full border ${statusConfig.timelineColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${orderProgress.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>Order Placed</span>
                          <span>Processing</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      <div className="p-6">
                        {/* Products Section */}
                        <div className="mb-8">
                          <h4 className="mb-4 text-lg font-bold text-gray-900">
                            Order Items ({totalItems})
                          </h4>
                          <div className="space-y-4">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl md:flex-row md:items-center">
                                <img 
                                  src={item.product?.images?.[0] || '/placeholder-product.jpg'} 
                                  alt={item.product?.name}
                                  className="object-cover w-full h-48 rounded-lg cursor-pointer md:w-32 md:h-32"
                                  onClick={() => viewProductDetails(item.product?.id)}
                                />
                                <div className="flex-1">
                                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                    <div>
                                      <h5 
                                        className="font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                                        onClick={() => viewProductDetails(item.product?.id)}
                                      >
                                        {item.product?.name}
                                      </h5>
                                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                        {item.product?.description?.substring(0, 100)}...
                                      </p>
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                          Qty: {item.quantity}
                                        </span>
                                        {item.size && (
                                          <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                            Size: {item.size}
                                          </span>
                                        )}
                                        {item.color && (
                                          <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                            Color: {item.color}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {formatPrice(item.price)} each
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-3 mt-4 sm:flex-row">
                                    {/* Show "Order Again" for cancelled orders, otherwise "View Product Details" */}
                                    {isCancelled ? (
                                      <button
                                        onClick={() => orderAgain(item.product?.id)}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-600 transition-colors bg-emerald-50 rounded-lg hover:bg-emerald-100"
                                      >
                                        <RotateCcw className="w-4 h-4" />
                                        Order Again
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => viewProductDetails(item.product?.id)}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors bg-blue-50 rounded-lg hover:bg-blue-100"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        View Product Details
                                      </button>
                                    )}
                                    
                                    {order.status === 'DELIVERED' && (
                                      <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-600 transition-colors bg-emerald-50 rounded-lg hover:bg-emerald-100">
                                        <Star className="w-4 h-4" />
                                        Write a Review
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping & Payment Summary */}
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Shipping Information */}
                          <div className="p-5 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <MapPin className="w-5 h-5 text-blue-600" />
                              </div>
                              <h5 className="font-bold text-gray-900">Shipping Details</h5>
                            </div>
                            {order.address ? (
                              <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-gray-50">
                                  <p className="font-medium text-gray-900">
                                    {order.address.firstName} {order.address.lastName}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-600">{order.address.street}</p>
                                  <p className="text-sm text-gray-600">
                                    {order.address.city}, {order.address.state} {order.address.zipCode}
                                  </p>
                                  <p className="text-sm text-gray-600">{order.address.country}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="font-medium">Phone:</span>
                                  <span>{order.address.phone}</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500">No shipping address provided</p>
                            )}
                          </div>

                          {/* Payment Summary */}
                          <div className="p-5 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-emerald-100">
                                <Shield className="w-5 h-5 text-emerald-600" />
                              </div>
                              <h5 className="font-bold text-gray-900">Payment Summary</h5>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-emerald-600">Free</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium text-gray-900">Included</span>
                              </div>
                              <div className="flex justify-between pt-2">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                              </div>
                              <div className="flex items-center gap-2 pt-3 mt-3 text-sm text-gray-500 border-t border-gray-100">
                                <span>Payment Method:</span>
                                <span className="font-medium text-gray-700">Cash on Delivery</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-col gap-3 mt-8 sm:flex-row">
                          {statusConfig.canCancel && (
                            <button 
                              onClick={() => cancelOrder(order.id)}
                              disabled={isCancelling}
                              className={`flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
                                isCancelling
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                              }`}
                            >
                              {isCancelling ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Cancelling Order...
                                </>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4" />
                                  Cancel Order
                                </>
                              )}
                            </button>
                          )}
                          
                          {order.status === 'SHIPPED' && (
                            <button className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                              <Truck className="w-4 h-4" />
                              Track Package
                            </button>
                          )}
                          
                          {order.status === 'DELIVERED' && (
                            <button className="flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100">
                              <Star className="w-4 h-4" />
                              Write Product Review
                            </button>
                          )}
                          
                          <button className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                            <HeadphonesIcon className="w-4 h-4" />
                            Contact Support
                          </button>
                        </div>

                        {/* Cancellation Warning */}
                        {statusConfig.canCancel && (
                          <div className="flex items-start gap-3 p-4 mt-6 text-sm rounded-lg bg-amber-50 text-amber-800">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Cancellation Policy</p>
                              <p className="mt-1">
                                You can cancel this order anytime before it starts processing. Once cancelled, it cannot be undone.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Help Section */}
        {orders.length > 0 && (
          <div className="p-6 mt-8 border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="flex-shrink-0">
                <div className="p-3 bg-white rounded-xl">
                  <HeadphonesIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">Need help with your order?</h4>
                <p className="mt-1 text-gray-600">Our support team is here to help you 24/7</p>
              </div>
              <button className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap">
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}