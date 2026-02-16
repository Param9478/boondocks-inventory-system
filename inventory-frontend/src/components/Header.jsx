import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, Bell, X } from 'lucide-react';
import NotificationBottomSheet from './NotificationBottomSheet';

const Header = ({ onAddClick, items = [] }) => {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
          message: `Only ${item.quantity} ${item.unit} left (${percentage}% of minimum)`,
          time: 'Just now',
        });
      } else {
        newNotifications.push({
          type: 'warning',
          title: `Low Stock: ${item.name}`,
          message: `${item.quantity} ${item.unit} (Min: ${item.minStock})`,
          time: 'Just now',
        });
      }
    });

    // Check for expiring items
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
        title: `Expiring: ${item.name}`,
        message: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`,
        time: 'Just now',
      });
    });

    setNotifications(newNotifications);
  }, [items]);

  return (
    <>
      <header className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl sticky top-0 z-40">
        <div className="max-w-400 mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo & Title */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="bg-white/20 backdrop-blur-lg p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/30 shrink-0">
                <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight truncate">
                  Boondocks
                </h1>
                <p className="text-[10px] sm:text-xs text-indigo-100 font-medium hidden sm:block">
                  Smart Inventory
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Notification Button */}
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="relative bg-white/20 backdrop-blur-lg p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/30 active:scale-95 transition-all duration-200 border border-white/30"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {/* Add Button */}
              <button
                onClick={onAddClick}
                className="bg-white text-indigo-600 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-indigo-50 active:scale-95 transition-all duration-200 flex items-center space-x-1 sm:space-x-2 shadow-md text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Sheet Notification */}
      <NotificationBottomSheet
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
      />
    </>
  );
};

export default Header;
