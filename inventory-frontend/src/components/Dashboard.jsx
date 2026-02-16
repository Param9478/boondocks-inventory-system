import React from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Grid3x3,
  Clock,
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    red: 'from-red-500 to-pink-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-violet-600',
    orange: 'from-orange-500 to-amber-600',
    cyan: 'from-cyan-500 to-blue-600',
  };

  return (
    <div className="relative group">
      <div
        className={`bg-linear-to-br ${colorClasses[color]} rounded-xl sm:rounded-2xl shadow-md active:shadow-lg transition-all duration-200 p-3 sm:p-4 border border-white/20 active:scale-95`}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-white/80 mb-0.5 sm:mb-1 uppercase tracking-wide truncate">
              {label}
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
              {value}
            </p>
          </div>

          <div className="shrink-0 bg-white/20 p-2 sm:p-3 rounded-lg sm:rounded-xl ml-2">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ stats }) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
        <StatCard
          icon={Package}
          label="Total Items"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={stats.lowStock}
          color="red"
        />
        <StatCard
          icon={CheckCircle}
          label="Stable"
          value={stats.stable}
          color="green"
        />
        <StatCard
          icon={DollarSign}
          label="Value"
          value={`$${stats.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          color="purple"
        />
        <StatCard
          icon={Grid3x3}
          label="Categories"
          value={stats.categories}
          color="orange"
        />
        <StatCard
          icon={Clock}
          label="Expiring"
          value={stats.expiringSoon}
          color="cyan"
        />
      </div>
    </div>
  );
};

export default Dashboard;
