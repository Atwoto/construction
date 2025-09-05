const app = require('../backend/src/server');
const serverless = require('serverless-http');
const { testConnection } = require('../backend/src/config/database'); // Import testConnection
const logger = require('../backend/src/utils/logger'); // Import logger

let isConnected = false;
let connectionPromise = null;

async function initializeDatabase() {
  if (isConnected) {
    return true;
  }
  
  // If we're already trying to connect, return the existing promise
  if (connectionPromise) {
    return connectionPromise;
  }
  
  // Create a new connection promise
  connectionPromise = (async () => {
    try {
      logger.info('Attempting to connect to Supabase...');
      isConnected = await testConnection();
      if (!isConnected) {
        logger.error('Failed to connect to Supabase database on startup.');
        return false;
      } else {
        logger.info('Supabase connection established.');
        return true;
      }
    } catch (error) {
      logger.error('Error connecting to Supabase:', error.message);
      return false;
    } finally {
      // Clear the promise so future calls can retry if needed
      connectionPromise = null;
    }
  })();
  
  return connectionPromise;
}

// Start database initialization when module loads, but don't wait for it
initializeDatabase().catch(err => {
  logger.error('Initial database connection failed:', err.message);
});

module.exports = async (req, res) => {
  try {
    // Wait for database connection with a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 5000);
    });
    
    await Promise.race([initializeDatabase(), timeoutPromise]);
    
    if (!isConnected) {
      // Try one more time
      await initializeDatabase();
      if (!isConnected) {
        res.status(500).json({ 
          error: 'Database connection failed',
          message: 'Unable to establish connection to the database'
        });
        return;
      }
    }
    
    return serverless(app)(req, res);
  } catch (error) {
    logger.error('Error in API handler:', error.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
    return;
  }
};