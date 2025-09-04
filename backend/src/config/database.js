const { supabase } = require('./supabase');
const logger = require('../utils/logger');

// Test database connection
async function testConnection() {
  let supabaseConnected = false;

  try {
    // Test the Supabase connection by making a simple request
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    // For Supabase, we check for specific error codes or messages
    // 42P01 is PostgreSQL table not found error, but Supabase may return different codes
    if (error && error.code !== '42P01' && !error.message.includes('does not exist')) {
      // If it's not a "table not found" error, then it's a real connection error
      if (!error.message.includes('does not exist')) {
        throw error;
      }
    }
    
    logger.info('Supabase connection successful');
    supabaseConnected = true;
  } catch (error) {
    logger.error('Supabase connection failed:', error.message);
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