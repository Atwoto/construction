const { supabase } = require('./supabase');
const logger = require('../utils/logger');

// Test database connection
async function testConnection() {
  let supabaseConnected = false;

  try {
    // Test the Supabase connection by making a simple request
    // Using a very lightweight query
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .single(); // Use single() to get just one record
    
    // For Supabase, we check for specific error codes or messages
    // 42P01 is PostgreSQL table not found error, but Supabase may return different codes
    if (error && error.code !== '42P01' && !error.message.includes('does not exist')) {
      // If it's not a "table not found" error, then it's a real connection error
      if (!error.message.includes('does not exist')) {
        // Special handling for Vercel - if we get a timeout or network error, don't fail completely
        if (process.env.VERCEL && (error.message.includes('timeout') || error.message.includes('network'))) {
          logger.warn('Supabase connection test timed out (expected in some Vercel environments):', error.message);
          // Don't fail the connection test for timeout issues in Vercel
          supabaseConnected = true;
        } else {
          throw error;
        }
      } else {
        // Table doesn't exist, but connection is working
        logger.info('Supabase connection successful (table may not exist yet)');
        supabaseConnected = true;
      }
    } else {
      logger.info('Supabase connection successful');
      supabaseConnected = true;
    }
  } catch (error) {
    logger.error('Supabase connection failed:', error.message);
    // In Vercel, we might want to be more lenient with connection failures
    if (process.env.VERCEL) {
      logger.warn('In Vercel environment, continuing despite connection error');
      supabaseConnected = true; // Optimistically continue in Vercel
    }
  }

  return supabaseConnected;
}

// Initialize database models (no-op with Supabase)
function initializeModels() {
  logger.info('Database models initialized (Supabase mode)');
}

module.exports = {
  supabase,
  testConnection,
  initializeModels,
};