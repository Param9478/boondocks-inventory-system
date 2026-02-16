# 🍽️ Boondocks Restaurant Inventory Management System

A modern, beautiful, and feature-rich inventory tracking system built with React, Tailwind CSS, and advanced libraries.

![React](https://img.shields.io/badge/React-18.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎨 Beautiful Modern Design
- **Gradient Header** with glassmorphism effects
- **Animated Dashboard Cards** with Framer Motion
- **Smooth Transitions** and hover effects throughout
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Modern Color Scheme** - Indigo, Purple, Pink gradients

### 📊 Advanced Analytics Dashboard
- **Interactive Charts** with Recharts
  - Bar Chart - Value by Category
  - Pie Chart - Stock Status Distribution
  - Bar Chart - Top 10 Items by Value
  - Pie Chart - Supplier Distribution
- **Real-time Statistics**
  - Total Items, Low Stock, Stable Stock
  - Total Inventory Value
  - Categories Count
  - Expiring Soon Alerts
- **Detailed Category Breakdown** table

### 🔥 Core Features
- **Smart Inventory Tracking** - Real-time stock monitoring
- **Low Stock Alerts** - Automatic warnings with color-coded badges
- **Expiry Date Tracking** - Never miss expiring items
- **Multi-Supplier Management** - Track delivery schedules
- **Cost Tracking** - Monitor per-unit costs and total value
- **Inline Editing** - Quick updates without forms
- **Advanced Search** - Find items instantly by name or category
- **Smart Filtering** - Filter by status, category, supplier
- **Multiple Sort Options** - By name, quantity, status, or value

### 🎯 User Experience
- **React Hot Toast** - Beautiful toast notifications
- **Headless UI Modal** - Smooth modal animations
- **Framer Motion** - Fluid animations and transitions
- **Loading States** - Elegant loading indicators
- **Empty States** - Helpful empty state messages
- **Confirmation Dialogs** - Safe delete operations

### 📈 View Modes
1. **Table View** - Detailed inventory table with inline editing
2. **Analytics View** - Comprehensive charts and insights

## 🚀 Installation

### Prerequisites
- Node.js 14+ and npm/yarn
- Backend API running (see Backend Setup section)

### Step 1: Clone or Download Files
```bash
# Copy all files to your project directory
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `react` & `react-dom` - Core React libraries
- `axios` - HTTP client for API calls
- `lucide-react` - Beautiful icon library
- `react-hot-toast` - Toast notifications
- `recharts` - Chart library
- `framer-motion` - Animation library
- `@headlessui/react` - Unstyled accessible UI components
- `tailwindcss` - Utility-first CSS framework

### Step 3: Configure Tailwind CSS
The `tailwind.config.js` and `postcss.config.js` files are already included.

### Step 4: Update API Endpoints
In `App.jsx`, update the axios base URL if needed:

```javascript
// Example: If your API runs on a different port
axios.defaults.baseURL = 'http://localhost:5000';
```

### Step 5: Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── App.jsx                      # Main application component
├── index.css                    # Tailwind imports & custom styles
├── components/
│   ├── Header.jsx              # Top navigation header
│   ├── Dashboard.jsx           # Statistics dashboard
│   ├── QuickActions.jsx        # View switcher & actions
│   ├── AddItemModal.jsx        # Add item modal
│   ├── FilterBar.jsx           # Search, filter, sort controls
│   ├── InventoryTable.jsx      # Main inventory table
│   └── Analytics.jsx           # Analytics & charts view
└── utils/
    └── toast.js                # Toast notification utilities
```

## 🔌 Backend API Endpoints

Your backend should implement these endpoints:

```javascript
// GET all items
GET /api/items
Response: [
  {
    _id: "...",
    name: "Tomatoes",
    quantity: 50,
    unit: "kg",
    minStock: 20,
    supplier: "Sysco",
    category: "Produce",
    location: "Walk-in Cooler",
    costPerUnit: 2.50,
    expiryDate: "2024-03-15",
    notes: "Organic"
  },
  ...
]

// POST new item
POST /api/items
Body: {
  name, quantity, unit, minStock, supplier,
  category, location, costPerUnit, expiryDate, notes
}

// PUT update item
PUT /api/items/:id
Body: { quantity, minStock, costPerUnit, notes, ... }

// DELETE item
DELETE /api/items/:id
```

## 🎨 Customization

### Change Colors
Edit gradient colors in components:

```jsx
// Header.jsx
className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"

// Dashboard.jsx
const colorClasses = {
  blue: 'from-blue-500 to-indigo-600',
  red: 'from-red-500 to-pink-600',
  // Add your custom colors
}
```

### Change Restaurant Name
Update `components/Header.jsx`:
```jsx
<h1 className="text-2xl font-bold text-white tracking-tight">
  Your Restaurant Name
</h1>
```

### Add More Categories
Update `components/AddItemModal.jsx`:
```jsx
<option value="Your Category">Your Category</option>
```

### Customize Toast Notifications
Edit `utils/toast.js` to change toast appearance.

## 📊 Analytics Features

### Available Charts
1. **Value by Category** - Bar chart showing inventory value per category
2. **Stock Status** - Pie chart of Critical/Low/Stable items
3. **Top 10 Items** - Horizontal bar chart of highest value items
4. **Supplier Distribution** - Pie chart of items per supplier
5. **Category Breakdown** - Detailed table with value metrics

### Adding Custom Charts
Use Recharts to add more visualizations:

```jsx
import { LineChart, Line, ... } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={yourData}>
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

## 🔧 Backend Schema (MongoDB Example)

```javascript
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  minStock: { type: Number, required: true },
  supplier: { type: String, required: true },
  category: { type: String, default: 'Other' },
  location: { type: String, default: 'Main Storage' },
  costPerUnit: { type: Number, default: 0 },
  expiryDate: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## 🎯 Usage Tips

1. **Setting Min Stock Levels**: Set to quantity needed before next delivery
2. **Cost Per Unit**: Track to monitor total inventory value
3. **Expiry Dates**: Critical for perishables - items expiring within 7 days show warnings
4. **Notes**: Use for special handling, supplier contacts, or quality notes
5. **Categories**: Organize items logically for better analytics

## 🚀 Performance Optimization

- **Memoization**: Analytics use `useMemo` for expensive calculations
- **Lazy Loading**: Charts only render in Analytics view
- **Debounced Search**: Instant search without performance issues
- **Optimized Re-renders**: `useCallback` prevents unnecessary renders

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

## 🔐 Security Recommendations

- ✅ Implement authentication (JWT tokens)
- ✅ Validate all inputs on backend
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Add CORS protection
- ✅ Sanitize user inputs

## 🐛 Troubleshooting

**Charts not showing?**
- Ensure `recharts` is installed: `npm install recharts`
- Check browser console for errors

**Tailwind styles not working?**
- Verify `index.css` imports Tailwind directives
- Run `npm install -D tailwindcss postcss autoprefixer`
- Ensure `tailwind.config.js` content paths are correct

**Toast notifications not appearing?**
- Verify `react-hot-toast` is installed
- Check `<Toaster />` component is in App.jsx

**Modal not opening?**
- Install `@headlessui/react`: `npm install @headlessui/react`
- Check browser console for errors

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🌟 Future Enhancements

- [ ] Export to CSV/Excel
- [ ] Print shopping lists by supplier
- [ ] Barcode scanning
- [ ] Recipe integration
- [ ] Order history tracking
- [ ] Multi-location support
- [ ] User roles & permissions
- [ ] Email/SMS alerts
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)

## 📄 License

MIT License - Free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 💬 Support

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for Boondocks Restaurant**
