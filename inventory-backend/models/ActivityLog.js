const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: [
        'LOGIN',
        'LOGOUT',
        'ITEM_CREATED',
        'ITEM_UPDATED',
        'ITEM_DELETED',
        'USER_CREATED',
        'USER_UPDATED',
        'USER_DELETED',
      ],
      required: true,
    },
    itemName: {
      type: String,
      default: null,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
