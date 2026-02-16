require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
// 1. Security headers
app.use(helmet());

// 2. CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 3. Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Compression
app.use(compression());

// 5. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🍽️ Boondocks Inventory API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// API status route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    endpoints: {
      items: '/api/items',
      stats: '/api/items/stats',
      lowStock: '/api/items/alerts/low-stock',
      expiring: '/api/items/alerts/expiring-soon',
    },
  });
});

// Routes
app.use('/api/items', itemRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`🍽️  Boondocks Inventory Management System`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('Available Endpoints:');
  console.log('  GET    /api/items              - Get all items');
  console.log('  GET    /api/items/:id          - Get single item');
  console.log('  POST   /api/items              - Create item');
  console.log('  PUT    /api/items/:id          - Update item');
  console.log('  DELETE /api/items/:id          - Delete item');
  console.log('  GET    /api/items/stats        - Get statistics');
  console.log('  GET    /api/items/alerts/low-stock      - Low stock items');
  console.log('  GET    /api/items/alerts/expiring-soon  - Expiring items');
  console.log('  POST   /api/items/bulk-update  - Bulk update');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated!');
  });
});

module.exports = app;
