import React, { useState, Fragment } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Prevent double submit
    if (loading) return;

    setLoading(true);

    // ✅ Clean data before sending - remove empty strings
    const cleanData = {
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      minStock: parseFloat(formData.minStock),
      supplier: formData.supplier,
      category: formData.category,
      location: formData.location,
    };

    // Only add optional fields if they have values
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-2xl font-bold text-white">
                      Add New Inventory Item
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Item Name */}
                    <div className="md:col-span-2">
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                          setFormData({ ...formData, supplier: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                        <option value="Sysco">Sysco (Tuesday)</option>
                        <option value="Saputo">Saputo (Saturday)</option>
                        <option value="GFS">Gordon Food Service (Wed)</option>
                        <option value="US Foods">US Foods (Thu)</option>
                        <option value="Local Farm">Local Farm (Weekly)</option>
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
                          setFormData({ ...formData, quantity: e.target.value })
                        }
                        placeholder="0"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                          setFormData({ ...formData, minStock: e.target.value })
                        }
                        placeholder="Alert threshold"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                        <option value="Main Storage">Main Storage</option>
                        <option value="Walk-in Cooler">Walk-in Cooler</option>
                        <option value="Walk-in Freezer">Walk-in Freezer</option>
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Plus className="h-5 w-5" />
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
