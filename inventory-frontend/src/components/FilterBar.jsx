import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const FilterBar = ({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="mb-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>

          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>

          <button
            onClick={() => setFilter('nightly')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'nightly'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌙 Nightly List
          </button>

          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'low'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low Stock
          </button>

          <button
            onClick={() => setFilter('stable')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'stable'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Stable
          </button>

          <button
            onClick={() => setFilter('expiring')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'expiring'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expiring Soon
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-gray-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <option value="name">Name (A-Z)</option>
            <option value="quantity">Quantity (Low-High)</option>
            <option value="status">Status (Critical)</option>
            <option value="value">Value (High-Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
