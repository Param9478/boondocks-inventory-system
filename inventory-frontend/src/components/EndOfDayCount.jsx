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

  // ✅ ONLY 3 CATEGORIES - matches backend master list
  const categories = ['Freezer', 'Cooler', 'Sauces'];

  useEffect(() => {
    const fetchNightlyList = async () => {
      try {
        const res = await axios.get('/api/items/nightly-list');
        const items = res.data.data;
        setNightlyItems(items);

        const initialCounts = {};
        items.forEach((item) => {
          if (item.quantity > 0) {
            initialCounts[item._id] = item.quantity;
          }
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

  const addNewInlineItem = (category) => {
    const nameTrimmed = newItemName.trim();
    if (!nameTrimmed) return;

    const existing = nightlyItems.find(
      (i) => i.name.toLowerCase() === nameTrimmed.toLowerCase(),
    );

    if (existing) {
      showError(`${nameTrimmed} already in list!`);
      setHighlightedId(existing._id);
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

    const newId = `temp-new-${Date.now()}-${nameTrimmed.toLowerCase().replace(/\s+/g, '-')}`;
    const newItem = {
      _id: newId,
      name: nameTrimmed,
      category: category,
      quantity: 0,
      isNew: true,
    };

    setNightlyItems((prev) => [...prev, newItem]);
    setNewItemName('');
    setAddingToCategory(null);
    showSuccess('Added!');
  };

  const deleteItem = (id) => {
    setNightlyItems((prev) => prev.filter((item) => item._id !== id));
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
          name: item.name, // Naye items layi zaroori hai
          category: item.category, // Naye items layi zaroori hai
          newQuantity: parseFloat(value),
        };
      });

    if (updates.length === 0) {
      showError('Enter at least one count');
      return;
    }

    setLoading(true);
    try {
      // 💡 Backend hun counts array expect karda hai
      const res = await axios.post('/api/items/end-of-day-count', {
        counts: updates,
      });

      showSuccess(`✅ Saved ${updates.length} items!`);
      onComplete(); // Modal band kardo
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto">
      <div className="sticky top-0 bg-slate-900 text-white p-4 sm:p-5 shadow-2xl z-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Moon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase">
                  Boondocks Nightly
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">
                  Stock Inventory
                </p>
              </div>
            </div>
            <button
              onClick={onComplete}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X size={24} className="sm:w-7 sm:h-7" />
            </button>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 text-white rounded-xl border-2 border-slate-700 focus:border-indigo-500 outline-none text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-3 sm:p-6 pb-32">
        {categories.map((cat) => (
          <div key={cat} className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4 border-b-4 border-slate-900 pb-2 sm:pb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                {cat === 'Freezer' && (
                  <ThermometerSnowflake className="text-blue-600" size={20} />
                )}
                {cat === 'Cooler' && (
                  <Wind className="text-emerald-600" size={20} />
                )}
                {cat === 'Sauces' && (
                  <Droplets className="text-orange-600" size={20} />
                )}
                <h2 className="text-xl sm:text-3xl font-black uppercase text-slate-900">
                  {cat}
                </h2>
              </div>

              <button
                onClick={() => setAddingToCategory(cat)}
                className="flex items-center gap-1 bg-slate-900 text-white px-2 sm:px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-600"
              >
                <Plus size={12} /> ADD
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {addingToCategory === cat && (
                <div className="bg-indigo-50 p-2 sm:p-3 rounded-xl border-2 border-dashed border-indigo-300 flex gap-2 sm:gap-3">
                  <input
                    autoFocus
                    className="flex-1 p-2 rounded-lg outline-none font-bold text-sm"
                    placeholder="Item name..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && addNewInlineItem(cat)
                    }
                  />
                  <button
                    onClick={() => addNewInlineItem(cat)}
                    className="bg-indigo-600 text-white p-2 rounded-lg"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setAddingToCategory(null);
                      setNewItemName('');
                    }}
                    className="bg-slate-300 text-slate-700 p-2 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {nightlyItems
                .filter((item) => item.category === cat)
                .filter(
                  (item) =>
                    searchQuery === '' ||
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((item) => (
                  <div
                    key={item._id}
                    ref={(el) => (scrollRefs.current[item._id] = el)}
                    className={`bg-white px-3 py-3 sm:px-4 sm:py-4 rounded-xl shadow-sm border-2 flex justify-between items-center gap-2 transition-all duration-500 ${
                      highlightedId === item._id
                        ? 'border-orange-500 bg-orange-50 scale-105 shadow-lg animate-pulse'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {item.isNew && (
                        <button
                          onClick={() => deleteItem(item._id)}
                          className="text-slate-300 hover:text-red-500 flex-shrink-0"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-slate-700 text-sm uppercase truncate">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      inputMode="decimal"
                      value={
                        counts[item._id] !== undefined ? counts[item._id] : ''
                      }
                      onChange={(e) =>
                        handleInputChange(item._id, e.target.value)
                      }
                      className="w-16 sm:w-24 p-2 bg-slate-50 border-2 border-slate-200 rounded-lg text-right font-black text-indigo-600 text-lg focus:border-indigo-600 focus:bg-white outline-none flex-shrink-0"
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 p-4 sm:p-6 shadow-2xl z-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmitAll}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl flex justify-center items-center gap-2 uppercase tracking-wider text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Save size={18} />
                <span>Save Inventory</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndOfDayCount;
