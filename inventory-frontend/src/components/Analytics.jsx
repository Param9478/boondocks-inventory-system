import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Package, DollarSign, AlertCircle } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#14b8a6'];

const Analytics = ({ items }) => {
  const analytics = useMemo(() => {
    // Category distribution
    const categoryData = items.reduce((acc, item) => {
      const cat = item.category || 'Uncategorized';
      if (!acc[cat]) {
        acc[cat] = { name: cat, value: 0, items: 0 };
      }
      acc[cat].value += item.quantity * (item.costPerUnit || 0);
      acc[cat].items += 1;
      return acc;
    }, {});

    // Stock status distribution
    const statusData = [
      {
        name: 'Critical',
        value: items.filter(item => item.quantity <= item.minStock * 0.5).length,
      },
      {
        name: 'Low',
        value: items.filter(item => item.quantity > item.minStock * 0.5 && item.quantity <= item.minStock).length,
      },
      {
        name: 'Stable',
        value: items.filter(item => item.quantity > item.minStock).length,
      },
    ];

    // Top 10 items by value
    const topItems = [...items]
      .map(item => ({
        name: item.name,
        value: item.quantity * (item.costPerUnit || 0),
        quantity: item.quantity,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Supplier distribution
    const supplierData = items.reduce((acc, item) => {
      const sup = item.supplier || 'Unknown';
      if (!acc[sup]) {
        acc[sup] = { name: sup, items: 0, value: 0 };
      }
      acc[sup].items += 1;
      acc[sup].value += item.quantity * (item.costPerUnit || 0);
      return acc;
    }, {});

    return {
      categories: Object.values(categoryData),
      status: statusData,
      topItems,
      suppliers: Object.values(supplierData),
    };
  }, [items]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total SKUs</p>
          <p className="text-3xl font-bold">{items.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Inventory Value</p>
          <p className="text-3xl font-bold">
            ${items.reduce((sum, item) => sum + (item.quantity * (item.costPerUnit || 0)), 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Categories</p>
          <p className="text-3xl font-bold">{analytics.categories.length}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Items Need Attention</p>
          <p className="text-3xl font-bold">
            {items.filter(item => item.quantity <= item.minStock).length}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Value Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Value by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {analytics.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Status Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Stock Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.status}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Items by Value */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top 10 Items by Value</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Supplier Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Suppliers Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.suppliers}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, items }) => `${name}: ${items} items`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="items"
              >
                {analytics.suppliers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Category Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Items</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Value</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Value/Item</th>
              </tr>
            </thead>
            <tbody>
              {analytics.categories.map((cat, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{cat.items}</td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    ${cat.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    ${(cat.value / cat.items).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
