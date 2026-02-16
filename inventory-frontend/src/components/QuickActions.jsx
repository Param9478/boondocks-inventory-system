import React from 'react';
import { BarChart3, Table2, Download, Plus, Moon } from 'lucide-react';

const QuickActions = ({
  viewMode,
  setViewMode,
  onAddItem,
  onEndOfDay,
  onExport,
}) => {
  return (
    <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* View Mode Switcher */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Table2 className="h-4 w-4" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              viewMode === 'analytics'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onEndOfDay}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200"
          >
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">End of Day</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
