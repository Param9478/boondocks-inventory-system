import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus } from 'lucide-react';

const AddItemModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    minStock: '',
    supplier: 'Sysco',
    category: 'Dry Goods',
    location: 'Main Storage',
    costPerUnit: '',
    expiryDate: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  // Prevent body scroll when modal is open
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const cleanData = {
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      minStock: parseFloat(formData.minStock),
      supplier: formData.supplier,
      category: formData.category,
      location: formData.location,
    };

    if (formData.costPerUnit) {
      cleanData.costPerUnit = parseFloat(formData.costPerUnit);
    }
    if (formData.expiryDate) {
      cleanData.expiryDate = formData.expiryDate;
    }
    if (formData.notes) {
      cleanData.notes = formData.notes;
    }

    const success = await onSubmit(cleanData);
    setLoading(false);

    if (success) {
      setFormData({
        name: '',
        quantity: '',
        unit: 'kg',
        minStock: '',
        supplier: 'Sysco',
        category: 'Dry Goods',
        location: 'Main Storage',
        costPerUnit: '',
        expiryDate: '',
        notes: '',
      });
    }
  };

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
          <div className="flex min-h-full items-center justify-center lg:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 lg:scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95 lg:scale-95"
            >
              <Dialog.Panel className="w-full lg:max-w-3xl h-full lg:h-auto transform overflow-hidden lg:rounded-3xl bg-white shadow-2xl transition-all flex flex-col">
                {/* Header */}
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 shrink-0">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      Add New Item
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="rounded-full bg-white/20 p-2 hover:bg-white/30 active:scale-95 transition-all"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Form - Scrollable */}
                <form
                  onSubmit={handleSubmit}
                  className="flex-1 overflow-y-auto"
                >
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Item Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Item Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="e.g., Tomatoes, Chicken Breast"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                        >
                          <option value="Freezer">Freezer</option>
                          <option value="Cooler">Cooler</option>
                          <option value="Sauces">Sauces</option>
                          <option value="Dry Goods">Dry Goods</option>
                          <option value="Produce">Produce</option>
                          <option value="Meat">Meat</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Frozen">Frozen</option>
                          <option value="Beverages">Beverages</option>
                          <option value="Condiments">Condiments</option>
                          <option value="Baking">Baking</option>
                          <option value="Seafood">Seafood</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Supplier */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Supplier *
                        </label>
                        <select
                          required
                          value={formData.supplier}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              supplier: e.target.value,
                            })
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                        >
                          <option value="Sysco">Sysco (Tuesday)</option>
                          <option value="Saputo">Saputo (Saturday)</option>
                          <option value="GFS">Gordon Food Service (Wed)</option>
                          <option value="US Foods">US Foods (Thu)</option>
                          <option value="Local Farm">
                            Local Farm (Weekly)
                          </option>
                          <option value="Costco">Costco (As needed)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Quantity *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity: e.target.value,
                            })
                          }
                          placeholder="0"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                        />
                      </div>

                      {/* Unit */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Unit *
                        </label>
                        <select
                          required
                          value={formData.unit}
                          onChange={(e) =>
                            setFormData({ ...formData, unit: e.target.value })
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                        >
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lb">Pounds (lb)</option>
                          <option value="g">Grams (g)</option>
                          <option value="oz">Ounces (oz)</option>
                          <option value="L">Liters (L)</option>
                          <option value="ml">Milliliters (ml)</option>
                          <option value="gal">Gallons (gal)</option>
                          <option value="box">Box</option>
                          <option value="case">Case</option>
                          <option value="each">Each</option>
                          <option value="dozen">Dozen</option>
                        </select>
                      </div>

                      {/* Min Stock */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Min Stock Level *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.minStock}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              minStock: e.target.value,
                            })
                          }
                          placeholder="Alert threshold"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                        />
                      </div>

                      {/* Cost Per Unit */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cost Per Unit
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.costPerUnit}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              costPerUnit: e.target.value,
                            })
                          }
                          placeholder="0.00"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                        />
                      </div>

                      {/* Storage Location */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Storage Location
                        </label>
                        <select
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                        >
                          <option value="Main Storage">Main Storage</option>
                          <option value="Walk-in Cooler">Walk-in Cooler</option>
                          <option value="Walk-in Freezer">
                            Walk-in Freezer
                          </option>
                          <option value="Dry Storage">Dry Storage</option>
                          <option value="Bar">Bar</option>
                          <option value="Kitchen Prep">Kitchen Prep</option>
                        </select>
                      </div>

                      {/* Expiry Date */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              expiryDate: e.target.value,
                            })
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                        />
                      </div>

                      {/* Notes */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          placeholder="Any additional notes..."
                          rows="3"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions - Sticky Footer */}
                  <div className="shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-center justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold rounded-lg sm:rounded-xl transition-all text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-semibold rounded-lg sm:rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
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
