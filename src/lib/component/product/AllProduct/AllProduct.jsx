"use client"
import React, { useEffect, useState } from "react";

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

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 5000]);
    setSortBy("featured");
  };

  const calculateDiscountedPrice = (price, discountPercent) => {
    if (!discountPercent) return price;
    return price - (price * discountPercent / 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-lg opacity-90">Find the perfect items that match your style</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Type</h3>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">₹{priceRange[0]}</span>
                    <span className="text-gray-600">₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              {uniqueColors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedColors.includes(color)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
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
                  <h3 className="font-semibold text-gray-700 mb-3">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border font-medium transition-all ${
                          selectedSizes.includes(size)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Count */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Showing <span className="font-bold text-blue-600">{filteredProducts.length}</span> of{" "}
                  <span className="font-bold text-gray-800">{products.length}</span> products
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sorting Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-gray-700">
                  <span className="font-medium">{filteredProducts.length} products found</span>
                  {(selectedType !== "all" || selectedColors.length > 0 || selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <button 
                      onClick={clearFilters}
                      className="ml-3 text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="discount">Best Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 text-6xl mb-4">😕</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
                  const isDiscounted = product.discountPercent > 0;
                  
                  return (
                    <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Product Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={product.images?.[0] || "https://via.placeholder.com/300x300"} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.featured && (
                            <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                              Featured
                            </span>
                          )}
                          {isDiscounted && (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              -{product.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                        
                        {/* Stock Indicator */}
                        {product.inventory <= 5 && product.inventory > 0 && (
                          <div className="absolute bottom-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                            Only {product.inventory} left
                          </div>
                        )}
                        {product.inventory === 0 && (
                          <div className="absolute bottom-3 left-3 px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                            Out of Stock
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <div className="mb-3">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {product.type?.toUpperCase() || "PRODUCT"}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          {isDiscounted ? (
                            <>
                              <span className="text-2xl font-bold text-gray-900">
                                ₹{discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-lg text-gray-500 line-through">
                                ₹{product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{product.price}
                            </span>
                          )}
                        </div>

                        {/* Colors & Sizes */}
                        <div className="space-y-3 mb-6">
                          {product.color?.length > 0 && (
                            <div>
                              <span className="text-xs text-gray-500">Colors:</span>
                              <div className="flex gap-1 mt-1">
                                {product.color.slice(0, 3).map((color, idx) => (
                                  <div 
                                    key={idx}
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                  />
                                ))}
                                {product.color.length > 3 && (
                                  <div className="w-6 h-6 flex items-center justify-center text-xs text-gray-500 bg-gray-100 rounded-full">
                                    +{product.color.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {product.size?.length > 0 && (
                            <div>
                              <span className="text-xs text-gray-500">Sizes:</span>
                              <div className="flex gap-1 mt-1">
                                {product.size.slice(0, 4).map((size, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                  >
                                    {size}
                                  </span>
                                ))}
                                {product.size.length > 4 && (
                                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                                    +{product.size.length - 4}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Add to Cart
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            View Details
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
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 NextShop. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">Showing {filteredProducts.length} amazing products for you</p>
        </div>
      </div>
    </div>
  );
}