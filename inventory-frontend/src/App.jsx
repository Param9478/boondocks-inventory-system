import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddItemModal from './components/AddItemModal';
import InventoryTable from './components/InventoryTable';
import FilterBar from './components/FilterBar';
import Analytics from './components/Analytics';
import QuickActions from './components/QuickActions';
import { showSuccess, showError } from './utils/toast';
import EndOfDayCount from './components/Endofdaycount';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://boondocks-api.onrender.com';
axios.defaults.baseURL = API_URL;

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showEndOfDay, setShowEndOfDay] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const [showNightlyOnly, setShowNightlyOnly] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/items');
      const allItems = res.data.data || res.data;
      setItems(allItems);
    } catch (err) {
      console.error('Fetch error:', err);
      showError('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    let result = [...items];

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filter === 'low') {
      result = result.filter((item) => item.quantity <= item.minStock);
    } else if (filter === 'stable') {
      result = result.filter((item) => item.quantity > item.minStock);
    } else if (filter === 'nightly') {
      result = result.filter((item) => item.isNightly === true);
    } else if (filter === 'expiring') {
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      result = result.filter((item) => {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        return expiry <= weekFromNow && expiry >= now;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      if (sortBy === 'status') {
        const aLow = a.quantity <= a.minStock;
        const bLow = b.quantity <= b.minStock;
        return bLow - aLow;
      }
      if (sortBy === 'value') {
        const aValue = a.quantity * (a.costPerUnit || 0);
        const bValue = b.quantity * (b.costPerUnit || 0);
        return bValue - aValue;
      }
      return 0;
    });

    setFilteredItems(result);
  }, [items, filter, searchQuery, sortBy]);

  const handleAddItem = async (formData) => {
    try {
      console.log('Adding item:', formData);

      // Check duplicate
      const existingItem = items.find(
        (item) => item.name.toLowerCase() === formData.name.toLowerCase(),
      );

      if (existingItem && !existingItem.isPlaceholder) {
        showError(`"${formData.name}" already exists!`);
        setHighlightedItemId(existingItem._id);
        if (viewMode !== 'table') setViewMode('table');
        setFilter('all');
        setSearchQuery('');
        setTimeout(() => setHighlightedItemId(null), 3000);
        return false;
      }

      const response = await axios.post('/api/items', formData);
      console.log('Add response:', response.data);

      await fetchItems();
      setIsModalOpen(false);
      showSuccess('Item added successfully!');
      return true;
    } catch (err) {
      console.error('Add error:', err.response?.data || err);
      showError(err.response?.data?.message || 'Failed to add item');
      return false;
    }
  };

  // const handleUpdateItem = async (id, updates) => {
  //   try {
  //     console.log('Updating item:', id, updates);

  //     if (id.startsWith('temp-') || id.startsWith('placeholder-')) {
  //       const item = items.find((i) => i._id === id);
  //       if (!item) {
  //         showError('Item not found');
  //         return false;
  //       }

  //       const newItemData = {
  //         name: updates.name || item.name,
  //         category: updates.category || item.category,
  //         quantity:
  //           parseFloat(updates.quantity) !== undefined
  //             ? parseFloat(updates.quantity)
  //             : item.quantity || 0,
  //         minStock:
  //           parseFloat(updates.minStock) !== undefined
  //             ? parseFloat(updates.minStock)
  //             : item.minStock || 5,
  //         unit: 'each',
  //         supplier: updates.supplier || 'Other',
  //       };
  //       if (updates.name) newItemData.name = updates.name;
  //       if (updates.category) newItemData.category = updates.category;
  //       if (updates.costPerUnit)
  //         newItemData.costPerUnit = parseFloat(updates.costPerUnit);
  //       if (updates.notes) newItemData.notes = updates.notes;

  //       console.log('Creating from placeholder:', newItemData);
  //       const response = await axios.post('/api/items', newItemData);
  //       console.log('Create response:', response.data);

  //       await fetchItems();
  //       showSuccess('Item added!');
  //       return true;
  //     }

  //     console.log('Updating existing:', id, updates);
  //     const response = await axios.put(`/api/items/${id}`, updates);
  //     console.log('Update response:', response.data);

  //     await fetchItems();
  //     showSuccess('Updated!');
  //     return true;
  //   } catch (err) {
  //     console.error('Update error:', err.response?.data || err);
  //     showError(err.response?.data?.message || 'Failed to update');
  //     return false;
  //   }
  // };

  const handleUpdateItem = async (id, updates) => {
    try {
      // ✅ No more temp-id checks needed since we seeded everything
      const response = await axios.put(`/api/items/${id}`, updates);
      await fetchItems();
      showSuccess('Updated!');
      return true;
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update');
      return false;
    }
  };
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      await fetchItems();
      showSuccess('Deleted!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete');
    }
  };

  const stats = {
    total: items.length,
    lowStock: items.filter((item) => item.quantity <= item.minStock).length,
    stable: items.filter((item) => item.quantity > item.minStock).length,
    totalValue: items.reduce(
      (sum, item) => sum + item.quantity * (item.costPerUnit || 0),
      0,
    ),
    categories: [...new Set(items.map((item) => item.category))].length,
    expiringSoon: items.filter((item) => {
      if (!item.expiryDate) return false;
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const expiry = new Date(item.expiryDate);
      return expiry <= weekFromNow && expiry >= now;
    }).length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: {
            duration: 3000,
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Header onAddClick={() => setIsModalOpen(true)} items={items} />

      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard stats={stats} />

        <QuickActions
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddItem={() => setIsModalOpen(true)}
          onEndOfDay={() => setShowEndOfDay(true)}
          onExport={() => showSuccess('Export coming soon!')}
        />

        {viewMode === 'table' ? (
          <>
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            <InventoryTable
              items={filteredItems}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
              loading={loading}
              highlightedItemId={highlightedItemId}
            />
          </>
        ) : (
          <Analytics items={items} />
        )}
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
      />

      {showEndOfDay && (
        <EndOfDayCount
          onComplete={() => {
            setShowEndOfDay(false);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}

export default App;
