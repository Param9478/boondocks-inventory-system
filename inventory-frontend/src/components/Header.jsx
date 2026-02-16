import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Bell } from 'lucide-react';
import NotificationDropDown from './Notificationdropdown';

const Header = ({ items = [] }) => {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const bellRef = useRef(null);

  // Generate notifications based on inventory status
  useEffect(() => {
    const newNotifications = [];

    // Check for low stock items
    const lowStockItems = items.filter(
      (item) => item.quantity <= item.minStock,
    );
    lowStockItems.forEach((item) => {
      const percentage =
        item.minStock > 0
          ? ((item.quantity / item.minStock) * 100).toFixed(0)
          : 0;
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
    <header className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title Section */}
          <div
            onClick={() => (window.location.href = '/')}
            className="flex items-center space-x-3 min-w-0 flex-1 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
            title="Go to Home"
          >
            <div className="bg-white/20 backdrop-blur-lg p-2 rounded-xl border border-white/30 shrink-0">
              <ChefHat className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
                Boondocks
              </h1>
              <p className="text-[10px] sm:text-xs text-indigo-100 font-medium hidden sm:block uppercase tracking-wider">
                Smart Inventory
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center shrink-0 ml-4">
            <div className="relative flex items-center justify-center">
              <button
                ref={bellRef} // ✅ REF ATTACH KARO
                onClick={(e) => {
                  e.preventDefault();
                  setIsNotificationOpen(!isNotificationOpen);
                }}
                className="relative bg-white/20 backdrop-blur-lg p-2.5 rounded-xl hover:bg-white/30 border border-white/30 flex items-center justify-center"
              >
                <Bell className="h-5 w-5 text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-indigo-600">
                    {notifications.length}
                  </span>
                )}
              </button>

              <NotificationDropDown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={notifications}
                onClear={() => setNotifications([])}
                anchorRef={bellRef} // ✅ EH PASS KARO
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
