const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const { initializeModels } = require('../backend/src/config/database');
const { errorHandler } = require('../backend/src/middleware/errorHandler');

// Import route modules
const authRoutes = require('../backend/src/routes/authRoutes');
const userRoutes = require('../backend/src/routes/userRoutes');
const clientRoutes = require('../backend/src/routes/clientRoutes');
const clientContactRoutes = require('../backend/src/routes/clientContactRoutes');
const projectRoutes = require('../backend/src/routes/projectRoutes');
const invoiceRoutes = require('../backend/src/routes/invoiceRoutes');
const employeeRoutes = require('../backend/src/routes/employeeRoutes');
const inventoryRoutes = require('../backend/src/routes/inventoryRoutes');
const documentRoutes = require('../backend/src/routes/documentRoutes');
const reportRoutes = require('../backend/src/routes/reportRoutes');

const app = express();

// Initialize models
initializeModels();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api', clientContactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;