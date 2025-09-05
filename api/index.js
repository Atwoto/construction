// api/index.js
const app = require('../backend/src/server');
const serverless = require('serverless-http');
const { supabaseAdmin } = require('../backend/src/config/supabase');
const logger = require('../backend/src/utils/logger');

// This is the main handler for the Vercel serverless function.
module.exports = async (req, res) => {
  // Basic check to ensure the admin client is initialized.
  // The real connection is handled by the Supabase client library itself.
  if (!supabaseAdmin) {
    logger.error('CRITICAL: supabaseAdmin client is not initialized. Check SUPABASE_SERVICE_ROLE_KEY.');
    return res.status(500).json({ error: 'Internal Server Error: Database client not configured.' });
  }

  // Pass the request to the Express app.
  return serverless(app)(req, res);
};