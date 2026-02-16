import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, Table2, Moon, Plus, ChevronDown } from 'lucide-react';

const QuickActions = ({ viewMode, setViewMode, onAddItem, onEndOfDay }) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside dropdown nu band karan layi
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsViewOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="mb-4 sm:mb-6 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-sm p-2 border border-gray-100 sticky top-16 sm:top-20 z-30">
      <div className="flex items-center justify-between gap-2">
        {/* Left: View Mode Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsViewOpen(!isViewOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-indigo-600 font-bold text-xs sm:text-sm transition-all active:scale-95"
          >
            {viewMode === 'table' ? (
              <Table2 className="h-4 w-4" />
            ) : (
              <BarChart3 className="h-4 w-4" />
            )}
            <span className="capitalize">{viewMode}</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${isViewOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isViewOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  setViewMode('table');
                  setIsViewOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Table2 className="h-4 w-4" />
                Table View
              </button>
              <button
                onClick={() => {
                  setViewMode('analytics');
                  setIsViewOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${viewMode === 'analytics' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </button>
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Add Item */}
          <button
            onClick={onAddItem}
            className="flex items-center gap-1.5 h-9 sm:h-10 px-3 sm:px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Item</span>
          </button>

          {/* EOD Button */}
          <button
            onClick={onEndOfDay}
            className="flex items-center gap-1.5 h-9 sm:h-10 px-3 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-all active:scale-95"
          >
            <Moon className="h-3.5 w-3.5" />
            <span className="text-xs sm:text-sm font-bold">EOD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
