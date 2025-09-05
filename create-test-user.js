const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Test user data
const testUser = {
  email: 'admin@example.com',
  password: 'SecurePass123!',
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin',
  is_active: true,
  is_email_verified: true
};

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Hash the password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(testUser.password, 12);
    
    // Insert user into database
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: testUser.email.toLowerCase(),
        password: hashedPassword,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        role: testUser.role,
        is_active: testUser.is_active,
        is_email_verified: testUser.is_email_verified,
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        console.log('Test user already exists');
        return;
      }
      throw error;
    }
    
    console.log('Test user created successfully:');
    console.log('Email:', testUser.email);
    console.log('Password:', testUser.password);
    console.log('Role:', testUser.role);
    
  } catch (error) {
    console.error('Error creating test user:', error.message);
    process.exit(1);
  }
}

createTestUser();