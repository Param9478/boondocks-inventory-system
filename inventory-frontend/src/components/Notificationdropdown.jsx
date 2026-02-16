import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  CheckCircle,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import '../App.css';

const NotificationDropDown = ({
  isOpen,
  onClose,
  notifications,
  onClear,
  anchorRef,
}) => {
  const dropdownRef = useRef(null);
  const [showAll, setShowAll] = useState(false); // State to toggle view more

  // Reset showAll when dropdown closes
  useEffect(() => {
    if (!isOpen) setShowAll(false);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 10);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  // Logic: Only show first 3 unless 'showAll' is true
  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 4);

  return (
    <div
      ref={dropdownRef}
      className="absolute 
        right-0 sm:right-0 
        top-full sm:mt-3 mt-1
        -translate-x-1 sm:translate-x-0
        w-[calc(100vw-2.5rem)] sm:w-96 
        max-w-90 
        bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-dropdown z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-linear-to-r from-indigo-50 to-purple-50">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Notifications
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {notifications.length} notifications
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {notifications.length > 0 && (
            <button
              onClick={() => {
                onClear();
                onClose();
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div
        className={`overflow-y-auto transition-all duration-300 ${showAll ? 'max-h-[60vh] sm:max-h-96' : 'max-h-none'}`}
      >
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">
              All caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayedNotifications.map((notif, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`shrink-0 p-2 rounded-lg ${
                      notif.type === 'critical'
                        ? 'bg-red-100 text-red-600'
                        : notif.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {notif.type === 'critical' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : notif.type === 'warning' ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View More Button Footer */}
      {notifications.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 bg-gray-50 border-t border-gray-100 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1 active:bg-indigo-100"
        >
          {showAll ? (
            <>
              Show Less <ChevronDown className="h-3.5 w-3.5 rotate-180" />
            </>
          ) : (
            <>
              View More ({notifications.length - 3} more){' '}
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default NotificationDropDown;
