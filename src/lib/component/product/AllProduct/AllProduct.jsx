// components/ProductsGrid.js
"use client"
import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

export default function ProductsGrid({ products }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Extract unique values for filters
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
    return ['all', ...uniqueCategories];
  }, [products]);

  const types = useMemo(() => {
    const uniqueTypes = [...new Set(products.map(p => p.type).filter(Boolean))];
    return ['all', ...uniqueTypes];
  }, [products]);

  const genders = useMemo(() => {
    // Extract from tags or create gender field
    const genderTags = products.flatMap(p => p.tags || [])
      .filter(tag => ['male', 'men', 'women', 'female', 'kids', 'unisex'].includes(tag.toLowerCase()));
    const uniqueGenders = [...new Set(genderTags)];
    return ['all', ...uniqueGenders];
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
      const matchesType = selectedType === 'all' || product.type === selectedType;
      const matchesGender = selectedGender === 'all' || 
        (product.tags || []).some(tag => tag.toLowerCase() === selectedGender.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesCategory && matchesType && matchesGender && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => b.featured - a.featured);
        break;
    }

    return filtered;
  }, [products, selectedCategory, selectedType, selectedGender, sortBy, priceRange]);

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-slate-500 text-lg mb-4">No products found</div>
          <button className="btn bg-primary-600 text-white hover:bg-primary-700">
            Refresh Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-500 mb-2">Our Products</h1>
        <p className="text-slate-500">Discover amazing products just for you</p>
      </div>

      {/* Filters and Sorting Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Left side - Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            {types.length > 1 && (
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            )}

            {/* Gender Filter */}
            {genders.length > 1 && (
              <select 
                value={selectedGender} 
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {genders.map(gender => (
                  <option key={gender} value={gender}>
                    {gender === 'all' ? 'All Genders' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </option>
                ))}
              </select>
            )}

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Price:</span>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Min"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Right side - Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-500">
        Showing {filteredAndSortedProducts.length} of {products.length} products
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product,index) => (
          <ProductCard key={product.id}  product={product} />
        ))}
      </div>

      {/* No Results State */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500 text-lg mb-4">No products match your filters</div>
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setSelectedType('all');
              setSelectedGender('all');
              setSortBy('featured');
              setPriceRange([0, 1000]);
            }}
            className="btn bg-primary-600 text-white hover:bg-primary-700"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}