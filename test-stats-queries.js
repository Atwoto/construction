const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - using service role key to bypass RLS
const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNTcxMCwiZXhwIjoyMDcyMzgxNzEwfQ.ewGoZ69BQVyxskZS1Y6IqGSBZdWT2MWDNoVVVWOn99I';

console.log('Testing stats queries...');

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testStatsQueries() {
  try {
    console.log('Testing project statistics query...');
    
    // Test the RPC function for project stats
    const startTime = Date.now();
    const { data: projectStats, error: projectStatsError } = await supabase
      .rpc('get_project_statistics');
    
    const endTime = Date.now();
    console.log(`Project stats query took ${endTime - startTime}ms`);
    
    if (projectStatsError) {
      console.error('Project stats RPC error:', projectStatsError);
    } else {
      console.log('Project stats result:', JSON.stringify(projectStats, null, 2));
    }
    
    console.log('\nTesting client statistics query...');
    
    // Test the RPC function for client stats
    const startTime2 = Date.now();
    const { data: clientStats, error: clientStatsError } = await supabase
      .rpc('get_client_statistics');
    
    const endTime2 = Date.now();
    console.log(`Client stats query took ${endTime2 - startTime2}ms`);
    
    if (clientStatsError) {
      console.error('Client stats RPC error:', clientStatsError);
    } else {
      console.log('Client stats result:', JSON.stringify(clientStats, null, 2));
    }
    
    // Test individual queries as fallback
    console.log('\nTesting fallback project stats queries...');
    
    // Individual project count queries
    const queries = [
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'on_hold')
    ];
    
    const startTime3 = Date.now();
    const results = await Promise.all(queries);
    const endTime3 = Date.now();
    console.log(`Individual project count queries took ${endTime3 - startTime3}ms`);
    
    results.forEach((result, index) => {
      if (result.error) {
        console.error(`Query ${index} error:`, result.error);
      } else {
        console.log(`Query ${index} count:`, result.count);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Stats query test error:', error.message);
    return false;
  }
}

testStatsQueries().then(success => {
  if (success) {
    console.log('✅ Stats query test completed');
  } else {
    console.log('❌ Stats query test failed');
  }
  process.exit(success ? 0 : 1);
});