import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  Activity,
  Shield,
  UserX,
  UserCheck,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  LogIn,
  LogOut,
  Plus,
  Edit,
  AlertCircle,
  ChevronRight,
  Crown,
  User as UserIcon,
  Lock,
} from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user: currentUser } = useAuth(); // ✅ Get current logged-in user
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'activity') fetchActivityLogs();
    else if (activeTab === 'stats') fetchStats();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      showError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/activity-logs?limit=50');
      setActivityLogs(res.data.data);
    } catch (err) {
      showError('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      showError('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    // ✅ Prevent changing own role
    if (userId === currentUser?._id) {
      showError('You cannot change your own role');
      return;
    }

    try {
      await axios.put(`/api/admin/users/${userId}`, { role: newRole });
      showSuccess(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    // ✅ Prevent deactivating yourself
    if (userId === currentUser?._id) {
      showError('You cannot deactivate your own account');
      return;
    }

    try {
      await axios.put(`/api/admin/users/${userId}`, {
        isActive: !currentStatus,
      });
      showSuccess(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      showError('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    // ✅ Prevent deleting yourself
    if (userId === currentUser?._id) {
      showError('You cannot delete your own account');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      showSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN':
        return <LogIn className="h-4 w-4" />;
      case 'LOGOUT':
        return <LogOut className="h-4 w-4" />;
      case 'ITEM_CREATED':
        return <Plus className="h-4 w-4" />;
      case 'ITEM_UPDATED':
        return <Edit className="h-4 w-4" />;
      case 'ITEM_DELETED':
        return <Trash2 className="h-4 w-4" />;
      case 'USER_CREATED':
        return <Users className="h-4 w-4" />;
      case 'USER_UPDATED':
        return <Edit className="h-4 w-4" />;
      case 'USER_DELETED':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action) => {
    if (action.includes('CREATED')) return 'bg-green-100 text-green-700';
    if (action.includes('UPDATED')) return 'bg-blue-100 text-blue-700';
    if (action.includes('DELETED')) return 'bg-red-100 text-red-700';
    if (action === 'LOGIN') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Mobile User Card Component
  const UserCard = ({ user }) => {
    const isExpanded = expandedUser === user._id;
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const isCurrentUser = user._id === currentUser?._id; // ✅ Check if it's current user

    return (
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden mb-3">
        <div className="p-4">
          <div
            className="flex items-start justify-between mb-3"
            onClick={() => setExpandedUser(isExpanded ? null : user._id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 text-base truncate">
                  {user.name}
                </h4>
                {isCurrentUser && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                    YOU
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>

              {/* Role & Status Badges */}
              <div className="flex items-center gap-2 mt-2">
                {/* Role Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrentUser) {
                        showError('You cannot change your own role');
                        return;
                      }
                      setShowRoleDropdown(!showRoleDropdown);
                    }}
                    disabled={isCurrentUser}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isCurrentUser ? 'opacity-60 cursor-not-allowed' : ''
                    } ${
                      user.role === 'admin'
                        ? 'bg-linear-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isCurrentUser ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : user.role === 'admin' ? (
                      <Crown className="h-3.5 w-3.5" />
                    ) : (
                      <UserIcon className="h-3.5 w-3.5" />
                    )}
                    <span>{user.role.toUpperCase()}</span>
                    {!isCurrentUser && <ChevronDown className="h-3 w-3" />}
                  </button>

                  {showRoleDropdown && !isCurrentUser && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowRoleDropdown(false)}
                      />
                      <div className="absolute z-20 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateUserRole(user._id, 'user');
                            setShowRoleDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <UserIcon className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">User</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateUserRole(user._id, 'admin');
                            setShowRoleDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors border-t border-gray-100"
                        >
                          <Crown className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-600">
                            Admin
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Status Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCurrentUser) {
                      showError('You cannot deactivate your own account');
                      return;
                    }
                    toggleUserStatus(user._id, user.isActive);
                  }}
                  disabled={isCurrentUser}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isCurrentUser ? 'opacity-60 cursor-not-allowed' : ''
                  } ${
                    user.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {user.isActive ? (
                    <UserCheck className="h-3.5 w-3.5" />
                  ) : (
                    <UserX className="h-3.5 w-3.5" />
                  )}
                  {user.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
            <ChevronRight
              className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </div>

          {isExpanded && (
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Last Login</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Never'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Account Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(user._id);
            }}
            disabled={isCurrentUser}
            className={`p-2 rounded-full transition-all ${
              isCurrentUser
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-red-600 hover:bg-red-50'
            }`}
            title={isCurrentUser ? 'Cannot delete yourself' : 'Delete User'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:mb-8 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-indigo-600" />
          <h1 className="sm:text-3xl text-xl font-bold text-gray-900">
            Admin Panel
          </h1>
        </div>
        <p className="text-gray-600">
          Manage users and monitor system activity
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 sm:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="inline h-5 w-5 mr-2" />
          Users
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 sm:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'activity'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="inline h-5 w-5 mr-2" />
          Activity
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 sm:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'stats'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="inline h-5 w-5 mr-2" />
          Stats
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
              {/* Mobile View */}
              <div className="lg:hidden space-y-2">
                {users.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Last Login
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Created
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <DesktopUserRow
                          key={user._id}
                          user={user}
                          currentUserId={currentUser?._id}
                          updateUserRole={updateUserRole}
                          toggleUserStatus={toggleUserStatus}
                          deleteUser={deleteUser}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Activity Logs Tab - Same as before */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div
                  key={log._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div
                    onClick={() =>
                      setExpandedLog(expandedLog === log._id ? null : log._id)
                    }
                    className="px-4 sm:px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${getActionColor(log.action)}`}
                      >
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="font-medium text-gray-900 truncate">
                            {log.userName}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 truncate">
                            {log.userEmail}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {log.action.replace(/_/g, ' ')}
                          {log.itemName && (
                            <span className="font-medium">
                              {' '}
                              • {log.itemName}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {expandedLog === log._id ? (
                      <ChevronUp className="h-5 w-5 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0" />
                    )}
                  </div>

                  {expandedLog === log._id && log.changes && (
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Changes:
                      </h4>
                      <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats Tab - Same as before */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              {/* User Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Total Users
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                        {stats.users.total}
                      </p>
                    </div>
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                  </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Active</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                        {stats.users.active}
                      </p>
                    </div>
                    <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Admins</p>
                      <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                        {stats.users.admins}
                      </p>
                    </div>
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                  </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Today</p>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
                        {stats.activity.today}
                      </p>
                    </div>
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Activity by Type */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Activity by Type
                </h3>
                <div className="space-y-3">
                  {stats.activity.byType.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${getActionColor(item._id)}`}
                        >
                          {getActionIcon(item._id)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {item._id.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {stats.activity.recent.map((log) => (
                    <div
                      key={log._id}
                      className="flex items-center gap-3 sm:gap-4 py-2 border-b border-gray-100 last:border-0"
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${getActionColor(log.action)}`}
                      >
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {log.userName}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {log.action.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Desktop User Row Component with Dropdown
const DesktopUserRow = ({
  user,
  currentUserId,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const isCurrentUser = user._id === currentUserId;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{user.name}</span>
            {isCurrentUser && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                YOU
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative inline-block">
          <button
            onClick={() => {
              if (isCurrentUser) {
                showError('You cannot change your own role');
                return;
              }
              setShowRoleDropdown(!showRoleDropdown);
            }}
            disabled={isCurrentUser}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isCurrentUser ? 'opacity-60 cursor-not-allowed' : ''
            } ${
              user.role === 'admin'
                ? 'bg-linear-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isCurrentUser ? (
              <Lock className="h-4 w-4" />
            ) : user.role === 'admin' ? (
              <Crown className="h-4 w-4" />
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
            <span>{user.role.toUpperCase()}</span>
            {!isCurrentUser && <ChevronDown className="h-3 w-3" />}
          </button>

          {showRoleDropdown && !isCurrentUser && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowRoleDropdown(false)}
              />
              <div className="absolute z-20 mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => {
                    updateUserRole(user._id, 'user');
                    setShowRoleDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">User</span>
                </button>
                <button
                  onClick={() => {
                    updateUserRole(user._id, 'admin');
                    setShowRoleDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors border-t border-gray-100"
                >
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-600">Admin</span>
                </button>
              </div>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => {
            if (isCurrentUser) {
              showError('You cannot deactivate your own account');
              return;
            }
            toggleUserStatus(user._id, user.isActive);
          }}
          disabled={isCurrentUser}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isCurrentUser ? 'opacity-60 cursor-not-allowed' : ''
          } ${
            user.isActive
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          {user.isActive ? (
            <UserCheck className="h-4 w-4" />
          ) : (
            <UserX className="h-4 w-4" />
          )}
          {user.isActive ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {user.lastLogin
          ? new Date(user.lastLogin).toLocaleDateString()
          : 'Never'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => deleteUser(user._id)}
          disabled={isCurrentUser}
          className={`p-2 rounded-lg transition-all ${
            isCurrentUser
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-red-600 hover:bg-red-50'
          }`}
          title={isCurrentUser ? 'Cannot delete yourself' : 'Delete User'}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

export default AdminPanel;
