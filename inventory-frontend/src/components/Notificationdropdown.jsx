import React, { useEffect } from 'react';
import { X, AlertTriangle, Clock, CheckCircle, Trash2 } from 'lucide-react';

const NotificationDropDown = ({ isOpen, onClose, notifications, onClear }) => {
  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Notifications
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {notifications.length} notification
              {notifications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  onClear();
                  onClose();
                }}
                className="p-2 text-gray-400 hover:text-red-600 active:scale-95 transition-all rounded-lg hover:bg-red-50"
                title="Clear all"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 active:scale-95 transition-all rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                All caught up!
              </p>
              <p className="text-sm text-gray-500 text-center">
                No new notifications at the moment
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif, index) => (
                <div
                  key={index}
                  className="px-4 sm:px-6 py-4 active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div
                      className={`shrink-0 p-2.5 rounded-xl ${
                        notif.type === 'critical'
                          ? 'bg-red-100 text-red-600'
                          : notif.type === 'warning'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {notif.type === 'critical' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : notif.type === 'warning' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
                            {notif.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.time && (
                            <p className="text-xs text-gray-400 mt-2">
                              {notif.time}
                            </p>
                          )}
                        </div>

                        {/* Priority Badge */}
                        {notif.type === 'critical' && (
                          <span className="shrink-0 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safe Area Bottom Padding for iOS */}
        <div className="h-safe-area-inset-bottom bg-white" />
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default NotificationDropDown;
