import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const FilterBar = ({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const filterButtons = [
    { value: 'all', label: 'All', color: 'indigo' },
    { value: 'nightly', label: '🌙 Nightly', color: 'purple' },
    { value: 'low', label: 'Low Stock', color: 'red' },
    { value: 'stable', label: 'Stable', color: 'green' },
    { value: 'expiring', label: 'Expiring', color: 'orange' },
  ];

  const getButtonClasses = (buttonValue, color) => {
    const baseClasses =
      'px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap active:scale-95';
    if (filter === buttonValue) {
      return `${baseClasses} bg-${color}-600 text-white shadow-md`;
    }
    return `${baseClasses} bg-gray-100 text-gray-700 active:bg-gray-200`;
  };

  return (
    <div className="mb-4 sm:mb-6 bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Search Bar - Always Visible */}
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Button - Mobile */}
      <div className="lg:hidden px-3 sm:px-4 py-2 bg-gray-50 border-b border-gray-100">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700 active:text-gray-900"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters & Sort</span>
            {filter !== 'all' && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                Active
              </span>
            )}
          </div>
          {showFilters ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Filters Content - Shows on mobile when toggled, always visible on desktop */}
      <div
        className={`${showFilters ? 'block' : 'hidden'} lg:block transition-all duration-200`}
      >
        <div className="p-3 sm:p-4 lg:px-4 lg:py-3 bg-white lg:bg-gray-50 lg:border-t lg:border-gray-100">
          {/* Filter Buttons */}
          <div className="mb-3 lg:mb-0 lg:flex lg:items-center lg:justify-between lg:flex-wrap lg:gap-3">
            <div className="lg:flex lg:items-center lg:space-x-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-600 mb-2 lg:mb-0">
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className={getButtonClasses(btn.value, btn.color)}
                    style={
                      filter === btn.value
                        ? {
                            backgroundColor:
                              btn.color === 'indigo'
                                ? '#4f46e5'
                                : btn.color === 'purple'
                                  ? '#9333ea'
                                  : btn.color === 'red'
                                    ? '#dc2626'
                                    : btn.color === 'green'
                                      ? '#16a34a'
                                      : '#ea580c',
                          }
                        : undefined
                    }
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="mt-3 lg:mt-0 lg:flex lg:items-center lg:space-x-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-600 mb-2 lg:mb-0">
                <ArrowUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="lg:hidden">Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full lg:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 lg:bg-white border border-gray-200 rounded-lg text-gray-700 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value="name">Name (A-Z)</option>
                <option value="quantity">Quantity (Low to High)</option>
                <option value="status">Status (Critical First)</option>
                <option value="value">Value (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
