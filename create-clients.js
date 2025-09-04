const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNTcxMCwiZXhwIjoyMDcyMzgxNzEwfQ.ewGoZ69BQVyxskZS1Y6IqGSBZdWT2MWDNoVVVWOn99I';

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createTestClients() {
  try {
    console.log('Creating test clients...');
    
    // Create test clients
    const clients = [
      {
        company_name: "ABC Construction Corp",
        contact_person: "John Smith",
        email: "info@abcconstruction.com",
        phone: "+1-555-123-4567",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        zip_code: "10001",
        country: "USA",
        website: "https://abcconstruction.com",
        industry: "construction",
        company_size: "201-500",
        status: "active",
        source: "referral",
        rating: 4,
        estimated_value: 5000000,
        notes: "Very reliable client with consistent projects",
        tags: ["commercial", "long-term", "preferred"],
        last_contact_date: new Date().toISOString(),
        next_follow_up_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        company_name: "XYZ Developers LLC",
        contact_person: "Sarah Johnson",
        email: "info@xyzdevelopers.com",
        phone: "+1-555-234-5678",
        address: "456 Oak Avenue",
        city: "Boston",
        state: "MA",
        zip_code: "02101",
        country: "USA",
        website: "https://xyzdevelopers.com",
        industry: "real_estate",
        company_size: "51-200",
        status: "active",
        source: "website",
        rating: 5,
        estimated_value: 1800000,
        notes: "Recently signed contract for residential development",
        tags: ["residential", "new_client"],
        last_contact_date: new Date().toISOString(),
        next_follow_up_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        company_name: "Tech Innovations Inc",
        contact_person: "Michael Brown",
        email: "michael@techinnovations.com",
        phone: "+1-555-345-6789",
        address: "789 Tech Boulevard",
        city: "San Francisco",
        state: "CA",
        zip_code: "94102",
        country: "USA",
        website: "https://techinnovations.com",
        industry: "technology",
        company_size: "500+",
        status: "lead",
        source: "cold_call",
        rating: 3,
        estimated_value: 750000,
        notes: "Potential client for office building construction",
        tags: ["technology", "lead"],
        last_contact_date: new Date().toISOString()
      },
      {
        company_name: "Green Building Solutions",
        contact_person: "Emma Wilson",
        email: "contact@greenbuildingsolutions.com",
        phone: "+1-555-456-7890",
        address: "321 Green Street",
        city: "Portland",
        state: "OR",
        zip_code: "97201",
        country: "USA",
        website: "https://greenbuildingsolutions.com",
        industry: "sustainability",
        company_size: "11-50",
        status: "opportunity",
        source: "social_media",
        rating: 4,
        estimated_value: 300000,
        notes: "Interested in eco-friendly construction projects",
        tags: ["sustainable", "green", "opportunity"],
        last_contact_date: new Date().toISOString(),
        next_follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        company_name: "Retail Space Builders",
        contact_person: "David Lee",
        email: "david@retailspacebuilders.com",
        phone: "+1-555-567-8901",
        address: "987 Commerce Ave",
        city: "Chicago",
        state: "IL",
        zip_code: "60601",
        country: "USA",
        website: "https://retailspacebuilders.com",
        industry: "retail",
        company_size: "201-500",
        status: "inactive",
        source: "trade_show",
        rating: 2,
        estimated_value: 450000,
        notes: "Contract ended, potential for future work",
        tags: ["retail", "inactive"],
        last_contact_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    console.log('Inserting clients into database...');
    const { data: createdClients, error: clientsError } = await supabase
      .from('clients')
      .insert(clients)
      .select();

    if (clientsError) {
      console.error('Error creating clients:', clientsError);
      return false;
    }

    console.log(`Successfully created ${createdClients.length} clients:`);
    createdClients.forEach((client, index) => {
      console.log(`  ${index + 1}. ${client.company_name} - ${client.email} (${client.status})`);
    });

    // Verify the count
    const { count } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    console.log(`Total clients in database: ${count}`);
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

createTestClients().then((success) => {
  if (success) {
    console.log('✅ Test clients created successfully!');
  } else {
    console.log('❌ Failed to create test clients');
  }
  process.exit(success ? 0 : 1);
});