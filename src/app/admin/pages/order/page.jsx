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
  CreditCard,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Edit,
  Save,
  X,
  Printer,
  Copy,
  Filter,
  Calendar,
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedDateRange, setSelectedDateRange] = useState("LAST_30_DAYS");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });

  const statusOptions = [
    { value: "ALL", label: "All Orders", bgColor: "bg-gray-100", textColor: "text-gray-700", iconColor: "text-gray-500" },
    { value: "PENDING", label: "Pending", bgColor: "bg-amber-100", textColor: "text-amber-700", iconColor: "text-amber-500" },
    { value: "PROCESSING", label: "Processing", bgColor: "bg-blue-100", textColor: "text-blue-700", iconColor: "text-blue-500" },
    { value: "SHIPPED", label: "Shipped", bgColor: "bg-indigo-100", textColor: "text-indigo-700", iconColor: "text-indigo-500" },
    { value: "DELIVERED", label: "Delivered", bgColor: "bg-emerald-100", textColor: "text-emerald-700", iconColor: "text-emerald-500" },
    { value: "CANCELLED", label: "Cancelled", bgColor: "bg-rose-100", textColor: "text-rose-700", iconColor: "text-rose-500" }
  ];

  const dateRanges = [
    { value: "TODAY", label: "Today" },
    { value: "YESTERDAY", label: "Yesterday" },
    { value: "LAST_7_DAYS", label: "Last 7 Days" },
    { value: "LAST_30_DAYS", label: "Last 30 Days" },
    { value: "THIS_MONTH", label: "This Month" },
    { value: "LAST_MONTH", label: "Last Month" },
    { value: "ALL", label: "All Time" }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      const response = await fetch(`/api/admin/order?status=${selectedStatus}&dateRange=${selectedDateRange}&search=${searchTerm}`);
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
    const deliveredOrders = ordersList.filter(o => o.status === 'DELIVERED').length;
    
    setStats({
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'PENDING').length,
      processing: ordersList.filter(o => o.status === 'PROCESSING').length,
      shipped: ordersList.filter(o => o.status === 'SHIPPED').length,
      delivered: deliveredOrders,
      cancelled: ordersList.filter(o => o.status === 'CANCELLED').length,
      totalRevenue,
      averageOrderValue: ordersList.length > 0 ? totalRevenue / ordersList.length : 0,
      conversionRate: ordersList.length > 0 ? (deliveredOrders / ordersList.length) * 100 : 0
    });
  };

  const updateOrderStatus = async (orderId) => {
    if (!statusUpdate) return;
    
    try {
      const response = await fetch(`/api/admin/order/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusUpdate })
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Order status updated successfully!");
        setEditingOrder(null);
        setStatusUpdate("");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  const printOrder = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Invoice - #${order.id.slice(-8).toUpperCase()}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .order-items { margin: 30px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f5f5f5; }
          .total-section { margin-top: 30px; text-align: right; }
          .total-amount { font-size: 24px; font-weight: bold; color: #333; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>INVOICE</h1>
          <h2>Order #${order.id.slice(-8).toUpperCase()}</h2>
          <p>Date: ${formatDate(order.createdAt)}</p>
          <p>Status: ${order.status}</p>
        </div>
        
        <div class="invoice-details">
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.user?.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${order.user?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.address?.phone || 'N/A'}</p>
          </div>
          
          <div class="shipping-info">
            <h3>Shipping Address</h3>
            <p>${order.address?.firstName || ''} ${order.address?.lastName || ''}</p>
            <p>${order.address?.street || ''}</p>
            <p>${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.zipCode || ''}</p>
            <p>${order.address?.country || ''}</p>
          </div>
        </div>
        
        <div class="order-items">
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map(item => `
                <tr>
                  <td>${item.product?.name || 'N/A'}</td>
                  <td>${item.size || 'N/A'}</td>
                  <td>${item.color || 'N/A'}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td>${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="total-section">
          <div>
            <p>Subtotal: ${formatPrice(order.totalAmount)}</p>
            <p>Shipping: Free</p>
            <p>Tax: Included</p>
            <p class="total-amount">Total: ${formatPrice(order.totalAmount)}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; cursor: pointer;">
            Print Invoice
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Items', 'Total', 'Status', 'Address'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.id.slice(-8).toUpperCase(),
        new Date(order.createdAt).toLocaleDateString(),
        order.user?.name || 'N/A',
        order.user?.email || 'N/A',
        order.address?.phone || 'N/A',
        order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        order.totalAmount,
        order.status,
        `${order.address?.city || ''}, ${order.address?.state || ''}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const copyOrderDetails = (order) => {
    const details = `
Order ID: ${order.id.slice(-8).toUpperCase()}
Date: ${formatDate(order.createdAt)}
Customer: ${order.user?.name || 'N/A'}
Email: ${order.user?.email || 'N/A'}
Phone: ${order.address?.phone || 'N/A'}
Address: ${order.address?.street || ''}, ${order.address?.city || ''}
Status: ${order.status}
Total: ${formatPrice(order.totalAmount)}
Items: ${order.items?.map(item => `${item.product?.name} (${item.quantity}x)`).join(', ')}
    `.trim();
    
    navigator.clipboard.writeText(details);
    alert("Order details copied to clipboard!");
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, selectedDateRange]);

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
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Order Management Dashboard</h1>
              <p className="mt-1 text-gray-600">Manage and track all customer orders in real-time</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <div className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-600">Active tracking</span>
            </div>
          </div>

          <div className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="mt-1 text-lg font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Avg order: {formatPrice(stats.averageOrderValue)}
            </div>
          </div>

          <div className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-emerald-600">
              {stats.conversionRate.toFixed(1)}% success rate
            </div>
          </div>

          <div className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="mt-1 text-2xl font-bold text-amber-800">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-amber-600">
              Requires attention
            </div>
          </div>

          <div className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Processing</p>
                <p className="mt-1 text-2xl font-bold text-blue-800">{stats.processing}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-blue-600">
              In preparation
            </div>
          </div>

          <div className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Shipped</p>
                <p className="mt-1 text-2xl font-bold text-indigo-800">{stats.shipped}</p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50">
                <Truck className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-indigo-600">
              In transit
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-col justify-between gap-4 mb-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Orders</h2>
            </div>
            <div className="text-sm text-gray-500">
              {stats.total} orders found
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute w-5 h-5 text-gray-400 transition-colors transform -translate-y-1/2 left-3 top-1/2 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                className="w-full py-3 pl-10 pr-4 transition-all border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                {statusOptions.slice(1).map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/* Date Range Filter */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {statusOptions.map((option) => {
              const Icon = getStatusIcon(option.value);
              const isActive = selectedStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                    isActive 
                      ? `${option.bgColor} ${option.textColor} border shadow-sm` 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option.value !== 'ALL' && <Icon className={`w-4 h-4 ${isActive ? option.iconColor : 'text-gray-400'}`} />}
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.value !== 'ALL' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/60' : 'bg-gray-100'
                    }`}>
                      {stats[option.value.toLowerCase()]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Order List</h2>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: Just now
              </div>
            </div>
          </div>

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
              <button 
                onClick={() => {
                  setSelectedStatus("ALL");
                  setSearchTerm("");
                  fetchOrders();
                }}
                className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Order</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Items</th>
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
                                <p className="text-xs text-gray-500 mt-0.5">Click to expand</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                                <p className="text-sm text-gray-500 truncate max-w-[150px]">{order.user?.email || 'No email'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                            <p className="text-xs text-gray-500">Order placed</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                                <ShoppingBag className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{totalItems}</p>
                                <p className="text-xs text-gray-500">items</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
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
                                onClick={() => printOrder(order)}
                                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-blue-600 hover:bg-blue-50"
                                title="Print Invoice"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => copyOrderDetails(order)}
                                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-gray-700 hover:bg-gray-100"
                                title="Copy Details"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingOrder(order.id);
                                  setStatusUpdate(order.status);
                                }}
                                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-emerald-600 hover:bg-emerald-50"
                                title="Update Status"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-indigo-600 hover:bg-indigo-50"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Order Details */}
                        {isExpanded && (
                          <tr className="bg-gray-50/50">
                            <td colSpan="7" className="px-6 py-8">
                              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Order Items */}
                                <div className="lg:col-span-2">
                                  <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                                    <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900">
                                      <ShoppingBag className="w-5 h-5" />
                                      Order Items ({totalItems})
                                    </h3>
                                    <div className="space-y-4">
                                      {order.items?.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
                                          <img
                                            src={item.product?.images?.[0] || '/placeholder.jpg'}
                                            alt={item.product?.name}
                                            className="object-cover w-20 h-20 border border-gray-200 rounded-lg"
                                          />
                                          <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                                            <div className="flex flex-wrap gap-3 mt-2">
                                              <span className="px-2.5 py-1 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                                Qty: {item.quantity}
                                              </span>
                                              <span className="px-2.5 py-1 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                                Size: {item.size}
                                              </span>
                                              <span className="px-2.5 py-1 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                                Color: {item.color}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                            <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Order Information Sidebar */}
                                <div className="space-y-6">
                                  {/* Customer Info Card */}
                                  <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                      <User className="w-5 h-5" />
                                      Customer Details
                                    </h3>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm text-gray-500">Email</p>
                                          <p className="font-medium text-gray-900">{order.user?.email || 'N/A'}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm text-gray-500">Phone</p>
                                          <p className="font-medium text-gray-900">{order.address?.phone || 'N/A'}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shipping Address Card */}
                                  <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl test-slate-500">
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-600">
                                      <MapPin className="w-5 h-5" />
                                      Shipping Address
                                    </h3>
                                    <div className="p-4 rounded-lg ">
                                      <p className="font-medium text-gray-900">{order.address?.firstName} {order.address?.lastName}</p>
                                      <p className="mt-1 text-gray-300">{order.address?.street}</p>
                                      <p className="text-gray-300">{order.address?.city}, {order.address?.state} {order.address?.zipCode}</p>
                                      <p className="text-gray-300">{order.address?.country}</p>
                                    </div>
                                  </div>

                                  {/* Status Update Card */}
                                  <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Update Status</h3>
                                    {editingOrder === order.id ? (
                                      <div className="space-y-4">
                                        <select
                                          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          value={statusUpdate}
                                          onChange={(e) => setStatusUpdate(e.target.value)}
                                        >
                                          {statusOptions.slice(1).map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                          ))}
                                        </select>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => updateOrderStatus(order.id)}
                                            className="flex items-center justify-center flex-1 gap-2 py-3 text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                          >
                                            <Save className="w-4 h-4" />
                                            Update Status
                                          </button>
                                          <button
                                            onClick={() => {
                                              setEditingOrder(null);
                                              setStatusUpdate("");
                                            }}
                                            className="px-4 py-3 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setEditingOrder(order.id);
                                          setStatusUpdate(order.status);
                                        }}
                                        className="flex items-center justify-center w-full gap-2 py-3 transition-all border rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200"
                                      >
                                        <Edit className="w-4 h-4" />
                                        Change Order Status
                                      </button>
                                    )}
                                  </div>
                                </div>
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

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 mt-8 sm:flex-row">
            <div className="text-sm text-gray-500">
              Showing {Math.min(orders.length, 10)} of {stats.total} orders
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                1
              </button>
              <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                2
              </button>
              <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}