"use client"
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductFilters({
  filters,
  updateFilters,
  clearFilters,
  showFilters,
  setShowFilters,
  products,
  filteredCount,
  totalCount,
  wishlist
}) {
  const allColors = products.flatMap(p => p.color || []).filter(Boolean);
  const uniqueColors = [...new Set(allColors)];
  const allSizes = products.flatMap(p => p.size || []).filter(Boolean);
  const uniqueSizes = [...new Set(allSizes)].sort();

  const toggleColor = (color) => {
    updateFilters({
      selectedColors: filters.selectedColors.includes(color)
        ? filters.selectedColors.filter(c => c !== color)
        : [...filters.selectedColors, color]
    });
  };

  const toggleSize = (size) => {
    updateFilters({
      selectedSizes: filters.selectedSizes.includes(size)
        ? filters.selectedSizes.filter(s => s !== size)
        : [...filters.selectedSizes, size]
    });
  };

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
  }, [showFilters, setShowFilters]);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="sticky top-0 z-40 p-4 bg-white border-b shadow-sm lg:hidden border-primary-100">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <button
              id="filters-button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 shadow-accent-200 hover:shadow-accent-300"
            >
              {/* ... mobile filter button content ... */}
            </button>
            
            {/* Mobile wishlist indicator */}
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-primary-700">
                {filteredCount} products
              </div>
              <Link 
                href="/wishlist" 
                className="relative p-2 transition-all duration-300 rounded-lg hover:bg-gray-50"
                title="View Wishlist"
              >
                <span className="text-lg">❤️</span>
                {wishlist.length > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-1 -right-1 bg-accent-500">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black bg-opacity-50 lg:hidden">
          {/* Mobile filters panel content */}
        </div>
      )}

      {/* Desktop Filters Sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        {/* Desktop filters content */}
      </div>
    </>
  );
}