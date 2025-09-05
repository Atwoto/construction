// api/index.js
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const logger = require('../backend/src/utils/logger');

// Create a new, lightweight Express app specifically for Vercel
const app = express();

// --- Essential Middleware ---
// Use CORS - this is critical. Using a permissive CORS for now.
app.use(cors({ origin: '*' }));
// Body parser
app.use(express.json());

// --- Health Check Route ---
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Lightweight API handler is running' });
});

// --- Lazy-load routes only when requested ---
// This avoids heavy initialization during function startup

// Auth routes
app.use('/api/auth', (req, res, next) => {
  try {
    const authRoutes = require('../backend/src/routes/authRoutes');
    req.url = req.url; // Keep original URL
    authRoutes(req, res, next);
  } catch (error) {
    logger.error('Error loading auth routes:', error);
    res.status(500).json({ error: 'Failed to load auth routes' });
  }
});

// Client routes
app.use('/api/clients', (req, res, next) => {
  try {
    const clientRoutes = require('../backend/src/routes/clientRoutes');
    req.url = req.url; // Keep original URL
    clientRoutes(req, res, next);
  } catch (error) {
    logger.error('Error loading client routes:', error);
    res.status(500).json({ error: 'Failed to load client routes' });
  }
});

// Project routes
app.use('/api/projects', (req, res, next) => {
  try {
    const projectRoutes = require('../backend/src/routes/projectRoutes');
    req.url = req.url; // Keep original URL
    projectRoutes(req, res, next);
  } catch (error) {
    logger.error('Error loading project routes:', error);
    res.status(500).json({ error: 'Failed to load project routes' });
  }
});

// --- Simple Error Handler ---
app.use((err, req, res, next) => {
  logger.error('Unhandled error in lightweight handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Export the handler
module.exports = serverless(app);