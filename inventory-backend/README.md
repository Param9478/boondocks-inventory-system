# 🍽️ Boondocks Inventory - Backend API

Professional Express.js + MongoDB backend with best practices, validation, error handling, and advanced features.

## 🚀 Features

### ✨ Core Features
- ✅ **RESTful API** - Clean, organized endpoints
- ✅ **MongoDB Integration** - Mongoose with validations
- ✅ **Error Handling** - Centralized error management
- ✅ **Input Validation** - Express-validator middleware
- ✅ **Soft Deletes** - Items marked inactive, not deleted
- ✅ **Virtual Fields** - totalValue, stockStatus, daysUntilExpiry
- ✅ **Advanced Queries** - Search, filter, sort, pagination
- ✅ **Statistics API** - Real-time inventory analytics
- ✅ **Bulk Operations** - Update multiple items at once

### 🔒 Security & Best Practices
- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Configured cross-origin requests
- ✅ **Compression** - Response compression
- ✅ **Morgan** - HTTP request logging
- ✅ **Environment Variables** - Config via .env
- ✅ **Error Stack Traces** - Only in development
- ✅ **Graceful Shutdown** - Proper process handling

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── itemController.js    # Business logic
├── middleware/
│   ├── errorHandler.js      # Error handling
│   └── validation.js        # Input validation
├── models/
│   └── Item.js              # Mongoose schema
├── routes/
│   └── itemRoutes.js        # API routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore
├── package.json            # Dependencies
└── server.js               # Entry point
```

## 🔧 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
PORT=3002
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
```

### 3. Start Server

**Development (with auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run at: `http://localhost:3002`

## 📡 API Endpoints

### Items CRUD

#### Get All Items
```http
GET /api/items
```

**Query Parameters:**
- `category` - Filter by category
- `supplier` - Filter by supplier
- `status` - Filter by stock status (critical/low/stable)
- `search` - Search by name
- `sort` - Sort fields (e.g., name,-createdAt)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

#### Get Single Item
```http
GET /api/items/:id
```

#### Create Item
```http
POST /api/items
Content-Type: application/json

{
  "name": "Tomatoes",
  "quantity": 50,
  "unit": "kg",
  "minStock": 20,
  "supplier": "Sysco",
  "category": "Produce",
  "location": "Walk-in Cooler",
  "costPerUnit": 2.50,
  "expiryDate": "2024-03-15",
  "notes": "Organic"
}
```

#### Update Item
```http
PUT /api/items/:id
Content-Type: application/json

{
  "quantity": 30,
  "costPerUnit": 2.75
}
```

#### Delete Item (Soft Delete)
```http
DELETE /api/items/:id
```

### Statistics & Alerts

#### Get Inventory Statistics
```http
GET /api/items/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalItems": 45,
    "totalValue": 12450.50,
    "lowStock": 8,
    "stable": 37,
    "byCategory": {...},
    "bySupplier": {...},
    "expiringWithin7Days": 3
  }
}
```

#### Get Low Stock Items
```http
GET /api/items/alerts/low-stock
```

#### Get Expiring Soon Items
```http
GET /api/items/alerts/expiring-soon?days=7
```

### Bulk Operations

#### Bulk Update Items
```http
POST /api/items/bulk-update
Content-Type: application/json

{
  "updates": [
    {
      "id": "item_id_1",
      "quantity": 100
    },
    {
      "id": "item_id_2",
      "quantity": 50,
      "costPerUnit": 3.50
    }
  ]
}
```

## 📊 Data Model

### Item Schema

```javascript
{
  name: String,              // Required
  quantity: Number,          // Required, min: 0
  unit: String,              // Required, enum
  minStock: Number,          // Required, min: 0
  supplier: String,          // Required, enum
  category: String,          // Required, enum
  location: String,          // Enum, default: "Main Storage"
  costPerUnit: Number,       // Optional, min: 0
  expiryDate: Date,          // Optional, must be future
  notes: String,             // Optional, max: 500 chars
  isActive: Boolean,         // Default: true
  lastRestocked: Date,       // Auto-updated
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

### Virtual Fields

```javascript
// Computed fields (not stored in DB)
totalValue          // quantity * costPerUnit
stockStatus         // critical / low / stable
daysUntilExpiry     // Days until expiry date
```

### Valid Enums

**Units:**
```
kg, lb, g, oz, L, ml, gal, box, case, each, dozen
```

**Suppliers:**
```
Sysco, Saputo, GFS, US Foods, Local Farm, Costco, Other
```

**Categories:**
```
Dry Goods, Produce, Meat, Dairy, Frozen, Beverages,
Condiments, Baking, Seafood, Other
```

**Locations:**
```
Main Storage, Walk-in Cooler, Walk-in Freezer,
Dry Storage, Bar, Kitchen Prep
```

## 🔐 Validation Rules

### Create Item
- ✅ All required fields must be present
- ✅ Quantity and minStock must be >= 0
- ✅ Unit, supplier, category must be valid enums
- ✅ Expiry date must be in the future
- ✅ Notes max 500 characters

### Update Item
- ✅ All fields optional
- ✅ Same validation rules as create
- ✅ Invalid fields are rejected

## 🛡️ Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Stack trace (development only)"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## 📝 Example Usage

### Using Axios (Frontend)

```javascript
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3002';

// Get all items
const items = await axios.get('/api/items');

// Create item
const newItem = await axios.post('/api/items', {
  name: 'Chicken Breast',
  quantity: 25,
  unit: 'kg',
  minStock: 10,
  supplier: 'Sysco',
  category: 'Meat'
});

// Update item
await axios.put(`/api/items/${id}`, {
  quantity: 30
});

// Delete item
await axios.delete(`/api/items/${id}`);

// Get statistics
const stats = await axios.get('/api/items/stats');
```

### Using cURL

```bash
# Get all items
curl http://localhost:3002/api/items

# Create item
curl -X POST http://localhost:3002/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tomatoes",
    "quantity": 50,
    "unit": "kg",
    "minStock": 20,
    "supplier": "Sysco",
    "category": "Produce"
  }'

# Update item
curl -X PUT http://localhost:3002/api/items/ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity": 30}'

# Get statistics
curl http://localhost:3002/api/items/stats
```

## 🔧 Advanced Features

### 1. Search & Filter
```javascript
// Search by name
GET /api/items?search=tomato

// Filter by category
GET /api/items?category=Produce

// Filter by supplier
GET /api/items?supplier=Sysco

// Filter by status
GET /api/items?status=low

// Combine filters
GET /api/items?category=Produce&status=low&search=tom
```

### 2. Sorting
```javascript
// Sort by name (ascending)
GET /api/items?sort=name

// Sort by quantity (descending)
GET /api/items?sort=-quantity

// Multiple sorts
GET /api/items?sort=category,-quantity
```

### 3. Pagination
```javascript
// Page 1, 20 items
GET /api/items?page=1&limit=20

// Page 2, 50 items
GET /api/items?page=2&limit=50
```

## 🚀 Performance Optimization

- ✅ **Database Indexing** - Indexed fields for faster queries
- ✅ **Compression** - Gzip response compression
- ✅ **Connection Pooling** - Mongoose handles connections
- ✅ **Pagination** - Limit large result sets
- ✅ **Virtual Fields** - Computed on-the-fly, not stored

## 🐛 Troubleshooting

**Server won't start?**
```bash
# Check if port is in use
lsof -i :3002

# Kill process if needed
kill -9 PID
```

**Database connection error?**
- Check MongoDB URI in .env
- Ensure MongoDB is running
- Verify network access

**Validation errors?**
- Check request body format
- Verify all required fields
- Check enum values are valid

**CORS errors?**
- Verify CLIENT_URL in .env
- Check frontend port matches

## 📦 Dependencies

```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables",
  "express-validator": "Input validation",
  "morgan": "HTTP logging",
  "helmet": "Security headers",
  "compression": "Response compression",
  "nodemon": "Auto-restart (dev)"
}
```

## 🌟 Future Enhancements

- [ ] Authentication & authorization
- [ ] File upload for images
- [ ] Email notifications
- [ ] WebSocket for real-time updates
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests
- [ ] Docker support

## 📄 License

MIT License

---

**Made with ❤️ for Boondocks Restaurant**

**Start the server: `npm run dev`**
