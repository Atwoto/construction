const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNTcxMCwiZXhwIjoyMDcyMzgxNzEwfQ.ewGoZ69BQVyxskZS1Y6IqGSBZdWT2MWDNoVVVWOn99I';

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createTestData() {
  try {
    console.log('Creating test data...');
    
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
        next_follow_up_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
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
        next_follow_up_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
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
      }
    ];

    console.log('Creating clients...');
    const { data: createdClients, error: clientsError } = await supabase
      .from('clients')
      .insert(clients)
      .select();

    if (clientsError) {
      console.error('Error creating clients:', clientsError);
      return false;
    }

    console.log('Created clients:', createdClients);

    // Create test projects
    const projects = [
      {
        name: "Downtown Office Complex",
        description: "Construction of a 15-story office building in the downtown area",
        project_number: "PRJ-001",
        type: "commercial",
        status: "in_progress",
        priority: "high",
        start_date: "2023-01-15",
        estimated_end_date: "2024-06-30",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        zip_code: "10001",
        budget: 5000000,
        actual_cost: 2500000,
        estimated_revenue: 7500000,
        actual_revenue: 0,
        progress: 45,
        client_id: createdClients[0].id,
        project_manager_id: 1, // Assuming user ID 1 exists
        notes: "Project is on schedule",
        tags: ["office", "downtown", "high-rise"],
        weather_dependency: true,
        risk_level: "medium",
        quality_score: 8,
        client_satisfaction: 4
      },
      {
        name: "Residential Housing Development",
        description: "Development of 50 residential units",
        project_number: "PRJ-002",
        type: "residential",
        status: "planning",
        priority: "medium",
        start_date: "2023-09-01",
        estimated_end_date: "2025-03-31",
        address: "456 Oak Avenue",
        city: "Boston",
        state: "MA",
        zip_code: "02101",
        budget: 12000000,
        actual_cost: 0,
        estimated_revenue: 18000000,
        actual_revenue: 0,
        progress: 0,
        client_id: createdClients[1].id,
        project_manager_id: 1, // Assuming user ID 1 exists
        notes: "Awaiting permits",
        tags: ["residential", "housing", "development"],
        weather_dependency: true,
        risk_level: "low"
      },
      {
        name: "Tech Office Renovation",
        description: "Complete renovation of tech company office space",
        project_number: "PRJ-003",
        type: "renovation",
        status: "approved",
        priority: "medium",
        start_date: "2023-07-01",
        estimated_end_date: "2023-12-31",
        address: "789 Tech Boulevard",
        city: "San Francisco",
        state: "CA",
        zip_code: "94102",
        budget: 750000,
        actual_cost: 150000,
        estimated_revenue: 1200000,
        actual_revenue: 0,
        progress: 20,
        client_id: createdClients[2].id,
        project_manager_id: 1, // Assuming user ID 1 exists
        notes: "Interior work in progress",
        tags: ["renovation", "technology", "office"],
        weather_dependency: false,
        risk_level: "low",
        quality_score: 9
      }
    ];

    console.log('Creating projects...');
    const { data: createdProjects, error: projectsError } = await supabase
      .from('projects')
      .insert(projects)
      .select();

    if (projectsError) {
      console.error('Error creating projects:', projectsError);
      return false;
    }

    console.log('Created projects:', createdProjects);

    console.log('✅ Test data created successfully');
    return true;
  } catch (error) {
    console.error('Error creating test data:', error.message);
    return false;
  }
}

createTestData().then(success => {
  process.exit(success ? 0 : 1);
});