const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - using service role key to bypass RLS
const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNTcxMCwiZXhwIjoyMDcyMzgxNzEwfQ.ewGoZ69BQVyxskZS1Y6IqGSBZdWT2MWDNoVVVWOn99I';

console.log('Testing performance with caching consideration...');

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testPerformance() {
  try {
    console.log('Running multiple tests to check for caching effects...');
    
    // Run tests multiple times to see if there's a caching improvement
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Test Run ${i} ---`);
      
      // Test the RPC function for project stats
      const startTime = Date.now();
      const { data: projectStats, error: projectStatsError } = await supabase
        .rpc('get_project_statistics');
      
      const endTime = Date.now();
      console.log(`Project stats query took ${endTime - startTime}ms`);
      
      if (projectStatsError) {
        console.error('Project stats RPC error:', projectStatsError);
      }
      
      // Test the RPC function for client stats
      const startTime2 = Date.now();
      const { data: clientStats, error: clientStatsError } = await supabase
        .rpc('get_client_statistics');
      
      const endTime2 = Date.now();
      console.log(`Client stats query took ${endTime2 - startTime2}ms`);
      
      if (clientStatsError) {
        console.error('Client stats RPC error:', clientStatsError);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n--- Comparison with fallback method ---');
    
    // Test individual queries as fallback for comparison
    const fallbackStartTime = Date.now();
    
    // Individual project count queries
    const queries = [
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'on_hold')
    ];
    
    const results = await Promise.all(queries);
    const fallbackEndTime = Date.now();
    
    console.log(`Individual project count queries took ${fallbackEndTime - fallbackStartTime}ms`);
    console.log(`Results: ${results.map((r, i) => `Query ${i}: ${r.count}`).join(', ')}`);
    
    return true;
  } catch (error) {
    console.error('Performance test error:', error.message);
    return false;
  }
}

testPerformance().then(success => {
  if (success) {
    console.log('\n✅ Performance testing completed.');
  } else {
    console.log('\n❌ Performance testing failed.');
  }
  process.exit(success ? 0 : 1);
});