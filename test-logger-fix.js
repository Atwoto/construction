// Test script to verify logger fix
const path = require('path');

// Set VERCEL environment variable to simulate Vercel environment
process.env.VERCEL = '1';

console.log('Testing logger fix...');

try {
  // Import logger after setting environment
  const logger = require('./backend/src/utils/logger.js');
  
  // Test logging
  logger.info('Test log message', { test: true, environment: 'VERCEL' });
  logger.error('Test error message', { error: true, environment: 'VERCEL' });
  
  console.log('✅ Logger test completed successfully');
  console.log('✅ Logger should work correctly in Vercel environment');
} catch (error) {
  console.error('❌ Logger test failed:', error.message);
  process.exit(1);
}