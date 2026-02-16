import React, { useState, useEffect } from 'react';
import { ChefHat, Plus } from 'lucide-react';

import ViewAllNotificationsModal from './ViewallnotificationsModal';
import NotificationDropdown from './Notificationdropdown';

const Header = ({ onAddClick, items = [] }) => {
  const [notifications, setNotifications] = useState([]);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  // Generate notifications based on inventory status
  useEffect(() => {
    const newNotifications = [];

    // Check for low stock items
    const lowStockItems = items.filter(
      (item) => item.quantity <= item.minStock,
    );
    lowStockItems.forEach((item) => {
      const percentage = ((item.quantity / item.minStock) * 100).toFixed(0);
      if (item.quantity <= item.minStock * 0.5) {
        newNotifications.push({
          type: 'critical',
          title: `Critical: ${item.name}`,
          message: `Only ${item.quantity} ${item.unit} left (${percentage}% of minimum). Order immediately!`,
          time: 'Just now',
        });
      } else {
        newNotifications.push({
          type: 'warning',
          title: `Low Stock: ${item.name}`,
          message: `Current stock: ${item.quantity} ${item.unit}. Minimum: ${item.minStock} ${item.unit}`,
          time: 'Just now',
        });
      }
    });

    // Check for expiring items (within 7 days)
    const expiringItems = items.filter((item) => {
      if (!item.expiryDate) return false;
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const expiry = new Date(item.expiryDate);
      return expiry <= weekFromNow && expiry >= now;
    });

    expiringItems.forEach((item) => {
      const daysLeft = Math.ceil(
        (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
      );
      newNotifications.push({
        type: 'warning',
        title: `Expiring Soon: ${item.name}`,
        message: `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Use or restock soon!`,
        time: 'Just now',
      });
    });

    setNotifications(newNotifications);
  }, [items]);

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleViewAll = () => {
    setIsViewAllOpen(true);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl shadow-lg border border-white/30">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Boondocks Restaurant
                </h1>
                <p className="text-indigo-100 text-sm font-medium">
                  Smart Inventory Management
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <NotificationDropdown
                notifications={notifications}
                onClear={handleClearNotifications}
                onViewAll={handleViewAll}
              />

              <button
                onClick={onAddClick}
                className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Add Item</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* View All Modal */}
      <ViewAllNotificationsModal
        isOpen={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        notifications={notifications}
      />
    </>
  );
};

export default Header;
