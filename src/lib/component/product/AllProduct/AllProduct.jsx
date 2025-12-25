"use client"
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState({});

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        const loggedIn = data.isLoggedIn;
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
          // Load server wishlist first
          await loadServerWishlist();
          
          // Check if there's local wishlist to sync
          const localWishlist = localStorage.getItem('nextshop-wishlist');
          if (localWishlist) {
            // Wait 1 second to ensure server wishlist is fully loaded
            setTimeout(async () => {
              await syncLocalToServer();
            }, 1000);
          }
        } else {
          // For guest users, only load from localStorage
          loadLocalWishlist();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
        loadLocalWishlist();
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Load wishlist from localStorage for guest users
  const loadLocalWishlist = () => {
    const savedWishlist = localStorage.getItem('nextshop-wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlist(parsedWishlist);
      } catch (error) {
        console.error("Error parsing localStorage wishlist:", error);
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  };

  // Load wishlist from server for logged-in users
  const loadServerWishlist = async () => {
    try {
      const response = await fetch('/api/product/wishList/getWishList');
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          const productIds = data.data.items?.map(item => item.id) || [];
          setWishlist(productIds);
          return productIds;
        }
      }
      setWishlist([]);
      return [];
    } catch (error) {
      console.error("Failed to load server wishlist:", error);
      setWishlist([]);
      return [];
    }
  };

  // Sync localStorage wishlist to server when user logs in
  const syncLocalToServer = async () => {
    const localWishlist = localStorage.getItem('nextshop-wishlist');
    
    if (!localWishlist) {
      return;
    }
    
    try {
      const productIds = JSON.parse(localWishlist);
      
      if (!Array.isArray(productIds) || productIds.length === 0) {
        localStorage.removeItem('nextshop-wishlist');
        return;
      }
      
      // Filter out products already in server wishlist
      const currentWishlist = wishlist;
      const productsToSync = productIds.filter(id => !currentWishlist.includes(id));
      
      if (productsToSync.length === 0) {
        localStorage.removeItem('nextshop-wishlist');
        return;
      }
      
      // Create array of sync promises
      const syncPromises = productsToSync.map(async (productId) => {
        try {
          const response = await fetch(`/api/product/wishList/addWishList?id=${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const data = await response.json();
          
          if (data.status === "success" || data.code === "ALREADY_IN_WISHLIST") {
            return {
              productId,
              success: true,
              data
            };
          } else {
            return {
              productId,
              success: false,
              error: data.msg
            };
          }
          
        } catch (error) {
          return {
            productId,
            success: false,
            error: error.message
          };
        }
      });
      
      // Wait for all sync operations to complete
      const results = await Promise.all(syncPromises);
      
      // Check results
      const successfulSyncs = results.filter(r => r.success);
      const failedSyncs = results.filter(r => !r.success);
      
      if (failedSyncs.length > 0) {
        // Keep only failed items in localStorage for retry
        const failedProductIds = failedSyncs.map(r => r.productId);
        localStorage.setItem('nextshop-wishlist', JSON.stringify(failedProductIds));
      } else {
        // All succeeded - clear localStorage
        localStorage.removeItem('nextshop-wishlist');
      }
      
      if (successfulSyncs.length > 0) {
        // Update local wishlist state with newly synced items
        const newProductIds = successfulSyncs.map(r => r.productId);
        setWishlist(prev => [...new Set([...prev, ...newProductIds])]);
        
        // Reload server wishlist to confirm
        setTimeout(async () => {
          await loadServerWishlist();
        }, 500);
      }
      
    } catch (error) {
      console.error("Error parsing or syncing wishlist:", error);
    }
  };

  // Save wishlist to localStorage for guest users
  useEffect(() => {
    if (!isLoggedIn && wishlist.length > 0) {
      localStorage.setItem('nextshop-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoggedIn]);

  useEffect(() => { 
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/product/getProduct");
        const data = await response.json();
        if (data.status === "success") {
          setProducts(data.data);
          setFilteredProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  // Filter products when filters change
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(product => product.type === selectedType);
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.color?.some(c => selectedColors.includes(c))
      );
    }
    
    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.size?.some(s => selectedSizes.includes(s))
      );
    }
    
    // Sort products
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "discount":
        filtered.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedType, sortBy, priceRange, selectedColors, selectedSizes]);

  // Get unique values for filters
  const uniqueTypes = ["all", ...new Set(products.map(p => p.type).filter(Boolean))];
  const allColors = products.flatMap(p => p.color || []).filter(Boolean);
  const uniqueColors = [...new Set(allColors)];
  const allSizes = products.flatMap(p => p.size || []).filter(Boolean);
  const uniqueSizes = [...new Set(allSizes)].sort();

  const toggleColor = useCallback((color) => {
    setSelectedColors(prev =>
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  }, []);

  const toggleSize = useCallback((size) => {
    setSelectedSizes(prev =>
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  }, []);

  // Enhanced Wishlist function
  const toggleWishlist = async (productId, productName) => {
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    
    const alreadyInWishlist = wishlist.includes(productId);
    
    try {
      if (isLoggedIn) {
        // Use API for logged-in users
        if (alreadyInWishlist) {
          // Remove from server
          const response = await fetch(`/api/product/wishList/deleteWishList?id=${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const data = await response.json();
          
          if (response.ok && data.status === "success") {
            setWishlist(prev => prev.filter(id => id !== productId));
          } else {
            alert(`❌ Failed: ${data.msg || "Could not remove from wishlist"}`);
          }
        } else {
          // Add to server
          const response = await fetch(`/api/product/wishList/addWishList?id=${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const data = await response.json();
          
          if (response.ok) {
            if (data.status === "success" || data.code === "ALREADY_IN_WISHLIST") {
              setWishlist(prev => [...prev, productId]);
            } else {
              alert(`❌ Failed: ${data.msg || "Server error"}`);
            }
          } else {
            alert(`❌ Failed: ${data.msg || "Server error"}`);
          }
        }
      } else {
        // Use localStorage for guest users
        if (alreadyInWishlist) {
          const newWishlist = wishlist.filter(id => id !== productId);
          setWishlist(newWishlist);
          localStorage.setItem('nextshop-wishlist', JSON.stringify(newWishlist));
        } else {
          const newWishlist = [...wishlist, productId];
          setWishlist(newWishlist);
          localStorage.setItem('nextshop-wishlist', JSON.stringify(newWishlist));
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      alert("❌ Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const isInWishlist = useCallback((productId) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const clearFilters = useCallback(() => {
    setSelectedType("all");
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 5000]);
    setSortBy("featured");
  }, []);

  const calculateDiscountedPrice = useCallback((price, discountPercent) => {
    if (!discountPercent) return price;
    return price - (price * discountPercent / 100);
  }, []);

  // Close filters when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && window.innerWidth < 1024) {
        const filtersPanel = document.getElementById("filters-panel");
        const filtersButton = document.getElementById("filters-button");
        
        if (filtersPanel && 
            !filtersPanel.contains(event.target) && 
            !filtersButton?.contains(event.target)) {
          setShowFilters(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{
        background: "linear-gradient(to bottom, var(--primary-50), white)"
      }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 rounded-full animate-spin" style={{
            borderColor: "var(--primary-400)",
            borderTopColor: "var(--primary-600)"
          }}></div>
          <p className="font-medium" style={{ color: "var(--primary-700)" }}>
            {authLoading ? "Checking authentication..." : "Loading amazing products..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(to bottom, var(--primary-25), white)"
    }}>
      {/* Mobile Filter Button */}
      <div className="sticky top-0 z-40 p-4 lg:hidden" style={{
        backgroundColor: "white",
        borderBottom: "1px solid var(--primary-100)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <button
              id="filters-button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 font-medium transition-all duration-300 rounded-lg"
              style={{
                background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                color: "white",
                boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 12px -2px rgba(14, 165, 233, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(14, 165, 233, 0.2)";
              }}
            >
              {showFilters ? (
                <>
                  <span>✕</span>
                  <span>Close Filters</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Filters ({selectedColors.length + selectedSizes.length + (selectedType !== "all" ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0)})</span>
                </>
              )
              }
            </button>
            
            <div className="flex items-center gap-4">
              {/* <div className="text-sm font-medium" style={{ color: "var(--primary-700)" }}>
                {filteredProducts.length} products
              </div> */}
              {/* <Link 
                href="/pages/wishlist" 
                className="relative p-2 transition-all duration-300 rounded-lg hover:bg-gray-50"
                title="View Wishlist"
              >
                <span className="text-lg">❤️</span>
                {wishlist.length > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full -top-1 -right-1"
                    style={{
                      backgroundColor: 'var(--accent-500)',
                      color: 'white'
                    }}>
                    {wishlist.length}
                  </span>
                )}
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black bg-opacity-50 lg:hidden">
          <div 
            id="filters-panel"
            className="w-full max-w-md mx-4 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: "white",
              border: "1px solid var(--primary-100)"
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--primary-800)" }}>
                  <span style={{ color: "var(--accent-600)" }}>✨</span> Filters
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={clearFilters}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: "var(--primary-50)",
                      color: "var(--primary-700)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-100)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-50)"}
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: "var(--primary-50)",
                      color: "var(--primary-700)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-100)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-50)"}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Mobile Filter Content */}
              <div className="space-y-6">
                {/* Type Filter */}
                <div>
                  <h3 className="flex items-center gap-2 mb-3 font-semibold" style={{ color: "var(--primary-700)" }}>
                    <span style={{ color: "var(--accent-500)" }}>▸</span> Types
                  </h3>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 font-medium transition-all border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: "var(--primary-200)",
                      backgroundColor: "white",
                      color: "var(--primary-800)"
                    }}
                  >
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>
                        {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="flex items-center gap-2 mb-3 font-semibold" style={{ color: "var(--primary-700)" }}>
                    <span style={{ color: "var(--accent-500)" }}>💰</span> Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.max(1, parseInt(e.target.value) || 0), priceRange[1]])}
                        className="w-1/2 px-4 py-2 border-2 rounded-lg"
                        style={{
                          borderColor: "var(--primary-200)",
                          backgroundColor: "white",
                          color: "var(--primary-800)"
                        }}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                        className="w-1/2 px-4 py-2 border-2 rounded-lg"
                        style={{
                          borderColor: "var(--primary-200)",
                          backgroundColor: "white",
                          color: "var(--primary-800)"
                        }}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Colors */}
                {uniqueColors.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 mb-3 font-semibold" style={{ color: "var(--primary-700)" }}>
                      <span style={{ color: "var(--accent-500)" }}>🎨</span> Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueColors.map(color => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className="px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg"
                          style={
                            selectedColors.includes(color)
                              ? {
                                  background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                                  color: "white",
                                  boxShadow: "0 2px 4px rgba(14, 165, 233, 0.2)"
                                }
                              : {
                                  backgroundColor: "var(--primary-50)",
                                  color: "var(--primary-700)",
                                  border: "1px solid var(--primary-200)"
                                }
                          }
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {uniqueSizes.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 mb-3 font-semibold" style={{ color: "var(--primary-700)" }}>
                      <span style={{ color: "var(--accent-500)" }}>📏</span> Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className="flex items-center justify-center w-10 h-10 font-medium transition-all duration-200 border rounded-lg"
                          style={
                            selectedSizes.includes(size)
                              ? {
                                  background: "linear-gradient(to bottom right, var(--accent-500), var(--accent-600))",
                                  color: "white",
                                  borderColor: "var(--accent-500)",
                                  boxShadow: "0 2px 4px rgba(14, 165, 233, 0.2)"
                                }
                              : {
                                  backgroundColor: "white",
                                  color: "var(--primary-700)",
                                  borderColor: "var(--primary-200)"
                                }
                          }
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container px-1 py-2 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop Sidebar Filters - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/4">
            <div id="filters-panel-desktop" className="sticky p-2 shadow-xl rounded-2xl top-24" style={{
              backgroundColor: "white",
              border: "1px solid var(--primary-100)"
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--primary-800)" }}>
                  <span style={{ color: "var(--accent-600)" }}>✨</span> Filters
                </h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: "var(--primary-50)",
                    color: "var(--primary-700)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-100)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-50)"}
                >
                  Clear All
                </button>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 font-medium transition-all border-2 rounded-xl focus:ring-2"
                  style={{
                    borderColor: "var(--primary-200)",
                    backgroundColor: "white",
                    color: "var(--primary-800)"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent-400)";
                    e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--primary-200)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 mb-3 font-semibold" style={{ color: "var(--primary-700)" }}>
                  <span style={{ color: "var(--accent-500)" }}>💰</span> Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Math.max(1, parseInt(e.target.value) || 0), priceRange[1]])}
                      className="w-1/2 px-4 py-2 border-2 rounded-lg"
                      style={{
                        borderColor: "var(--primary-200)",
                        backgroundColor: "white",
                        color: "var(--primary-800)"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--accent-400)";
                        e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--primary-200)";
                        e.target.style.boxShadow = "none";
                      }}
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                      className="w-1/2 px-4 py-2 border-2 rounded-lg"
                      style={{
                        borderColor: "var(--primary-200)",
                        backgroundColor: "white",
                        color: "var(--primary-800)"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--accent-400)";
                        e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--primary-200)";
                        e.target.style.boxShadow = "none";
                      }}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              {uniqueColors.length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 mb-3 font-semibold" style={{ color: "var(--primary-700)" }}>
                    <span style={{ color: "var(--accent-500)" }}>🎨</span> Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className="px-4 py-2 text-sm font-medium transition-all duration-200 transform rounded-xl hover:scale-105 active:scale-95"
                        style={
                          selectedColors.includes(color)
                            ? {
                                background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                                color: "white",
                                boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                              }
                            : {
                                backgroundColor: "var(--primary-50)",
                                color: "var(--primary-700)",
                                border: "1px solid var(--primary-200)"
                              }
                        }
                        onMouseEnter={(e) => {
                          if (!selectedColors.includes(color)) {
                            e.currentTarget.style.backgroundColor = "var(--primary-100)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedColors.includes(color)) {
                            e.currentTarget.style.backgroundColor = "var(--primary-50)";
                          }
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {uniqueSizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 mb-3 font-semibold" style={{ color: "var(--primary-700)" }}>
                    <span style={{ color: "var(--accent-500)" }}>📏</span> Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className="flex items-center justify-center w-12 h-12 font-bold transition-all duration-200 border-2 rounded-xl hover:scale-105 active:scale-95"
                        style={
                          selectedSizes.includes(size)
                            ? {
                                background: "linear-gradient(to bottom right, var(--accent-500), var(--accent-600))",
                                color: "white",
                                borderColor: "var(--accent-500)",
                                boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                              }
                            : {
                                backgroundColor: "white",
                                color: "var(--primary-700)",
                                borderColor: "var(--primary-200)"
                              }
                        }
                        onMouseEnter={(e) => {
                          if (!selectedSizes.includes(size)) {
                            e.currentTarget.style.borderColor = "var(--accent-400)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedSizes.includes(size)) {
                            e.currentTarget.style.borderColor = "var(--primary-200)";
                          }
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Counter in Desktop */}
              <div className="pt-6 mb-4" style={{ borderTop: "1px solid var(--primary-100)" }}>
                <Link 
                  href="/pages/wishlist" 
                  className="flex items-center justify-between p-3 transition-all duration-300 rounded-xl hover:shadow-md group"
                  style={{ 
                    backgroundColor: 'var(--primary-25)',
                    border: '1px solid var(--primary-100)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg group-hover:bg-red-50"
                      style={{ backgroundColor: 'var(--primary-100)' }}>
                      <span className="text-lg">❤️</span>
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--primary-800)' }}>My Wishlist</div>
                      <div className="text-sm" style={{ color: 'var(--primary-600)' }}>{wishlist.length} items saved</div>
                      {!isLoggedIn && (
                        <div className="text-xs" style={{ color: 'var(--warning-600)' }}>Saved locally</div>
                      )}
                    </div>
                  </div>
                  <span className="text-lg font-bold transition-transform group-hover:scale-110" 
                    style={{ color: 'var(--accent-600)' }}>→</span>
                </Link>
              </div>

              {/* Product Count */}
              <div className="pt-6 mt-4" style={{ borderTop: "1px solid var(--primary-100)" }}>
                <p style={{ color: "var(--primary-600)" }}>
                  <span className="text-lg font-bold" style={{ color: "var(--primary-800)" }}>
                    {filteredProducts.length}
                  </span> of{" "}
                  <span className="font-bold" style={{ color: "var(--primary-800)" }}>
                    {products.length}
                  </span> products
                  <span className="block mt-1 text-sm" style={{ color: "var(--primary-500)" }}>
                    🎯 Perfect matches for you
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sorting Bar - Updated with login status indicator */}
            <div className="p-4 mb-8 shadow-lg rounded-2xl lg:p-6" style={{
              backgroundColor: "white",
              border: "1px solid var(--primary-100)"
            }}>
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div style={{ color: "var(--primary-800)" }}>
                  <span className="text-lg font-bold lg:text-xl">{filteredProducts.length}</span>
                  <span className="ml-2 font-medium" style={{ color: "var(--primary-600)" }}>
                    products found
                  </span>
                  {!isLoggedIn && (
                    <span className="ml-2 text-sm" style={{ color: "var(--warning-600)" }}>
                      (Wishlist saved locally)
                    </span>
                  )}
                  {(selectedType !== "all" || selectedColors.length > 0 || selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <button 
                      onClick={clearFilters}
                      className="hidden px-3 py-1 ml-4 text-sm font-medium transition-colors rounded-lg lg:inline-block"
                      style={{
                        backgroundColor: "var(--primary-50)",
                        color: "var(--primary-700)"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-100)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-50)"}
                    >
                      ✕ Clear filters
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden font-medium sm:block" style={{ color: "var(--primary-600)" }}>Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 border-2 rounded-xl font-medium w-full sm:w-auto min-w-[180px]"
                    style={{
                      borderColor: "var(--primary-200)",
                      backgroundColor: "white",
                      color: "var(--primary-800)"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent-400)";
                      e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--primary-200)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="featured">✨ Featured</option>
                    <option value="price-low-high">💰 Price: Low to High</option>
                    <option value="price-high-low">💰 Price: High to Low</option>
                    <option value="name-asc">🔤 Name: A to Z</option>
                    <option value="name-desc">🔤 Name: Z to A</option>
                    <option value="discount">🏷️ Best Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center shadow-lg rounded-2xl" style={{
                backgroundColor: "white",
                border: "1px solid var(--primary-100)"
              }}>
                <div className="mb-6 text-7xl">🔍</div>
                <h3 className="mb-3 text-2xl font-bold" style={{ color: "var(--primary-800)" }}>
                  No products found
                </h3>
                <p className="max-w-md mx-auto mb-8" style={{ color: "var(--primary-600)" }}>
                  Try adjusting your filters or explore our full collection
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-3 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold transform hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                    boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(14, 165, 233, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(14, 165, 233, 0.2)";
                  }}
                >
                  ✨ Explore All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {filteredProducts.map((product) => {
                  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
                  const isDiscounted = product.discountPercent > 0;
                  const inWishlist = isInWishlist(product.id);
                  const isLoading = wishlistLoading[product.id];
                  
                  return (
                    <div key={product.id} className="overflow-hidden transition-all duration-500 shadow-lg group rounded-xl lg:rounded-2xl hover:-translate-y-2" style={{
                      backgroundColor: "white",
                      border: "2px solid var(--primary-100)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                    }}
                    >
                      {/* Product Image with Wishlist Icon */}
                      <div className="relative">
                        <Link key={product.name} href={`/pages/product/detail/${product.id}`} className="block">
                          <div className="relative h-56 overflow-hidden lg:h-72" style={{
                            background: "linear-gradient(to bottom right, var(--primary-25), var(--primary-50))"
                          }}>
                            <img 
                              src={product.images?.[0] || "https://via.placeholder.com/300x300"} 
                              alt={product.name}
                              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Enhanced Wishlist Icon */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product.id, product.name);
                              }}
                              disabled={isLoading}
                              className="absolute z-10 flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 opacity-0 top-3 right-3 group-hover:opacity-100 hover:scale-110 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                              <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
                                style={{
                                  backgroundColor: 'white',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}>
                                {isLoading ? (
                                  <span className="text-xs">⏳</span>
                                ) : (
                                  <span className={`text-xl transition-all duration-300 ${inWishlist ? 'scale-125' : ''}`}
                                    style={{
                                      color: inWishlist ? 'var(--error-500)' : 'var(--primary-500)'
                                    }}>
                                    {inWishlist ? '❤️' : '🤍'}
                                  </span>
                                )}
                              </div>
                              <span className="mt-1 text-xs font-medium whitespace-nowrap text-slate-700"
                                style={{
                                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                }}>
                                {isLoading ? 'Updating...' : (inWishlist ? 'Added' : 'Wishlist')}
                              </span>
                            </button>
                            
                            {/* Badges */}
                            <div className="absolute flex flex-col gap-2 top-3 lg:top-4 left-3 lg:left-4">
                              {isDiscounted && (
                                <span className="px-3 lg:px-4 py-1 lg:py-1.5 text-white text-xs font-bold rounded-full shadow-lg" style={{
                                  background: "linear-gradient(to right, var(--secondary-500), var(--secondary-600))"
                                }}>
                                  🔥 {product.discountPercent}%
                                </span>
                              )}
                            </div>
                            
                            {/* Stock Indicator */}
                            {product.inventory <= 5 && product.inventory > 0 && (
                              <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4 px-3 lg:px-4 py-1 lg:py-1.5 text-white text-xs font-bold rounded-full shadow-lg" style={{
                                background: "linear-gradient(to right, var(--warning-500), var(--warning-600))"
                              }}>
                                ⚡ {product.inventory}
                              </div>
                            )}
                            {product.inventory === 0 && (
                              <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4 px-3 lg:px-4 py-1 lg:py-1.5 text-white text-xs font-bold rounded-full shadow-lg" style={{
                                background: "linear-gradient(to right, var(--neutral-500), var(--neutral-600))"
                              }}>
                                😔
                              </div>
                            )}
                          </div>                      
                        </Link>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 lg:p-6">
                        {/* Category Tag */}
                        {product.category && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 text-xs font-medium rounded-full lg:px-4 lg:py-1.5 lg:text-sm"
                              style={{
                                backgroundColor: "var(--primary-50)",
                                color: "var(--primary-700)"
                              }}>
                              {product.category}
                            </span>
                            {/* Wishlist Indicator - Always visible */}
                            <button
                              onClick={() => toggleWishlist(product.id, product.name)}
                              disabled={isLoading}
                              className="p-2 ml-auto transition-all duration-300 rounded-full hover:bg-gray-50 text-slate-600 disabled:opacity-50"
                              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                              {isLoading ? (
                                <span className="text-xs">⏳</span>
                              ) : (
                                <span className={`text-lg transition-transform duration-300 hover:scale-110 ${inWishlist ? 'animate-pulse' : ''}`}
                                  style={{
                                    color: inWishlist ? 'var(--error-500)' : 'var(--primary-400)'
                                  }}>
                                  {inWishlist ? '❤️' : '🤍'}
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                        
                        <h3 className="mb-2 text-lg font-bold transition-colors lg:text-xl lg:mb-3 line-clamp-1" style={{
                          color: "var(--primary-900)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-600)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--primary-900)"}
                        >
                          {product.name}
                        </h3>
                      

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4 lg:gap-3 lg:mb-6">
                          {isDiscounted ? (
                            <>
                              <span className="text-xl font-bold lg:text-2xl" style={{ color: "var(--primary-900)" }}>
                                {discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-base line-through lg:text-lg" style={{ color: "var(--primary-500)" }}>
                                {product.price}
                              </span>
                              <span className="hidden px-2 py-1 text-xs font-bold rounded lg:inline-block" style={{
                                backgroundColor: "var(--secondary-100)",
                                color: "var(--secondary-700)"
                              }}>
                                Save {product.discountPercent}%
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold lg:text-2xl" style={{ color: "var(--primary-900)" }}>
                              {product.price}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 lg:gap-3">
                          <button className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-white rounded-lg lg:rounded-xl hover:shadow-xl transition-all duration-300 font-bold transform hover:-translate-y-0.5" 
                            style={{
                              background: "linear-gradient(to right, var(--accent-500), var(--accent-600))",
                              boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(14, 165, 233, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(14, 165, 233, 0.2)";
                            }}
                          >
                            🛒 Add
                          </button>
                          <button className="px-4 py-2 text-sm font-medium transition-all duration-300 border-2 rounded-lg lg:px-6 lg:py-3 lg:rounded-xl lg:text-base"
                            style={{
                              borderColor: "var(--primary-200)",
                              color: "var(--primary-700)"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "var(--primary-50)";
                              e.currentTarget.style.borderColor = "var(--accent-400)";
                              e.currentTarget.style.color = "var(--accent-600)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.borderColor = "var(--primary-200)";
                              e.currentTarget.style.color = "var(--primary-700)";
                            }}
                          >
                            <Link key={product.name} href={`/pages/product/detail/${product.id}`}>👁️ View</Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-10 mt-12" style={{
        background: "linear-gradient(to right, var(--primary-800), var(--primary-900))"
      }}>
        <div className="container px-4 mx-auto text-center">
          <p className="mb-2 text-lg" style={{ color: "var(--primary-200)" }}>
            <span className="font-bold text-white">NextShop</span> • Premium Shopping Experience
          </p>
          <p style={{ color: "var(--primary-300)" }}>
            Showing <span className="font-bold" style={{ color: "var(--accent-300)" }}>{filteredProducts.length}</span> amazing products curated just for you
            {!isLoggedIn && (
              <span className="ml-2 text-sm" style={{ color: "var(--warning-300)" }}>
                (Login to sync wishlist)
              </span>
            )}
          </p>
          <div className="flex justify-center gap-6 mt-4 mb-12 md:mb-0" style={{ color: "var(--primary-400)" }}>
            <span>🔒 Secure Checkout</span>
            <span>🚚 Free Shipping</span>
            <span>🔄 Easy Returns</span> 
              
          </div>
        </div>
      </div>
    </div>
  );
}