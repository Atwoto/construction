const { supabaseAdmin } = require('../backend/src/config/supabase');

async function testDatabaseFunctions() {
  console.log('Testing database functions...');
  
  try {
    // Test client statistics function
    console.log('Testing client statistics function...');
    const { data: clientStats, error: clientError } = await supabaseAdmin.rpc('get_client_statistics');
    
    if (clientError) {
      console.log('❌ Client statistics function error:', clientError);
    } else {
      console.log('✅ Client statistics function working:', clientStats);
    }
    
    // Test project statistics function
    console.log('Testing project statistics function...');
    const { data: projectStats, error: projectError } = await supabaseAdmin.rpc('get_project_statistics');
    
    if (projectError) {
      console.log('❌ Project statistics function error:', projectError);
    } else {
      console.log('✅ Project statistics function working:', projectStats);
    }
    
  } catch (error) {
    console.error('Error testing database functions:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabaseFunctions();
}

module.exports = { testDatabaseFunctions };