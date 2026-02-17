import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddItemModal from './components/AddItemModal';
import InventoryTable from './components/InventoryTable';
import FilterBar from './components/FilterBar';
import Analytics from './components/Analytics';
import QuickActions from './components/QuickActions';
import AdminPanel from './components/AdminPanel';
import { showSuccess, showError } from './utils/toast';
import EndOfDayCount from './components/EndOfDayCount';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
axios.defaults.baseURL = API_URL;

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [currentView, setCurrentView] = useState('inventory');
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

  // Reset to login when logged out
  useEffect(() => {
    if (!user && !authLoading) {
      setAuthView('login');
    }
  }, [user, authLoading]);

  // ✅ Fetch items only when user is set AND not loading
  const fetchItems = useCallback(async () => {
    // Don't fetch if no user or still loading auth
    if (!user || authLoading) {
      console.log(
        '⏸️ Skipping fetch - user:',
        !!user,
        'authLoading:',
        authLoading,
      );
      return;
    }

    try {
      setLoading(true);
      console.log(
        '📦 Fetching items with token:',
        !!axios.defaults.headers.common['Authorization'],
      );
      const res = await axios.get('/api/items');
      const allItems = res.data.data || res.data;
      console.log('✅ Items fetched:', allItems.length);
      setItems(allItems);
    } catch (err) {
      console.error('❌ Fetch error:', err.response?.data || err.message);
      // Only show error if it's not an auth issue
      if (err.response?.status !== 401) {
        showError('Failed to fetch inventory');
      }
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  // ✅ Only fetch when user changes AND auth is done loading
  useEffect(() => {
    if (currentView === 'inventory' && user && !authLoading) {
      // Small delay to ensure token is set
      const timer = setTimeout(() => {
        fetchItems();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, currentView, fetchItems]);

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

  const handleUpdateItem = async (id, updates) => {
    try {
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            iconTheme: { primary: '#10b981', secondary: '#fff' },
            style: { background: '#10b981' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            style: { background: '#ef4444' },
          },
        }}
      />

      <Header
        onAddClick={() => setIsModalOpen(true)}
        items={items}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAdmin={user?.role === 'admin'}
      />

      {currentView === 'admin' ? (
        <AdminPanel />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      )}

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

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
