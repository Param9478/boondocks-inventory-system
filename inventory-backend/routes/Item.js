const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const ActivityLog = require('../models/ActivityLog');

// Controllers (Jo tusi pehla use kar rahe si)
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
  getExpiringSoonItems,
  getInventoryStats,
  bulkUpdateItems,
  getNightlyList,
  endOfDayCount,
} = require('../controllers/itemController');

const { itemValidation } = require('../middleware/validation');

// --- 1. Statistics & Alerts (Must be before /:id) ---
router.get('/stats', getInventoryStats);
router.get('/alerts/low-stock', getLowStockItems);
router.get('/alerts/expiring-soon', getExpiringSoonItems);

// --- 2. Nightly Operations ---
// Order is important: 'nightly-list' must come before '/:id'
router.get('/nightly-list', getNightlyList);
router.post('/end-of-day-count', endOfDayCount);

// --- 3. Bulk Operations ---
router.post('/bulk-update', bulkUpdateItems);

// --- 4. Main CRUD Routes (Base: /api/items) ---

// Get All Items & Create Item
router
  .route('/')
  .get(getAllItems)
  .post(itemValidation.create, async (req, res, next) => {
    // Note: If you want Activity Logs here, ensure createItem controller
    // handles it, or use this inline logic:
    try {
      // Calling your existing controller logic or adding logs here
      // Recommendation: Add the ActivityLog logic inside your itemController.js
      // for a cleaner file, but for now, it's integrated.
      return createItem(req, res);
    } catch (err) {
      next(err);
    }
  });

// --- 5. Specific Item Operations (:id) ---
router
  .route('/:id')
  .get(itemValidation.idParam, getItemById)
  .put(
    [...itemValidation.idParam, ...itemValidation.update],
    async (req, res) => {
      try {
        // Logic for tracking changes and logging (as we discussed)
        const oldItem = await Item.findById(req.params.id);
        if (!oldItem)
          return res
            .status(404)
            .json({ success: false, message: 'Item not found' });

        // Run the update controller
        // We let the controller do the update, but we log the action
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });

        // Track changes for ActivityLog
        const changes = {};
        Object.keys(req.body).forEach((key) => {
          if (oldItem[key] !== req.body[key]) {
            changes[key] = { old: oldItem[key], new: req.body[key] };
          }
        });

        // Log the activity
        await ActivityLog.create({
          user: req.user._id,
          userName: req.user.name,
          userEmail: req.user.email,
          action: 'ITEM_UPDATED',
          itemName: item.name,
          itemId: item._id,
          changes,
        });

        res.json({ success: true, data: item });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
  )
  .delete(itemValidation.idParam, async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item)
        return res
          .status(404)
          .json({ success: false, message: 'Item not found' });

      await Item.findByIdAndDelete(req.params.id);

      // Log deletion
      await ActivityLog.create({
        user: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        action: 'ITEM_DELETED',
        itemName: item.name,
        itemId: item._id,
        changes: { deletedItem: item.toObject() },
      });

      res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

module.exports = router;
