const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration - using service role key to bypass RLS
const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNTcxMCwiZXhwIjoyMDcyMzgxNzEwfQ.ewGoZ69BQVyxskZS1Y6IqGSBZdWT2MWDNoVVVWOn99I';

console.log('Installing database optimization functions...');

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function installDatabaseFunctions() {
  try {
    console.log('Reading SQL function files...');
    
    // Read the SQL files
    const clientStatsSql = fs.readFileSync(path.join(__dirname, 'database', 'client_statistics_function.sql'), 'utf8');
    const projectStatsSql = fs.readFileSync(path.join(__dirname, 'database', 'project_statistics_function.sql'), 'utf8');
    
    console.log('Installing client statistics function...');
    
    // Install client statistics function
    const { error: clientError } = await supabase.rpc('execute_sql', {
      sql: clientStatsSql
    });
    
    if (clientError) {
      // Try direct execution
      const { error: directError } = await supabase.rpc('execute_sql', {
        sql: clientStatsSql
      });
      
      if (directError) {
        console.error('Error installing client statistics function:', directError);
        return false;
      }
    }
    
    console.log('Installing project statistics function...');
    
    // Install project statistics function
    const { error: projectError } = await supabase.rpc('execute_sql', {
      sql: projectStatsSql
    });
    
    if (projectError) {
      // Try direct execution
      const { error: directError } = await supabase.rpc('execute_sql', {
        sql: projectStatsSql
      });
      
      if (directError) {
        console.error('Error installing project statistics function:', directError);
        return false;
      }
    }
    
    console.log('Database functions installed successfully!');
    return true;
  } catch (error) {
    console.error('Error installing database functions:', error.message);
    return false;
  }
}

// Alternative approach - direct SQL execution
async function installFunctionsDirect() {
  try {
    console.log('Installing functions using direct SQL execution...');
    
    // Read the SQL files
    const clientStatsSql = fs.readFileSync(path.join(__dirname, 'database', 'client_statistics_function.sql'), 'utf8');
    const projectStatsSql = fs.readFileSync(path.join(__dirname, 'database', 'project_statistics_function.sql'), 'utf8');
    
    // Since we can't directly execute these through the JS client,
    // let's output the SQL that needs to be run manually
    console.log('\n--- CLIENT STATISTICS FUNCTION ---');
    console.log(clientStatsSql);
    console.log('\n--- PROJECT STATISTICS FUNCTION ---');
    console.log(projectStatsSql);
    console.log('\nPlease execute the above SQL in your Supabase SQL editor.');
    
    return true;
  } catch (error) {
    console.error('Error reading SQL files:', error.message);
    return false;
  }
}

// Run the installation
installFunctionsDirect().then(success => {
  if (success) {
    console.log('\n✅ Please copy the above SQL and execute it in your Supabase SQL editor.');
    console.log('This will install the optimized database functions that significantly improve performance.');
  } else {
    console.log('❌ Failed to prepare database function installation.');
  }
  process.exit(success ? 0 : 1);
});