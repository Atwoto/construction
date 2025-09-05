// api/clients/stats.js
const { supabaseAdmin } = require('../../backend/src/config/supabase');
const logger = require('../../backend/src/utils/logger');

// This is a standalone serverless function for maximum speed.
module.exports = async (req, res) => {
  try {
    // Set CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this for production
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for pre-flight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (!supabaseAdmin) {
      logger.error('CRITICAL: supabaseAdmin client is not initialized.');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const { data, error } = await supabaseAdmin.rpc('get_client_statistics');

    if (error) {
      logger.error('Client Stats RPC Error:', error);
      return res.status(500).json({ error: 'Failed to fetch client statistics', details: error.message });
    }

    // IMPORTANT: Wrap the response in a `data` object to match frontend expectations
    res.status(200).json({ data: data[0] || {} });

  } catch (e) {
    logger.error('Unexpected error in /api/clients/stats:', e);
    res.status(500).json({ error: 'An unexpected error occurred', details: e.message });
  }
};