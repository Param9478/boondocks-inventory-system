const Item = require('../models/Item');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// Master list defined in backend

// const MASTER_NIGHTLY_LIST = [
//   { name: 'Dry ribs', category: 'Freezer' },
//   { name: 'Onion rings', category: 'Freezer' },
//   { name: 'Cactus', category: 'Freezer' },
//   { name: 'Potato skins', category: 'Freezer' },
//   { name: 'Shrimp basket', category: 'Freezer' },
//   { name: 'Green pepper', category: 'Cooler' },
//   { name: 'Red pepper', category: 'Cooler' },
//   { name: 'Red onions', category: 'Cooler' },
//   { name: 'Tomatoes', category: 'Cooler' },
//   { name: 'Chipotle', category: 'Sauces' },
//   { name: 'Dill', category: 'Sauces' },
//   { name: 'Ranch', category: 'Sauces' },
//   { name: 'Ceaser sauce', category: 'Sauces' },
//   { name: 'BBQ', category: 'Sauces' },
//   { name: 'Mayo', category: 'Sauces' },
// ];

// @desc    Get all items
// @route   GET /api/items
// @access  Public

const getAllItems = asyncHandler(async (req, res) => {
  const { category, supplier, status, search, sort, limit, page } = req.query;

  let query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (supplier) {
    query.supplier = supplier;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  let itemsQuery = Item.find(query);

  if (sort) {
    const sortBy = sort.split(',').join(' ');
    itemsQuery = itemsQuery.sort(sortBy);
  } else {
    itemsQuery = itemsQuery.sort('-createdAt');
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 100;
  const skip = (pageNum - 1) * limitNum;

  itemsQuery = itemsQuery.skip(skip).limit(limitNum);

  const items = await itemsQuery;

  let filteredItems = items;
  if (status) {
    filteredItems = items.filter((item) => item.stockStatus === status);
  }

  const total = await Item.countDocuments(query);

  res.status(200).json({
    success: true,
    count: filteredItems.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: filteredItems,
  });
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item || !item.isActive) {
    return next(new AppError('Item not found', 404));
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Create new item
// @route   POST /api/items
// @access  Public
const createItem = asyncHandler(async (req, res) => {
  const item = await Item.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: item,
  });
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Public
const updateItem = asyncHandler(async (req, res, next) => {
  let item = await Item.findById(req.params.id);

  if (!item || !item.isActive) {
    return next(new AppError('Item not found', 404));
  }

  Object.keys(req.body).forEach((key) => {
    item[key] = req.body[key];
  });

  await item.save();

  res.status(200).json({
    success: true,
    message: 'Item updated successfully',
    data: item,
  });
});

// @desc    Delete item (soft delete)
// @route   DELETE /api/items/:id
// @access  Public
const deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item || !item.isActive) {
    return next(new AppError('Item not found', 404));
  }

  item.isActive = false;
  await item.save();

  res.status(200).json({
    success: true,
    message: 'Item deleted successfully',
  });
});

// @desc    Get low stock items
// @route   GET /api/items/alerts/low-stock
// @access  Public
const getLowStockItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ isActive: true });

  const lowStockItems = items.filter((item) => item.quantity <= item.minStock);

  res.status(200).json({
    success: true,
    count: lowStockItems.length,
    data: lowStockItems,
  });
});

// @desc    Get expiring soon items
// @route   GET /api/items/alerts/expiring-soon
// @access  Public
const getExpiringSoonItems = asyncHandler(async (req, res) => {
  const daysThreshold = parseInt(req.query.days, 10) || 7;
  const today = new Date();
  const futureDate = new Date(
    today.getTime() + daysThreshold * 24 * 60 * 60 * 1000,
  );

  const items = await Item.find({
    isActive: true,
    expiryDate: {
      $gte: today,
      $lte: futureDate,
    },
  }).sort('expiryDate');

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

// @desc    Get inventory statistics
// @route   GET /api/items/stats
// @access  Public
const getInventoryStats = asyncHandler(async (req, res) => {
  const items = await Item.find({ isActive: true });

  const stats = {
    totalItems: items.length,
    totalValue: items.reduce((sum, item) => sum + item.totalValue, 0),
    lowStock: items.filter(
      (item) => item.stockStatus === 'low' || item.stockStatus === 'critical',
    ).length,
    stable: items.filter((item) => item.stockStatus === 'stable').length,
    byCategory: {},
    bySupplier: {},
    expiringWithin7Days: items.filter((item) => {
      if (!item.expiryDate) return false;
      const daysUntil = item.daysUntilExpiry;
      return daysUntil !== null && daysUntil <= 7 && daysUntil >= 0;
    }).length,
  };

  items.forEach((item) => {
    if (!stats.byCategory[item.category]) {
      stats.byCategory[item.category] = {
        count: 0,
        totalValue: 0,
      };
    }
    stats.byCategory[item.category].count++;
    stats.byCategory[item.category].totalValue += item.totalValue;
  });

  items.forEach((item) => {
    if (!stats.bySupplier[item.supplier]) {
      stats.bySupplier[item.supplier] = {
        count: 0,
        totalValue: 0,
      };
    }
    stats.bySupplier[item.supplier].count++;
    stats.bySupplier[item.supplier].totalValue += item.totalValue;
  });

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// @desc    Bulk update items
// @route   POST /api/items/bulk-update
// @access  Public
const bulkUpdateItems = asyncHandler(async (req, res, next) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return next(new AppError('Invalid bulk update data', 400));
  }

  const results = await Promise.all(
    updates.map(async ({ id, ...updateData }) => {
      try {
        const item = await Item.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
        return { success: true, id, data: item };
      } catch (error) {
        return { success: false, id, error: error.message };
      }
    }),
  );

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  res.status(200).json({
    success: true,
    message: `Bulk update completed: ${successful} successful, ${failed} failed`,
    results,
  });
});

// @desc    Get nightly count list (master list + DB items)
// @route   GET /api/items/nightly-list
// @access  Public
// const getNightlyList = asyncHandler(async (req, res) => {
//   // Get all active items from DB
//   const dbItems = await Item.find({ isActive: true });

//   // Merge with master list
//   const nightlyList = MASTER_NIGHTLY_LIST.map((masterItem) => {
//     // Check if item exists in DB
//     const dbMatch = dbItems.find(
//       (dbItem) => dbItem.name.toLowerCase() === masterItem.name.toLowerCase(),
//     );

//     if (dbMatch) {
//       // Return existing DB item with MASTER LIST category (for proper display)
//       return {
//         _id: dbMatch._id,
//         name: dbMatch.name,
//         category: masterItem.category, // Use master list category, not DB category
//         quantity: dbMatch.quantity,
//         minStock: dbMatch.minStock,
//         unit: dbMatch.unit,
//         supplier: dbMatch.supplier,
//         costPerUnit: dbMatch.costPerUnit,
//         isActive: dbMatch.isActive,
//         isInDatabase: true,
//       };
//     } else {
//       // Return placeholder for new item
//       return {
//         _id: `temp-${masterItem.name.replace(/\s+/g, '-')}`,
//         name: masterItem.name,
//         category: masterItem.category,
//         quantity: 0,
//         minStock: 5,
//         unit: 'each',
//         isActive: true,
//         isInDatabase: false,
//         isPlaceholder: true,
//       };
//     }
//   });

//   // ✅ ADD: Include all other DB items that are NOT in master list
//   const masterNames = MASTER_NIGHTLY_LIST.map((m) => m.name.toLowerCase());
//   const otherDbItems = dbItems
//     .filter((dbItem) => !masterNames.includes(dbItem.name.toLowerCase()))
//     .map((dbItem) => ({
//       _id: dbItem._id,
//       name: dbItem.name,
//       category: dbItem.category,
//       quantity: dbItem.quantity,
//       minStock: dbItem.minStock,
//       unit: dbItem.unit,
//       supplier: dbItem.supplier,
//       costPerUnit: dbItem.costPerUnit,
//       location: dbItem.location,
//       expiryDate: dbItem.expiryDate,
//       notes: dbItem.notes,
//       isActive: dbItem.isActive,
//       isInDatabase: true,
//     }));

//   // Combine: master list + other items
//   const allItems = [...nightlyList, ...otherDbItems];

//   res.status(200).json({
//     success: true,
//     count: allItems.length,
//     data: allItems,
//   });
// });

const getNightlyList = asyncHandler(async (req, res) => {
  // Sirf nightly items database ton chako
  const items = await Item.find({ isNightly: true, isActive: true });
  res.status(200).json({ success: true, data: items });
});

// @desc    End of day count
// @route   POST /api/items/end-of-day-count
// @access  Public
// const endOfDayCount = asyncHandler(async (req, res) => {
//   const { counts } = req.body;

//   if (!Array.isArray(counts) || counts.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid count data',
//     });
//   }

//   const results = [];

//   for (const countData of counts) {
//     try {
//       const { itemId, newQuantity, name, category } = countData;
//       let item;

//       // Check if temp ID (new item)
//       if (itemId && itemId.startsWith('temp-')) {
//         // Check if item already exists by name
//         item = await Item.findOne({
//           name: { $regex: new RegExp(`^${name}$`, 'i') },
//           isActive: true,
//         });

//         if (!item) {
//           // Map categories to backend allowed values
//           const categoryMap = {
//             Freezer: 'Frozen',
//             Cooler: 'Produce',
//             Sauces: 'Condiments',
//           };

//           // Create new item with proper validation-compliant values
//           item = await Item.create({
//             name: name,
//             category: categoryMap[category] || 'Other',
//             quantity: parseFloat(newQuantity),
//             unit: 'each', // Backend validation requires specific units
//             minStock: 5,
//             supplier: 'Other', // Backend validation requires specific suppliers
//             isActive: true,
//           });
//           results.push({ success: true, itemId, item, action: 'created' });
//         } else {
//           // Update existing
//           item.quantity = parseFloat(newQuantity);
//           await item.save();
//           results.push({ success: true, itemId, item, action: 'updated' });
//         }
//       } else {
//         // Update existing item by ID
//         item = await Item.findByIdAndUpdate(
//           itemId,
//           {
//             quantity: parseFloat(newQuantity),
//             lastRestocked: new Date(),
//           },
//           { new: true, runValidators: true },
//         );

//         if (item) {
//           results.push({ success: true, itemId, item, action: 'updated' });
//         } else {
//           results.push({
//             success: false,
//             itemId,
//             error: 'Item not found',
//           });
//         }
//       }
//     } catch (error) {
//       results.push({
//         success: false,
//         itemId: countData.itemId,
//         error: error.message,
//       });
//     }
//   }

//   const successful = results.filter((r) => r.success).length;
//   const failed = results.filter((r) => !r.success).length;
//   const created = results.filter((r) => r.action === 'created').length;
//   const updated = results.filter((r) => r.action === 'updated').length;

//   res.status(200).json({
//     success: true,
//     message: `Nightly count: ${created} created, ${updated} updated, ${failed} failed`,
//     results,
//     summary: {
//       successful,
//       failed,
//       created,
//       updated,
//     },
//   });
// });

const endOfDayCount = asyncHandler(async (req, res) => {
  const { counts } = req.body;

  if (!Array.isArray(counts) || counts.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid count data' });
  }

  const results = [];

  for (const countData of counts) {
    try {
      const { itemId, newQuantity } = countData;

      // Hun sirf ID naal update karo, kyunki item DB ch pehla hi hai
      const item = await Item.findByIdAndUpdate(
        itemId,
        {
          quantity: parseFloat(newQuantity),
          lastRestocked: new Date(),
        },
        { new: true, runValidators: true },
      );

      if (item) {
        results.push({ success: true, itemId, action: 'updated' });
      } else {
        results.push({ success: false, itemId, error: 'Item not found' });
      }
    } catch (error) {
      results.push({
        success: false,
        itemId: countData.itemId,
        error: error.message,
      });
    }
  }

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  res.status(200).json({
    success: true,
    message: `Nightly count completed: ${successful} success, ${failed} failed`,
    summary: { successful, failed, updated: successful, created: 0 },
  });
});
getNightlyItems = asyncHandler(async (req, res) => {
  // Sirf nightly items database ton chako
  const items = await Item.find({ isNightly: true, isActive: true });
  res.status(200).json({ success: true, data: items });
});

// itemController.js
// seedNightlyItems = asyncHandler(async (req, res) => {
//   const masterItems = [
//     {
//       name: 'Wings',
//       category: 'Freezer',
//       unit: 'case',
//       supplier: 'Sysco',
//       isNightly: true,
//       minStock: 1,
//     },
//     {
//       name: 'Grilled Chicken',
//       category: 'Freezer',
//       unit: 'each',
//       supplier: 'Sysco',
//       isNightly: true,
//       minStock: 1,
//     },
//     {
//       name: 'Peppered Chicken',
//       category: 'Freezer',
//       unit: 'each',
//       supplier: 'Sysco',
//       isNightly: true,
//       minStock: 1,
//     },
//     {
//       name: 'Pepperoni',
//       category: 'Cooler',
//       unit: 'each',
//       supplier: 'Saputo',
//       isNightly: true,
//       minStock: 5,
//     },
//     {
//       name: 'Sausage',
//       category: 'Cooler',
//       unit: 'each',
//       supplier: 'Other',
//       isNightly: true,
//       minStock: 2,
//     },
//     {
//       name: 'Pizza Beef',
//       category: 'Cooler',
//       unit: 'each',
//       supplier: 'Other',
//       isNightly: true,
//       minStock: 2,
//     },
//     {
//       name: 'Turkey',
//       category: 'Cooler',
//       unit: 'each',
//       supplier: 'Sysco',
//       isNightly: true,
//       minStock: 2,
//     },
//     {
//       name: 'Roast Beef',
//       category: 'Cooler',
//       unit: 'each',
//       supplier: 'Sysco',
//       isNightly: true,
//       minStock: 2,
//     },
//     {
//       name: 'Dry Ribs',
//       category: 'Freezer',
//       unit: 'case',
//       supplier: 'Sysco',
//       isNightly: true,
//       minStock: 1,
//     },
//     {
//       name: 'Bacon',
//       category: 'Freezer',
//       unit: 'case',
//       supplier: 'Sysco',
//       isNightly: true,
//       minStock: 1,
//     },
//     {
//       name: 'Burgers Beef',
//       category: 'Freezer',
//       unit: 'case',
//       supplier: 'Sysco',
//       isNightly: true,
//       minStock: 3,
//     },
//   ];

//   for (let item of masterItems) {
//     await Item.findOneAndUpdate(
//       { name: item.name },
//       {
//         $set: {
//           ...item,
//           isActive: true,
//           quantity: 0, // Shuru ch 0 stock
//         },
//       },
//       { upsert: true, new: true, runValidators: true },
//     );
//   }

//   res
//     .status(200)
//     .json({ success: true, message: 'Master items seeded successfully!' });
// });

module.exports = {
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
};
