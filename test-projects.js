const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - using service role key to bypass RLS
const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNTcxMCwiZXhwIjoyMDcyMzgxNzEwfQ.ewGoZ69BQVyxskZS1Y6IqGSBZdWT2MWDNoVVVWOn99I';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Service Role Key exists:', !!supabaseServiceRoleKey);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testProjects() {
  try {
    console.log('Testing database tables...');
    
    // Test users
    const { data: users, error: usersError, count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact' });
    
    if (usersError) {
      console.error('Supabase users query failed:', usersError);
      return false;
    }
    
    console.log('Users found:', usersCount);
    console.log('Users data:', JSON.stringify(users, null, 2));
    
    // Test the connection by making a simple request
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Supabase projects query failed:', error);
      return false;
    }
    
    console.log('Projects found:', count);
    console.log('Projects data:', JSON.stringify(data, null, 2));
    
    // Also test clients
    const { data: clients, error: clientsError, count: clientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact' });
    
    if (clientsError) {
      console.error('Supabase clients query failed:', clientsError);
      return false;
    }
    
    console.log('Clients found:', clientsCount);
    console.log('Clients data:', JSON.stringify(clients, null, 2));
    
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error.message);
    return false;
  }
}

testProjects().then(success => {
  if (success) {
    console.log('✅ Database test passed');
  } else {
    console.log('❌ Database test failed');
  }
  process.exit(success ? 0 : 1);
});