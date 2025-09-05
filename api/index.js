// api/index.js
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { supabaseAdmin } = require('../backend/src/config/supabase');
const logger = require('../backend/src/utils/logger');

// Create a new, lightweight Express app specifically for Vercel
const app = express();

// --- Essential Middleware ---
// Use CORS - this is critical. Using permissive CORS for now.
app.use(cors({ origin: '*' }));
// Body parser
app.use(express.json());

// --- Health Check Route ---
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Lightweight API handler is running' });
});

// --- Import and use ONLY the routes that are timing out ---
// This avoids loading the entire slow server
const projectRoutes = require('../backend/src/routes/projectRoutes');
const clientRoutes = require('../backend/src/routes/clientRoutes');
const authRoutes = require('../backend/src/routes/authRoutes'); // Auth is needed for profile

app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes);


// --- Simple Error Handler ---
app.use((err, req, res, next) => {
  logger.error('Unhandled error in lightweight handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Export the handler
module.exports = serverless(app);
