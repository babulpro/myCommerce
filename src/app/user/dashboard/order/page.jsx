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
  ShoppingBag,
  CreditCard,
  MapPin,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  User,
  Phone,
  Home,
  DollarSign,
  Tag,
  Archive
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");

  const orderFilters = [
    { value: "ALL", label: "All Orders", bgColor: "bg-gray-100", textColor: "text-gray-700", borderColor: "border-gray-300" },
    { value: "PENDING", label: "Pending", bgColor: "bg-amber-100", textColor: "text-amber-700", borderColor: "border-amber-300" },
    { value: "PROCESSING", label: "Processing", bgColor: "bg-blue-100", textColor: "text-blue-700", borderColor: "border-blue-300" },
    { value: "SHIPPED", label: "Shipped", bgColor: "bg-indigo-100", textColor: "text-indigo-700", borderColor: "border-indigo-300" },
    { value: "DELIVERED", label: "Delivered", bgColor: "bg-emerald-100", textColor: "text-emerald-700", borderColor: "border-emerald-300" },
    { value: "CANCELLED", label: "Cancelled", bgColor: "bg-rose-100", textColor: "text-rose-700", borderColor: "border-rose-300" },
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return { bg: "bg-blue-500", text: "text-amber-700", border: "border-amber-300", icon: "text-amber-500" };
      case 'PROCESSING': return { bg: "bg-green-400", text: "text-slate-900", border: "border-blue-300", icon: "text-blue-500" };
      case 'SHIPPED': return { bg: "bg-yellow-500", text: "text-indigo-700", border: "border-indigo-300", icon: "text-indigo-500" };
      case 'DELIVERED': return { bg: "bg-green-600", text: "text-emerald-700", border: "border-emerald-300", icon: "text-emerald-500" };
      case 'CANCELLED': return { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-300", icon: "text-rose-500" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300", icon: "text-gray-500" };
    }
  };

  const cancelOrder = async (orderId, reason) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const response = await fetch(`/api/product/order/cancelOrder?orderId=${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancellationReason: reason })
      });
      const data = await response.json();
      
      if (data.status === "success") {
        alert("Order cancelled successfully!");
        fetchOrders();
      } else {
        alert(data.msg || "Failed to cancel order");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/order/newOrder?status=${activeStatusFilter}`);
      const data = await response.json();
      
      if (data.status === "success") {
        setOrders(data.orders);
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

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getTotalItems = (order) => {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  // Calculate timeline steps based on order status
  const getTimelineSteps = (orderStatus) => {
    const steps = [
      { 
        status: 'ORDER_PLACED', 
        label: 'Order Placed', 
        description: 'Your order has been received',
        defaultDate: 'Today'
      },
      { 
        status: 'PROCESSING', 
        label: 'Processing', 
        description: 'Preparing your items for shipping',
        defaultDate: 'Within 24 hours'
      },
      { 
        status: 'SHIPPED', 
        label: 'Shipped', 
        description: 'Your order is on the way',
        defaultDate: '2-3 business days'
      },
      { 
        status: 'DELIVERED', 
        label: 'Delivered', 
        description: 'Package delivered successfully',
        defaultDate: '5-7 business days'
      }
    ];

    const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const currentStatusIndex = statusOrder.indexOf(orderStatus);

    return steps.map((step, index) => {
      const stepStatusIndex = statusOrder.indexOf(step.status === 'ORDER_PLACED' ? 'PENDING' : step.status);
      const isCompleted = currentStatusIndex >= stepStatusIndex;
      const isCurrent = currentStatusIndex === stepStatusIndex;
      const isCancelled = orderStatus === 'CANCELLED';
      
      return {
        ...step,
        isCompleted: isCancelled ? false : isCompleted,
        isCurrent: isCancelled ? false : isCurrent,
        isCancelled
      };
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatusFilter]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-gray-300 rounded-full border-3 border-t-blue-500 animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-gray-600 md:text-base">
                Track and manage all your purchases in one place
              </p>
            </div>
            <div className="items-center hidden gap-2 text-sm text-gray-500 md:flex">
              <Archive className="w-4 h-4" />
              <span>{orders.length} orders</span>
            </div>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 p-2">
            {orderFilters.map((filter) => {
              const Icon = getStatusIcon(filter.value);
              const isActive = activeStatusFilter === filter.value;
              const count = orders.filter(o => filter.value === 'ALL' || o.status === filter.value).length;
              
              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveStatusFilter(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 flex-shrink-0 border ${
                    isActive 
                      ? `scale-105 shadow-sm ${filter.bgColor} ${filter.textColor} ${filter.borderColor}` 
                      : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200 hover:shadow-sm'
                  }`}
                >
                  {filter.value !== 'ALL' && <Icon className={`w-4 h-4 ${isActive ? filter.textColor : 'text-gray-500'}`} />}
                  <span className="font-medium">{filter.label}</span>
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    isActive ? 'font-semibold bg-white/60' : 'font-normal bg-gray-100'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {error ? (
          <div className="p-6 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="mb-4 text-4xl">😔</div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              Something went wrong
            </h3>
            <p className="mb-4 text-sm text-gray-600">{error}</p>
            <button 
              onClick={fetchOrders}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
              <ShoppingBag className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              No Orders Found
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              {activeStatusFilter !== 'ALL' 
                ? `You don't have any ${orderFilters.find(f => f.value === activeStatusFilter)?.label.toLowerCase()} orders.`
                : "Start shopping to see your orders here!"}
            </p>
            <button 
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-lg hover:bg-black"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              const statusColor = getStatusColor(order.status);
              const totalItems = getTotalItems(order);
              const isExpanded = expandedOrder === order.id;
              const timelineSteps = getTimelineSteps(order.status);

              return (
                <div key={order.id} className={`overflow-hidden bg-white border rounded-xl transition-all duration-300 ${
                  isExpanded ? 'border-gray-300 shadow-lg' : 'border-gray-200 shadow-sm'
                }`}>
                  
                  {/* Order Summary Card */}
                  <div 
                    className="p-4 transition-colors cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-transform duration-300 ${
                          isExpanded ? 'rotate-90 bg-gray-100' : ''
                        }`}>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              <StatusIcon className={`w-3.5 h-3.5 ${statusColor.icon}`} />
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                                {order.status}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {totalItems} item{totalItems !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      
                      {/* Order Timeline */}
                      <div className="p-6 bg-gradient-to-r from-gray-100 to-blue-100 text-slate-600">
                        <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-700 uppercase">
                          Order Progress
                        </h3>
                        
                        <div className="relative">
                          {timelineSteps.map((step, index) => {
                            const stepColor = getStatusColor(step.status === 'ORDER_PLACED' ? 'PENDING' : step.status);
                            const isStepCompleted = step.isCompleted && !step.isCancelled;
                            const isStepCurrent = step.isCurrent && !step.isCancelled;
                            
                            return (
                              <div key={step.status} className="relative flex items-center mb-8 last:mb-0">
                                {/* Connection Line */}
                                {index < timelineSteps.length - 1 && (
                                  <div className={`absolute left-5 top-10 bottom-0 w-0.5 z-0 ${
                                    isStepCompleted ? stepColor.bg : 'bg-gray-200'
                                  }`}></div>
                                )}
                                
                                {/* Step Icon */}
                                <div className="relative z-10 flex-shrink-0">
                                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2  transition-all duration-300 ${
                                    step.isCancelled ? 'bg-rose-50 border-rose-300' :
                                    isStepCurrent ? 'scale-110 shadow-md' : ''
                                  } ${
                                    isStepCompleted ? `${stepColor.bg.replace('100', '500')} border-transparent` :
                                    `bg-white ${step.isCancelled ? 'border-rose-300' : stepColor.border}`
                                  }`}>
                                    {isStepCompleted ? (
                                      <CheckCircle className="w-5 h-5 text-white" />
                                    ) : step.isCancelled ? (
                                      <XCircle className="w-5 h-5 text-rose-500" />
                                    ) : (
                                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        isStepCurrent ? 'scale-125' : ''
                                      } ${isStepCurrent ? stepColor.icon : 'text-gray-400'}`}></div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Step Details */}
                                <div className="flex-1 ml-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className={`font-medium ${
                                      (isStepCompleted || isStepCurrent) ? 'font-semibold' : ''
                                    } ${
                                      isStepCompleted ? stepColor.text :
                                      isStepCurrent ? stepColor.text :
                                      step.isCancelled ? 'text-rose-600' : 'text-gray-700'
                                    }`}>
                                      {step.label}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                      {step.defaultDate}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600">
                                    {step.description}
                                  </p>
                                  {step.isCurrent && order.status === 'SHIPPED' && (
                                    <div className="inline-flex items-center gap-1 px-3 py-1 mt-2 text-xs font-medium text-blue-700 rounded-full bg-blue-50">
                                      <Truck className="w-3 h-3" />
                                      Estimated delivery: 3-5 business days
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Items & Details Grid */}
                      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                        
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
                              Order Items ({totalItems})
                            </h4>
                            <span className="text-sm text-gray-500">Total: {formatPrice(order.totalAmount)}</span>
                          </div>
                          <div className="space-y-4">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-4 transition-shadow border border-gray-100 rounded-xl bg-gray-50 hover:shadow-sm">
                                <img 
                                  src={item.product?.images?.[0] || '/placeholder-product.jpg'} 
                                  alt={item.product?.name}
                                  className="flex-shrink-0 object-cover w-16 h-16 p-1 bg-white border border-gray-200 rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-900 truncate">
                                    {item.product?.name}
                                  </h5>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded">
                                      <Tag className="w-3 h-3 text-gray-500" />
                                      Qty: {item.quantity}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded">
                                      Size: {item.size}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded">
                                      Color: {item.color}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                  <p className="font-bold text-gray-900">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {formatPrice(item.price)} each
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order & Shipping Information */}
                        <div className="space-y-6">
                          
                          {/* Shipping Address */}
                          <div className="p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <h4 className="font-medium text-gray-800">
                                Shipping Address
                              </h4>
                            </div>
                            {order.address ? (
                              <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg">
                                  <User className="flex-shrink-0 w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">{order.address.firstName} {order.address.lastName}</span>
                                </div>
                                <div className="p-2 bg-white border border-gray-100 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <Home className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-gray-700">
                                      <p>{order.address.street}</p>
                                      <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                                      <p>{order.address.country}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg">
                                  <Phone className="flex-shrink-0 w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">{order.address.phone}</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No address provided</p>
                            )}
                          </div>

                          {/* Payment Summary */}
                          <div className="p-4 border rounded-xl bg-gradient-to-br from-white to-emerald-50/30 border-emerald-100">
                            <div className="flex items-center gap-2 mb-3">
                              <CreditCard className="w-4 h-4 text-emerald-600" />
                              <h4 className="font-medium text-gray-800">
                                Payment Summary
                              </h4>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-800">{formatPrice(order.totalAmount)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-emerald-600">Free</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium text-gray-800">Included</span>
                              </div>
                              <div className="pt-3 mt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between font-semibold">
                                  <span className="text-gray-900">Total</span>
                                  <span className="text-lg text-gray-900">{formatPrice(order.totalAmount)}</span>
                                </div>
                              </div>
                              <div className="pt-2 mt-2 border-t border-gray-200">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">Payment Method</span>
                                  <span className="flex items-center gap-1 font-medium text-gray-700">
                                    <DollarSign className="w-3 h-3" />
                                    Cash on Delivery
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Customer Note */}
                          {order.customerNote && (
                            <div className="p-4 border rounded-xl bg-gradient-to-br from-white to-amber-50/30 border-amber-100">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-amber-600" />
                                <h4 className="font-medium text-gray-800">
                                  Your Note
                                </h4>
                              </div>
                              <div className="p-3 text-sm italic bg-white border rounded-lg border-amber-200">
                                "{order.customerNote}"
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="pt-4 space-y-3 border-t border-gray-200">
                            {order.status === 'PENDING' && (
                              <button 
                                onClick={() => cancelOrder(order.id, "Customer requested cancellation")}
                                className="w-full py-2.5 font-medium transition-all duration-200 border border-rose-300 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg hover:shadow-sm active:scale-95 flex items-center justify-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Cancel Order
                              </button>
                            )}
                            
                            {order.status === 'DELIVERED' && (
                              <button className="w-full py-2.5 font-medium transition-all duration-200 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg hover:shadow-sm active:scale-95">
                                Write Product Review
                              </button>
                            )}
                            
                            {order.status === 'SHIPPED' && (
                              <button className="w-full py-2.5 font-medium transition-all duration-200 border border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg hover:shadow-sm active:scale-95">
                                Track Package
                              </button>
                            )}
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