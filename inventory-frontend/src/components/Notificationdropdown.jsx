import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell, AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';

const NotificationDropdown = ({ notifications = [], onClear, onViewAll }) => {
  return (
    <Menu as="div" className="relative">
      {({ open, close }) => (
        <>
          <Menu.Button className="relative bg-white/20 backdrop-blur-lg p-2.5 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30">
            <Bell className="h-5 w-5 text-white" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {notifications.length}
              </span>
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={() => {
                        onClear();
                        close(); // Close dropdown after clearing
                      }}
                      className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                  {/* Close X button */}
                  <button
                    onClick={close}
                    className="text-white/80 hover:text-white transition-colors p-1"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">All caught up!</p>
                    <p className="text-sm text-gray-400 mt-1">
                      No new notifications
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notif, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={`px-4 py-3 transition-colors ${
                              active ? 'bg-gray-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {/* Icon based on type */}
                              <div
                                className={`flex-shrink-0 mt-1 ${
                                  notif.type === 'critical'
                                    ? 'text-red-500'
                                    : notif.type === 'warning'
                                      ? 'text-yellow-500'
                                      : 'text-blue-500'
                                }`}
                              >
                                {notif.type === 'critical' ? (
                                  <AlertTriangle className="h-5 w-5" />
                                ) : notif.type === 'warning' ? (
                                  <Clock className="h-5 w-5" />
                                ) : (
                                  <Bell className="h-5 w-5" />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">
                                  {notif.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notif.message}
                                </p>
                                {notif.time && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notif.time}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer - Only show if more than 3 notifications */}
              {notifications.length > 3 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => {
                      onViewAll();
                      close(); // Close dropdown after clicking view all
                    }}
                    className="w-full text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors py-2 hover:bg-gray-100 rounded-lg"
                  >
                    View All {notifications.length} Notifications
                  </button>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default NotificationDropdown;
