const express = require('express');
const router = express.Router();
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

// Statistics and alerts routes (must be before /:id)
router.get('/stats', getInventoryStats);
router.get('/alerts/low-stock', getLowStockItems);
router.get('/alerts/expiring-soon', getExpiringSoonItems);

// Nightly list endpoint
router.get('/nightly-list', getNightlyList);

// Bulk operations
router.post('/bulk-update', bulkUpdateItems);
router.post('/end-of-day-count', endOfDayCount);

// CRUD routes
router.route('/').get(getAllItems).post(itemValidation.create, createItem);

router
  .route('/:id')
  .get(itemValidation.idParam, getItemById)
  .put([...itemValidation.idParam, ...itemValidation.update], updateItem)
  .delete(itemValidation.idParam, deleteItem);

module.exports = router;
