const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test the serverless API setup
async function testAPI() {
  console.log('Testing Serverless API Setup...\n');

  // Test Supabase connection
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || 'https://rrkwxtdnefcymxaplnox.supabase.co',
      process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDU3MTAsImV4cCI6MjA3MjM4MTcxMH0.f0QJnNK7E52Ckqbr0L9uUZv4U5sM9nNEVg0MY2xieQM'
    );

    console.log('✅ Supabase client created successfully');

    // Test database connection
    const { data, error } = await supabase
      .from('projects')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.log('❌ Supabase connection error:', error.message);
      return false;
    }

    console.log('✅ Supabase database connection successful');
    console.log('📊 Projects table accessible');

    // Test projects query
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);

    if (projectsError) {
      console.log('⚠️  Projects query error:', projectsError.message);
    } else {
      console.log(`✅ Found ${projects.length} projects in database`);
    }

    return true;
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    return false;
  }
}

// Run the test
testAPI().then(success => {
  if (success) {
    console.log('\n🎉 Serverless API setup is ready for deployment!');
  } else {
    console.log('\n💥 API setup needs fixes before deployment');
  }
  process.exit(success ? 0 : 1);
});