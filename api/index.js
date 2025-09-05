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

// --- Truly lazy-load routes only when requested ---
// This avoids heavy initialization during function startup and even during first request

// Route loader cache
const routeCache = {};

// Function to lazily load a route module
function lazyLoadRoute(routePath) {
  // Return cached route if already loaded
  if (routeCache[routePath]) {
    return routeCache[routePath];
  }
  
  try {
    // Load the route module
    const routeModule = require(routePath);
    // Cache it for future requests
    routeCache[routePath] = routeModule;
    return routeModule;
  } catch (error) {
    logger.error(`Error loading route module ${routePath}:`, error);
    throw error;
  }
}

// Auth routes
app.use('/api/auth', (req, res, next) => {
  try {
    const authRoutes = lazyLoadRoute('../backend/src/routes/authRoutes');
    authRoutes(req, res, next);
  } catch (error) {
    logger.error('Error loading auth routes:', error);
    res.status(500).json({ error: 'Failed to load auth routes' });
  }
});

// Client routes
app.use('/api/clients', (req, res, next) => {
  try {
    const clientRoutes = lazyLoadRoute('../backend/src/routes/clientRoutes');
    clientRoutes(req, res, next);
  } catch (error) {
    logger.error('Error loading client routes:', error);
    res.status(500).json({ error: 'Failed to load client routes' });
  }
});

// Project routes
app.use('/api/projects', (req, res, next) => {
  try {
    const projectRoutes = lazyLoadRoute('../backend/src/routes/projectRoutes');
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