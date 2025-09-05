const app = require('../backend/src/server');
const serverless = require('serverless-http');
const { testConnection } = require('../backend/src/config/database'); // Import testConnection
const logger = require('../backend/src/utils/logger'); // Import logger

let isConnected = false;

async function initializeDatabase() {
  if (!isConnected) {
    logger.info('Attempting to connect to Supabase...');
    isConnected = await testConnection();
    if (!isConnected) {
      logger.error('Failed to connect to Supabase database on startup.');
    } else {
      logger.info('Supabase connection established.');
    }
  }
}

// Call initializeDatabase once when the module is loaded
initializeDatabase();

module.exports = async (req, res) => {
  // Ensure database is connected before handling the request
  if (!isConnected) {
    await initializeDatabase(); // Try to connect again if not connected
    if (!isConnected) {
      res.status(500).json({ error: 'Database connection failed' });
      return;
    }
  }
  return serverless(app)(req, res);
};