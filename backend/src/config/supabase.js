const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Configuration options optimized for Vercel
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  // Add headers to help with Vercel deployment
  global: {
    headers: {
      'X-Client-Info': 'construction-crm'
    }
  }
};

// Additional options for server-side operations
const supabaseAdminOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'X-Client-Info': 'construction-crm-admin'
    }
  }
};

// Create Supabase client for public operations (with RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Create Supabase admin client for server-side operations (bypasses RLS)
const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, supabaseAdminOptions)
  : null;

module.exports = {
  supabase,
  supabaseAdmin
};