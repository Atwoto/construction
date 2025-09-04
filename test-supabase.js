const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test the connection by making a simple request
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    console.log('Data received:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('✅ Supabase connection test passed');
  } else {
    console.log('❌ Supabase connection test failed');
  }
  process.exit(success ? 0 : 1);
});