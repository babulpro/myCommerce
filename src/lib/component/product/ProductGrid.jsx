"use client"
import { useEffect, useState } from "react";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    selectedType: "all",
    selectedColors: [],
    selectedSizes: [],
    priceRange: [0, 5000],
    sortBy: "featured"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => { 
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/product/getProduct");
        const data = await response.json();
        if (data.status === "success") {
          setProducts(data.data);
          setFilteredProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  // Wishlist localStorage logic
  useEffect(() => {
    const savedWishlist = localStorage.getItem('nextshop-wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem('nextshop-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...products];
    
    // Apply filters
    if (filters.selectedType !== "all") {
      filtered = filtered.filter(product => product.type === filters.selectedType);
    }
    
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    if (filters.selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.color?.some(c => filters.selectedColors.includes(c))
      );
    }
    
    if (filters.selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.size?.some(s => filters.selectedSizes.includes(s))
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
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
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      selectedType: "all",
      selectedColors: [],
      selectedSizes: [],
      priceRange: [0, 5000],
      sortBy: "featured"
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 rounded-full animate-spin border-primary-400 border-t-primary-600"></div>
          <p className="font-medium text-primary-700">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-25 to-white">
      <ProductFilters
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        products={products}
        filteredCount={filteredProducts.length}
        totalCount={products.length}
        wishlist={wishlist}
      />
      
      <ProductGrid
        products={filteredProducts}
        sortBy={filters.sortBy}
        onSortChange={(sortBy) => updateFilters({ sortBy })}
        clearFilters={clearFilters}
        hasActiveFilters={filters.selectedType !== "all" || filters.selectedColors.length > 0 || filters.selectedSizes.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 5000}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />
    </div>
  );
}