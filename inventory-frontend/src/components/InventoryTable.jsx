import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, Edit2, Trash2, Save, X, Package, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const InventoryTable = ({ items, onUpdate, onDelete, loading, highlightedItemId }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const rowRefs = useRef({});

  // Scroll to highlighted item
  useEffect(() => {
    if (highlightedItemId && rowRefs.current[highlightedItemId]) {
      setTimeout(() => {
        rowRefs.current[highlightedItemId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [highlightedItemId]);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData({
      _originalItem: item,  // Store reference
      name: item.name,
      quantity: item.quantity,
      minStock: item.minStock,
      category: item.category || '',
      supplier: item.supplier || '',
      costPerUnit: item.costPerUnit || '',
      notes: item.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    // Get original item for comparison
    const originalItem = editData._originalItem;
    
    // ✅ Clean data before sending - convert strings to numbers
    const cleanData = {};
    
    // Only send name if it actually changed
    if (editData.name !== undefined && editData.name !== originalItem.name) {
      cleanData.name = editData.name;
    }
    if (editData.quantity !== undefined && editData.quantity !== '') {
      cleanData.quantity = parseFloat(editData.quantity);
    }
    if (editData.minStock !== undefined && editData.minStock !== '') {
      cleanData.minStock = parseFloat(editData.minStock);
    }
    if (editData.costPerUnit !== undefined && editData.costPerUnit !== '') {
      cleanData.costPerUnit = parseFloat(editData.costPerUnit);
    }
    if (editData.category !== undefined && editData.category !== '') {
      cleanData.category = editData.category;
    }
    if (editData.supplier !== undefined && editData.supplier !== '') {
      cleanData.supplier = editData.supplier;
    }
    if (editData.notes !== undefined && editData.notes !== '') {
      cleanData.notes = editData.notes;
    }
    
    console.log('Saving edit:', id, cleanData);  // Debug log
    
    const success = await onUpdate(id, cleanData);
    if (success) {
      setEditingId(null);
      setEditData({});
    }
  };

  const getStatusBadge = (item) => {
    const isLow = item.quantity <= item.minStock;
    const percentage = (item.quantity / item.minStock) * 100;

    if (isLow) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Critical
        </span>
      );
    } else if (percentage <= 150) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
          <Clock className="h-3 w-3 mr-1" />
          Low
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Stable
        </span>
      );
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiry = new Date(expiryDate);
    return expiry <= weekFromNow && expiry >= now;
  };

  if (loading && items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-500 font-medium">Loading inventory...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Items Found</h3>
        <p className="text-gray-500">Add your first inventory item to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">
          Inventory Items ({items.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Min Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Cost/Unit
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => {
              const isEditing = editingId === item._id;
              const totalValue = (item.quantity * (item.costPerUnit || 0)).toFixed(2);
              const isLowStock = item.quantity <= item.minStock;
              const isHighlighted = highlightedItemId === item._id;
              const rowClass = isHighlighted 
                ? 'bg-orange-100 border-2 border-orange-500 scale-105 shadow-xl' 
                : isLowStock 
                ? 'bg-red-50/50' 
                : '';

              return (
                <motion.tr
                  key={item._id}
                  ref={(el) => (rowRefs.current[item._id] = el)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-all duration-500 ${rowClass}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name ?? item.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-3 py-1.5 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <span className="font-semibold text-gray-900">{item.name}</span>
                      )}
                      {item.expiryDate && (
                        <span className={`text-xs mt-1 ${isExpiringSoon(item.expiryDate) ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                          Exp: {new Date(item.expiryDate).toLocaleDateString()}
                          {isExpiringSoon(item.expiryDate) && ' ⚠️'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <select
                        value={editData.category || item.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="w-full px-3 py-1.5 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Frozen">Frozen</option>
                        <option value="Produce">Produce</option>
                        <option value="Sauces">Sauces</option>
                        <option value="Dry Goods">Dry Goods</option>
                        <option value="Meat">Meat</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Baking">Baking</option>
                        <option value="Seafood">Seafood</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {item.category || 'N/A'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editData.quantity}
                        onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                        className="w-24 px-3 py-1.5 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">
                        {item.quantity} {item.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editData.minStock}
                        onChange={(e) => setEditData({ ...editData, minStock: e.target.value })}
                        className="w-24 px-3 py-1.5 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-gray-600">
                        {item.minStock} {item.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        <input
                          type="number"
                          step="0.01"
                          value={editData.costPerUnit}
                          onChange={(e) => setEditData({ ...editData, costPerUnit: e.target.value })}
                          className="w-24 px-3 py-1.5 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="0.00"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-600">
                        {item.costPerUnit ? `$${item.costPerUnit}` : '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600">
                      ${totalValue}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <select
                        value={editData.supplier || item.supplier}
                        onChange={(e) => setEditData({ ...editData, supplier: e.target.value })}
                        className="w-full px-3 py-1.5 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Sysco">Sysco</option>
                        <option value="Saputo">Saputo</option>
                        <option value="GFS">GFS</option>
                        <option value="US Foods">US Foods</option>
                        <option value="Local Farm">Local Farm</option>
                        <option value="Costco">Costco</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span className="text-sm text-gray-600">{item.supplier}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(item._id)}
                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this item?')) {
                                onDelete(item._id);
                              }
                            }}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;