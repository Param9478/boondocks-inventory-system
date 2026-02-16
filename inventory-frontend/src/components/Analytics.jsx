import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Package,
  DollarSign,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from 'lucide-react';

const COLORS = [
  '#6366f1',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ef4444',
  '#14b8a6',
];

const Analytics = ({ items }) => {
  const [expandedCharts, setExpandedCharts] = useState({
    summary: true,
    categoryValue: false,
    status: false,
    topItems: false,
    suppliers: false,
    breakdown: false,
  });

  const toggleChart = (chartName) => {
    setExpandedCharts((prev) => ({
      ...prev,
      [chartName]: !prev[chartName],
    }));
  };

  const analytics = useMemo(() => {
    const categoryData = items.reduce((acc, item) => {
      const cat = item.category || 'Uncategorized';
      if (!acc[cat]) {
        acc[cat] = { name: cat, value: 0, items: 0 };
      }
      acc[cat].value += item.quantity * (item.costPerUnit || 0);
      acc[cat].items += 1;
      return acc;
    }, {});

    const statusData = [
      {
        name: 'Critical',
        value: items.filter((item) => item.quantity <= item.minStock * 0.5)
          .length,
      },
      {
        name: 'Low',
        value: items.filter(
          (item) =>
            item.quantity > item.minStock * 0.5 &&
            item.quantity <= item.minStock,
        ).length,
      },
      {
        name: 'Stable',
        value: items.filter((item) => item.quantity > item.minStock).length,
      },
    ];

    const topItems = [...items]
      .map((item) => ({
        name:
          item.name.length > 15
            ? item.name.substring(0, 15) + '...'
            : item.name,
        value: item.quantity * (item.costPerUnit || 0),
        quantity: item.quantity,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

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
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs sm:text-sm">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CollapsibleSection = ({
    title,
    isExpanded,
    onToggle,
    children,
    icon: Icon,
  }) => (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          {Icon && <Icon className="h-5 w-5 text-indigo-600" />}
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {title}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="p-4 sm:p-6">{children}</div>}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Summary Cards - Always Visible */}
      <CollapsibleSection
        title="Summary"
        isExpanded={expandedCharts.summary}
        onToggle={() => toggleChart('summary')}
        icon={Package}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-4 text-white">
            <Package className="h-6 w-6 sm:h-7 sm:w-7 mb-2 opacity-80" />
            <p className="text-xs sm:text-sm opacity-90 mb-1">Total SKUs</p>
            <p className="text-xl sm:text-2xl font-bold">{items.length}</p>
          </div>

          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-xl p-3 sm:p-4 text-white">
            <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 mb-2 opacity-80" />
            <p className="text-xs sm:text-sm opacity-90 mb-1">Total Value</p>
            <p className="text-xl sm:text-2xl font-bold">
              $
              {items
                .reduce(
                  (sum, item) => sum + item.quantity * (item.costPerUnit || 0),
                  0,
                )
                .toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-500 to-violet-600 rounded-xl p-3 sm:p-4 text-white">
            <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 mb-2 opacity-80" />
            <p className="text-xs sm:text-sm opacity-90 mb-1">Categories</p>
            <p className="text-xl sm:text-2xl font-bold">
              {analytics.categories.length}
            </p>
          </div>

          <div className="bg-linear-to-br from-red-500 to-pink-600 rounded-xl p-3 sm:p-4 text-white">
            <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 mb-2 opacity-80" />
            <p className="text-xs sm:text-sm opacity-90 mb-1">Low Stock</p>
            <p className="text-xl sm:text-2xl font-bold">
              {items.filter((item) => item.quantity <= item.minStock).length}
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Category Value Chart */}
      <CollapsibleSection
        title="Value by Category"
        isExpanded={expandedCharts.categoryValue}
        onToggle={() => toggleChart('categoryValue')}
        icon={BarChart3}
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.categories}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {analytics.categories.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleSection>

      {/* Stock Status */}
      <CollapsibleSection
        title="Stock Status"
        isExpanded={expandedCharts.status}
        onToggle={() => toggleChart('status')}
      >
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={analytics.status}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) =>
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
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
      </CollapsibleSection>

      {/* Top Items */}
      <CollapsibleSection
        title="Top 10 Items by Value"
        isExpanded={expandedCharts.topItems}
        onToggle={() => toggleChart('topItems')}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.topItems} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              width={80}
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleSection>

      {/* Suppliers */}
      <CollapsibleSection
        title="Suppliers Overview"
        isExpanded={expandedCharts.suppliers}
        onToggle={() => toggleChart('suppliers')}
      >
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={analytics.suppliers}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, items }) => `${name}: ${items}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="items"
            >
              {analytics.suppliers.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CollapsibleSection>

      {/* Category Breakdown Table */}
      <CollapsibleSection
        title="Category Breakdown"
        isExpanded={expandedCharts.breakdown}
        onToggle={() => toggleChart('breakdown')}
      >
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 sm:px-4 font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-right py-2 px-2 sm:px-4 font-semibold text-gray-700">
                  Items
                </th>
                <th className="text-right py-2 px-2 sm:px-4 font-semibold text-gray-700">
                  Value
                </th>
                <th className="text-right py-2 px-2 sm:px-4 font-semibold text-gray-700 hidden sm:table-cell">
                  Avg
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.categories.map((cat, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2 px-2 sm:px-4 font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="py-2 px-2 sm:px-4 text-right text-gray-600">
                    {cat.items}
                  </td>
                  <td className="py-2 px-2 sm:px-4 text-right font-semibold text-green-600">
                    $
                    {cat.value.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="py-2 px-2 sm:px-4 text-right text-gray-600 hidden sm:table-cell">
                    $
                    {(cat.value / cat.items).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default Analytics;
