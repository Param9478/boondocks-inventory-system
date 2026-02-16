const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: [
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
        ],
        message: '{VALUE} is not a valid unit',
      },
    },
    minStock: {
      type: Number,
      required: [true, 'Minimum stock level is required'],
      min: [0, 'Minimum stock cannot be negative'],
      default: 5,
    },
    supplier: {
      type: String,
      required: [true, 'Supplier is required'],
      enum: {
        values: [
          'Sysco',
          'Saputo',
          'GFS',
          'US Foods',
          'Local Farm',
          'Costco',
          'Other',
        ],
        message: '{VALUE} is not a valid supplier',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Freezer',
          'Cooler',
          'Sauces',
          'Dry Goods',
          'Meat',
          'Produce',
          'Dairy',
          'Frozen',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
      default: 'Other',
    },
    location: {
      type: String,
      enum: {
        values: [
          'Main Storage',
          'Walk-in Cooler',
          'Walk-in Freezer',
          'Dry Storage',
          'Bar',
          'Kitchen Prep',
        ],
        message: '{VALUE} is not a valid location',
      },
      default: 'Main Storage',
    },
    costPerUnit: {
      type: Number,
      min: [0, 'Cost per unit cannot be negative'],
      default: 0,
    },
    expiryDate: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNightly: {
      type: Boolean,
      default: false,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

itemSchema.virtual('totalValue').get(function () {
  return this.quantity * (this.costPerUnit || 0);
});

itemSchema.virtual('stockStatus').get(function () {
  if (this.quantity <= this.minStock * 0.5) return 'critical';
  if (this.quantity <= this.minStock) return 'low';
  return 'stable';
});

itemSchema.index({ name: 1 });
itemSchema.index({ category: 1 });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
