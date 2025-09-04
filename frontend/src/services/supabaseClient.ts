import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrkwxtdnefcymxaplnox.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3d4dGRuZWZjeW14YXBsbm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDU3MTAsImV4cCI6MjA3MjM4MTcxMH0.f0QJnNK7E52Ckqbr0L9uUZv4U5sM9nNEVg0MY2xieQM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);