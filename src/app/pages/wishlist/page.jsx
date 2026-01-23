"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { 
  AlertCircle, CheckCircle, Loader2, Heart, ShoppingCart, 
  Trash2, Package, Truck, Shield, X, ArrowLeft, ShoppingBag 
} from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [buyingNow, setBuyingNow] = useState({});
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customerNote, setCustomerNote] = useState("");
  const [removeAfterPurchase, setRemoveAfterPurchase] = useState(true);
  const [orderMessage, setOrderMessage] = useState(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn || false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Load wishlist based on auth status
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isLoggedIn) {
          await loadServerWishlist();
        } else {
          await loadLocalWishlist();
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
        setError("Failed to load wishlist. Please try again.");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      loadWishlist();
    }
  }, [isLoggedIn, authLoading]);

  // Fetch product details
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`/api/product/detail?id=${productId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product ${productId}`);
      }
      
      const data = await response.json();
      if (data.status === "success" && data.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return {
        id: productId,
        name: `Product ${productId}`,
        price: 0,
        discountPercent: 0,
        images: [],
        inventory: 0
      };
    }
  };

  const loadLocalWishlist = async () => {
    try {
      const savedWishlist = localStorage.getItem('nextshop-wishlist');
      if (!savedWishlist) {
        setWishlistItems([]);
        return;
      }

      const productIds = JSON.parse(savedWishlist);
      if (!Array.isArray(productIds) || productIds.length === 0) {
        setWishlistItems([]);
        return;
      }

      // Create basic items first
      const basicItems = productIds.map((productId, index) => ({
        id: `local_${productId}_${index}`,
        productId: productId,
        product: {
          id: productId,
          name: `Product ${productId}`,
          price: 0,
          discountPercent: 0,
          images: [],
          inventory: 0
        },
        createdAt: new Date().toISOString(),
        isLocal: true
      }));

      setWishlistItems(basicItems);

      // Fetch details in background
      const itemsWithDetails = await Promise.all(
        productIds.map(async (productId, index) => {
          try {
            const product = await fetchProductDetails(productId);
            if (product) {
              return {
                id: `local_${productId}_${index}`,
                productId: productId,
                product: product,
                createdAt: new Date().toISOString(),
                isLocal: true
              };
            }
            return null;
          } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
            return {
              id: `local_${productId}_${index}`,
              productId: productId,
              product: {
                id: productId,
                name: `Product ${productId}`,
                price: 0,
                discountPercent: 0,
                images: [],
                inventory: 0
              },
              createdAt: new Date().toISOString(),
              isLocal: true
            };
          }
        })
      );

      const validItems = itemsWithDetails.filter(Boolean);
      setWishlistItems(validItems);
      
    } catch (error) {
      console.error("Error loading local wishlist:", error);
      const savedWishlist = localStorage.getItem('nextshop-wishlist');
      if (savedWishlist) {
        try {
          const productIds = JSON.parse(savedWishlist);
          const items = productIds.map((productId, index) => ({
            id: `local_${productId}_${index}`,
            productId: productId,
            product: {
              id: productId,
              name: `Product ${productId}`,
              price: 0,
              discountPercent: 0,
              images: [],
              inventory: 0
            },
            createdAt: new Date().toISOString(),
            isLocal: true
          }));
          setWishlistItems(items);
        } catch (e) {
          setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
    }
  };

  const loadServerWishlist = async () => {
    try {
      const response = await fetch('/api/product/wishList/getWishList');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "success") {
        const items = data.data || [];
        
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            try {
              const productDetails = await fetchProductDetails(item.productId);
              return {
                ...item,
                product: productDetails || {
                  id: item.productId,
                  name: `Product ${item.productId}`,
                  price: 0,
                  discountPercent: 0,
                  images: [],
                  inventory: 0
                }
              };
            } catch (error) {
              console.error(`Failed to fetch details for product ${item.productId}:`, error);
              return {
                ...item,
                product: {
                  id: item.productId,
                  name: `Product ${item.productId}`,
                  price: 0,
                  discountPercent: 0,
                  images: [],
                  inventory: 0
                }
              };
            }
          })
        );
        
        setWishlistItems(itemsWithDetails);
      } else {
        throw new Error(data.msg || "Failed to load wishlist");
      }
    } catch (error) {
      throw error;
    }
  };

  // Add to Cart function - DOES NOT remove from wishlist
  const addToCart = async (item) => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart!");
      router.push('/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [item.id]: true }));

    try {
      const response = await fetch(`/api/product/cart/addCart?id=${item.productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: 1,
          size: item.product?.size?.[0]?.toUpperCase() || "M",
          color: item.product?.color?.[0]?.toUpperCase() || "BLACK"
        })
      });

      const result = await response.json();
      
      if (result.status === "success") {
        // Show success message
        setOrderMessage({ 
          type: "success", 
          text: "Item added to cart! It remains in your wishlist."
        });
        setTimeout(() => setOrderMessage(null), 3000);
      } else {
        setOrderMessage({ 
          type: "error", 
          text: result.msg || "Failed to add to cart"
        });
        setTimeout(() => setOrderMessage(null), 3000);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      setOrderMessage({ 
        type: "error", 
        text: "Failed to add item to cart"
      });
      setTimeout(() => setOrderMessage(null), 3000);
    } finally {
      setAddingToCart(prev => ({ ...prev, [item.id]: false }));
    }
  };

  // Buy Now function
  const buyNow = async (item) => {
    if (!isLoggedIn) {
      alert("Please login to place orders!");
      router.push('/login');
      return;
    }

    if (item.product?.inventory === 0) {
      setOrderMessage({ 
        type: "error", 
        text: "Product is out of stock!"
      });
      setTimeout(() => setOrderMessage(null), 3000);
      return;
    }

    setBuyingNow(prev => ({ ...prev, [item.id]: true }));

    try {
      const response = await fetch(`/api/product/order/newOrder?productId=${item.productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: 1,
          size: item.product?.size?.[0]?.toUpperCase() || "M",
          color: item.product?.color?.[0]?.toUpperCase() || "BLACK",
          customerNote: customerNote.trim() || ""
        })
      });

      const result = await response.json();
      
      if (result.status === "success") {
        // Show success message
        setOrderMessage({ 
          type: "success", 
          text: `Order placed successfully! Order ID: ${result.order?.id}`
        });
        
        if (removeAfterPurchase) {
          // Remove from wishlist if user chose to
          await removeFromWishlist(item);
        }
        
        // Close modal
        setShowBuyModal(false);
        setCustomerNote("");
        setRemoveAfterPurchase(true);
        setSelectedItem(null);
        
        // Redirect to orders page after 2 seconds
        setTimeout(() => {
          router.push('/user/dashboard/order');
        }, 2000);
      } else {
        setOrderMessage({ 
          type: "error", 
          text: result.msg || "Failed to place order"
        });
        setTimeout(() => setOrderMessage(null), 3000);
      }
    } catch (error) {
      console.error("Buy Now error:", error);
      setOrderMessage({ 
        type: "error", 
        text: "An error occurred while placing order. Please try again."
      });
      setTimeout(() => setOrderMessage(null), 3000);
    } finally {
      setBuyingNow(prev => ({ ...prev, [item.id]: false }));
    }
  };

  // Open Buy Now modal
  const handleBuyNowClick = (item) => {
    if (!isLoggedIn) {
      alert("Please login to place orders!");
      router.push('/login');
      return;
    }

    if (item.product?.inventory === 0) {
      setOrderMessage({ 
        type: "error", 
        text: "Product is out of stock!"
      });
      setTimeout(() => setOrderMessage(null), 3000);
      return;
    }

    setSelectedItem(item);
    setShowBuyModal(true);
  };

  // Remove item from wishlist
  const removeFromWishlist = async (item) => {
    try {
      if (isLoggedIn) {
        const response = await fetch(`/api/product/wishList/DeleteWishList?id=${item.productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setWishlistItems(prev => prev.filter(i => i.id !== item.id));
          return true;
        } else {
          throw new Error('Failed to remove from server');
        }
      } else {
        const savedWishlist = localStorage.getItem('nextshop-wishlist');
        if (savedWishlist) {
          const productIds = JSON.parse(savedWishlist);
          const updatedIds = productIds.filter(id => id !== item.productId);
          localStorage.setItem('nextshop-wishlist', JSON.stringify(updatedIds));
          setWishlistItems(prev => prev.filter(i => i.id !== item.id));
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      setOrderMessage({ 
        type: "error", 
        text: "Failed to remove item from wishlist. Please try again."
      });
      setTimeout(() => setOrderMessage(null), 3000);
      return false;
    }
  };

  // Move to cart and remove from wishlist (explicit action)
  const moveToCart = async (item) => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart!");
      router.push('/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [item.id]: true }));

    try {
      // First add to cart
      const response = await fetch(`/api/product/cart/addCart?id=${item.productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: 1,
          size: item.product?.size?.[0]?.toUpperCase() || "M",
          color: item.product?.color?.[0]?.toUpperCase() || "BLACK"
        })
      });

      const result = await response.json();
      
      if (result.status === "success") {
        // Then remove from wishlist
        await removeFromWishlist(item);
        setOrderMessage({ 
          type: "success", 
          text: "Item moved to cart and removed from wishlist!"
        });
        setTimeout(() => setOrderMessage(null), 3000);
      } else {
        setOrderMessage({ 
          type: "error", 
          text: result.msg || "Failed to add to cart"
        });
        setTimeout(() => setOrderMessage(null), 3000);
      }
    } catch (error) {
      console.error("Move to cart error:", error);
      setOrderMessage({ 
        type: "error", 
        text: "Failed to move item to cart"
      });
      setTimeout(() => setOrderMessage(null), 3000);
    } finally {
      setAddingToCart(prev => ({ ...prev, [item.id]: false }));
    }
  };

  // Sync local wishlist to server
  const syncToServer = async () => {
    try {
      const localWishlist = localStorage.getItem('nextshop-wishlist');
      if (!localWishlist) return;
      
      const productIds = JSON.parse(localWishlist);
      
      const syncPromises = productIds.map(async (productId) => {
        const response = await fetch(`/api/product/wishList/addWishList?id=${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        return response.ok;
      });
      
      const results = await Promise.all(syncPromises);
      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        localStorage.removeItem('nextshop-wishlist');
        await loadServerWishlist();
        setOrderMessage({ 
          type: "success", 
          text: "Wishlist synced to your account!"
        });
        setTimeout(() => setOrderMessage(null), 3000);
      } else {
        throw new Error("Some items failed to sync");
      }
      
    } catch (error) {
      console.error("Failed to sync wishlist:", error);
      setOrderMessage({ 
        type: "error", 
        text: "Failed to sync wishlist. Please try again."
      });
      setTimeout(() => setOrderMessage(null), 3000);
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discountPercent) => {
    if (!discountPercent || price === 0) return price;
    return price - (price * discountPercent / 100);
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "৳ 0";
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Clear local wishlist
  const clearLocalWishlist = () => {
    if (window.confirm("Are you sure you want to clear your local wishlist?")) {
      localStorage.removeItem('nextshop-wishlist');
      setWishlistItems([]);
      setOrderMessage({ 
        type: "success", 
        text: "Wishlist cleared!"
      });
      setTimeout(() => setOrderMessage(null), 3000);
    }
  };

  // Get product image
  const getProductImage = (product) => {
    if (product?.images?.[0]) {
      return product.images[0];
    }
    return `https://via.placeholder.com/300x300/cccccc/969696?text=Product+${product?.id || ''}`;
  };

  // Get product name
  const getProductName = (product) => {
    return product?.name || `Product ${product?.id || 'Unknown'}`;
  };

  // Bulk add to cart
  const bulkAddToCart = async () => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart!");
      router.push('/login');
      return;
    }

    const inStockItems = wishlistItems.filter(item => item.product?.inventory > 0);
    
    if (inStockItems.length === 0) {
      setOrderMessage({ 
        type: "error", 
        text: "No in-stock items to add to cart!"
      });
      setTimeout(() => setOrderMessage(null), 3000);
      return;
    }

    if (window.confirm(`Add all ${inStockItems.length} in-stock items to cart?`)) {
      try {
        let addedCount = 0;
        
        for (const item of inStockItems) {
          const response = await fetch(`/api/product/cart/addCart?id=${item.productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: 1,
              size: item.product?.size?.[0]?.toUpperCase() || "M",
              color: item.product?.color?.[0]?.toUpperCase() || "BLACK"
            })
          });

          if (response.ok) {
            addedCount++;
          }
        }

        setOrderMessage({ 
          type: "success", 
          text: `${addedCount} items added to cart! Items remain in your wishlist.`
        });
        setTimeout(() => setOrderMessage(null), 3000);
      } catch (error) {
        console.error("Bulk add to cart error:", error);
        setOrderMessage({ 
          type: "error", 
          text: "Failed to add some items to cart"
        });
        setTimeout(() => setOrderMessage(null), 3000);
      }
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{
        background: "linear-gradient(to bottom, var(--primary-50), white)"
      }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 rounded-full animate-spin" style={{
            borderColor: "var(--primary-400)",
            borderTopColor: "var(--accent-600)"
          }}></div>
          <p className="text-lg font-bold" style={{ color: "var(--primary-700)" }}>
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  const totalValue = wishlistItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discountPercent || 0;
    return sum + calculateDiscountedPrice(price, discount);
  }, 0);

  const onSaleCount = wishlistItems.filter(item => item.product?.discountPercent > 0).length;
  const outOfStockCount = wishlistItems.filter(item => item.product?.inventory === 0).length;
  const inStockCount = wishlistItems.filter(item => item.product?.inventory > 0).length;

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(to bottom, var(--primary-25), white)"
    }}>
      {/* Order Message */}
      {orderMessage && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg max-w-md w-full ${
          orderMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {orderMessage.type === 'success' ? (
              <CheckCircle className="flex-shrink-0 text-green-600" size={20} />
            ) : (
              <AlertCircle className="flex-shrink-0 text-red-600" size={20} />
            )}
            <p>{orderMessage.text}</p>
          </div>
        </div>
      )}

      {/* Buy Now Modal */}
      {showBuyModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full p-6 bg-white shadow-2xl md:w-1/2 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: "var(--primary-900)" }}>
                Buy Now: {getProductName(selectedItem.product)}
              </h3>
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setCustomerNote("");
                  setRemoveAfterPurchase(true);
                  setSelectedItem(null);
                }}
                className="p-1 transition-colors rounded-full hover:bg-gray-100"
              >
                <X size={24} style={{ color: "var(--primary-600)" }} />
              </button>
            </div>
            
            {/* Product Info */}
            <div className="flex items-start gap-4 p-4 mb-4 rounded-lg" style={{
              backgroundColor: "var(--primary-50)",
              border: "1px solid var(--primary-200)"
            }}>
              <img 
                src={getProductImage(selectedItem.product)}
                alt={getProductName(selectedItem.product)}
                className="object-cover w-20 h-20 rounded-lg"
              />
              <div>
                <h4 className="font-bold" style={{ color: "var(--primary-800)" }}>
                  {getProductName(selectedItem.product)}
                </h4>
                <p className="mt-1 text-lg font-bold" style={{ color: "var(--accent-600)" }}>
                  {formatPrice(calculateDiscountedPrice(
                    selectedItem.product.price, 
                    selectedItem.product.discountPercent
                  ))}
                </p>
                {selectedItem.product.discountPercent > 0 && (
                  <p className="text-sm line-through" style={{ color: "var(--primary-400)" }}>
                    {formatPrice(selectedItem.product.price)}
                  </p>
                )}
                <p className="mt-1 text-sm" style={{ color: "var(--primary-600)" }}>
                  Quantity: 1
                </p>
              </div>
            </div>
            
            {/* Order Note */}
            <div className="mb-4">
              <label className="block mb-2 font-medium" style={{ color: "var(--primary-700)" }}>
                Add Order Note (Optional)
              </label>
              <textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="e.g., Please deliver after 5 PM, special packaging, etc."
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900"
                rows={3}
              />
            </div>
            
            {/* Remove from Wishlist Option */}
            <div className="flex items-center gap-3 p-3 mb-6 rounded-lg" style={{
              backgroundColor: "var(--accent-50)",
              border: "1px solid var(--accent-200)"
            }}>
              <input
                type="checkbox"
                id="removeFromWishlist"
                checked={removeAfterPurchase}
                onChange={(e) => setRemoveAfterPurchase(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: "var(--accent-600)" }}
              />
              <label htmlFor="removeFromWishlist" className="text-sm" style={{ color: "var(--accent-800)" }}>
                Remove this item from wishlist after purchase
              </label>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setCustomerNote("");
                  setRemoveAfterPurchase(true);
                  setSelectedItem(null);
                }}
                className="flex-1 py-2 font-medium transition-colors border rounded-lg hover:bg-primary-50"
                style={{
                  color: "var(--primary-700)",
                  borderColor: "var(--primary-300)"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => buyNow(selectedItem)}
                disabled={buyingNow[selectedItem.id]}
                className="flex-1 py-2 font-medium text-white transition-all rounded-lg hover:shadow-lg disabled:opacity-70"
                style={{
                  background: "linear-gradient(to right, var(--accent-500), var(--accent-600))"
                }}
              >
                {buyingNow[selectedItem.id] ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Place Order (COD)"
                )}
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="pt-4 mt-4 border-t" style={{ borderColor: "var(--primary-200)" }}>
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--primary-600)" }}>
                <Package size={16} />
                <span>Cash on Delivery (COD)</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: "var(--primary-600)" }}>
                <Truck size={16} />
                <span>Free shipping on orders over ৳1000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="py-6" style={{ backgroundColor: "var(--primary-50)" }}>
        <div className="px-4 mx-auto sm:container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-primary-100"
                style={{ color: "var(--primary-700)" }}
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Continue Shopping</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-center sm:text-left" style={{ color: "var(--primary-900)" }}>
              My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
            </h1>
            <div className="text-lg font-bold text-center sm:text-right" style={{ color: "var(--primary-700)" }}>
              Total Value: {formatPrice(totalValue)}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 mx-auto sm:py-8 sm:container">
        {/* Sync Notification for Guest Users */}
        {!isLoggedIn && wishlistItems.length > 0 && (
          <div className="p-6 mb-8 rounded-xl" style={{
            backgroundColor: "var(--warning-50)",
            border: "1px solid var(--warning-200)"
          }}>
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full" style={{
                  backgroundColor: "var(--warning-100)",
                  color: "var(--warning-600)"
                }}>
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: "var(--warning-800)" }}>
                    Save your wishlist permanently!
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "var(--warning-700)" }}>
                    You have {wishlistItems.length} items saved locally. 
                    Login to sync them to your account and access from any device.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 md:ml-auto">
                <Link
                  href="/login"
                  className="px-6 py-3 font-bold text-white transition-all rounded-lg hover:shadow-lg"
                  style={{
                    background: "linear-gradient(to right, var(--accent-500), var(--accent-600))"
                  }}
                >
                  🔐 Login Now
                </Link>
                <button
                  onClick={clearLocalWishlist}
                  className="px-6 py-3 font-bold transition-colors border rounded-lg hover:bg-red-50"
                  style={{
                    color: "var(--neutral-600)",
                    borderColor: "var(--primary-300)"
                  }}
                >
                  🗑️ Clear Local
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="max-w-2xl py-16 mx-auto text-center bg-white shadow-sm rounded-2xl">
            <div className="mb-6" style={{ color: "var(--primary-400)", fontSize: "5rem" }}>❤️</div>
            <h2 className="mb-4 text-3xl font-bold" style={{ color: "var(--primary-900)" }}>
              {isLoggedIn ? 'Your wishlist is empty' : 'No items in wishlist'}
            </h2>
            <p className="mb-8 text-lg" style={{ color: "var(--primary-600)" }}>
              {isLoggedIn 
                ? 'Start adding products you love to your wishlist!'
                : 'Browse products and add them to your wishlist - they will be saved locally'}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link 
                href="/"
                className="px-8 py-4 font-bold text-white transition-all duration-300 rounded-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                  boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                }}
              >
                ✨ Browse Products
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="px-8 py-4 font-bold transition-colors border rounded-lg hover:bg-primary-50"
                  style={{
                    color: "var(--primary-700)",
                    borderColor: "var(--primary-300)"
                  }}
                >
                  🔐 Login to Get Started
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => {
                const product = item.product;
                if (!product) return null;
                
                const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
                const isDiscounted = product.discountPercent > 0;
                const productImage = getProductImage(product);
                const productName = getProductName(product);
                const isOutOfStock = product.inventory === 0;
                
                return (
                  <div 
                    key={item.id}
                    className="overflow-hidden transition-all bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg group"
                    style={{ borderColor: "var(--primary-200)" }}
                  >
                    {/* Product Image */}
                    <div className="relative h-48" style={{ backgroundColor: "var(--primary-50)" }}>
                      <Link href={`/pages/product/detail/${product.id}`} className="block h-full">
                        <img 
                          src={productImage}
                          alt={productName}
                          className="object-contain w-full h-full p-4 transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/300x300/cccccc/969696?text=Product+${product.id}`;
                          }}
                        />
                      </Link>
                      
                      {/* Local Storage Badge */}
                      {!isLoggedIn && item.isLocal && (
                        <div className="absolute px-2 py-1 text-xs font-bold text-white rounded top-2 left-2" style={{
                          backgroundColor: "var(--primary-600)"
                        }}>
                          💾 Local
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {isDiscounted && (
                        <div className={`absolute px-2 py-1 text-xs font-bold text-white rounded ${
                          !isLoggedIn && item.isLocal ? 'top-8' : 'top-2'
                        } left-2`} style={{
                          background: "linear-gradient(to right, var(--secondary-500), var(--secondary-600))"
                        }}>
                          -{product.discountPercent}%
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(item)}
                        className="absolute p-2 transition-colors rounded-full top-2 right-2 hover:bg-red-100"
                        style={{ color: "var(--neutral-600)" }}
                        title="Remove from wishlist"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      {/* Stock Indicator */}
                      <div className="absolute bottom-2 left-2">
                        {isOutOfStock ? (
                          <span className="px-2 py-1 text-xs font-bold text-white rounded" style={{
                            backgroundColor: "var(--neutral-600)"
                          }}>
                            Out of Stock
                          </span>
                        ) : product.inventory && product.inventory <= 5 ? (
                          <span className="px-2 py-1 text-xs font-bold text-white rounded" style={{
                            backgroundColor: "var(--warning-600)"
                          }}>
                            Only {product.inventory} left
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-bold text-white rounded" style={{
                            backgroundColor: "var(--success-600)"
                          }}>
                            In Stock
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      {/* Product Name */}
                      <h3 className="mb-2 font-semibold line-clamp-2 h-14" style={{ color: "var(--primary-800)" }}>
                        <Link 
                          href={`/pages/product/detail/${product.id}`}
                          className="transition-colors hover:text-accent-600"
                        >
                          {productName}
                        </Link>
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {product.price > 0 ? (
                          isDiscounted ? (
                            <>
                              <span className="text-xl font-bold" style={{ color: "var(--accent-600)" }}>
                                {formatPrice(discountedPrice)}
                              </span>
                              <span className="text-sm line-through" style={{ color: "var(--primary-400)" }}>
                                {formatPrice(product.price)}
                              </span>
                              <span className="ml-auto text-xs font-bold rounded px-1.5 py-0.5" style={{
                                backgroundColor: "var(--secondary-100)",
                                color: "var(--secondary-700)"
                              }}>
                                Save {product.discountPercent}%
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold" style={{ color: "var(--accent-600)" }}>
                              {formatPrice(product.price)}
                            </span>
                          )
                        ) : (
                          <span className="text-sm" style={{ color: "var(--primary-500)" }}>Price not available</span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 mt-3">
                        {/* Move to Cart (Add + Remove) */}
                        <button
                          onClick={() => moveToCart(item)}
                          disabled={addingToCart[item.id] || isOutOfStock || !isLoggedIn}
                          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            addingToCart[item.id] 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : isOutOfStock || !isLoggedIn
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {addingToCart[item.id] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Moving...
                            </>
                          ) : !isLoggedIn ? (
                            'Login to Move'
                          ) : isOutOfStock ? (
                            'Out of Stock'
                          ) : (
                            <>
                              ➡️ Move to Cart
                            </>
                          )}
                        </button>
                        
                        {/* Simple Add to Cart */}
                        <button
                          onClick={() => addToCart(item)}
                          disabled={addingToCart[item.id] || isOutOfStock || !isLoggedIn}
                          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            addingToCart[item.id] 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : isOutOfStock || !isLoggedIn
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {addingToCart[item.id] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Adding...
                            </>
                          ) : !isLoggedIn ? (
                            'Login to Add'
                          ) : isOutOfStock ? (
                            'Out of Stock'
                          ) : (
                            <>
                              🛒 Add to Cart
                            </>
                          )}
                        </button>
                        
                        {/* Buy Now */}
                        <button
                          onClick={() => handleBuyNowClick(item)}
                          disabled={buyingNow[item.id] || isOutOfStock || !isLoggedIn}
                          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            buyingNow[item.id]
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : isOutOfStock || !isLoggedIn
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-md'
                          }`}
                        >
                          {buyingNow[item.id] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : !isLoggedIn ? (
                            'Login to Buy'
                          ) : isOutOfStock ? (
                            'Out of Stock'
                          ) : (
                            <>
                              ⚡ Buy Now (COD)
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {product.brand && product.brand !== "Others" && (
                          <span className="px-2 py-1 text-xs rounded" style={{
                            color: "var(--primary-600)",
                            backgroundColor: "var(--primary-100)"
                          }}>
                            {product.brand}
                          </span>
                        )}
                        {product.category && (
                          <span className="px-2 py-1 text-xs rounded" style={{
                            color: "var(--accent-600)",
                            backgroundColor: "var(--accent-100)"
                          }}>
                            {product.category.name || "Category"}
                          </span>
                        )}
                      </div>
                      
                      {/* Added Date */}
                      <div className="pt-3 mt-4 border-t" style={{ borderColor: "var(--primary-200)" }}>
                        <div className="text-xs" style={{ color: "var(--primary-500)" }}>
                          Added: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary and Bulk Actions */}
            <div className="p-6 mt-12 rounded-xl" style={{
              backgroundColor: "white",
              border: "1px solid var(--primary-200)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center md:text-left">
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--primary-800)" }}>Total Items</h3>
                  <div className="text-3xl font-bold" style={{ color: "var(--primary-900)" }}>{wishlistItems.length}</div>
                  <p className="mt-1 text-sm" style={{ color: "var(--primary-600)" }}>
                    {!isLoggedIn ? "Saved locally" : "In your account"}
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--primary-800)" }}>Total Value</h3>
                  <div className="text-3xl font-bold" style={{ color: "var(--primary-900)" }}>
                    {formatPrice(totalValue)}
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--primary-500)" }}>Current worth</p>
                </div>
                
                <div className="text-center md:text-right">
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--primary-800)" }}>On Sale</h3>
                  <div className="text-3xl font-bold" style={{ color: "var(--secondary-600)" }}>
                    {onSaleCount}
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--primary-500)" }}>Discounted items</p>
                </div>
              </div>
              
              {/* Bulk Actions */}
              <div className="flex flex-col justify-center gap-4 pt-6 mt-6 border-t sm:flex-row" style={{ borderColor: "var(--primary-200)" }}>
                <Link 
                  href="/"
                  className="px-6 py-3 font-medium text-center transition-colors border rounded-lg hover:bg-primary-50"
                  style={{
                    color: "var(--primary-700)",
                    borderColor: "var(--primary-300)"
                  }}
                >
                  ← Continue Shopping
                </Link>
                
                <Link 
                  href="/pages/cart"
                  className="px-6 py-3 font-medium text-center text-white transition-all rounded-lg hover:shadow-lg"
                  style={{
                    background: "linear-gradient(to right, var(--accent-500), var(--accent-600))"
                  }}
                >
                  🛒 View Cart
                </Link>
                
                {isLoggedIn && inStockCount > 0 && (
                  <button
                    onClick={bulkAddToCart}
                    className="px-6 py-3 font-medium text-center text-white transition-all rounded-lg hover:shadow-lg"
                    style={{
                      background: "linear-gradient(to right, var(--secondary-500), var(--secondary-600))"
                    }}
                  >
                    📦 Add All ({inStockCount}) to Cart
                  </button>
                )}
                
                {!isLoggedIn && wishlistItems.length > 0 && (
                  <button
                    onClick={syncToServer}
                    className="px-6 py-3 font-medium text-center text-white transition-all rounded-lg hover:shadow-lg"
                    style={{
                      background: "linear-gradient(to right, var(--success-500), var(--success-600))"
                    }}
                  >
                    🔄 Sync to Account
                  </button>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
                <div className="p-3 text-center rounded-lg" style={{ backgroundColor: "var(--primary-50)" }}>
                  <div className="text-lg font-bold" style={{ color: "var(--primary-600)" }}>{inStockCount}</div>
                  <div className="text-xs" style={{ color: "var(--primary-700)" }}>In Stock</div>
                </div>
                <div className="p-3 text-center rounded-lg" style={{ backgroundColor: "var(--neutral-50)" }}>
                  <div className="text-lg font-bold" style={{ color: "var(--neutral-600)" }}>{outOfStockCount}</div>
                  <div className="text-xs" style={{ color: "var(--neutral-700)" }}>Out of Stock</div>
                </div>
                <div className="p-3 text-center rounded-lg" style={{ backgroundColor: "var(--warning-50)" }}>
                  <div className="text-lg font-bold" style={{ color: "var(--warning-600)" }}>
                    {wishlistItems.filter(item => item.product?.inventory > 0 && item.product?.inventory <= 5).length}
                  </div>
                  <div className="text-xs" style={{ color: "var(--warning-700)" }}>Low Stock</div>
                </div>
                <div className="p-3 text-center rounded-lg" style={{ backgroundColor: "var(--success-50)" }}>
                  <div className="text-lg font-bold" style={{ color: "var(--success-600)" }}>
                    {wishlistItems.filter(item => item.product?.inventory > 5).length}
                  </div>
                  <div className="text-xs" style={{ color: "var(--success-700)" }}>Good Stock</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Note */}
      <div className="py-6 mt-8" style={{ backgroundColor: "var(--primary-900)" }}>
        <div className="container px-4 mx-auto text-center">
          <p style={{ color: "var(--primary-300)" }}>
            {isLoggedIn 
              ? "❤️ Your wishlist is saved to your account"
              : wishlistItems.length > 0 
                ? "💾 Your wishlist is saved locally in your browser" 
                : "Browse products to add to your wishlist"}
          </p>
          <div className="mt-2 text-sm" style={{ color: "var(--primary-400)" }}>
            {wishlistItems.length > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>"Add to Cart" keeps items in wishlist</span>
                <span className="mx-2">•</span>
                <span>"Move to Cart" removes from wishlist</span>
                <span className="mx-2">•</span>
                <span>"Buy Now" asks to keep or remove</span>
              </>
            )}
          </div>
          {!isLoggedIn && wishlistItems.length > 0 && (
            <Link 
              href="/login" 
              className="inline-block mt-3 text-sm underline transition-colors hover:text-accent-300"
              style={{ color: "var(--accent-300)" }}
            >
              Login to save your wishlist permanently
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}