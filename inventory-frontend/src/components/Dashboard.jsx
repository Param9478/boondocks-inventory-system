import React from 'react';
import { Package, AlertTriangle, CheckCircle, DollarSign, Grid3x3, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color, delay }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    red: 'from-red-500 to-pink-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-violet-600',
    orange: 'from-orange-500 to-amber-600',
    cyan: 'from-cyan-500 to-blue-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
        {/* Gradient Background Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <span className={`${trend > 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
                <span className="ml-1">vs last week</span>
              </p>
            )}
          </div>
          
          <div className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = ({ stats }) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          icon={Package}
          label="Total Items"
          value={stats.total}
          trend={5}
          color="blue"
          delay={0}
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={stats.lowStock}
          trend={-12}
          color="red"
          delay={0.1}
        />
        <StatCard
          icon={CheckCircle}
          label="Stable Stock"
          value={stats.stable}
          trend={8}
          color="green"
          delay={0.2}
        />
        <StatCard
          icon={DollarSign}
          label="Total Value"
          value={`$${stats.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          trend={15}
          color="purple"
          delay={0.3}
        />
        <StatCard
          icon={Grid3x3}
          label="Categories"
          value={stats.categories}
          color="orange"
          delay={0.4}
        />
        <StatCard
          icon={Clock}
          label="Expiring Soon"
          value={stats.expiringSoon}
          trend={-5}
          color="cyan"
          delay={0.5}
        />
      </div>
    </div>
  );
};

export default Dashboard;
