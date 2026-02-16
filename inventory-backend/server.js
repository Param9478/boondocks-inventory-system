const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/Auth');
const itemRoutes = require('./routes/Item');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/boondocks-inventory';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Boondocks Inventory API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      items: '/api/items (protected)',
    },
  });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Item routes (protected with authentication)
app.use('/api/items', authMiddleware, itemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST /api/auth/signup`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/auth/verify`);
  console.log(`📦 Item endpoints (protected):`);
  console.log(`   GET    /api/items`);
  console.log(`   POST   /api/items`);
  console.log(`   PUT    /api/items/:id`);
  console.log(`   DELETE /api/items/:id`);
});

module.exports = app;
