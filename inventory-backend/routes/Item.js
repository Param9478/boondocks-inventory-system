const express = require('express');
const Item = require('../models/Item');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
    });
  }
});

// Create item
router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body);

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      action: 'ITEM_CREATED',
      itemName: item.name,
      itemId: item._id,
      changes: { item: req.body },
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating item',
    });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const oldItem = await Item.findById(req.params.id);
    if (!oldItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Track what changed
    const changes = {};
    Object.keys(req.body).forEach((key) => {
      if (oldItem[key] !== req.body[key]) {
        changes[key] = {
          old: oldItem[key],
          new: req.body[key],
        };
      }
    });

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      action: 'ITEM_UPDATED',
      itemName: item.name,
      itemId: item._id,
      changes,
    });

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item',
    });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      action: 'ITEM_DELETED',
      itemName: item.name,
      itemId: item._id,
      changes: { deletedItem: item.toObject() },
    });

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
    });
  }
});

module.exports = router;
