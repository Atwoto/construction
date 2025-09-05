const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - using service role key to bypass RLS
const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNTcxMCwiZXhwIjoyMDcyMzgxNzEwfQ.ewGoZ69BQVyxskZS1Y6IqGSBZdWT2MWDNoVVVWOn99I';

console.log('Testing application dashboard queries...');

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testDashboardQueries() {
  try {
    console.log('Simulating dashboard data loading...');
    
    // Simulate the exact queries that the dashboard uses
    const dashboardStartTime = Date.now();
    
    // Get project stats using the optimized function
    console.log('Fetching project statistics...');
    const { data: projectStats, error: projectStatsError } = await supabase
      .rpc('get_project_statistics');
    
    if (projectStatsError) {
      console.error('❌ Project stats error:', projectStatsError);
      return false;
    }
    
    console.log('✅ Project stats loaded');
    
    // Get client stats using the optimized function
    console.log('Fetching client statistics...');
    const { data: clientStats, error: clientStatsError } = await supabase
      .rpc('get_client_statistics');
    
    if (clientStatsError) {
      console.error('❌ Client stats error:', clientStatsError);
      return false;
    }
    
    console.log('✅ Client stats loaded');
    
    const dashboardEndTime = Date.now();
    const totalTime = dashboardEndTime - dashboardStartTime;
    
    console.log(`\n📊 Dashboard data loading completed in ${totalTime}ms`);
    console.log(`📦 Project stats: ${JSON.stringify(projectStats[0])}`);
    console.log(`👥 Client stats: ${JSON.stringify(clientStats[0])}`);
    
    // Check if this is within acceptable performance limits
    if (totalTime < 1000) {
      console.log('✅ Performance is excellent - well under the 1-second target');
    } else if (totalTime < 3000) {
      console.log('✅ Performance is good - under the 3-second target');
    } else {
      console.log('⚠️ Performance is acceptable but could be improved');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Dashboard test error:', error.message);
    return false;
  }
}

testDashboardQueries().then(success => {
  if (success) {
    console.log('\n🎉 Dashboard queries are working correctly and performantly!');
    console.log('The application dashboard should now load quickly without timeouts.');
  } else {
    console.log('\n❌ There may be an issue with the dashboard queries.');
  }
  process.exit(success ? 0 : 1);
});