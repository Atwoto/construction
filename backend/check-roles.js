const { supabaseAdmin } = require('./src/config/supabase');

async function checkUserRoles() {
  try {
    console.log('Checking allowed user roles...');
    
    // Query the users table to see what roles are allowed
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying users table:', error);
      return;
    }
    
    console.log('Users table structure:');
    console.log(data);
    
    // Try to get enum values
    console.log('Getting role enum values...');
    const { data: enumData, error: enumError } = await supabaseAdmin
      .rpc('get_enum_values', { enum_name: 'user_role' });
    
    if (enumError) {
      console.log('Could not get enum values via RPC, checking table info...');
      
      // Alternative approach to get enum info
      const { data: tableInfo, error: tableError } = await supabaseAdmin
        .from('pg_type')
        .select('*')
        .eq('typname', 'user_role');
      
      if (tableError) {
        console.error('Error getting table info:', tableError);
      } else {
        console.log('Table info:', tableInfo);
      }
    } else {
      console.log('Role enum values:', enumData);
    }
  } catch (error) {
    console.error('Error checking user roles:', error);
  }
}

checkUserRoles();