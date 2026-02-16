import React from 'react';
import { BarChart3, Table2, Moon, ChevronDown } from 'lucide-react';

const QuickActions = ({
  viewMode,
  setViewMode,
  onAddItem,
  onEndOfDay,
  onExport,
}) => {
  return (
    <div className="mb-4 sm:mb-6 bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 border border-gray-100">
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
        {/* View Mode Switcher */}
        <div className="flex items-center bg-gray-100 rounded-lg sm:rounded-xl p-1 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95 ${
              viewMode === 'table'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 active:text-gray-900'
            }`}
          >
            <Table2 className="h-4 w-4" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95 ${
              viewMode === 'analytics'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 active:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Charts</span>
          </button>
        </div>

        {/* Action Button - End of Day */}
        <button
          onClick={onEndOfDay}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-md text-sm sm:text-base"
        >
          <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>End of Day Count</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
