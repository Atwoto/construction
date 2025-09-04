// Test script to verify timezone fix
const { supabase } = require('./src/config/supabase');

async function testTimezoneHandling() {
  console.log('Testing timezone handling...');
  
  // Test date creation and formatting
  const startDate = new Date('2025-01-01T00:00:00.000Z');
  const endDate = new Date('2025-12-31T23:59:59.999Z');
  
  console.log('Start date ISO:', startDate.toISOString());
  console.log('End date ISO:', endDate.toISOString());
  
  try {
    // Test a simple query with date filtering
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (error) {
      console.error('Query error:', error);
    } else {
      console.log('Query successful! Count:', count);
      console.log('Sample data:', data?.slice(0, 2));
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testTimezoneHandling();