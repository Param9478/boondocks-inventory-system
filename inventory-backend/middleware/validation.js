const { body, param, validationResult } = require('express-validator');

// Validation result checker
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Item validation rules
const itemValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Item name is required')
      .isLength({ max: 100 })
      .withMessage('Item name cannot exceed 100 characters'),

    body('quantity')
      .notEmpty()
      .withMessage('Quantity is required')
      .isFloat({ min: 0 })
      .withMessage('Quantity must be a positive number'),

    body('unit')
      .notEmpty()
      .withMessage('Unit is required')
      .isIn([
        'kg',
        'lb',
        'g',
        'oz',
        'L',
        'ml',
        'gal',
        'box',
        'case',
        'each',
        'dozen',
      ])
      .withMessage('Invalid unit'),

    body('minStock')
      .notEmpty()
      .withMessage('Minimum stock is required')
      .isFloat({ min: 0 })
      .withMessage('Minimum stock must be a positive number'),

    body('supplier')
      .notEmpty()
      .withMessage('Supplier is required')
      .isIn([
        'Sysco',
        'Saputo',
        'GFS',
        'US Foods',
        'Local Farm',
        'Costco',
        'Other',
      ])
      .withMessage('Invalid supplier'),

    body('category')
      .optional()
      .isIn([
        'Freezer',
        'Cooler',
        'Sauces',
        'Dry Goods',
        'Produce',
        'Meat',
        'Dairy',
        'Frozen',
        'Beverages',
        'Condiments',
        'Baking',
        'Seafood',
        'Other',
      ])
      .withMessage('Invalid category'),

    body('location')
      .optional()
      .isIn([
        'Main Storage',
        'Walk-in Cooler',
        'Walk-in Freezer',
        'Dry Storage',
        'Bar',
        'Kitchen Prep',
      ])
      .withMessage('Invalid location'),

    body('costPerUnit')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Cost per unit must be a positive number'),

    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid expiry date format')
      .custom((value) => {
        if (value && new Date(value) <= new Date()) {
          throw new Error('Expiry date must be in the future');
        }
        return true;
      }),

    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),

    validate,
  ],

  update: [
    body('quantity')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Quantity must be a positive number'),

    body('minStock')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum stock must be a positive number'),

    body('costPerUnit')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Cost per unit must be a positive number'),

    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid expiry date format')
      .custom((value) => {
        if (value && new Date(value) <= new Date()) {
          throw new Error('Expiry date must be in the future');
        }
        return true;
      }),

    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),

    validate,
  ],

  idParam: [param('id').isMongoId().withMessage('Invalid item ID'), validate],
};

module.exports = { itemValidation };
