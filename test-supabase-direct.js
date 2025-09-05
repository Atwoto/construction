const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration with service role key to bypass RLS
const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNTcxMCwiZXhwIjoyMDcyMzgxNzEwfQ.ewGoZ69BQVyxskZS1Y6IqGSBZdWT2MWDNoVVVWOn99I';

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testAllTables() {
  console.log('Testing direct Supabase data access with service role key...');
  
  // List of tables to check
  const tables = ['clients', 'users', 'projects', 'invoices', 'employees'];
  
  for (const table of tables) {
    try {
      console.log(`\nChecking table: ${table}`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(3);
      
      if (error) {
        console.error(`Error fetching ${table} data:`, error.message);
        continue;
      }
      
      console.log(`Successfully retrieved ${table} data:`);
      console.log(`Number of records: ${data.length}`);
      if (data.length > 0) {
        console.log(`Sample record:`, JSON.stringify(data[0], null, 2));
      }
    } catch (error) {
      console.error(`Exception during ${table} data fetch:`, error.message);
    }
  }
  
  // Also check if we can get table names from the database
  try {
    console.log('\nAttempting to list all tables...');
    const { data, error } = await supabase
      .rpc('pg_tables')
      .eq('schemaname', 'public')
      .limit(20);
    
    if (error) {
      console.error('Error listing tables:', error.message);
    } else {
      console.log('Available tables:');
      data.forEach(table => console.log(`- ${table.tablename}`));
    }
  } catch (error) {
    console.error('Exception during table listing:', error.message);
  }
}

// Run the test
testAllTables();