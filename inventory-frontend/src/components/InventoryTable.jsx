import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2'; // ✅ SweetAlert2 Import
import {
  AlertTriangle,
  CheckCircle,
  Edit2,
  Trash2,
  Save,
  X,
  Package,
  Clock,
  ChevronRight,
} from 'lucide-react';

// --- MOBILE CARD COMPONENT ---
const MobileCard = ({
  item,
  editingId,
  editData,
  setEditData,
  expandedItemId,
  setExpandedItemId,
  highlightedItemId,
  rowRefs,
  startEdit,
  saveEdit,
  cancelEdit,
  handleDelete, // ✅ Swal wala delete pass kita
  getStatusBadge,
  isExpiringSoon,
}) => {
  const isEditing = editingId === item._id;
  const isExpanded = expandedItemId === item._id;
  const totalValue = (item.quantity * (item.costPerUnit || 0)).toFixed(2);
  const isLowStock = item.quantity <= item.minStock;
  const isHighlighted = highlightedItemId === item._id;

  const handleToggleExpand = () => {
    if (!isEditing) {
      setExpandedItemId(isExpanded ? null : item._id);
    }
  };

  return (
    <div
      ref={(el) => (rowRefs.current[item._id] = el)}
      className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 mb-3 overflow-hidden ${
        isHighlighted
          ? 'border-orange-500 bg-orange-50 scale-[1.02] shadow-lg'
          : isLowStock
            ? 'border-red-200 bg-red-50/50'
            : 'border-gray-200'
      }`}
    >
      <div className="p-3 sm:p-4">
        <div
          className="flex items-start justify-between mb-2"
          onClick={!isEditing ? handleToggleExpand : undefined}
        >
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-2 py-1 text-sm font-semibold border-2 border-indigo-300 rounded-lg focus:outline-none"
                autoComplete="off"
              />
            ) : (
              <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                {item.name}
              </h4>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700">
                {item.category || 'N/A'}
              </span>
              {getStatusBadge(item)}
            </div>
          </div>
          {!isEditing && (
            <ChevronRight
              className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <p className="text-xs text-gray-500">Stock</p>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editData.quantity || ''}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                className="w-full mt-1 px-2 py-1 text-sm border-2 border-indigo-300 rounded-lg"
              />
            ) : (
              <p className="font-semibold text-gray-900 text-sm">
                {item.quantity} {item.unit}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500">Min Level</p>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editData.minStock || ''}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    minStock: e.target.value,
                  }))
                }
                className="w-full mt-1 px-2 py-1 text-sm border-2 border-indigo-300 rounded-lg"
              />
            ) : (
              <p className="font-semibold text-gray-900 text-sm">
                {item.minStock} {item.unit}
              </p>
            )}
          </div>
        </div>
      </div>

      {isExpanded && !isEditing && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <p className="text-gray-500 mb-1">Cost/Unit</p>
              <p className="font-semibold text-gray-900">
                {item.costPerUnit ? `$${item.costPerUnit}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Total Value</p>
              <p className="font-bold text-green-600">${totalValue}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Supplier</p>
              <p className="font-semibold text-gray-900">{item.supplier}</p>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="px-3 sm:px-4 pb-3 space-y-2 border-t border-gray-100 bg-gray-50 pt-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <select
              value={editData.category || ''}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-2 py-1.5 text-sm border-2 border-indigo-300 rounded-lg"
            >
              {[
                'Freezer',
                'Cooler',
                'Sauces',
                'Dry Goods',
                'Produce',
                'Meat',
                'Dairy',
                'Frozen',
                'Beverages',
                'Other',
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Cost per Unit
            </label>
            <input
              type="number"
              step="0.01"
              value={editData.costPerUnit || ''}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  costPerUnit: e.target.value,
                }))
              }
              className="w-full px-2 py-1.5 text-sm border-2 border-indigo-300 rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="px-3 py-2 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={() => saveEdit(item._id)}
              className="p-2 text-green-600 active:scale-90"
            >
              <Save className="h-5 w-5" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-2 text-gray-500 active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => startEdit(item)}
              className="p-2 text-indigo-500 active:scale-90"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 text-red-500 active:scale-90"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- MAIN INVENTORY TABLE COMPONENT ---
const InventoryTable = ({
  items,
  onUpdate,
  onDelete,
  loading,
  highlightedItemId,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedItemId, setExpandedItemId] = useState(null);
  const rowRefs = useRef({});

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

  const handleDelete = (item) => {
    Swal.fire({
      title: 'Delete Item?',
      text: `Confirm for "${item.name}"?`,
      icon: 'warning',
      iconColor: '#ef4444',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete',
      cancelButtonText: 'No',
      reverseButtons: true,
      width: '260px',
      padding: '0.8rem',
      borderRadius: '1rem',
      customClass: {
        icon: 'nano-icon',
        title: 'nano-title',
        htmlContainer: 'nano-text',
        confirmButton: 'nano-btn',
        cancelButton: 'nano-btn',
      },
      // ✅ CSS pehla hi inject karti taaki animation glitch na kare
      didOpen: () => {
        const style = document.createElement('style');
        style.innerHTML = `
          .swal2-icon { 
            animation: none !important; 
            transform: scale(0.4) !important; 
            margin: -15px auto !important; 
          }
          .nano-title { font-size: 14px !important; font-weight: 700 !important; }
          .nano-text { font-size: 11px !important; margin-top: 4px !important; }
          .nano-btn { font-size: 11px !important; padding: 6px 14px !important; }
        `;
        document.head.appendChild(style);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(item._id);
      }
    });
  };

  const saveEdit = async (id) => {
    const originalItem = editData._originalItem;
    const cleanData = {};

    if (editData.name !== originalItem.name) cleanData.name = editData.name;

    if (editData.quantity !== '')
      cleanData.quantity = Math.round(parseFloat(editData.quantity));

    if (editData.minStock !== '')
      cleanData.minStock = Math.round(parseFloat(editData.minStock));

    if (editData.costPerUnit !== '')
      cleanData.costPerUnit = parseFloat(editData.costPerUnit);

    if (editData.category !== '') cleanData.category = editData.category;
    if (editData.supplier !== '') cleanData.supplier = editData.supplier;

    const success = await onUpdate(id, cleanData);
    if (success) cancelEdit();
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setExpandedItemId(null);
    setEditData({
      _originalItem: item,
      name: item.name,
      quantity: item.quantity,
      minStock: item.minStock,
      category: item.category || '',
      supplier: item.supplier || '',
      costPerUnit: item.costPerUnit || '',
      notes: item.notes || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const getStatusBadge = (item) => {
    const isLow = item.quantity <= item.minStock;
    const percentage = (item.quantity / item.minStock) * 100;
    if (isLow)
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
          <AlertTriangle className="h-3 w-3 mr-1" /> Critical
        </span>
      );
    if (percentage <= 150)
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] bg-yellow-100 text-yellow-700 font-bold">
          <Clock className="h-3 w-3 mr-1" /> Low
        </span>
      );
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] bg-green-100 text-green-700 font-bold">
        <CheckCircle className="h-3 w-3 mr-1" /> Stable
      </span>
    );
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const expiry = new Date(expiryDate);
    return expiry <= weekFromNow && expiry >= new Date();
  };

  if (loading && items.length === 0)
    return (
      <div className="text-center p-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto animate-pulse" />
        <p className="text-gray-500 mt-4 text-sm">Loading...</p>
      </div>
    );

  return (
    <>
      <div className="lg:hidden space-y-2 px-2">
        {items.map((item) => (
          <MobileCard
            key={item._id}
            item={item}
            editingId={editingId}
            editData={editData}
            setEditData={setEditData}
            expandedItemId={expandedItemId}
            setExpandedItemId={setExpandedItemId}
            highlightedItemId={highlightedItemId}
            rowRefs={rowRefs}
            startEdit={startEdit}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            handleDelete={handleDelete} // ✅ Passed here
            getStatusBadge={getStatusBadge}
            isExpiringSoon={isExpiringSoon}
          />
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Inventory Items ({items.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Item
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Stock
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const isEditing = editingId === item._id;
                return (
                  <tr
                    key={item._id}
                    ref={(el) => (rowRefs.current[item._id] = el)}
                    className={`hover:bg-gray-50 transition-all ${highlightedItemId === item._id ? 'bg-orange-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name || ''}
                          onChange={(e) =>
                            setEditData((p) => ({ ...p, name: e.target.value }))
                          }
                          className="px-2 py-1 border rounded w-full text-sm"
                        />
                      ) : (
                        <span className="font-semibold text-sm">
                          {item.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(item._id)}
                              className="p-1 text-green-600"
                            >
                              <Save className="h-5 w-5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 text-gray-400"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1 text-indigo-600"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InventoryTable;
