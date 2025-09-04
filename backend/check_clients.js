const { supabase, supabaseAdmin } = require('./src/config/supabase');

async function checkClientsData() {
  console.log('[INFO] Checking clients data in database...');
  
  try {
    // Use admin client to bypass RLS
    const client = supabaseAdmin || supabase;
    
    // Check if clients table exists and count records
    const { data, error, count } = await client
      .from('clients')
      .select('*', { count: 'exact' })
      .limit(5); // Limit to 5 records for display

    if (error) {
      console.error('[ERROR] Error querying clients:', error);
      return;
    }

    console.log(`[INFO] Total clients in database: ${count}`);
    
    if (data && data.length > 0) {
      console.log('[INFO] Sample client records:');
      data.forEach((client, index) => {
        console.log(`  ${index + 1}. ${client.company_name || client.companyName} - ${client.email} (Status: ${client.status})`);
      });
    } else {
      console.log('[WARNING] No client records found in the database');
    }

    // Also check the table structure
    const { data: tableInfo, error: tableError } = await client
      .from('clients')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('[ERROR] Error checking table structure:', tableError);
    } else if (tableInfo && tableInfo.length > 0) {
      console.log('[INFO] Client table columns:', Object.keys(tableInfo[0]));
    }

  } catch (error) {
    console.error('[ERROR] Unexpected error:', error);
  }
}

checkClientsData().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('[ERROR] Script failed:', error);
  process.exit(1);
});