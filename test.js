"use client";
import React, { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw,
  Search,
  Download,
  User,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Edit,
  Printer,
  Copy,
  Filter,
  Calendar,
  Eye,
  BarChart3,
  TrendingUp,
  PackageOpen,
  Shield,
  AlertCircle,
  ArrowUpDown,
  FileText,
  Check,
  X
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  const statusOptions = [
    { value: "ALL", label: "All Orders", bgColor: "bg-gray-100", textColor: "text-gray-700", iconColor: "text-gray-500" },
    { value: "PENDING", label: "Pending", bgColor: "bg-amber-100", textColor: "text-amber-700", iconColor: "text-amber-500" },
    { value: "PROCESSING", label: "Processing", bgColor: "bg-blue-100", textColor: "text-blue-700", iconColor: "text-blue-500" },
    { value: "SHIPPED", label: "Shipped", bgColor: "bg-indigo-100", textColor: "text-indigo-700", iconColor: "text-indigo-500" },
    { value: "DELIVERED", label: "Delivered", bgColor: "bg-emerald-100", textColor: "text-emerald-700", iconColor: "text-emerald-500" },
    { value: "CANCELLED", label: "Cancelled", bgColor: "bg-rose-100", textColor: "text-rose-700", iconColor: "text-rose-500" }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/order?status=${selectedStatus}&search=${searchTerm}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        calculateStats(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList) => {
    const totalRevenue = ordersList.reduce((sum, order) => sum + order.totalAmount, 0);
    
    setStats({
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'PENDING').length,
      processing: ordersList.filter(o => o.status === 'PROCESSING').length,
      shipped: ordersList.filter(o => o.status === 'SHIPPED').length,
      delivered: ordersList.filter(o => o.status === 'DELIVERED').length,
      cancelled: ordersList.filter(o => o.status === 'CANCELLED').length,
      totalRevenue
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!newStatus) {
      alert("Please select a status first");
      return;
    }

    if (!confirm(`Change order status to ${newStatus}?`)) {
      return;
    }

    setUpdatingStatus(orderId);
    try {
      const response = await fetch(`/api/admin/order/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        // Update the order in state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        calculateStats(orders.map(o => o.id === orderId ? {...o, status: newStatus} : o));
        alert(`Order status updated to ${newStatus}!`);
      } else {
        alert(data.msg || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const printAddress = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Address - Order #${order.id.slice(-8).toUpperCase()}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; max-width: 400px; }
          .address-label { border: 2px solid #333; padding: 30px; border-radius: 10px; }
          .order-header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          .address-details { line-height: 1.8; }
          .highlight { background-color: #fff3cd; padding: 10px; margin: 15px 0; border-radius: 5px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="address-label">
          <div class="order-header">
            <h2>SHIPPING LABEL</h2>
            <p><strong>Order #${order.id.slice(-8).toUpperCase()}</strong></p>
            <p>Date: ${formatDate(order.createdAt)}</p>
          </div>
          
          <div class="address-details">
            <div class="highlight">
              <p><strong>Ship To:</strong></p>
            </div>
            <p><strong>${order.address?.firstName || ''} ${order.address?.lastName || ''}</strong></p>
            <p>${order.address?.street || ''}</p>
            <p>${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.zipCode || ''}</p>
            <p>${order.address?.country || ''}</p>
            <p><strong>Phone:</strong> ${order.address?.phone || 'N/A'}</p>
          </div>
          
          <div class="highlight">
            <p><strong>Order Items:</strong> ${order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>Please handle with care</p>
          </div>
        </div>
        
        <div class="no-print" style="margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; cursor: pointer; border-radius: 5px;">
            Print Address Label
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; cursor: pointer; border-radius: 5px; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const copyAddress = (order) => {
    const address = `
${order.address?.firstName || ''} ${order.address?.lastName || ''}
${order.address?.street || ''}
${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.zipCode || ''}
${order.address?.country || ''}
Phone: ${order.address?.phone || 'N/A'}
Order #${order.id.slice(-8).toUpperCase()}
    `.trim();
    
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchOrders();
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50/20 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Order Management</h1>
              <p className="mt-1 text-gray-600">Update status, print addresses, and manage orders</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 transition-shadow bg-white border border-gray-100 rounded-xl hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: stats.total > 0 ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6 transition-shadow bg-white border border-gray-100 rounded-xl hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="mt-1 text-2xl font-bold text-amber-700">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full rounded-full bg-amber-500" 
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6 transition-shadow bg-white border border-gray-100 rounded-xl hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Processing</p>
                <p className="mt-1 text-2xl font-bold text-blue-700">{stats.processing}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <PackageOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.processing / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6 transition-shadow bg-white border border-gray-100 rounded-xl hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="mt-1 text-lg font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full rounded-full bg-emerald-500" 
                  style={{ width: stats.totalRevenue > 0 ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 mb-8 bg-white border border-gray-100 rounded-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search by order ID, customer..."
                className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <Filter className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("ALL");
                  fetchOrders();
                }}
                className="flex-1 px-4 py-3 text-gray-700 transition-colors bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200"
              >
                Clear Filters
              </button>
              <button
                onClick={fetchOrders}
                className="flex-1 px-4 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="overflow-hidden bg-white border border-gray-100 rounded-xl">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-10 h-10 border-blue-500 rounded-full animate-spin border-3 border-t-transparent"></div>
              <p className="mt-3 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">No orders found</h3>
              <p className="mb-6 text-gray-500">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Order Details</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    const statusOption = statusOptions.find(s => s.value === order.status) || statusOptions[0];
                    const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                    const isExpanded = expandedOrder === order.id;
                    const isUpdating = updatingStatus === order.id;

                    return (
                      <React.Fragment key={order.id}>
                        <tr className="transition-colors hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  #{order.id.slice(-8).toUpperCase()}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{totalItems} items</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 truncate max-w-[150px]">
                                  {order.user?.name || 'Guest Customer'}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                  {order.user?.email || 'No email provided'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                            <p className="text-xs text-gray-500">COD</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <StatusIcon className={`w-4 h-4 ${statusOption.iconColor}`} />
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusOption.bgColor} ${statusOption.textColor}`}>
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-blue-600 hover:bg-blue-50"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => printAddress(order)}
                                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-emerald-600 hover:bg-emerald-50"
                                title="Print Address"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Order Details */}
                        {isExpanded && (
                          <tr className="bg-gray-50/50">
                            <td colSpan="5" className="px-6 py-8">
                              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* Order Summary */}
                                <div className="p-6 bg-white border border-gray-100 rounded-xl">
                                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                    <FileText className="w-5 h-5" />
                                    Order Summary
                                  </h3>
                                  <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                      <span className="text-gray-600">Order ID</span>
                                      <span className="font-medium text-gray-900">
                                        #{order.id.slice(-8).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                      <span className="text-gray-600">Order Date</span>
                                      <span className="font-medium text-gray-900">
                                        {formatDate(order.createdAt)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                      <span className="text-gray-600">Items</span>
                                      <span className="font-medium text-gray-900">
                                        {totalItems} items
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                      <span className="text-gray-600">Total Amount</span>
                                      <span className="font-bold text-gray-900">
                                        {formatPrice(order.totalAmount)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                      <span className="text-gray-600">Payment Method</span>
                                      <span className="font-medium text-gray-900">
                                        Cash on Delivery
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Customer & Address Info */}
                                <div className="p-6 bg-white border border-gray-100 rounded-xl">
                                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                    <User className="w-5 h-5" />
                                    Customer & Shipping
                                  </h3>
                                  <div className="space-y-6">
                                    <div>
                                      <h4 className="mb-2 font-medium text-gray-900">Customer Information</h4>
                                      <div className="p-3 rounded-lg bg-gray-50">
                                        <p className="font-medium">{order.user?.name || 'Guest Customer'}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Mail className="w-3 h-3 text-gray-400" />
                                          <span className="text-sm text-gray-600">
                                            {order.user?.email || 'No email provided'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">Shipping Address</h4>
                                        <button
                                          onClick={() => copyAddress(order)}
                                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 transition-colors rounded hover:bg-blue-50"
                                        >
                                          <Copy className="w-3 h-3" />
                                          Copy
                                        </button>
                                      </div>
                                      <div className="p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <div className="flex items-start gap-2">
                                          <MapPin className="flex-shrink-0 w-4 h-4 text-blue-600 mt-0.5" />
                                          <div>
                                            <p className="font-medium">{order.address?.firstName} {order.address?.lastName}</p>
                                            <p className="text-gray-700">{order.address?.street}</p>
                                            <p className="text-gray-700">
                                              {order.address?.city}, {order.address?.state} {order.address?.zipCode}
                                            </p>
                                            <p className="text-gray-700">{order.address?.country}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                              <Phone className="w-3 h-3 text-gray-500" />
                                              <span className="text-sm text-gray-700">{order.address?.phone}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => printAddress(order)}
                                        className="flex items-center justify-center w-full gap-2 py-3 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                      >
                                        <Printer className="w-4 h-4" />
                                        Print Shipping Label
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Status Management */}
                                <div className="p-6 bg-white border border-gray-100 rounded-xl">
                                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                    <ArrowUpDown className="w-5 h-5" />
                                    Update Status
                                  </h3>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                      {statusOptions.slice(1).map((option) => {
                                        const Icon = getStatusIcon(option.value);
                                        const isCurrent = order.status === option.value;
                                        const isUpdatingThis = isUpdating && updatingStatus === order.id;
                                        
                                        return (
                                          <button
                                            key={option.value}
                                            onClick={() => updateOrderStatus(order.id, option.value)}
                                            disabled={isCurrent || isUpdatingThis}
                                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                                              isCurrent
                                                ? `${option.bgColor} ${option.textColor} border-2 ${option.bgColor.replace('100', '300')}`
                                                : 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            } ${isUpdatingThis ? 'opacity-50 cursor-not-allowed' : ''}`}
                                          >
                                            <Icon className={`w-5 h-5 ${isCurrent ? option.iconColor : 'text-gray-500'}`} />
                                            <span className="text-xs font-medium">{option.label}</span>
                                            {isCurrent && (
                                              <div className="flex items-center gap-1 mt-1 text-xs">
                                                <Check className="w-3 h-3" />
                                                <span>Current</span>
                                              </div>
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
                                      <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium text-amber-800">Status Guidelines</p>
                                          <ul className="mt-1 space-y-1 text-xs text-amber-700">
                                            <li>• PENDING: Order just placed</li>
                                            <li>• PROCESSING: Order is being prepared</li>
                                            <li>• SHIPPED: Order has been dispatched</li>
                                            <li>• DELIVERED: Order completed</li>
                                            <li>• CANCELLED: Order cancelled</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    {isUpdating && (
                                      <div className="flex items-center justify-center gap-2 py-3 text-blue-600 rounded-lg bg-blue-50">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Updating status...</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                                <button
                                  onClick={() => printAddress(order)}
                                  className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                                >
                                  <Printer className="w-4 h-4" />
                                  Print Full Invoice
                                </button>
                                <button
                                  onClick={() => copyAddress(order)}
                                  className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy All Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}