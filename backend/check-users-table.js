const { supabaseAdmin } = require('./src/config/supabase');

async function checkUsersTable() {
  try {
    console.log('Checking if users table exists...');
    
    // Try to get table info
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error accessing users table:', error);
      return;
    }
    
    console.log('Users table exists and is accessible');
    console.log('Sample data:', data);
    
    // Get table structure
    console.log('Getting table structure...');
    const { data: tableData, error: tableError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.error('Error getting table structure:', tableError);
    } else {
      console.log('Table structure check successful');
    }
  } catch (error) {
    console.error('Error checking users table:', error);
  }
}

checkUsersTable();