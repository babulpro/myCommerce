"use client";
import React, { useState, useEffect } from "react"; 
import { 
  ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, 
  RefreshCw, MapPin, CreditCard, MessageSquare, Calendar, 
  User, Phone, Mail, Printer, Download, Share2, Heart, 
  Star, Shield, ChevronRight, Home, Navigation, 
  ExternalLink, AlertCircle, Check, ShoppingBag, Tag, 
  Percent, DollarSign, Hash, Layers, Award, BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();  
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [copied, setCopied] = useState(false);

  // Add print-specific styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        /* Hide header, footer, and other non-essential elements */
        header, 
        footer, 
        .no-print,
        .print\\:hidden,
        button,
        [onclick],
        a[href],
        nav,
        .back-button,
        .action-buttons,
        .need-help-card,
        .view-on-map,
        .write-review,
        .order-actions,
        .support-card,
        .share-button,
        .copy-button,
        .continue-shopping,
        .contact-support {
          display: none !important;
        }
        
        /* Show only essential content */
        body {
          background: white !important;
          color: black !important;
          font-size: 12pt !important;
        }
        
        .print\\:block {
          display: block !important;
        }
        
        /* Ensure proper page breaks */
        .page-break {
          page-break-before: always;
        }
        
        /* Adjust layout for print */
        .print-container {
          width: 100% !important;
          margin: 0 !important;
          padding: 20px !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        .print-order-header {
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .print-order-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        /* Make sure all text is black for better print contrast */
        * {
          color: black !important;
          background: white !important;
          border-color: #ccc !important;
        }
        
        /* Hide shadows and gradients for print */
        .shadow-sm, .shadow-lg, .shadow-md {
          box-shadow: none !important;
        }
        
        .bg-gradient-to-br, .bg-gradient-to-b, .bg-gradient-to-r {
          background: white !important;
        }
        
        /* Ensure images don't break across pages */
        img {
          max-height: 100px !important;
        }
        
        /* Better spacing for print */
        .print-spacing {
          margin-top: 20px !important;
          margin-bottom: 20px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/order/details?id=${id}`);
      const data = await response.json();
      
      if (data.status === "success") {
        setOrder(data.data);
      } else {
        setError(data.msg || "Failed to load order details");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return '#F59E0B';
      case 'PROCESSING': return '#3B82F6';
      case 'SHIPPED': return '#8B5CF6';
      case 'DELIVERED': return '#10B981';
      case 'CANCELLED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return Clock;
      case 'PROCESSING': return RefreshCw;
      case 'SHIPPED': return Truck;
      case 'DELIVERED': return CheckCircle;
      case 'CANCELLED': return XCircle;
      default: return Package;
    }
  };

  const copyOrderNumber = () => {
    if (!order?.id) return;
    navigator.clipboard.writeText(`ORD-${order.id.slice(-8).toUpperCase()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `My Order #ORD-${order?.id?.slice(-8).toUpperCase() || ''}`,
        text: `Check out my order from NextShop!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order #${order?.id?.slice(-8).toUpperCase() || ''}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #000;
            background: #fff;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .order-title {
            font-size: 18px;
            margin: 10px 0;
          }
          .print-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
          }
          .info-section {
            margin-bottom: 20px;
          }
          .info-label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #666;
            font-size: 12px;
          }
          .info-value {
            font-size: 14px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          .items-table th {
            background: #f5f5f5;
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
            font-size: 12px;
          }
          .items-table td {
            padding: 12px;
            border: 1px solid #ddd;
            font-size: 12px;
          }
          .summary {
            margin-top: 30px;
            text-align: right;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 14px;
          }
          .summary-total {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #000;
          }
          .print-footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: #666;
          }
          @page {
            margin: 20mm;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="company-name">NextShop</div>
          <div class="order-title">Order Invoice</div>
          <div>Order #${order?.id?.slice(-8).toUpperCase() || ''}</div>
          <div>Date: ${formatDate(order?.createdAt || new Date())}</div>
        </div>
        
        <div class="print-info">
          <div class="info-section">
            <div class="info-label">CUSTOMER INFORMATION</div>
            <div class="info-value">${order?.user?.name || `${order?.address?.firstName || ''} ${order?.address?.lastName || ''}`.trim()}</div>
            <div class="info-value">${order?.user?.email || order?.address?.email || ''}</div>
            <div class="info-value">${order?.address?.phone || ''}</div>
          </div>
          
          <div class="info-section">
            <div class="info-label">SHIPPING ADDRESS</div>
            <div class="info-value">${order?.address?.street || ''}</div>
            <div class="info-value">${order?.address?.city || ''}, ${order?.address?.state || ''} ${order?.address?.zipCode || ''}</div>
            <div class="info-value">${order?.address?.country || ''}</div>
          </div>
          
          <div class="info-section">
            <div class="info-label">ORDER STATUS</div>
            <div class="info-value">${order?.status || ''}</div>
          </div>
          
          <div class="info-section">
            <div class="info-label">PAYMENT METHOD</div>
            <div class="info-value">${order?.transaction?.paymentMethod || 'Cash on Delivery'}</div>
            <div class="info-value">Status: ${order?.transaction?.status || 'PENDING'}</div>
          </div>
        </div>
        
        ${order?.customerNote ? `
          <div class="info-section">
            <div class="info-label">CUSTOMER NOTE</div>
            <div class="info-value">"${order.customerNote}"</div>
          </div>
        ` : ''}
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Size</th>
              <th>Color</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order?.items?.map(item => `
              <tr>
                <td>${item.product?.name || 'Product'}</td>
                <td>${item.quantity}</td>
                <td>${item.size}</td>
                <td>${item.color}</td>
                <td>${formatPrice(item.price)}</td>
                <td>${formatPrice(item.price * item.quantity)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
        
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal (${order?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items):</span>
            <span>${formatPrice(order?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div class="summary-row summary-total">
            <span>Total Amount:</span>
            <span>${formatPrice(order?.totalAmount || 0)}</span>
          </div>
        </div>
        
        <div class="print-footer">
          <div>Thank you for shopping with NextShop!</div>
          <div>This is an automated invoice, no signature required.</div>
          <div>Invoice generated on ${new Date().toLocaleDateString()}</div>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Print after content is loaded
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 border-4 border-blue-200 rounded-full animate-spin border-t-purple-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Loading Order Details
          </h2>
          <p className="mt-2 text-gray-600">
            Fetching your order information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-md text-center">
          <div className="mb-6 text-blue-300 text-8xl">📦</div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            {error || "Order Not Found"}
          </h2>
          <p className="mb-8 text-gray-600">
            {error || "We couldn't find the order you're looking for."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/user/dashboard/order")}
              className="px-6 py-3 font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-lg hover:shadow-lg"
            >
              ← Back to Orders
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);
  const statusColor = getStatusColor(order.status);
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 print:bg-white">
      {/* Header - Will be hidden in print */}
      <div className="py-6 bg-white shadow-sm no-print">
        <div className="px-4 mx-auto sm:container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/user/dashboard/order")}
                className="flex items-center gap-2 px-4 py-2 font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-sm group back-button"
              >
                <ArrowLeft className="transition-transform group-hover:-translate-x-1" size={20} />
                Back to Orders
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h1>
                <p className="text-sm text-gray-600">
                  Track and manage your order
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 action-buttons">
              <button
                onClick={shareOrder}
                className="flex items-center gap-2 px-4 py-2 font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-sm share-button"
              >
                <Share2 size={16} />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 mx-auto sm:container sm:py-8 print-container">
        <div className="hidden print:block print-order-header">
          <div className="text-2xl font-bold text-center">NextShop</div>
          <div className="mt-2 text-lg text-center">Order Invoice</div>
          <div className="mt-4 text-center">
            Order #${order.id.slice(-8).toUpperCase()} | 
            Date: {formatDate(order.createdAt)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Order Status Card */}
            <div className="p-6 mb-6 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl print:hidden">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ backgroundColor: `${statusColor}15` }}
                  >
                    <StatusIcon size={24} style={{ color: statusColor }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h2>
                      <span 
                        className="px-3 py-1 text-xs font-bold rounded-full"
                        style={{ 
                          backgroundColor: `${statusColor}15`,
                          color: statusColor
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs - Hidden in print */}
            <div className="mb-6 print:hidden">
              <div className="flex border-b border-gray-200">
                {['details', 'items', 'timeline'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium text-sm transition-all duration-300 relative ${
                      activeTab === tab ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'details' && 'Order Details'}
                    {tab === 'items' && `Order Items (${totalItems})`}
                    {tab === 'timeline' && 'Timeline'}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl print:shadow-none print:border-none print:p-0">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="print:block">
                    <h3 className="mb-4 text-lg font-bold text-gray-900 print:text-xl">
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                        <span className="font-medium text-gray-800">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-green-600">
                          Free
                        </span>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.customerNote && (
                    <div className="print:block">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">
                        Customer Note
                      </h3>
                      <div className="p-4 rounded-lg bg-gray-50 print:bg-transparent print:p-0">
                        <div className="flex items-start gap-3">
                          <MessageSquare size={18} className="text-gray-600 print:hidden" />
                          <p className="italic text-gray-700">
                            "{order.customerNote}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'items' && (
                <div className="space-y-4 print:block">
                  <h3 className="text-lg font-bold text-gray-900 print:text-xl">
                    Order Items ({totalItems})
                  </h3>
                  {order.items?.map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 transition-all duration-300 bg-white border border-gray-100 rounded-lg hover:shadow-md print:border print:p-2 print:mb-2 print:shadow-none"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 print:hidden">
                          <img 
                            src={item.product?.images?.[0] || '/placeholder-product.jpg'} 
                            alt={item.product?.name}
                            className="object-cover w-16 h-16 rounded-lg"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col justify-between sm:flex-row">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {item.product?.name}
                              </h4>
                              <div className="flex flex-wrap gap-3 mt-2 print:gap-1">
                                <span className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Size: {item.size}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Color: {item.color}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 text-right sm:mt-0">
                              <p className="font-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatPrice(item.price)} each
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 print:hidden">
                            <Link 
                              href={`/product/${item.product?.id}`}
                              className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-purple-600"
                            >
                              View Product
                              <ExternalLink size={12} />
                            </Link>
                            {order.status === 'DELIVERED' && (
                              <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-purple-700 transition-all duration-300 rounded-lg bg-purple-50 hover:shadow-sm write-review">
                                <Star size={14} />
                                Write Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="print:hidden">
                  <h3 className="mb-6 text-lg font-bold text-gray-900">
                    Order Timeline
                  </h3>
                  <div className="relative">
                    {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status, index, array) => {
                      const Icon = getStatusIcon(status);
                      const statusIndex = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status?.toUpperCase());
                      const isCompleted = statusIndex >= index;
                      const isCurrent = order.status?.toUpperCase() === status;
                      
                      return (
                        <div key={status} className="flex items-start mb-8 last:mb-0">
                          <div className="relative">
                            <div 
                              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                                isCurrent ? 'scale-110' : ''
                              }`}
                              style={{ 
                                backgroundColor: isCompleted ? getStatusColor(status) : '#F3F4F6',
                                color: isCompleted ? 'white' : '#9CA3AF',
                                border: isCurrent ? '2px solid white' : 'none',
                                boxShadow: isCurrent ? `0 0 0 2px ${getStatusColor(status)}` : 'none'
                              }}
                            >
                              <Icon size={18} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar - Hidden in print */}
          <div className="space-y-6 print:hidden">
            {/* Customer Info Card */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Customer Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <User className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {order.user?.name || `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.user?.email || order.address?.email}
                    </p>
                  </div>
                </div>
                
                {order.address?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-600" />
                    <span className="text-gray-700">{order.address.phone}</span>
                  </div>
                )}
                
                {order.user?.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-600" />
                    <span className="text-gray-700">{order.user.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Shipping Address
                </h3>
                <MapPin size={18} className="text-gray-600" />
              </div>
              
              {order.address ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="font-bold text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {order.address.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.address.city}, {order.address.state} {order.address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.address.country}
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      📱 {order.address.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No shipping address provided
                </p>
              )}
            </div>

            {/* Payment Info Card */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Payment Information
                </h3>
                <CreditCard size={18} className="text-gray-600" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium text-gray-800">
                    {order.transaction?.paymentMethod || 'Cash on Delivery'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                    (order.transaction?.status || 'PENDING') === 'COMPLETED' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.transaction?.status || 'PENDING'}
                  </span>
                </div>
                
                {order.transaction?.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium text-gray-800">
                      {order.transaction.transactionId.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl order-actions">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Order Actions
              </h3>
              <div className="space-y-3">
                {order.status === 'PENDING' && (
                  <button className="flex items-center justify-center w-full gap-2 py-2.5 font-medium transition-all duration-300 border border-red-300 rounded-lg text-red-600 bg-red-50 hover:shadow-sm">
                    <XCircle size={16} />
                    Cancel Order
                  </button>
                )}
                
                <button className="flex items-center justify-center w-full gap-2 py-2.5 font-medium transition-all duration-300 bg-white border border-gray-200 rounded-lg text-gray-700 hover:shadow-sm">
                  <Download size={16} />
                  Download Invoice
                </button>
                
                {order.status === 'DELIVERED' && (
                  <button className="flex items-center justify-center w-full gap-2 py-2.5 font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:shadow-lg">
                    <Star size={16} />
                    Write a Review
                  </button>
                )}
                
                <button 
                  onClick={() => router.push("/")}
                  className="flex items-center justify-center w-full gap-2 py-2.5 font-medium transition-all duration-300 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 hover:shadow-sm continue-shopping"
                >
                  <ShoppingBag size={16} />
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="p-6 bg-white border border-purple-200 shadow-sm rounded-xl bg-gradient-to-b from-purple-50 to-white support-card">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={20} className="text-purple-600" />
                <h3 className="font-bold text-purple-800">
                  Need Help?
                </h3>
              </div>
              <p className="mb-4 text-sm text-purple-700">
                Having issues with your order? Our support team is here to help.
              </p>
              <button className="w-full py-2 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg contact-support">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}