const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

// Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  try {
    console.log('Checking if tables exist...');
    
    // Check if users table exists
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError && usersError.code !== '42P01') {
      console.log('Users table exists but might be empty');
    } else if (usersError && usersError.code === '42P01') {
      console.log('Users table does not exist');
    } else {
      console.log('Users table exists');
    }
    
    // Check if projects table exists
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (projectsError && projectsError.code !== '42P01') {
      console.log('Projects table exists but might be empty');
    } else if (projectsError && projectsError.code === '42P01') {
      console.log('Projects table does not exist');
    } else {
      console.log('Projects table exists');
    }
    
    // Get list of all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error getting table list:', tablesError);
    } else {
      console.log('Tables in database:');
      tables.forEach(table => {
        console.log('- ' + table.table_name);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error checking tables:', error.message);
    return false;
  }
}

checkTables().then(success => {
  if (success) {
    console.log('✅ Table check completed');
  } else {
    console.log('❌ Table check failed');
  }
  process.exit(success ? 0 : 1);
});