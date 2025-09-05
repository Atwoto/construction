const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Lazy-loaded Supabase clients
let supabaseInstance = null;
let supabaseAdminInstance = null;

// Function to get the Supabase client (with RLS)
function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
  }
  return supabaseInstance;
}

// Function to get the Supabase admin client (bypasses RLS)
function getSupabaseAdminClient() {
  if (supabaseServiceRoleKey && !supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseAdminInstance;
}

module.exports = {
  get supabase() {
    return getSupabaseClient();
  },
  get supabaseAdmin() {
    return getSupabaseAdminClient();
  }
};