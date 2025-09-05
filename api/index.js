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
        logger.warn('Supabase connection test indicates issues, but continuing optimistically...');
        // In Vercel, we continue optimistically as the actual queries might work
        // even if the test fails
        return true;
      } else {
        logger.info('Supabase connection established.');
        return true;
      }
    } catch (error) {
      logger.error('Error connecting to Supabase:', error.message);
      // In Vercel, we might want to continue even if the test fails
      if (process.env.VERCEL) {
        logger.warn('In Vercel environment, continuing despite connection test error');
        return true;
      }
      return false;
    } finally {
      // Clear the promise so future calls can retry if needed
      connectionPromise = null;
    }
  })();
  
  return connectionPromise;
}

// Start database initialization when module loads, but don't wait for it
// In Vercel, we do this optimistically
if (!process.env.VERCEL) {
  initializeDatabase().catch(err => {
    logger.error('Initial database connection failed:', err.message);
  });
}

module.exports = async (req, res) => {
  try {
    // In Vercel, we don't wait for database connection as it might not be needed for all requests
    // and can cause timeouts. We let the actual queries handle connection issues.
    if (!process.env.VERCEL) {
      // Wait for database connection with a timeout only in non-Vercel environments
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timeout')), 5000);
      });
      
      await Promise.race([initializeDatabase(), timeoutPromise]);
      
      if (!isConnected) {
        // Try one more time
        await initializeDatabase();
        if (!isConnected) {
          logger.warn('Database connection failed, but continuing optimistically...');
        }
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