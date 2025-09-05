const { supabase, supabaseAdmin } = require('./src/config/supabase');
const logger = require('./src/utils/logger');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test regular client connection
    console.log('Testing regular client connection...');
    const { data: regularData, error: regularError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (regularError) {
      console.error('Regular client connection failed:', regularError);
    } else {
      console.log('Regular client connection successful');
    }
    
    // Test admin client connection
    console.log('Testing admin client connection...');
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (adminError) {
      console.error('Admin client connection failed:', adminError);
    } else {
      console.log('Admin client connection successful');
    }
    
    console.log('Database connection test completed');
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

testDatabaseConnection();