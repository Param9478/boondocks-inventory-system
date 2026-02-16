import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertTriangle, Clock, Bell, CheckCircle } from 'lucide-react';

const ViewAllNotificationsModal = ({ isOpen, onClose, notifications = [] }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-2xl font-bold text-white flex items-center space-x-2">
                      <Bell className="h-6 w-6" />
                      <span>All Notifications</span>
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  <p className="text-indigo-100 text-sm mt-2">
                    {notifications.length} notification
                    {notifications.length !== 1 ? 's' : ''} total
                  </p>
                </div>

                {/* Content */}
                <div className="max-h-150 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-gray-900 mb-2">
                        All caught up!
                      </p>
                      <p className="text-gray-500">
                        You don't have any notifications at the moment.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif, index) => (
                        <div
                          key={index}
                          className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-4">
                            {/* Icon */}
                            <div
                              className={`shrink-0 mt-1 p-2 rounded-full ${
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
                                <Bell className="h-5 w-5" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-base font-semibold text-gray-900">
                                    {notif.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
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
                                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
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

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewAllNotificationsModal;
