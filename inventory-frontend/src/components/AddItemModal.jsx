import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  X,
  Plus,
  Package,
  Truck,
  Tag,
  MapPin,
  FileText,
  Hash,
} from 'lucide-react';

const AddItemModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    minStock: '',
    supplier: 'Sysco',
    category: 'Dry Goods',
    location: 'Main Storage',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        quantity: '',
        unit: 'kg',
        minStock: '',
        supplier: 'Sysco',
        category: 'Dry Goods',
        location: 'Main Storage',
        notes: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return;
    }

    setLoading(true);
    const payload = {
      name: formData.name.trim(),
      quantity: Number(formData.quantity) || 0,
      unit: formData.unit,
      minStock: Number(formData.minStock) || 0,
      category: formData.category,
      supplier: formData.supplier,
      location: formData.location,
      notes: formData.notes.trim(),
    };

    try {
      const success = await onSubmit(payload);
      if (success) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl transform transition-all overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                        <Plus
                          className="h-5 w-5 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                      <div>
                        <Dialog.Title className="text-lg sm:text-xl font-bold text-white">
                          Add New Item
                        </Dialog.Title>
                        <p className="text-xs text-indigo-100 mt-0.5">
                          Quick inventory entry
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                  {/* Item Name */}
                  <div>
                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 mb-2">
                      <Package className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Item Name *</span>
                    </label>
                    <input
                      autoFocus
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Burger Buns"
                      className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Category & Supplier */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 mb-2">
                        <Tag className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Category</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-900"
                      >
                        <option value="Dry Goods">Dry Goods</option>
                        <option value="Freezer">Freezer</option>
                        <option value="Cooler">Cooler</option>
                        <option value="Sauces">Sauces</option>
                        <option value="Produce">Produce</option>
                        <option value="Meat">Meat</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 mb-2">
                        <Truck className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Supplier</span>
                      </label>
                      <select
                        value={formData.supplier}
                        onChange={(e) =>
                          setFormData({ ...formData, supplier: e.target.value })
                        }
                        className="w-full px-3 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-900"
                      >
                        <option value="Sysco">Sysco</option>
                        <option value="GFS">GFS</option>
                        <option value="Saputo">Saputo</option>
                        <option value="US Foods">US Foods</option>
                        <option value="Costco">Costco</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Quantity & Unit */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 mb-2">
                        <Hash className="h-3.5 w-3.5 text-green-600" />
                        <span>Quantity</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: e.target.value })
                        }
                        placeholder="0"
                        className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base font-bold text-green-600 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 mb-2">
                        <span className="text-gray-400">Unit</span>
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                        className="w-full px-3 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-900"
                      >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                        <option value="g">g</option>
                        <option value="oz">oz</option>
                        <option value="L">L</option>
                        <option value="ml">ml</option>
                        <option value="case">case</option>
                        <option value="box">box</option>
                        <option value="each">each</option>
                      </select>
                    </div>
                  </div>

                  {/* Min Stock & Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 mb-2">
                        <Hash className="h-3.5 w-3.5 text-red-600" />
                        <span>Min Level</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.minStock}
                        onChange={(e) =>
                          setFormData({ ...formData, minStock: e.target.value })
                        }
                        placeholder="0"
                        className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base font-bold text-red-600 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 mb-2">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Location</span>
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-3 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-900"
                      >
                        <option value="Main Storage">Main Storage</option>
                        <option value="Walk-in Cooler">Walk-in Cooler</option>
                        <option value="Walk-in Freezer">Walk-in Freezer</option>
                        <option value="Dry Storage">Dry Storage</option>
                        <option value="Bar">Bar</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 mb-2">
                      <FileText className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Notes (Optional)</span>
                    </label>
                    <textarea
                      rows="2"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Add any additional notes..."
                      className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 sm:py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{loading ? 'Adding...' : 'Add Item'}</span>
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddItemModal;
