import React, { useState, useEffect, useRef } from 'react';
import {
  Moon,
  X,
  ThermometerSnowflake,
  Wind,
  Droplets,
  Save,
  Plus,
  Check,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import axios from 'axios';

const EndOfDayCount = ({ onComplete }) => {
  const [nightlyItems, setNightlyItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [addingToCategory, setAddingToCategory] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedId, setHighlightedId] = useState(null);
  const scrollRefs = useRef({});
  const [openCats, setOpenCats] = useState({
    Freezer: true,
    Cooler: true,
    Sauces: true,
  });

  const categories = ['Freezer', 'Cooler', 'Sauces'];

  useEffect(() => {
    const fetchNightlyList = async () => {
      try {
        const res = await axios.get('/api/items/nightly-list');
        setNightlyItems(res.data.data);
        const initialCounts = {};
        res.data.data.forEach((item) => {
          if (item.quantity > 0) initialCounts[item._id] = item.quantity;
        });
        setCounts(initialCounts);
      } catch (err) {
        showError('Failed to load list');
      }
    };
    fetchNightlyList();
  }, []);

  const handleInputChange = (id, value) => {
    setCounts((prev) => ({ ...prev, [id]: value }));
  };

  const toggleCat = (cat) => {
    setOpenCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleAddClick = (e, cat) => {
    e.stopPropagation();
    setOpenCats((prev) => ({ ...prev, [cat]: true }));
    setAddingToCategory(cat);
  };

  const addNewInlineItem = (category) => {
    const nameTrimmed = newItemName.trim();
    if (!nameTrimmed) return;

    const existing = nightlyItems.find(
      (i) => i.name.toLowerCase() === nameTrimmed.toLowerCase(),
    );

    if (existing) {
      showError(`${nameTrimmed} already in list!`);
      setHighlightedId(existing._id);
      setOpenCats((prev) => ({ ...prev, [existing.category]: true }));
      setSearchQuery('');
      setTimeout(() => {
        scrollRefs.current[existing._id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
      setTimeout(() => setHighlightedId(null), 3000);
      setNewItemName('');
      setAddingToCategory(null);
      return;
    }

    const newItem = {
      _id: `temp-${Date.now()}`,
      name: nameTrimmed,
      category,
      quantity: 0,
      isNew: true,
    };
    setNightlyItems((prev) => [...prev, newItem]);
    setNewItemName('');
    setAddingToCategory(null);
    showSuccess('Added!');
  };

  const deleteItem = (id) => {
    setNightlyItems((prev) => prev.filter((i) => i._id !== id));
    const newCounts = { ...counts };
    delete newCounts[id];
    setCounts(newCounts);
  };

  const handleSubmitAll = async () => {
    const updates = Object.entries(counts)
      .filter(([_, value]) => value !== '' && value !== undefined)
      .map(([id, value]) => {
        const item = nightlyItems.find((i) => i._id === id);
        return {
          itemId: id,
          name: item.name,
          category: item.category,
          newQuantity: parseFloat(value),
        };
      });

    if (updates.length === 0) {
      showError('Enter at least one count');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/items/end-of-day-count', { counts: updates });
      showSuccess(`✅ Saved ${updates.length} items!`);
      onComplete();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Freezer':
        return <ThermometerSnowflake className="h-4 w-4" />;
      case 'Cooler':
        return <Wind className="h-4 w-4" />;
      case 'Sauces':
        return <Droplets className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Freezer':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Cooler':
        return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Sauces':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl my-8">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-indigo-600 px-5 py-4 sm:px-6 sm:py-5 rounded-t-2xl sm:rounded-t-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Moon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">
                    End of Day Count
                  </h1>
                  <p className="text-xs text-purple-100 mt-0.5">
                    Nightly inventory check
                  </p>
                </div>
              </div>
              <button
                onClick={onComplete}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-200" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-purple-200 outline-none focus:bg-white/20 focus:border-white/30 text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-200 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {categories.map((cat) => {
              const itemsInCategory = nightlyItems
                .filter((i) => i.category === cat)
                .filter((i) =>
                  i.name.toLowerCase().includes(searchQuery.toLowerCase()),
                );

              return (
                <div
                  key={cat}
                  className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCat(cat)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(cat)}`}
                      >
                        {getCategoryIcon(cat)}
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-gray-900">
                          {cat}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {itemsInCategory.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleAddClick(e, cat)}
                        className="px-2.5 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add</span>
                      </button>
                      {openCats[cat] ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Category Items */}
                  {openCats[cat] && (
                    <div className="px-4 pb-3 space-y-2">
                      {/* Add New Item Form */}
                      {addingToCategory === cat && (
                        <div className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-lg p-2 flex items-center space-x-2">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Item name..."
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && addNewInlineItem(cat)
                            }
                            className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => addNewInlineItem(cat)}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setAddingToCategory(null);
                              setNewItemName('');
                            }}
                            className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Items List */}
                      {itemsInCategory.map((item) => (
                        <div
                          key={item._id}
                          ref={(el) => (scrollRefs.current[item._id] = el)}
                          className={`bg-white rounded-lg p-3 border-2 transition-all ${
                            highlightedId === item._id
                              ? 'border-orange-500 bg-orange-50 shadow-lg'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              {item.isNew && (
                                <button
                                  onClick={() => deleteItem(item._id)}
                                  className="text-gray-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Current: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <input
                              type="number"
                              step="0.01"
                              inputMode="decimal"
                              value={
                                counts[item._id] !== undefined
                                  ? counts[item._id]
                                  : ''
                              }
                              onChange={(e) =>
                                handleInputChange(item._id, e.target.value)
                              }
                              placeholder="0"
                              className="w-20 sm:w-24 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-center font-bold text-indigo-600 text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
                            />
                          </div>
                        </div>
                      ))}

                      {itemsInCategory.length === 0 && !addingToCategory && (
                        <p className="text-center py-4 text-sm text-gray-400">
                          No items in this category
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl sm:rounded-b-3xl">
            <button
              onClick={handleSubmitAll}
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Inventory'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndOfDayCount;
