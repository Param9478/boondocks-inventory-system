const express = require('express');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// All routes require authentication AND admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
});

// Update user (make admin, deactivate, etc.)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      action: 'USER_UPDATED',
      changes: { userId: id, role, isActive },
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(id);

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      action: 'USER_DELETED',
      changes: { deletedUser: user.email },
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
    });
  }
});

// Get activity logs (with filters)
router.get('/activity-logs', async (req, res) => {
  try {
    const { userId, action, limit = 100, page = 1 } = req.query;

    const query = {};
    if (userId) query.user = userId;
    if (action) query.action = action;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('user', 'name email');

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs',
    });
  }
});

// Get activity stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivity = await ActivityLog.countDocuments({
      createdAt: { $gte: today },
    });

    const recentActivity = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');

    // Activity by action type
    const activityByType = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers,
          inactive: totalUsers - activeUsers,
        },
        activity: {
          today: todayActivity,
          byType: activityByType,
          recent: recentActivity,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
    });
  }
});

module.exports = router;
